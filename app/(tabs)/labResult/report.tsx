"use client";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";

const reportData = [
	{
		id: "1",
		testName: "Complete Blood Count",
		date: "2024-01-15",
		hospital: "NRL Diagnostics",
		status: "Ready",
	},
	{
		id: "2",
		testName: "Liver Function Test",
		date: "2024-01-14",
		hospital: "Teaching Hospital",
		status: "Ready",
	},
	{
		id: "3",
		testName: "Lipid Profile",
		date: "2024-01-13",
		hospital: "SRL Laboratory",
		status: "Processing",
	},
];

export default function ReportScreen() {
	const router = useRouter();

	const renderReportItem = ({ item }: { item: (typeof reportData)[0] }) => (
		<View style={styles.reportHeader}>
			<View style={styles.reportIcon}>
				<Ionicons name="document-text" size={24} color="#8b5cf6" />
			</View>
			<View style={styles.reportInfo}>
				<Text style={styles.testName}>{item.testName}</Text>
				<Text style={styles.hospitalName}>{item.hospital}</Text>
				<Text style={styles.testDate}>{item.date}</Text>
			</View>
			<View style={styles.statusContainer}>
				<View
					style={[
						styles.statusBadge,
						{
							backgroundColor: item.status === "Ready" ? "#10b981" : "#f59e0b",
						},
					]}
				>
					<Text style={styles.statusText}>{item.status}</Text>
				</View>
				<Ionicons name="chevron-forward" size={20} color="#6b7280" />
			</View>
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			<LinearGradient colors={["#8b5cf6", "#7c3aed"]} style={styles.header}>
				<Text style={styles.headerTitle}>Lab Reports</Text>
				<Text style={styles.headerSubtitle}>View your test reports</Text>
			</LinearGradient>

			<View style={styles.content}>
				<View style={styles.summaryCard}>
					<Text style={styles.summaryTitle}>Report Summary</Text>
					<View style={styles.summaryStats}>
						<View style={styles.statItem}>
							<Text style={styles.statNumber}>3</Text>
							<Text style={styles.statLabel}>Total Reports</Text>
						</View>
						<View style={styles.statItem}>
							<Text style={styles.statNumber}>2</Text>
							<Text style={styles.statLabel}>Ready</Text>
						</View>
						<View style={styles.statItem}>
							<Text style={styles.statNumber}>1</Text>
							<Text style={styles.statLabel}>Processing</Text>
						</View>
					</View>
				</View>

				<Text style={styles.sectionTitle}>Recent Reports</Text>

				<FlatList
					data={reportData}
					keyExtractor={(item) => item.id}
					renderItem={renderReportItem}
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
		color: "#e9d5ff",
	},
	content: {
		flex: 1,
		padding: 20,
	},
	summaryCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 20,
		marginBottom: 24,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	summaryTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1f2937",
		marginBottom: 16,
	},
	summaryStats: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	statItem: {
		alignItems: "center",
	},
	statNumber: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#8b5cf6",
		marginBottom: 4,
	},
	statLabel: {
		fontSize: 14,
		color: "#6b7280",
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "600",
		color: "#1f2937",
		marginBottom: 16,
	},
	listContainer: {
		paddingBottom: 20,
	},
	reportCard: {
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
	reportHeader: {
		flexDirection: "row",
		alignItems: "center",
	},
	reportIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "#f3e8ff",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	reportInfo: {
		flex: 1,
	},
	testName: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1f2937",
		marginBottom: 2,
	},
	hospitalName: {
		fontSize: 14,
		color: "#6b7280",
		marginBottom: 2,
	},
	testDate: {
		fontSize: 12,
		color: "#9ca3af",
	},
	statusContainer: {
		alignItems: "center",
		gap: 8,
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	statusText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#ffffff",
	},
});
