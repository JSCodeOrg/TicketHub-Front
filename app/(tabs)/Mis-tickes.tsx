// Mis-tickes.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { API_BASE_URL } from '../../api/api';
import { useAuth } from '../../components/auth/AuthContext';

interface Ticket {
  id: number;
  qrPath: string;
  estado: string;
  tipoTicket: {
    nombre: string;
    evento: {
      nombre: string;
      fecha: string;
    };
  };
}

const MisTicketsScreen = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId, token } = useAuth();

  useEffect(() => {
    const fetchTickets = async () => {
      if (!userId || !token) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/tickets/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setTickets(data.tickets);
        } else {
          console.error('Error al obtener tickets:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [userId, token]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A448FF" />
      </View>
    );
  }

  if (tickets.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No tienes tickets comprados</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Tickets</Text>
      
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.ticketCard}>
            <Text style={styles.eventName}>{item.tipoTicket.evento.nombre}</Text>
            <Text style={styles.ticketType}>{item.tipoTicket.nombre}</Text>
            <Text style={styles.eventDate}>{new Date(item.tipoTicket.evento.fecha).toLocaleDateString()}</Text>
            
            {item.qrPath && (
              <Image 
                source={{ uri: `${API_BASE_URL}/tickets/qr/${item.qrPath}` }} 
                style={styles.qrImage}
                resizeMode="contain"
              />
            )}
            
            <View style={[
              styles.statusBadge,
              item.estado === 'ACTIVO' ? styles.activeBadge : styles.inactiveBadge
            ]}>
              <Text style={styles.statusText}>{item.estado}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  ticketCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  eventName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ticketType: {
    color: '#A448FF',
    fontSize: 16,
    marginBottom: 4,
  },
  eventDate: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 12,
  },
  qrImage: {
    width: '100%',
    height: 200,
    marginBottom: 12,
    alignSelf: 'center',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeBadge: {
    backgroundColor: 'rgba(0, 200, 0, 0.2)',
  },
  inactiveBadge: {
    backgroundColor: 'rgba(200, 0, 0, 0.2)',
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default MisTicketsScreen;