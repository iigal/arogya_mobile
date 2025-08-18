import axios from "axios"

export const deleteVaccinationRecord = async (id: string): Promise<void> => {

  try {
  await axios.delete(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/vaccinations/${id}/`, {
    headers: {
      "Authorization": `Bearer ${process.env.EXPO_PUBLIC_ACCESS_TOKEN}`,
    },
  })
  } catch (error) {
    console.error("Error deleting vaccination record:", error)
  }
}