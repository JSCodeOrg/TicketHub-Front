import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router'; // Añade useLocalSearchParams
import { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { verifyUser } from '../../api/api';

export default function VerifyScreen() {
  const { email } = useLocalSearchParams(); // Obtén el email de los parámetros
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerification = async () => {
    if (!verificationCode || verificationCode.length !== 4) {
        Alert.alert('Error', 'Por favor ingresa un código de 4 dígitos');
        return;
    }

    setIsLoading(true);
    
    try {
        // Asegúrate que el email sea string (puede venir como array en Expo Router)
        const emailToVerify = Array.isArray(email) ? email[0] : email;
        
        if (!emailToVerify) {
        throw new Error('No se encontró el email para verificación');
        }

        console.log('Datos enviados:', { 
        email: emailToVerify, 
        code: verificationCode 
        });

        await verifyUser(emailToVerify, verificationCode);
        
        Alert.alert(
        'Registro exitoso', 
        '¡Tu cuenta ha sido verificada correctamente! Ahora puedes iniciar sesión.',
        [{ text: 'OK', onPress: () => router.push('/Login') }]
        );
    } catch (error) {
        console.error('Error completo:', error);
        Alert.alert(
        'Error', 
        error instanceof Error ? error.message : 'Error al verificar el código'
        );
    } finally {
        setIsLoading(false);
    }
    };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Verificación</Text>
            <Text style={styles.subtitle}>
              Ingresa el código que enviamos a tu correo
            </Text>
          </View>

          {/* Formulario de verificación */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Código de verificación</Text>
              <TextInput
                style={styles.input}
                value={verificationCode}
                onChangeText={setVerificationCode}
                placeholder="Introduce el código de 4 dígitos"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={4}
              />
            </View>

            <TouchableOpacity 
              onPress={handleVerification} 
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#A448FF', '#DA48FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.verifyButton, isLoading && styles.disabledButton]}
              >
                <Text style={styles.verifyButtonText}>
                  {isLoading ? 'Verificando...' : 'Verificar'}
                </Text>
              </LinearGradient>
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
  verifyButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});