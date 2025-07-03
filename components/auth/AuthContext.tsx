import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  userEmail: string;
  userId: number | null;
  token: string | null;
  userRoles: number[];
  login: (email: string, token: string, userId: number, userRoles: number[]) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  hasRole: (roleId: number) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  userEmail: '',
  userId: null,
  token: null,
  userRoles: [],
  login: async () => {},
  logout: async () => {},
  isLoading: true,
  hasRole: () => false
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const [email, storedToken, storedUserId, storedUserRoles] = await Promise.all([
          AsyncStorage.getItem('userEmail'),
          AsyncStorage.getItem('userToken'),
          AsyncStorage.getItem('userId'),
          AsyncStorage.getItem('userRoles')
        ]);

        if (email) setUserEmail(email);
        if (storedToken) setToken(storedToken);
        if (storedUserId) setUserId(parseInt(storedUserId));
        if (storedUserRoles) setUserRoles(JSON.parse(storedUserRoles));
      } catch (error) {
        console.error('Error loading auth data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const login = async (email: string, token: string, userId: number, userRoles: number[]) => {
    try {
      await Promise.all([
        AsyncStorage.setItem('userEmail', email),
        AsyncStorage.setItem('userToken', token),
        AsyncStorage.setItem('userId', userId.toString()),
        AsyncStorage.setItem('userRoles', JSON.stringify(userRoles))
      ]);
      
      setUserEmail(email);
      setToken(token);
      setUserId(userId);
      setUserRoles(userRoles);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userEmail', 'userId', 'userRoles']);
      setUserEmail('');
      setToken(null);
      setUserId(null);
      setUserRoles([]);
      router.replace('/Login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const hasRole = (roleId: number) => {
    return userRoles.includes(roleId);
  };

  return (
    <AuthContext.Provider value={{ 
      userEmail, 
      userId, 
      token, 
      userRoles,
      hasRole,
      login, 
      logout, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};