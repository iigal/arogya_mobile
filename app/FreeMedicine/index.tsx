import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Alert,
  Animated,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { useRouter } from "expo-router";

const healthCentersData = require("./list_of_health_centers.json");
const medicinesData = require("./medicines.json");
const freeMedicines = medicinesData.medicines;
const diseaseMedicines = require("./disease_medicines.json");

function assignMedicinesToCenters(healthCenters) {
  const meds = [...freeMedicines, ...Object.values(diseaseMedicines).flat()];
  return healthCenters.map((center) => {
    const count = Math.floor(Math.random() * 4) + 3;
    const availableMedicines = [];
    while (availableMedicines.length < count) {
      const med = meds[Math.floor(Math.random() * meds.length)];
      if (!availableMedicines.includes(med)) availableMedicines.push(med);
    }
    return { ...center, availableMedicines };
  });
}

const openOSMSearch = (latitude, longitude) => {
  const url = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`;
  Linking.openURL(url);
};

export default function App() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("freeMedicines");
  const [healthCenters, setHealthCenters] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [selectedDisease, setSelectedDisease] = useState("");
  const [uploadedReport, setUploadedReport] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Map search state
  const [centerSearch, setCenterSearch] = useState("");

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    Animated.spring(slideAnim, {
      toValue: 0,
      bounciness: 12,
      useNativeDriver: true,
    }).start();

    const centers = healthCentersData
      .map((item) => ({
        id: item.uuid,
        name: item.name || "Unnamed Center",
        latitude: parseFloat(item.coordinates.latitude),
        longitude: parseFloat(item.coordinates.longitude),
        properties: item.properties,
      }))
      .filter((center) => center.latitude && center.longitude);

    setHealthCenters(assignMedicinesToCenters(centers));
  }, []);

  const pickReport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });
      if (result.type === "success") {
        setUploadedReport(result);
        Alert.alert("Report Uploaded", `File: ${result.name}`);
      }
    } catch (error) {
      console.log("Error picking document:", error);
    }
  };

  const filteredMedicines = freeMedicines.filter((med) =>
    med.toLowerCase().includes(search.toLowerCase())
  );

  const centersWithMedicine = selectedMedicine
    ? healthCenters.filter((center) =>
        center.availableMedicines.includes(selectedMedicine)
      )
    : [];

  const medicinesForDisease = selectedDisease
    ? diseaseMedicines[selectedDisease] || []
    : [];

  const centersForDisease = selectedDisease
    ? healthCenters.filter((center) =>
        medicinesForDisease.some((med) =>
          center.availableMedicines.includes(med)
        )
      )
    : [];

  const handleMarkerPress = (center) => {
    setSelectedCenter(center);
    setModalVisible(true);
  };

  // Filter centers for map based on search
  const filteredCenters = healthCenters.filter((center) =>
    center.name.toLowerCase().includes(centerSearch.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#E8F5E9" }}>
      {/* Back Button */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.backButtonText}>← Back to Home</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingTop: 10 }}
      >
        {/* Animated Title */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <View style={styles.titleBox}>
            <Text style={styles.title}>💊 Free Medicine by Nepal Govt</Text>
          </View>
          <Text style={styles.subtitle}>Your trusted health partner</Text>
        </Animated.View>

        {/* Navigation */}
        <View style={styles.nav}>
          <Button
            title="All Medicines"
            onPress={() => {
              setActiveSection("freeMedicines");
              setSelectedMedicine("");
              setSearch("");
            }}
            color={activeSection === "freeMedicines" ? "#0A6847" : "#A5D6A7"}
          />
          <Button
            title="Disease Check"
            onPress={() => {
              setActiveSection("diseaseMedicines");
              setSelectedDisease("");
            }}
            color={activeSection === "diseaseMedicines" ? "#0A6847" : "#A5D6A7"}
          />
          <Button
            title="Health Centers"
            onPress={() => setActiveSection("locations")}
            color={activeSection === "locations" ? "#0A6847" : "#A5D6A7"}
          />
        </View>

        {/* Free Medicines Section */}
        {activeSection === "freeMedicines" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔍 Search Medicines</Text>
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <TextInput
                style={styles.input}
                placeholder="Type medicine name..."
                value={search}
                onChangeText={(text) => {
                  setSearch(text);
                  setSelectedMedicine("");
                }}
              />
            </Animated.View>

            <FlatList
              data={filteredMedicines}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Animated.View
                  style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.listItem,
                      item === selectedMedicine && styles.selectedListItem,
                    ]}
                    onPress={() => {
                      setSelectedMedicine(item);
                      setSearch(item);
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
              scrollEnabled={false}
            />

            {selectedMedicine && (
              <View style={{ marginTop: 20 }}>
                <Text style={styles.sectionTitle}>
                  📦 {selectedMedicine} is available at:
                </Text>
                {centersWithMedicine.length === 0 && (
                  <Text style={styles.infoText}>
                    ❌ Not available in listed centers.
                  </Text>
                )}
                {centersWithMedicine.map((center) => (
                  <View key={center.id} style={styles.centerRow}>
                    <Text
                      style={styles.centerName}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {center.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        openOSMSearch(center.latitude, center.longitude)
                      }
                      style={styles.mapButton}
                    >
                      <Text style={styles.mapButtonText}>View on Map</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Disease Medicines Section */}
        {activeSection === "diseaseMedicines" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🩺 Select Disease</Text>
            <Picker
              selectedValue={selectedDisease}
              onValueChange={(value) => setSelectedDisease(value)}
              style={styles.picker}
            >
              <Picker.Item label="-- Select Disease --" value="" />
              {Object.keys(diseaseMedicines).map((disease) => (
                <Picker.Item key={disease} label={disease} value={disease} />
              ))}
            </Picker>

            {selectedDisease !== "" && (
              <View style={{ marginTop: 20 }}>
                <Text style={styles.sectionTitle}>
                  💊 Medicines for {selectedDisease}:
                </Text>
                {medicinesForDisease.map((med, idx) => (
                  <Text key={idx} style={styles.boldText}>
                    {med}
                  </Text>
                ))}

                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                  📍 Available at Centers:
                </Text>
                {centersForDisease.length === 0 && (
                  <Text style={styles.infoText}>
                    ❌ Not available in listed centers.
                  </Text>
                )}
                {centersForDisease.map((center) => (
                  <View key={center.id} style={styles.centerRow}>
                    <Text
                      style={styles.centerName}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {center.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        openOSMSearch(center.latitude, center.longitude)
                      }
                      style={styles.mapButton}
                    >
                      <Text style={styles.mapButtonText}>View on Map</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Health Centers Section */}
        {activeSection === "locations" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 Health Centers Map</Text>

            <TextInput
              style={styles.input}
              placeholder="Search Health Center..."
              value={centerSearch}
              onChangeText={(text) => setCenterSearch(text)}
            />

            <MapView
              style={{ width: "100%", height: 400, borderRadius: 12 }}
              initialRegion={{
                latitude: healthCenters.length ? healthCenters[0].latitude : 27.7172,
                longitude: healthCenters.length ? healthCenters[0].longitude : 85.3240,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
              provider={PROVIDER_DEFAULT}
            >
              {filteredCenters.map((center) => (
                <Marker
                  key={center.id}
                  coordinate={{ latitude: center.latitude, longitude: center.longitude }}
                  title={center.name}
                  description={`Medicines: ${center.availableMedicines.join(", ")}`}
                  onPress={() => handleMarkerPress(center)}
                />
              ))}
            </MapView>

            {selectedCenter && modalVisible && (
              <View style={styles.modalContainer}>
                <Text style={styles.sectionTitle}>{selectedCenter.name}</Text>
                <Text style={styles.infoText}>
                  Available Medicines: {selectedCenter.availableMedicines.join(", ")}
                </Text>
                <Button
                  title="Open in OSM"
                  onPress={() =>
                    openOSMSearch(selectedCenter.latitude, selectedCenter.longitude)
                  }
                />
                <Button
                  title="Close"
                  onPress={() => setModalVisible(false)}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  titleBox: {
    backgroundColor: "#0A6847",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 10,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#388E3C",
    textAlign: "center",
    marginBottom: 25,
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#0A6847",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "white",
    elevation: 2,
  },
  listItem: {
    backgroundColor: "#F1F8E9",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  selectedListItem: {
    backgroundColor: "#A5D6A7",
  },
  picker: {
    backgroundColor: "white",
    borderRadius: 8,
    marginVertical: 12,
    elevation: 2,
  },
  centerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  centerName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#0A6847",
    flexShrink: 1,
  },
  mapButton: {
    backgroundColor: "#388E3C",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
  },
  mapButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  fileInfo: {
    marginVertical: 5,
    fontStyle: "italic",
    color: "#555",
  },
  boldText: {
    marginTop: 10,
    fontWeight: "bold",
  },
  infoText: {
    marginVertical: 5,
    fontStyle: "italic",
    color: "#555",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 5,
    marginTop: 10,
  },
  backButtonContainer: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  backButton: {
    backgroundColor: "#0A6847",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
