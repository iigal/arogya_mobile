import axios from "axios"
import { UpcomingVaccine, upcomingVaccineSchema } from "../types/Types"


export const getUpcomingVaccines = async (): Promise<UpcomingVaccine[]> => {

  try {
    const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/vaccinations/notifications/`, {
      headers: {
        "Authorization": `Bearer ${process.env.EXPO_PUBLIC_ACCESS_TOKEN}`,
      },
    })
    return response.data.map((record: UpcomingVaccine) => upcomingVaccineSchema.parse(record))
  } catch (error) {
    console.error("Error getting upcoming vaccines:", error)
    return []
  }
}