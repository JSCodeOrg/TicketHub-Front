// Header.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../components/auth/AuthContext';

const { width, height } = Dimensions.get('window');

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleEdition = async () => {
    router.push('/Edition');
  }


  const handleGes = async () => {
    router.push('/Edition-events')
  }

  const { userEmail } = useAuth();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      
      {/* Header Container */}
      <View style={styles.headerContainer}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar"
            placeholderTextColor="#A855F7"
          />
          <Ionicons name="search" size={20} color="#A855F7" style={styles.searchIcon} />
        </View>

        {/* Avatar */}
        <TouchableOpacity onPress={toggleMenu} style={styles.avatarContainer}>
          <Image
            source={{
              uri: 'https://img.freepik.com/vector-gratis/vete-mierda-simbolo-estilo-comic_23-2148684350.jpg?semt=ais_hybrid&w=740'
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Side Menu Modal */}
      <Modal
        visible={isMenuOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <View style={styles.modalOverlay}>
          {/* Backdrop */}
          <TouchableOpacity 
            style={styles.backdrop}
            onPress={closeMenu}
            activeOpacity={1}
          />
          
          {/* Menu Panel */}
          <View style={styles.menuPanel}>
            {/* Menu Header */}
            <View style={styles.menuHeader}>
              <View style={styles.profileSection}>
                <Image
                  source={{
                    uri: 'https://img.freepik.com/vector-gratis/vete-mierda-simbolo-estilo-comic_23-2148684350.jpg?semt=ais_hybrid&w=740'
                  }}
                  style={styles.menuAvatar}
                />
                <Text style={styles.userName}>{userEmail}</Text>
              </View>
              <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#A855F7" />
              </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <View style={styles.menuItems}>
              <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Menú principal')}>
                <Ionicons name="home-outline" size={20} color="#A855F7" />
                <Text style={styles.menuItemText}>Menú principal</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleEdition}>
                <Ionicons name="settings-outline" size={20} color="#A855F7" />
                <Text style={styles.menuItemText}>Ajustes</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Historial')}>
                <Ionicons name="time-outline" size={20} color="#A855F7" />
                <Text style={styles.menuItemText}>Historial</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Mis entradas')}>
                <Ionicons name="ticket-outline" size={20} color="#A855F7" />
                <Text style={styles.menuItemText}>Mis entradas</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleGes}>
                <Ionicons name="ticket-outline" size={20} color="#A855F7" />
                <Text style={styles.menuItemText}>Gestion de Evento</Text>
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <View style={styles.logoutContainer}>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Ionicons name="log-out-outline" size={20} color="#A855F7" />
                <Text style={styles.logoutText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#111827',
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 12 : 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flex: 1,
    maxWidth: width * 0.7,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  searchIcon: {
    marginLeft: 8,
  },
  avatarContainer: {
    marginLeft: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuPanel: {
    width: width * 0.8,
    maxWidth: 320,
    height: height,
    backgroundColor: '#374151',
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  menuItems: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuItemText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  logoutContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#A855F7',
    marginLeft: 12,
  },
});

export default Header;