import axios from "axios"
import { VaccineRecord } from "../types/Types"

export const createVaccination = async (data: VaccineRecord): Promise<void> => {

  try {
    await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/vaccinations/`, data, {
      headers: {
        "Authorization": `Bearer ${process.env.EXPO_PUBLIC_ACCESS_TOKEN}`,
      },
    })
  } catch (error) {
    console.error("Error creating vaccination record:", error)
  }
}