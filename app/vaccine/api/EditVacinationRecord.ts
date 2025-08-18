import axios from "axios"
import { VaccineRecord } from "../types/Types"

export const editVaccineRecord = async (id: string, data: VaccineRecord): Promise<void> => {

  try {
    await axios.put(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/vaccinations/${id}/`, data, {
      headers: {
        "Authorization": `Bearer ${process.env.EXPO_PUBLIC_ACCESS_TOKEN}`,
      },
    })
  } catch (error) {
    console.error("Error editing vaccination record:", error)
  }
}