import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login attempt:', { email, password });
  };

  const handleRegister = () => {
    router.push('/Register'); // o la ruta donde tengas tu pantalla de registro
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
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

        {/* Login Form */}
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

          <TouchableOpacity onPress={handleLogin}>
            <LinearGradient
              colors={['#A448FF', '#DA48FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Iniciar sesión</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerLink} onPress={handleRegister}>
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
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 12,
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
});