import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface TicketPurchaseModalProps {
  visible: boolean;
  onClose: () => void;
  onContinue: (quantity: number) => void;
  eventTitle: string;
  maxTickets?: number;
}

const TicketPurchaseModal: React.FC<TicketPurchaseModalProps> = ({
  visible,
  onClose,
  onContinue,
  eventTitle,
  maxTickets = 10
}) => {
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => {
    if (quantity < maxTickets) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleContinue = () => {
    onContinue(quantity);
  };

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
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Event Info */}
            <View style={styles.eventSection}>
              <Text style={styles.eventTitle}>{eventTitle}</Text>
              <Text style={styles.eventSubtitle}>Selecciona la cantidad de tickets</Text>
            </View>

            {/* Quantity Selector */}
            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>Cantidad de tickets</Text>
              
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                  onPress={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Text style={[styles.quantityButtonText, quantity <= 1 && styles.quantityButtonTextDisabled]}>-</Text>
                </TouchableOpacity>
                
                <View style={styles.quantityDisplay}>
                  <Text style={styles.quantityText}>{quantity}</Text>
                </View>
                
                <TouchableOpacity 
                  style={[styles.quantityButton, quantity >= maxTickets && styles.quantityButtonDisabled]}
                  onPress={incrementQuantity}
                  disabled={quantity >= maxTickets}
                >
                  <Text style={[styles.quantityButtonText, quantity >= maxTickets && styles.quantityButtonTextDisabled]}>+</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.maxTicketsText}>Máximo {maxTickets} tickets por compra</Text>
            </View>

            {/* Summary */}
            <View style={styles.summarySection}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total de tickets:</Text>
                <Text style={styles.summaryValue}>{quantity}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                <Text style={styles.continueButtonText}>Continuar Compra</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
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
    fontSize: 14,
    color: '#ccc',
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
    marginBottom: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#ccc',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A448FF',
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
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default TicketPurchaseModal;