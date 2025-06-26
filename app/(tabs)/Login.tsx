import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { loginUser } from '../../api/api';
import { useAuth } from '../../components/auth/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu email');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu contraseña');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginUser({ email, password });
      
      // Verifica si hay error en la respuesta
      if (response.error) {
        throw new Error(response.error);
      }

      // Verifica que los datos necesarios estén presentes
      if (!response.token || !response.user || !response.user.id) {
        throw new Error('Datos de usuario incompletos en la respuesta');
      }

      // Llama a login con todos los parámetros requeridos
      await login(response.user.email, response.token, response.user.id);
      router.replace('/Home-screen');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image 
            source={require('@/assets/images/logo-tickethub.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>
            Tu <Text style={styles.highlight}>evento</Text> perfecto, a un{' '}
            <Text style={styles.highlight1}>click</Text> de distancia
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Inicio de sesión</Text>
          
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
              editable={!isLoading}
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
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity 
            onPress={handleLogin} 
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#A448FF', '#DA48FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.loginButton, isLoading && styles.disabledButton]}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Iniciar sesión</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.registerLink} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerText}>
              ¿No tienes cuenta? <Text style={styles.registerHighlight}>Regístrate</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoImage: {
    width: 330,
    height: 80,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  highlight: {
    color: '#FF12D4',
    fontWeight: 'bold',
  },
  highlight1: {
    color: '#D12CFF',
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
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
  loginButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 24,
  },
  registerText: {
    fontSize: 16,
    color: '#fff',
  },
  registerHighlight: {
    color: '#A448FF',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
  },
});