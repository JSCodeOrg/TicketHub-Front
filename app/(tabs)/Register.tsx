import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { registerUser } from '../../api/api';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [documento, setDocumento] = useState('');
  const [quiereCrearEventos, setQuiereCrearEventos] = useState(null); // null, true, false
  const [isLoading, setIsLoading] = useState(false);

  

  const handleRegister = async () => {
    if (!email || !password || !nombre || !apellido || !documento || quiereCrearEventos === null) {
        Alert.alert('Error', 'Por favor completa todos los campos');
        return;
    }

    // Validar que el documento sea numérico
    const documentoNumber = Number(documento);
    if (isNaN(documentoNumber)) {
        Alert.alert('Error', 'El documento debe ser un número');
        return;
    }

    setIsLoading(true);
    
    try {
        const rol = quiereCrearEventos ? 2 : 1;
        
        await registerUser({ 
            email, 
            password, 
            nombre, 
            apellido, 
            documento: documentoNumber,
            rol 
        });

        router.push({
            pathname: '/verify-screen',
            params: { email }
        });

    } catch (error) {
        Alert.alert('Error', error.message || 'Error al registrar usuario');
    } finally {
        setIsLoading(false);
    }
};


  const handleLogin = () => {
    router.push('/Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          <View style={styles.header}>
            <Text style={styles.title}>Registro</Text>
            <Text style={styles.subtitle}>
              ¡Empieza ahora! Tu evento no se planificará solo!
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Introduce tu nombre"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Apellido</Text>
              <TextInput
                style={styles.input}
                value={apellido}
                onChangeText={setApellido}
                placeholder="Introduce tu apellido"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Documento</Text>
              <TextInput
                style={styles.input}
                value={documento}
                onChangeText={setDocumento}
                placeholder="Introduce tu documento"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Introduce tu Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Introduce tu contraseña"
                placeholderTextColor="#999"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>¿Quieres crear eventos?</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity 
                  style={[
                    styles.optionButton, 
                    quiereCrearEventos === true && styles.optionButtonSelected
                  ]}
                  onPress={() => setQuiereCrearEventos(true)}
                >
                  <Text style={[
                    styles.optionText,
                    quiereCrearEventos === true && styles.optionTextSelected
                  ]}>
                    Sí
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.optionButton, 
                    quiereCrearEventos === false && styles.optionButtonSelected
                  ]}
                  onPress={() => setQuiereCrearEventos(false)}
                >
                  <Text style={[
                    styles.optionText,
                    quiereCrearEventos === false && styles.optionTextSelected
                  ]}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              onPress={handleRegister} 
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#A448FF', '#DA48FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.registerButton, isLoading && styles.disabledButton]}
              >
                <Text style={styles.registerButtonText}>
                  {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginLink} onPress={handleLogin}>
              <Text style={styles.loginText}>
                ¿Ya tienes cuenta? <Text style={styles.loginHighlight}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>
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
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#D12CFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#D12CFF',
    borderColor: '#D12CFF',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  registerButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 16,
    color: '#fff',
  },
  loginHighlight: {
    color: '#A448FF',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});