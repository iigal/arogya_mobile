import axios from "axios"
import { VaccineRecord, vaccineRecordSchema } from "../types/Types"

const buildQuery = (params: Record<string, any>): string => {
    const query = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null) 
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&")
  
    return query ? `?${query}` : ""
  }

export const getVaccineRecords = async (query: Record<string, any>): Promise<VaccineRecord[]> => {

  try {
    const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/vaccinations/${buildQuery(query)}`, {
      headers: {
        "Authorization": `Bearer ${process.env.EXPO_PUBLIC_ACCESS_TOKEN}`,
      },
    })
    return response.data.map((record: VaccineRecord) => vaccineRecordSchema.parse(record))
  } catch (error) {
    console.error("Error getting vaccine records:", error)
    return []
  }
}