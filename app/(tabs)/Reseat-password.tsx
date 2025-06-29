import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { updateUserProfile, verifyCurrentPassword } from '../../api/api';
import { useAuth } from '../../components/auth/AuthContext';

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const { userId, token, logout } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Por favor ingresa tu contraseña actual';
      isValid = false;
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'Por favor ingresa tu nueva contraseña';
      isValid = false;
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Por favor confirma tu nueva contraseña';
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    if (!userId || !token) {
      Alert.alert('Error', 'No se pudo identificar al usuario');
      return;
    }

    setIsSaving(true);

    try {
      // Primero verificar si la contraseña actual es correcta
      const isCurrentPasswordValid = await verifyCurrentPassword(
        userId,
        formData.currentPassword,
        token
      );

      if (!isCurrentPasswordValid) {
        setErrors(prev => ({
          ...prev,
          currentPassword: 'La contraseña actual es incorrecta'
        }));
        setIsSaving(false);
        return;
      }

      // Si la contraseña actual es correcta, proceder con el cambio
      const response = await updateUserProfile(
        userId,
        {
          password: formData.newPassword,
          currentPassword: formData.currentPassword,
        },
        token
      );

      if (response.success) {
        setShowSuccessModal(true);
      } else {
        Alert.alert('Error', response.message || 'Error al actualizar la contraseña');
      }
    } catch (err) {
      console.error('Error al actualizar contraseña:', err);
      Alert.alert('Error', err.message || 'Error al actualizar la contraseña');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSuccessConfirm = async () => {
    setShowSuccessModal(false);

    await logout();
    router.replace('/Login'); 
  };

  const handleCancel = () => {
    router.push('/Edition');
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
            Mantén tu <Text style={styles.highlight}>cuenta</Text> segura
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Restablecer contraseña</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña actual</Text>
            <TextInput
              style={[styles.input, errors.currentPassword ? styles.errorInput : null]}
              value={formData.currentPassword}
              onChangeText={(text) => {
                setFormData({...formData, currentPassword: text});
                setErrors(prev => ({...prev, currentPassword: ''}));
              }}
              placeholder="Introduce tu contraseña actual"
              placeholderTextColor="#999"
              secureTextEntry
              editable={!isSaving}
            />
            {errors.currentPassword ? (
              <Text style={styles.errorText}>{errors.currentPassword}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nueva contraseña</Text>
            <TextInput
              style={[styles.input, errors.newPassword ? styles.errorInput : null]}
              value={formData.newPassword}
              onChangeText={(text) => {
                setFormData({...formData, newPassword: text});
                setErrors(prev => ({...prev, newPassword: ''}));
              }}
              placeholder="Introduce tu nueva contraseña"
              placeholderTextColor="#999"
              secureTextEntry
              editable={!isSaving}
            />
            {errors.newPassword ? (
              <Text style={styles.errorText}>{errors.newPassword}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Repetir contraseña</Text>
            <TextInput
              style={[styles.input, errors.confirmPassword ? styles.errorInput : null]}
              value={formData.confirmPassword}
              onChangeText={(text) => {
                setFormData({...formData, confirmPassword: text});
                setErrors(prev => ({...prev, confirmPassword: ''}));
              }}
              placeholder="Confirma tu nueva contraseña"
              placeholderTextColor="#999"
              secureTextEntry
              editable={!isSaving}
            />
            {errors.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            ) : null}
          </View>

          <TouchableOpacity 
            onPress={handleSave} 
            disabled={isSaving}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#A448FF', '#DA48FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.resetButton, isSaving && styles.disabledButton]}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.resetButtonText}>Restablecer</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={handleCancel}
            disabled={isSaving}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>


      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {}} 
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>¡Éxito!</Text>
              <Text style={styles.modalMessage}>
                Su contraseña se actualizó correctamente
              </Text>
              
              <TouchableOpacity 
                onPress={handleSuccessConfirm}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#A448FF', '#DA48FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>Continuar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 40,
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
  errorInput: {
    borderColor: '#FF0000',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 14,
    marginTop: 5,
  },
  resetButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    alignItems: 'center',
    marginTop: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.7,
  },
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    margin: 20,
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 0,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 300,
  },
  modalContent: {
    padding: 32,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 120,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});