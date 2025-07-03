import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { getEvents } from '../../api/api';
import EventCard from '../../components/EventCard';
import Header from '../../components/Header';
import { useAuth } from '../../components/auth/AuthContext';

interface Event {
    nombre: string;
    banner: string;
    descripcion: string;
    fecha: Date;
    aforo: number;
    responsable: {
        nombre: string;
        foto: string;
    };
    ticketTypes: Array<{
        nombre: string;
        precio: string;
        cantidad_disponible: number;
    }>;
}

const Home = () => {
    const { token } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            if (!token) return;
            
            try {
                setLoading(true);
                const response = await getEvents(token);
                setEvents(response.events || []);

            } catch (err) {
                setError(err.message || 'Error al cargar eventos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [token]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#A448FF" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        Eventos mas populares 🔥
                    </Text>
                </View>
                
                {events.length > 0 ? (
                    events.map((event, index) => (
                        <EventCard 
                            key={index}
                            event={{
                                titulo: event.nombre,
                                imageUrl: event.banner,
                                descripcion: event.descripcion,
                                fecha: new Date(event.fecha),
                                ubicacion: event.responsable?.nombre || 'Ubicación no disponible',
                                aforo: event.aforo,
                                ticketTypes: event.ticketTypes || []
                            }}
                        />
                    ))
                ) : (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>
                            No hay eventos disponibles
                        </Text>
                    </View>
                )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111827',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111827',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
});

export default Home;