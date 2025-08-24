import { SafeAreaView, StyleSheet, View } from 'react-native';
import SurveyBuilder from '../../components/survey/SurveyBuilder';

export default function SurveyScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <SurveyBuilder />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F3F4F6',
  },
});