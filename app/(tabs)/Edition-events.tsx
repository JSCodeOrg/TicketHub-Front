import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_BASE_URL, updateEvent } from '../../api/api';
import { useAuth } from '../../components/auth/AuthContext';

interface Event {
  id: number;
  nombre: string;
  descripcion: string;
  aforo: number;
  fecha: string;
  responsable: { id: number };
  ticketTypes: TicketType[];
}

interface TicketType {
  id: number;
  nombre: string;
  precio: number;
  cantidad_total: number;
  cantidad_disponible: number;
}

export default function EditionEvent() {
  const { token, userId } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    aforo: '',
    fecha: '',
    ticketName: 'General',
    precio: '',
    cantidadTotal: '',
    cantidadDisponible: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (userId && token) {
      fetchUserEvents();
    }
  }, [userId, token]);

  const fetchUserEvents = async () => {
    try {
        if (!token) {
        throw new Error('No hay token de autenticación');
        }

        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/eventos/usuario`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
        });
        
        if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al obtener eventos');
        }
        
        const data = await response.json();
        
        if (!data.events) {
        throw new Error('Formato de respuesta inesperado');
        }
        
        setEvents(data.events);
    } catch (error) {
        console.error('Error fetching events:', error);
        Alert.alert('Error', error.message || 'No se pudieron cargar los eventos');
        
        // Si hay un error de autenticación, redirige al login
        if (error.message.includes('autenticación') || error.message.includes('token')) {
        router.replace('/Login');
        }
    } finally {
        setLoading(false);
    }
    };

  const handleEditEvent = (event: Event) => {
    const mainTicketType = event.ticketTypes[0];
    setEditingEvent(event);
    setFormData({
      nombre: event.nombre,
      descripcion: event.descripcion,
      aforo: event.aforo.toString(),
      fecha: event.fecha.split('T')[0],
      ticketName: mainTicketType.nombre,
      precio: mainTicketType.precio.toString(),
      cantidadTotal: mainTicketType.cantidad_total.toString(),
      cantidadDisponible: mainTicketType.cantidad_disponible.toString(),
    });
    setIsEditing(true);
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent || !token || !userId) return;

    // Validaciones
    if (!formData.nombre || !formData.descripcion || !formData.aforo || !formData.fecha || !formData.precio || !formData.cantidadTotal) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    if (isNaN(Number(formData.aforo))) {
      Alert.alert('Error', 'El aforo debe ser un número válido');
      return;
    }

    if (parseInt(formData.aforo) !== parseInt(formData.cantidadTotal)) {
      Alert.alert('Error', `El aforo (${formData.aforo}) debe coincidir con la cantidad total de tickets (${formData.cantidadTotal})`);
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.fecha)) {
      Alert.alert('Error', 'El formato de fecha debe ser YYYY-MM-DD (ej: 2023-12-31)');
      return;
    }

    setIsUpdating(true);
    
    try {
      const eventData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        aforo: parseInt(formData.aforo),
        fecha: new Date(formData.fecha).toISOString(),
        responsable: userId,
        ticketTypes: [{
          id: editingEvent.ticketTypes[0].id,
          nombre: formData.ticketName || 'General',
          precio: parseFloat(formData.precio),
          cantidad_total: parseInt(formData.cantidadTotal),
          cantidad_disponible: parseInt(formData.cantidadDisponible || formData.cantidadTotal)
        }]
      };

      await updateEvent(editingEvent.id, eventData, token);

      Alert.alert('Éxito', 'Evento actualizado correctamente');
      setIsEditing(false);
      setEditingEvent(null);
      fetchUserEvents();
    } catch (error: any) {
      console.error('Error updating event:', error);
      Alert.alert('Error', error.message || 'Error al actualizar el evento');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingEvent(null);
  };

  const handleCreate = () => {
    router.push('/Create-event');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderEventItem = ({ item }: { item: Event }) => (
    <TouchableOpacity 
      style={styles.eventItem} 
      onPress={() => handleEditEvent(item)}
    >
      <Text style={styles.eventTitle}>{item.nombre}</Text>
      <Text style={styles.eventDate}>
        Fecha: {new Date(item.fecha).toLocaleDateString('es-ES')}
      </Text>
      <Text style={styles.eventCapacity}>Aforo: {item.aforo}</Text>
      <Text style={styles.eventTickets}>
        Tickets: {item.ticketTypes[0].cantidad_disponible}/{item.ticketTypes[0].cantidad_total} disponibles
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando eventos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isEditing && editingEvent) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Editar Evento</Text>
              <Text style={styles.subtitle}>
                Editando: {editingEvent.nombre}
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre del Evento*</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nombre}
                  onChangeText={(text) => handleInputChange('nombre', text)}
                  placeholder="Introduce el nombre del evento"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descripción*</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.descripcion}
                  onChangeText={(text) => handleInputChange('descripcion', text)}
                  placeholder="Describe tu evento"
                  placeholderTextColor="#999"
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Aforo*</Text>
                <TextInput
                  style={styles.input}
                  value={formData.aforo}
                  onChangeText={(text) => handleInputChange('aforo', text)}
                  placeholder="Número máximo de asistentes"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Fecha*</Text>
                <TextInput
                  style={styles.input}
                  value={formData.fecha}
                  onChangeText={(text) => handleInputChange('fecha', text)}
                  placeholder="YYYY-MM-DD (ej: 2023-12-31)"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre del Tipo de Ticket</Text>
                <TextInput
                  style={styles.input}
                  value={formData.ticketName}
                  onChangeText={(text) => handleInputChange('ticketName', text)}
                  placeholder="Ej: General, VIP, etc."
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Precio del Ticket*</Text>
                <TextInput
                  style={styles.input}
                  value={formData.precio}
                  onChangeText={(text) => handleInputChange('precio', text)}
                  placeholder="0.00"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cantidad Total de Tickets*</Text>
                <TextInput
                  style={styles.input}
                  value={formData.cantidadTotal}
                  onChangeText={(text) => handleInputChange('cantidadTotal', text)}
                  placeholder="Debe coincidir con el aforo"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cantidad Disponible</Text>
                <TextInput
                  style={styles.input}
                  value={formData.cantidadDisponible}
                  onChangeText={(text) => handleInputChange('cantidadDisponible', text)}
                  placeholder="Si no especifica, se usará la cantidad total"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  onPress={handleUpdateEvent}
                  disabled={isUpdating}
                  style={styles.buttonWrapper}
                >
                  <LinearGradient
                    colors={['#A448FF', '#DA48FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.createButton, isUpdating && styles.disabledButton]}
                  >
                    <Text style={styles.createButtonText}>
                      {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={handleCancelEdit}
                  disabled={isUpdating}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Eventos</Text>
        <Text style={styles.subtitle}>
          {events.length > 0 
            ? 'Selecciona un evento para editarlo' 
            : 'Crea tu primer evento para comenzar'}
        </Text>
      </View>

      {events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes eventos creados</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <TouchableOpacity 
        style={styles.createNewButton}
        onPress={handleCreate}
      >
        <LinearGradient
          colors={['#A448FF', '#DA48FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.createNewButtonGradient}
        >
          <Text style={styles.createNewButtonText}>Crear Nuevo Evento</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    maxWidth: '80%',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#D12CFF',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#fff',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  buttonContainer: {
    marginTop: 24,
  },
  buttonWrapper: {
    marginBottom: 16,
  },
  createButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: '#D12CFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#D12CFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  eventItem: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D12CFF',
  },
  eventTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDate: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 4,
  },
  eventCapacity: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 4,
  },
  eventTickets: {
    color: '#ccc',
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 150,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  createNewButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  createNewButtonGradient: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  createNewButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});