import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  userEmail: string;
  userId: number | null;
  token: string | null;
  login: (email: string, token: string, userId: number) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const [email, storedToken, storedUserId] = await Promise.all([
          AsyncStorage.getItem('userEmail'),
          AsyncStorage.getItem('userToken'),
          AsyncStorage.getItem('userId')
        ]);

        if (email) setUserEmail(email);
        if (storedToken) setToken(storedToken);
        if (storedUserId) setUserId(parseInt(storedUserId));
      } catch (error) {
        console.error('Error loading auth data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const login = async (email: string, token: string, userId: number) => {
    try {
      await Promise.all([
        AsyncStorage.setItem('userEmail', email),
        AsyncStorage.setItem('userToken', token),
        AsyncStorage.setItem('userId', userId.toString())
      ]);
      
      setUserEmail(email);
      setToken(token);
      setUserId(userId);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userEmail', 'userId']);
      setUserEmail('');
      setToken(null);
      setUserId(null);
      router.replace('/Login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      userEmail, 
      userId, 
      token, 
      login, 
      logout, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);