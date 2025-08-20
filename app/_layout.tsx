import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="FreeMedicine" options={{ headerShown: false, title: "", presentation: 'card' }} />
      <Stack.Screen name="complain" options={{ headerShown: false }} />
      <Stack.Screen name="MedicineReminderApp" options={{ headerShown: false }} />
    </Stack>
  );
}
