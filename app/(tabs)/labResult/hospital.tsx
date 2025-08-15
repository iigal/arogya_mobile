"use client";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	FlatList,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

const hospitalData = [
	{
		id: "1",
		date: "01/23/2024",
		name: "NRL Diagnostics",
		address: "123 Medical Center Dr",
		phone: "+1 (555) 123-4567",
		type: "Diagnostic Center",
	},
	{
		id: "2",
		date: "07/16/2023",
		name: "Teaching Hospital",
		address: "456 University Ave",
		phone: "+1 (555) 987-6543",
		type: "General Hospital",
	},
	{
		id: "3",
		date: "11/28/2023",
		name: "SRL Laboratory",
		address: "789 Health Plaza",
		phone: "+1 (555) 456-7890",
		type: "Laboratory",
	},
];

export default function HospitalScreen() {
	const router = useRouter();
	const [search, setSearch] = useState("");

	const filteredHospitals = hospitalData.filter((hospital) =>
		hospital.name.toLowerCase().includes(search.toLowerCase())
	);

	const renderHospitalItem = ({ item }: { item: (typeof hospitalData)[0] }) => (
		<TouchableOpacity style={styles.hospitalCard}>
			<View style={styles.hospitalHeader}>
				<View style={styles.hospitalIcon}>
					<Ionicons name="medical" size={24} color="#3b82f6" />
				</View>
				<View style={styles.hospitalInfo}>
					<Text style={styles.hospitalName}>{item.name}</Text>
					<Text style={styles.hospitalType}>{item.type}</Text>
				</View>
				<Text style={styles.visitDate}>{item.date}</Text>
			</View>

			<View style={styles.hospitalDetails}>
				<View style={styles.detailRow}>
					<Ionicons name="location" size={16} color="#6b7280" />
					<Text style={styles.detailText}>{item.address}</Text>
				</View>
				<View style={styles.detailRow}>
					<Ionicons name="call" size={16} color="#6b7280" />
					<Text style={styles.detailText}>{item.phone}</Text>
				</View>
			</View>

			<TouchableOpacity
				style={styles.viewReportsButton}
				onPress={() => router.push("/report")}
			>
				<Text style={styles.viewReportsText}>View Reports</Text>
				<Ionicons name="arrow-forward" size={16} color="#3b82f6" />
			</TouchableOpacity>
		</TouchableOpacity>
	);

	return (
		<SafeAreaView style={styles.container}>
			<LinearGradient colors={["#10b981", "#059669"]} style={styles.header}>
				<Text style={styles.headerTitle}>Hospital Details</Text>
				<Text style={styles.headerSubtitle}>Your visit history</Text>
			</LinearGradient>

			<View style={styles.content}>
				<View style={styles.searchContainer}>
					<Ionicons
						name="search"
						size={20}
						color="#6b7280"
						style={styles.searchIcon}
					/>
					<TextInput
						placeholder="Search hospitals..."
						value={search}
						onChangeText={setSearch}
						style={styles.searchInput}
						placeholderTextColor="#9ca3af"
					/>
				</View>

				<FlatList
					data={filteredHospitals}
					keyExtractor={(item) => item.id}
					renderItem={renderHospitalItem}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.listContainer}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8fafc",
	},
	header: {
		padding: 20,
		paddingTop: 40,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
	headerTitle: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#ffffff",
		marginBottom: 4,
	},
	headerSubtitle: {
		fontSize: 16,
		color: "#d1fae5",
	},
	content: {
		flex: 1,
		padding: 20,
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#ffffff",
		borderRadius: 12,
		paddingHorizontal: 16,
		marginBottom: 20,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	searchIcon: {
		marginRight: 12,
	},
	searchInput: {
		flex: 1,
		paddingVertical: 16,
		fontSize: 16,
		color: "#1f2937",
	},
	listContainer: {
		paddingBottom: 20,
	},
	hospitalCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	hospitalHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	hospitalIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "#eff6ff",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	hospitalInfo: {
		flex: 1,
	},
	hospitalName: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1f2937",
		marginBottom: 2,
	},
	hospitalType: {
		fontSize: 14,
		color: "#6b7280",
	},
	visitDate: {
		fontSize: 12,
		color: "#9ca3af",
		fontWeight: "500",
	},
	hospitalDetails: {
		marginBottom: 16,
	},
	detailRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
		gap: 8,
	},
	detailText: {
		fontSize: 14,
		color: "#4b5563",
	},
	viewReportsButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: "#3b82f6",
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 8,
		gap: 8,
	},
	viewReportsText: {
		color: "#3b82f6",
		fontWeight: "600",
		fontSize: 14,
	},
});
