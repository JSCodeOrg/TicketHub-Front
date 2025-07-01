// Edition.tsx
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getUserProfile, updateUserProfile } from '../../api/api';
import { useAuth } from '../../components/auth/AuthContext';

interface FormData {
  nombre: string;
  apellido: string;
  email: string;
  documento: string;
  password: string;
}

const Edition: React.FC = () => {
  const { userId, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    email: '',
    documento: '',
    password: '',
  });

  // Estado para notificaciones por email
  const [emailNotifications, setEmailNotifications] = useState<boolean>(false);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const loadUserData = async () => {
      if (!userId || !token) {
        setError('No se pudo identificar al usuario');
        setIsLoading(false);
        return;
      }

      try {
        const response = await getUserProfile(userId, token);
        
        if (response.success) {
          setFormData({
            nombre: response.user.nombre || '',
            apellido: response.user.apellido || '',
            email: response.user.email || '',
            documento: response.user.documento ? response.user.documento.toString() : '',
            password: response.user.password || '',
          });

        } else {
          setError(response.message || 'Error al cargar los datos del usuario');
        }
      } catch (err) {
        console.error('Error al cargar perfil:', err);
        setError(err.message || 'Error al cargar los datos del usuario');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [userId, token]);

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (): Promise<void> => {
    if (!userId || !token) {
      setError('No se pudo identificar al usuario');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const documentoNumber = formData.documento ? parseInt(formData.documento) : undefined;

      const response = await updateUserProfile(
        userId,
        {
          nombre: formData.nombre,
          apellido: formData.apellido,
          documento: documentoNumber,
          password: formData.password,
        },
        token
      );

      if (response.success) {
        setSuccess('Perfil actualizado correctamente');
      } else {
        setError(response.message || 'Error al actualizar el perfil');
      }
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = (): void => {
    router.push('/Home-screen')
  };

  const handleLogout = (): void => {
    console.log('Cerrando sesión');
    //me imagino que esto no es cerrar cesion si no eliminar secion, ingresar la logica para eliminar
  };

  const handleChangePassword = (): void => {
    // agregar pa navegar a una pantalla de cambio de contraseña
    
    router.push('/Reseat-password');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A448FF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        {success && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>{success}</Text>
          </View>
        )}

        {/* Header */}
        <Text style={styles.title}>Ajustes</Text>

        {/* Form Fields */}
        <View style={styles.formSection}>
          {/* Nombre */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre de usuario</Text>
            <TextInput
              style={styles.input}
              value={formData.nombre}
              onChangeText={(value) => handleInputChange('nombre', value)}
              placeholder="Ingresa tu nombre"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Apellido */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Apellido</Text>
            <TextInput
              style={styles.input}
              value={formData.apellido}
              onChangeText={(value) => handleInputChange('apellido', value)}
              placeholder="Ingresa tu apellido"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Email (solo lectura) */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={formData.email}
              editable={false}
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Documento */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Documento</Text>
            <TextInput
              style={styles.input}
              value={formData.documento}
              onChangeText={(value) => handleInputChange('documento', value)}
              placeholder="Número de documento"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>

          {/* Change Password Link */}
          <TouchableOpacity style={styles.passwordLink} onPress={handleChangePassword}>
            <Text style={styles.passwordLinkText}>Cambiar contraseña</Text>
            <Text style={styles.linkIcon}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.preferencesSection}>
          <Text style={styles.sectionTitle}>Preferencias</Text>
          
          {/* Email Notifications Toggle */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Notificaciones por email</Text>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: '#4B5563', true: '#9333EA' }}
              thumbColor={emailNotifications ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Eliminar Cuenta</Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={handleCancel}
            disabled={isSaving}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.saveButton, isSaving && styles.disabledButton]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Guardar cambios</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  content: {
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#D1D5DB',
    marginBottom: 32,
  },
  formSection: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
    paddingBottom: 12,
    paddingHorizontal: 0,
    fontSize: 16,
    color: '#FFFFFF',
  },
  disabledInput: {
    opacity: 0.7,
  },
  passwordLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  passwordLinkText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  linkIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  preferencesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#D1D5DB',
    marginBottom: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  logoutButton: {
    marginBottom: 32,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EF4444',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#B91C1C',
    textAlign: 'center',
  },
  successContainer: {
    backgroundColor: '#DCFCE7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    color: '#166534',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#374151',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#9333EA',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default Edition;