# E-Arogya Disease Dashboard

A React Native mobile application built with Expo CLI that provides disease information, preventive measures, and health guidelines for different cities and seasons.

## Features

- **Dashboard Screen**: Season selector, city dropdown, and quick action grid
- **City Details**: Disease information specific to selected city
- **Disease Information**: Detailed symptoms, prevention, and treatment guidelines
- **Responsive Design**: Modern UI matching the provided reference design
- **Navigation**: Smooth transitions between screens using Expo Router

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npx expo start
```

3. Run on device/simulator:
- Press `a` for Android
- Press `i` for iOS
- Scan QR code with Expo Go app

## Project Structure

```
app/
├── _layout.tsx          # Root layout with navigation
├── index.tsx            # Dashboard screen
├── city-details.tsx     # City-specific disease info
└── disease-info.tsx     # Detailed disease information

components/
├── SeasonSelector.tsx   # Season toggle buttons
├── CityDropdown.tsx     # City selection dropdown
├── QuickActionGrid.tsx  # Action buttons grid
└── BottomNavigation.tsx # Bottom navigation bar

constants/
├── Colors.ts           # App color scheme
└── Data.ts            # Mock data for cities and diseases
```

## Technologies Used

- React Native with Expo
- Expo Router for navigation
- TypeScript
- Expo Vector Icons
- Linear Gradient
- React Native Safe Area Context

## Mock Data

The app currently uses static mock data for:
- Cities (Kathmandu, Pokhara, Chitwan, Dharan, Butwal)
- Disease information (Seasonal Flu)
- Symptoms, prevention measures, and treatment guidelines

## Future Enhancements

- Real-time disease data integration
- User location detection
- Push notifications for health alerts
- Offline data caching
- Multi-language support
