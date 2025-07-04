import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getUserEventsWithTickets } from '../../api/api';
import { useAuth } from '../../components/auth/AuthContext';

const MisTickets = ({ navigation }: { navigation: any }) => {
  const { token } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!token) {
        setError('No hay token de autenticación');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userEvents = await getUserEventsWithTickets(token);
        setEvents(userEvents);
        setError(null);
      } catch (err) {
        console.error('Error al obtener eventos:', err);
        setError('Error al cargar tus tickets. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [token]);

  const goBack = () => {
    router.push('/Home-screen');
  };

  const renderEventItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
        style={styles.eventCard}
        onPress={() => {
    router.push({
      pathname: "/EventTicketsScreen",
      params: { id: item.id.toString() } 
    });
}}
    >
        {item.banner && (
            <Image 
                source={{ uri: item.banner }} 
                style={styles.eventImage}
                resizeMode="cover"
            />
        )}
        <View style={styles.eventInfo}>
            <Text style={styles.eventName}>{item.nombre}</Text>
            <Text style={styles.eventDate}>
                {format(new Date(item.fecha), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
            </Text>
            <Text style={styles.eventDescription} numberOfLines={2}>
                {item.descripcion}
            </Text>
            <View style={styles.ticketsInfo}>
                <Text style={styles.ticketsCount}>
                    {item.cantidadTickets} {item.cantidadTickets === 1 ? 'boleto' : 'boletos'}
                </Text>
                <Text style={styles.ticketTypes}>
                    Tipos: {item.tiposTickets.join(', ')}
                </Text>
            </View>
        </View>
    </TouchableOpacity>
);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mis Entradas</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A448FF" />
          <Text style={styles.loadingText}>Cargando tus tickets...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mis Entradas</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mis Entradas</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes tickets comprados aún</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Entradas</Text>
      </View>
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(164, 72, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 20,
    color: '#A448FF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A448FF',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#ccc',
  },
  listContent: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  eventImage: {
    width: '100%',
    height: 150,
  },
  eventInfo: {
    padding: 16,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#A448FF',
  },
  eventDate: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  eventDescription: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 10,
    lineHeight: 20,
  },
  ticketsInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  ticketsCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  ticketTypes: {
    fontSize: 14,
    color: '#A448FF',
    marginTop: 4,
    fontWeight: '500',
  },
});

export default MisTickets;