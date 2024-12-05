import { api } from '@/api'
import {GenerateUrl} from "@/api/shared";


export const getRateCards  = async ( params?: any) => {
  const url = GenerateUrl('rate-cards?', params)

  return await api
    .get(url)
    .then(response => response)
    .catch(e => e.response)
}

export const addRateCard = async (postBody: any) => {
  return await api
    .post('rate-cards', postBody)
    .then(response => response)
    .catch(e => e.response)
}
