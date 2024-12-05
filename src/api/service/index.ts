import { api } from '@/api'
import {GenerateUrl} from "@/api/shared";



export const getServices = async (params: any) => {

  const url = GenerateUrl('services?', params)
  return await api
    .get(url)
    .then(response => response)
    .catch(e => e.response)
}

export const addService = async (postBody: any) => {
  return await api
    .post('services', postBody)
    .then(response => response)
    .catch(e => e.response)
}
export const getService = async (id: string) => {
  return await api
    .get(`services/${id}`)
    .then(response => response)
    .catch(e => e.response)
}

export const updateService = async (id: string, postBody: any) => {
  return await api
    .patch(`services/${id}`, postBody)
    .then(response => response)
    .catch(e => e.response)
}

export const removeService = async (id: number) => {
  return await api
    .delete(`services/${id}`)
    .then(response => response)
    .catch(e => e.response)
}
