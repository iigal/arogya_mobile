import axios from "axios"
import { Vaccine, vaccineSchema } from "../types/Types"


export const getVaccines = async (): Promise<Vaccine[]> => {

  try {
    const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/vaccines/`, {
      headers: {
        "Authorization": `Bearer ${process.env.EXPO_PUBLIC_ACCESS_TOKEN}`,
      },
    })
    return response.data.map((record: Vaccine) => vaccineSchema.parse(record))
  } catch (error) {
    console.error("Error getting vaccines:", error)
    return []
  }
  
}