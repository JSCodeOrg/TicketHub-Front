import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createEvent } from '../../api/api';
import { useAuth } from '../../components/auth/AuthContext';

export default function CreateEventScreen() {
  const { token, userId } = useAuth();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [aforo, setAforo] = useState('');
  const [fecha, setFecha] = useState('');
  const [ticketName, setTicketName] = useState('General');
  const [precio, setPrecio] = useState('');
  const [cantidadTotal, setCantidadTotal] = useState('');
  const [cantidadDisponible, setCantidadDisponible] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateEvent = async () => {

    if (!nombre || !descripcion || !aforo || !fecha || !precio || !cantidadTotal) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    if (isNaN(Number(aforo)) || isNaN(Number(precio)) || isNaN(Number(cantidadTotal))) {
      Alert.alert('Error', 'Por favor ingresa valores numéricos válidos');
      return;
    }

    if (parseInt(aforo) !== parseInt(cantidadTotal)) {
      Alert.alert('Error', `El aforo (${aforo}) debe coincidir con la cantidad total de tickets (${cantidadTotal})`);
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fecha)) {
      Alert.alert('Error', 'El formato de fecha debe ser YYYY-MM-DD (ej: 2023-12-31)');
      return;
    }

    setIsLoading(true);
    
    try {
      if (!userId) {
        throw new Error('No se pudo identificar al usuario responsable');
      }

      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const eventData = {
        nombre,
        descripcion,
        aforo: parseInt(aforo),
        fecha: new Date(fecha).toISOString(), 
        responsable: userId, 
        ticketTypes: [{
          nombre: ticketName || 'General',
          precio: parseFloat(precio),
          cantidad_total: parseInt(cantidadTotal),
          cantidad_disponible: parseInt(cantidadDisponible || cantidadTotal) 
        }]
      };

      console.log('Datos a enviar:', JSON.stringify(eventData, null, 2));

      await createEvent(eventData, token);

      Alert.alert('Éxito', 'Evento creado exitosamente', [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]);

    } catch (error: any) {
      console.error('Error completo:', error);
      Alert.alert('Error', error.message || 'Error al crear el evento. Por favor verifica los datos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          <View style={styles.header}>
            <Text style={styles.title}>Crear Evento</Text>
            <Text style={styles.subtitle}>
              ¡Crea un evento increíble para tus invitados!
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre del Evento*</Text>
              <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Introduce el nombre del evento"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descripción*</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={descripcion}
                onChangeText={setDescripcion}
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
                value={aforo}
                onChangeText={setAforo}
                placeholder="Número máximo de asistentes"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fecha*</Text>
              <TextInput
                style={styles.input}
                value={fecha}
                onChangeText={setFecha}
                placeholder="YYYY-MM-DD (ej: 2023-12-31)"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre del Tipo de Ticket</Text>
              <TextInput
                style={styles.input}
                value={ticketName}
                onChangeText={setTicketName}
                placeholder="Ej: General, VIP, etc."
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Precio del Ticket*</Text>
              <TextInput
                style={styles.input}
                value={precio}
                onChangeText={setPrecio}
                placeholder="0.00"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cantidad Total de Tickets*</Text>
              <TextInput
                style={styles.input}
                value={cantidadTotal}
                onChangeText={setCantidadTotal}
                placeholder="Debe coincidir con el aforo"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cantidad Disponible</Text>
              <TextInput
                style={styles.input}
                value={cantidadDisponible}
                onChangeText={setCantidadDisponible}
                placeholder="Si no especifica, se usará la cantidad total"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                onPress={handleCreateEvent} 
                disabled={isLoading}
                style={styles.buttonWrapper}
              >
                <LinearGradient
                  colors={['#A448FF', '#DA48FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.createButton, isLoading && styles.disabledButton]}
                >
                  <Text style={styles.createButtonText}>
                    {isLoading ? 'Creando...' : 'Crear Evento'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={handleCancel}
                disabled={isLoading}
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
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
  },
  formContainer: {
    flex: 1,
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
});