
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryCard from '../../components/CategoryCard';

// SVG Icon imports
import ChildHealthIcon from '../../assets/icons/child_health.svg';
import FirstAidIcon from '../../assets/icons/first_aid.svg';
import HygieneIcon from '../../assets/icons/hygiene.svg';

import Coronavirus from '../../assets/icons/coronavirus.svg';
import MedicineReminder from '../../assets/icons/medicine_reminder.svg';
import MentalHealthIcon from '../../assets/icons/mental_health.svg';
import NutritionIcon from '../../assets/icons/nutrition.svg';
import ProfileIcon from '../../assets/icons/profile.svg';
import SearchIcon from '../../assets/icons/search.svg';
import SeasonalDiseasesIcon from '../../assets/icons/seasonal_diseases.svg';


const categories = [
  { name: 'FreeMedicines', icon: <NutritionIcon width={40} height={40} stroke="#4CAF50" strokeWidth="2" fill="none" /> },

import SignoutIcon from '../../assets/icons/signout.svg';
import VaccineIcon from '../../assets/icons/vaccine.svg';
// import promo from '../../assets/images/promo.png';
const promo = require('../../assets/images/promo.png');

const categories = [
  { name: 'Vaccine', icon: <VaccineIcon width={40} height={40} stroke="#607D8B" strokeWidth="2" fill="none" /> },
  { name: 'Nutrition', icon: <NutritionIcon width={40} height={40} stroke="#4CAF50" strokeWidth="2" fill="none" /> },
  { name: 'Complain/Feedback', icon: <HygieneIcon width={40} height={40} stroke="#2196F3" strokeWidth="2" fill="none" /> },
  { name: 'Doctors', icon: <ChildHealthIcon width={40} height={40} stroke="#FF9800" strokeWidth="2" fill="none" /> },
  { name: 'Mental Health', icon: <MentalHealthIcon width={40} height={40} stroke="#9C27B0" strokeWidth="2" fill="none" /> },
  { name: 'First Aid', icon: <FirstAidIcon width={40} height={40} stroke="#F44336" strokeWidth="2" fill="none" /> },
  { name: 'HealthCamp', icon: <SeasonalDiseasesIcon width={40} height={40} stroke="#607D8B" strokeWidth="2" fill="none" /> },
  { name: 'Medicine Reminder', icon: <MedicineReminder width={40} height={40} stroke="#607D8B" strokeWidth="2" fill="none" /> },
  { name: 'Disease Dashboard', icon: <Coronavirus width={40} height={40} stroke="#607D8B" strokeWidth="2" fill="none" /> },
  { name: 'Survey Builder', icon: <ProfileIcon width={40} height={40} /> },
];

export default function HomeScreen() {
  const router = useRouter();

  const handleCategoryPress = (categoryName: string) => {
    if (categoryName === 'Complain/Feedback') {
      router.push('../complain/complainAndFeedback');
    } else if (categoryName === "Medicine Reminder") {
      router.push("../MedicineReminderApp/screens/HomeScreen");
    } else if (categoryName === "FreeMedicines") {
      router.push('../FreeMedicine/');
    } else if (categoryName === "Vaccine") {
      router.push("./vaccine/");
    } else if (categoryName === "HealthCamp") {
      router.push("../healthCamp/");
    } else if (categoryName === "Disease Dashboard") {
      router.push("./disease_dashboard/dashboard");
    } else if (categoryName === 'Survey Builder') {
      router.push('/survey');
    }
    else if (categoryName === "Doctors") {
      router.push("./doctors/");
    }
    // Add other category navigation here as needed
  };

  const handleSignout = async () => {
    await AsyncStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <ProfileIcon width={40} height={40} />
          <View style={styles.searchContainer}>
            <SearchIcon width={20} height={20} style={styles.searchIcon} />
            <TextInput placeholder="Search for a health tip" style={styles.searchInput} />
          </View>
          <TouchableOpacity style={styles.languageButton}>
            <Text style={styles.languageText}>ने/En</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.languageButton}>
            <Text style={styles.languageText}><SignoutIcon width={20} height={20} onPress={handleSignout} /></Text>
          </TouchableOpacity>

        </View>

        {/* Promotion Banner */}
        <View style={styles.promoBanner}>
          <Image
            source={promo}
            style={styles.promoImage}
            resizeMode="contain"
          />
          <Text style={styles.promoText}>स्वस्थ जीवनशैली अपनाउनुहोस्।</Text>
        </View>

        {/* Categories */}
        <Text style={styles.categoryTitle}>Health Features</Text>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              icon={category.icon}
              name={category.name}
              onPress={() => handleCategoryPress(category.name)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  languageButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  languageText: {
    fontWeight: 'bold',
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 20,
    margin: 15,
    borderRadius: 10,
  },
  promoImage: {
    width: 100,
    height: 100,
    marginRight: 15,
  },
  promoText: {
    fontSize: 22,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginHorizontal: 15,
  },
});
