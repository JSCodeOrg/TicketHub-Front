import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { verifyUser } from '../../api/api';

export default function VerifyScreen() {
  const { email } = useLocalSearchParams();
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...verificationCode];
    newCode[index] = text;
    setVerificationCode(newCode);
  };

  const handleVerification = async () => {
    const fullCode = verificationCode.join('');
    
    if (!fullCode || fullCode.length !== 4) {
      Alert.alert('Error', 'Por favor ingresa un código de 4 dígitos');
      return;
    }

    setIsLoading(true);
    
    try {
      const emailToVerify = Array.isArray(email) ? email[0] : email;
      
      if (!emailToVerify) {
        throw new Error('No se encontró el email para verificación');
      }

      console.log('Datos enviados:', { 
        email: emailToVerify, 
        code: fullCode 
      });

      await verifyUser(emailToVerify, fullCode);
      
      router.replace('/Login');
      
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

  const handleResendCode = async () => {
    // Aquí puedes implementar la lógica para reenviar el código
    Alert.alert('Código reenviado', 'Se ha enviado un nuevo código a tu correo');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Verificar Cuenta</Text>
          </View>

          {/* Card Container */}
          <View style={styles.cardContainer}>
            <Text style={styles.instructionText}>
              Introduce el código enviado al correo{'\n'}
              {Array.isArray(email) ? email[0] : email}
            </Text>

            {/* Code Input Boxes */}
            <View style={styles.codeInputContainer}>
              {verificationCode.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.codeInput}
                  value={digit}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                />
              ))}
            </View>

            {/* Verify Button */}
            <TouchableOpacity 
              onPress={handleVerification} 
              disabled={isLoading}
              style={styles.verifyButtonContainer}
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

            {/* Resend Code */}
            <TouchableOpacity onPress={handleResendCode} style={styles.resendContainer}>
              <Text style={styles.resendText}>Reenviar Código</Text>
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
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 32,
    borderWidth: 2,
    borderColor: '#A448FF',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    width: '100%',
    paddingHorizontal: 20,
  },
  codeInput: {
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#A448FF',
    borderRadius: 8,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  verifyButtonContainer: {
    width: '100%',
    marginBottom: 24,
  },
  verifyButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  resendContainer: {
    paddingVertical: 8,
  },
  resendText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});