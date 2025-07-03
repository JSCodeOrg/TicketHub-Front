import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import TicketPurchaseModal from './TicketPurchaseModal';

const { width, height } = Dimensions.get('window');

interface EventCardProps {
  event: {
    titulo: string;
    imageUrl: string;
    descripcion: string;
    fecha: Date;
    ubicacion: string;
    aforo: number;
    ticketTypes: Array<{
      id: number;
      nombre: string;
      precio: string;
      cantidad_disponible: number;
    }>;
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPurchaseModalVisible, setIsPurchaseModalVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const ImageDefault = require("../assets/images/logo-tickethub.png");
  const [selectedTicket, setSelectedTicket] = useState<{
    id: number;
    nombre: string;
    precio: number;
    cantidad_disponible: number;
  } | null>(null);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handlepago = (ticket: {
    id: number;
    nombre: string;
    precio: number;
    cantidad_disponible: number;
  }) => {
    setSelectedTicket(ticket);
    setIsPurchaseModalVisible(true);
  }

  const handlePurchaseClose = () => {
    setIsPurchaseModalVisible(false);
  }

  const handlePurchaseContinue = (quantity: number) => {
    console.log(`Comprando ${quantity} tickets`);
    setIsPurchaseModalVisible(false);
  }

  const getMinPrice = () => {
    if (!event.ticketTypes || event.ticketTypes.length === 0) return 'N/A';
    const minPrice = Math.min(...event.ticketTypes.map(t => parseFloat(t.precio)));
    return minPrice.toFixed(2);
  };

  const lineup = [
    { name: 'Artista Principal', featured: true },
    { name: 'DJ Invitado', featured: true },
    { name: 'Banda Soporte', featured: false },
    { name: 'Apertura', featured: false },
  ];

  const formattedDate = new Date(event.fecha).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <>
      {/* Tarjeta compacta */}
      <TouchableOpacity style={styles.card} onPress={openModal}>
        {imageLoading && (
          <View style={styles.loadingImage}>
            <ActivityIndicator size="small" color="#A448FF" />
          </View>
        )}
        <Image 
          source={{ uri: event.imageUrl || ImageDefault }}
          style={styles.cardImage}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />
        <View style={styles.cardOverlay}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={1}>{event.titulo}</Text>
            <Text style={styles.cardDate}>{formattedDate}</Text>
            <Text style={styles.cardLocation} numberOfLines={1}>{event.ubicacion}</Text>
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.ticketsText}>{event.aforo} Aforo</Text>
                {event.ticketTypes.length > 0 && (
                  <Text style={styles.ticketPrice}>Desde ${getMinPrice()}</Text>
                )}
              </View>
              <View style={styles.avatarGroup}>
                <View style={[styles.avatar, { backgroundColor: '#FF6B6B' }]} />
                <View style={[styles.avatar, { backgroundColor: '#4ECDC4', marginLeft: -8 }]} />
                <View style={[styles.avatar, { backgroundColor: '#45B7D1', marginLeft: -8 }]} />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Modal expandido */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="overFullScreen"
        onRequestClose={closeModal}
        transparent={false}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView style={styles.modalScrollView}>
            <View style={styles.modalHeader}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              {imageLoading && (
                <View style={styles.loadingImage}>
                  <ActivityIndicator size="large" color="#A448FF" />
                </View>
              )}
              <Image 
                source={{ uri: event.imageUrl || ImageDefault }}
                style={styles.modalImage}
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
              />
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{event.titulo.toUpperCase()}</Text>
              
              <View style={styles.eventInfo}>
                <Text style={styles.eventLocation}>{event.ubicacion}</Text>
                <Text style={styles.eventDate}>Fecha: {formattedDate}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Descripción</Text>
                <Text style={styles.description}>
                  {event.descripcion || 'Descripción no disponible'}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>LINE UP</Text>
                <View style={styles.lineupContainer}>
                  {lineup.map((artist, index) => (
                    <View key={index} style={styles.lineupRow}>
                      <Text style={[
                        styles.artistName,
                        artist.featured && styles.featuredArtist
                      ]}>
                        {artist.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>ENTRADAS DISPONIBLES</Text>
                {event.ticketTypes.map((ticket, index) => (
                  <View key={index} style={styles.ticketItem}>
                    <View style={styles.ticketInfoContainer}>
                      <Text style={styles.ticketName}>{ticket.nombre}</Text>
                      <Text style={styles.ticketAvailable}>
                        {ticket.cantidad_disponible} disponibles
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.ticketPrice}>${ticket.precio}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.modalFooter}>
                <View style={styles.ticketInfo}>
                  <Text style={styles.ticketCount}>{event.aforo} Aforo</Text>
                  <View style={styles.avatarGroup}>
                    <View style={[styles.avatar, { backgroundColor: '#FF6B6B' }]} />
                    <View style={[styles.avatar, { backgroundColor: '#4ECDC4', marginLeft: -8 }]} />
                    <View style={[styles.avatar, { backgroundColor: '#45B7D1', marginLeft: -8 }]} />
                  </View>
                </View>
                {/* Botón de comprar general al final como en el componente 2 */}
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={() => {
                    // Si hay tickets disponibles, tomar el primero como ejemplo
                    if (event.ticketTypes.length > 0) {
                      const firstTicket = event.ticketTypes[0];
                      handlepago({
                        id: firstTicket.id,
                        nombre: firstTicket.nombre,
                        precio: parseFloat(firstTicket.precio),
                        cantidad_disponible: firstTicket.cantidad_disponible
                      });
                    }
                  }}
                >
                  <Text style={styles.saveButtonText}>Comprar Ticket</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {selectedTicket && (
        <TicketPurchaseModal
          visible={isPurchaseModalVisible}
          onClose={handlePurchaseClose}
          eventTitle={event.titulo}
          ticketType={selectedTicket}
          maxTickets={10}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A448FF',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 2,
  },
  cardLocation: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  ticketPrice: {
    fontSize: 14,
    color: '#A448FF',
    fontWeight: 'bold',
    marginTop: 4,
  },
  buyButton: {
    backgroundColor: '#9333EA',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  buyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  loadingImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  modalScrollView: {
    flex: 1,
  },
  modalHeader: {
    position: 'relative',
    height: 250,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  modalContent: {
    padding: 20,
    flex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A448FF',
    marginBottom: 16,
    letterSpacing: 1,
  },
  eventInfo: {
    marginBottom: 24,
  },
  eventLocation: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 16,
    color: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  lineupContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  lineupRow: {
    width: '48%',
    marginBottom: 8,
  },
  artistName: {
    fontSize: 14,
    color: '#ccc',
  },
  featuredArtist: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalFooter: {
    paddingTop: 20,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  ticketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  ticketCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  ticketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  ticketInfoContainer: {
    flex: 1,
  },
  ticketName: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  ticketAvailable: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  saveButton: {
    backgroundColor: '#9333EA',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default EventCard;