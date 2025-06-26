// Home.tsx
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Header from '../../components/Header';

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Component */}
      <Header />
      
      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Eventos mas populares 🔥
          </Text>
        </View>
        
        {/* Aquí irían las tarjetas de eventos */}
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            Contenido principal (tarjetas de eventos)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  content: {
    flex: 1,
    backgroundColor: '#111827',
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  placeholderText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default Home;