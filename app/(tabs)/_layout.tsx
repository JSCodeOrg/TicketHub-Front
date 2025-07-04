import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../../components/auth/AuthContext';


function AppNavigation() {
  const { userEmail, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#A448FF" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!userEmail ? (
        <>
          <Stack.Screen name="Login" />
          <Stack.Screen name="Register" />
          <Stack.Screen name="verify-screen" />
          <Stack.Screen name="Edition" />
          <Stack.Screen name="Reseat-password" />
          <Stack.Screen name="Create-event" />
          <Stack.Screen name="Edition-events" />
          <Stack.Screen name="Mis-tickes" />
          <Stack.Screen name="EventTicketsScreen/[id]" />
        </>
      ) : (
         <>
        <Stack.Screen name="(tabs)" />
        </>
      )}
    </Stack>
  );
}


export default function RootLayout() {
  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>
  );
}