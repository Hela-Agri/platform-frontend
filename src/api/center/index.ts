import { api } from '@/api'
import { GenerateUrl } from "@/api/shared";


export const getCenters = async ( params?: any) => {
  const url = GenerateUrl('centers?', params)

  return await api
    .get(url)
    .then(response => response)
    .catch(e => e.response)
}

export const addCenter = async (postBody: any) => {
  return await api
    .post('centers', postBody)
    .then(response => response)
    .catch(e => e.response)
}

export const updateCenter = async (id: string, postBody: any) => {
  return await api
    .patch(`centers/${id}`, postBody)
    .then(response => response)
    .catch(e => e.response)
}
export const getCenter = async (id: string) => {
  return await api
    .get(`centers/${id}`)
    .then(response => response)
    .catch(e => e.response)
}



export const removeCenter = async (id: number) => {
  return await api
    .delete(`centers/${id}`)
    .then(response => response)
    .catch(e => e.response)
}

export const uploadCenterList = async (params: any) => {
  return await api
    .post('import-centers', params)
    .then(response => response)
    .catch(e => e.response)
}
