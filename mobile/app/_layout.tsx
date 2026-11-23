import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f8fafc' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="emergency-sos"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="doctors-search"
          options={{
            headerShown: true,
            title: 'البحث عن طبيب • Médecins',
            headerBackTitle: 'رجوع',
          }}
        />
        <Stack.Screen
          name="pharmacies-radar"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="chifa-card"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="traceability"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
