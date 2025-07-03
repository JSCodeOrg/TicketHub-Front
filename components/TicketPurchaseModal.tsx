import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { purchaseTickets } from '../api/api';
import { useAuth } from '../components/auth/AuthContext';
import PurchaseSuccessModal from './PurchaseSuccessModal';

interface TicketPurchaseModalProps {
  visible: boolean;
  onClose: () => void;
  eventTitle: string;
  ticketType: {
    id: number;
    nombre: string;
    precio: number;
    cantidad_disponible: number;
  };
  maxTickets?: number;
  onPurchaseSuccess?: () => void;
}

const TicketPurchaseModal: React.FC<TicketPurchaseModalProps> = ({
  visible,
  onClose,
  eventTitle,
  ticketType,
  maxTickets = 10,
  onPurchaseSuccess,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { token, userEmail } = useAuth();
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const actualMaxTickets = Math.min(maxTickets, ticketType.cantidad_disponible);

  const incrementQuantity = () => {
    if (quantity < actualMaxTickets) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const calculateTotalPrice = () => {
    return (ticketType.precio * quantity).toFixed(2);
  };

  


  const handleContinue = async () => {
    if (!token) {
      Alert.alert('Error', 'Debes iniciar sesión para comprar tickets');
      return;
    }

    if (!userEmail) {
      Alert.alert('Error', 'No se pudo obtener tu información de usuario');
      return;
    }

    setIsProcessing(true);
    
    try {
      const purchaseResult = await purchaseTickets(ticketType.id, quantity, token);
      
      setPurchaseSuccess(true);
      
    } catch (error: any) {
      console.error('Error en la compra:', error);

      let errorMessage = 'Ocurrió un error al procesar la compra. Por favor, intenta nuevamente.';
      
      if (error.message.includes('No hay suficientes tickets disponibles')) {
        errorMessage = error.message;
      } else if (error.message.includes('token')) {
        errorMessage = 'Error de autenticación. Por favor, vuelve a iniciar sesión.';
      } else if (error.message.includes('Tipo de ticket no encontrado')) {
        errorMessage = 'El tipo de ticket seleccionado ya no está disponible.';
      }
      
      Alert.alert('Error', errorMessage, [
        { text: 'Entendido', style: 'cancel' }
      ]);

    } finally {
      setIsProcessing(false);
    }
};

  const totalPrice = calculateTotalPrice();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.modalTitle}>Comprar Tickets</Text>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={onClose}
                disabled={isProcessing}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Event Info */}
            <View style={styles.eventSection}>
              <Text style={styles.eventTitle}>{eventTitle}</Text>
              <Text style={styles.eventSubtitle}>{ticketType.nombre}</Text>
            </View>

            {/* Quantity Selector */}
            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>Cantidad de tickets</Text>
              
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  style={[styles.quantityButton, (quantity <= 1 || isProcessing) && styles.quantityButtonDisabled]}
                  onPress={decrementQuantity}
                  disabled={quantity <= 1 || isProcessing}
                >
                  <Text style={[styles.quantityButtonText, (quantity <= 1 || isProcessing) && styles.quantityButtonTextDisabled]}>-</Text>
                </TouchableOpacity>
                
                <View style={styles.quantityDisplay}>
                  {isProcessing ? (
                    <ActivityIndicator size="small" color="#A448FF" />
                  ) : (
                    <Text style={styles.quantityText}>{quantity}</Text>
                  )}
                </View>
                
                <TouchableOpacity 
                  style={[styles.quantityButton, (quantity >= actualMaxTickets || isProcessing) && styles.quantityButtonDisabled]}
                  onPress={incrementQuantity}
                  disabled={quantity >= actualMaxTickets || isProcessing}
                >
                  <Text style={[styles.quantityButtonText, (quantity >= actualMaxTickets || isProcessing) && styles.quantityButtonTextDisabled]}>+</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.maxTicketsText}>
                Máximo {actualMaxTickets} tickets disponibles ({ticketType.cantidad_disponible} en total)
              </Text>
            </View>

            {/* Summary */}
            <View style={styles.summarySection}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tickets:</Text>
                <Text style={styles.summaryValue}>{quantity} x ${ticketType.precio.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total:</Text>
                <Text style={styles.summaryTotal}>${totalPrice}</Text>
              </View>
            </View>

            {/* User Info */}
            <View style={styles.userInfoSection}>
              <Text style={styles.userInfoLabel}>Comprador:</Text>
              <Text style={styles.userInfoText}>{userEmail}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={onClose}
                disabled={isProcessing}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.continueButton, isProcessing && styles.continueButtonDisabled]}
                onPress={handleContinue}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.continueButtonText}>Pagar ${totalPrice}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
      <PurchaseSuccessModal
        visible={purchaseSuccess}
        onClose={() => {
          setPurchaseSuccess(false);
          onClose();
          if (onPurchaseSuccess) {
            onPurchaseSuccess();
          }
        }}
        eventTitle={eventTitle}
        quantity={quantity}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A448FF',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  eventSection: {
    marginBottom: 32,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  eventSubtitle: {
    fontSize: 16,
    color: '#A448FF',
    fontWeight: '600',
  },
  quantitySection: {
    marginBottom: 32,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#A448FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#333',
  },
  quantityButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  quantityButtonTextDisabled: {
    color: '#666',
  },
  quantityDisplay: {
    marginHorizontal: 32,
    minWidth: 60,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  maxTicketsText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  summarySection: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 20,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#ccc',
  },
  summaryValue: {
    fontSize: 16,
    color: '#fff',
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A448FF',
  },
  userInfoSection: {
    marginBottom: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  userInfoLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  userInfoText: {
    fontSize: 16,
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#666',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  continueButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#9333EA',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#7e22ce',
    opacity: 0.7,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default TicketPurchaseModal;