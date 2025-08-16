import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Dashboard',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="city-details" 
          options={{ 
            title: 'City Details',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="disease-info" 
          options={{ 
            title: 'Disease Information',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="active-diseases" 
          options={{ 
            title: 'Active Diseases',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="prevention-tips" 
          options={{ 
            title: 'Prevention Tips',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="treatment-guidelines" 
          options={{ 
            title: 'Treatment Guidelines',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="city-symptoms" 
          options={{ 
            title: 'City Symptoms',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="city-preventive" 
          options={{ 
            title: 'City Preventive',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="city-treatment" 
          options={{ 
            title: 'City Treatment',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="city-vaccination" 
          options={{ 
            title: 'City Vaccination',
            headerShown: false 
          }} 
        />
      </Stack>
    </>
  );
}
