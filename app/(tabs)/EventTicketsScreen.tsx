import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getUserTicketsForEvent } from '../../api/api';
import { useAuth } from '../../components/auth/AuthContext';

const EventTicketsScreen = () => {
    const { token } = useAuth();
    const router = useRouter();
    const params = useLocalSearchParams();
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const eventId = params.id ? String(params.id) : null;

    useEffect(() => {
        console.log('Params:', params);
        console.log('Event ID:', eventId);

        const fetchEventTickets = async () => {
            if (!token || !eventId) {
                setError(!token ? 'No estás autenticado' : 'Evento no especificado');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log('Fetching tickets...');
                const ticketsData = await getUserTicketsForEvent(token, parseInt(eventId, 10));
                console.log('Tickets data:', ticketsData);
                
                if (!ticketsData || ticketsData.length === 0) {
                    setError('No tienes tickets para este evento');
                    setTickets([]);
                } else {
                    setTickets(ticketsData);
                    setError(null);
                }
            } catch (err) {
                console.error('Error:', err);
                setError('Error al cargar los tickets');
                setTickets([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEventTickets();
    }, [token, eventId]);

    const goBack = () => {
        router.back();
    };

    const renderTicketItem = ({ item }: { item: any }) => (
        <View style={styles.ticketCard}>
            <Text style={styles.ticketType}>{item.nombreTipoTicket}</Text>
            {item.qrFile ? (
                <Image 
                    source={{ uri: item.qrFile }} 
                    style={styles.qrImage}
                    resizeMode="contain"
                />
            ) : (
                <Text style={styles.errorText}>QR no disponible</Text>
            )}
            <Text style={styles.ticketInstructions}>
                Muestra este QR al ingresar al evento
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={goBack}>
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Mis Tickets</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#A448FF" />
                    <Text style={styles.loadingText}>Cargando tus tickets...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={goBack}>
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Mis Tickets</Text>
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mis Tickets</Text>
            </View>
            
            <FlatList
                data={tickets}
                renderItem={renderTicketItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No hay tickets para mostrar</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(164, 72, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    backButtonText: {
        fontSize: 20,
        color: '#A448FF',
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#A448FF',
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 10,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 16,
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#ccc',
    },
    listContent: {
        padding: 16,
    },
    ticketCard: {
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        marginBottom: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    ticketType: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#A448FF',
        marginBottom: 12,
    },
    qrImage: {
        width: 200,
        height: 200,
        marginVertical: 16,
    },
    ticketInstructions: {
        fontSize: 14,
        color: '#ccc',
        marginTop: 8,
        textAlign: 'center',
    },
});

export default EventTicketsScreen;