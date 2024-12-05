import { api } from "@/api"
import { GenerateUrl } from '@/api/shared'


export const fetchFarms = async (params: any, page?: number) => {
  const url = GenerateUrl('farms?', params)

  return await api
    .get(url)
    .then(response => response)
    .catch(e => e.response)
}

export const getFarmers = async (params: any) => {
  const url = GenerateUrl('farmers?', params)

  return await api
    .get(url)
    .then(response => response)
    .catch(e => e.response)
}

export const createFarmer = async (payload: any) => {
  return await api
    .post('farmers', payload)
    .then(response => response)
    .catch(e => e.response)
}
export const updateFarmer = async (uuid:any,payload: any) => {
  return await api
    .post('update-farmers/'+uuid, payload)
    .then(response => response)
    .catch(e => e.response)
}
export const getFarmer = async (uuid:any) => {
  return await api
    .get('farmers/'+uuid)
    .then(response => response)
    .catch(e => e.response)
}
export const removeFarmer = async (id: number) => {
  return await api
    .delete(`farmers/${id}`)
    .then(response => response)
    .catch(e => e.response)
}
export const addKin = async (payload: any) => {
  return await api
    .post('kin', payload)
    .then(response => response)
    .catch(e => e.response)
}



export const createFarmerActivity = async (payload: any) => {
  return await api
    .post('farm-activities', payload)
    .then(response => response)
    .catch(e => e.response)
}
export const updateFarmerActivity = async (uuid: any, payload: any) => {
  return await api
    .put(`farm-activities/${uuid}`, payload)
    .then(response => response)
    .catch(e => e.response)
}

export const getFarmerActivities = async (params: any) => {
  const url = GenerateUrl('farm-activities?', params)
  return await api
    .get(url)
    .then(response => response)
    .catch(e => e.response)
}

export const getFarmerActivity = async (uuid: any) => {
  return await api
    .get(`farm-activities/${uuid}`)
    .then(response => response)
    .catch(e => e.response)
}


export const removeFarmActivity = async (uuid: any) => {
  return await api
    .delete(`farm-activities/${uuid}`)
    .then(response => response)
    .catch(e => e.response)
}

export const removeFarmActivityItem = async (uuid: any) => {
  return await api
    .delete(`farm-activity-items/${uuid}`)
    .then(response => response)
    .catch(e => e.response)
}

export const downloadActivityStatement = async (uuid: any) => {
  return await api
    .get(`farm-activities/print-statement/${uuid}`,
      {
        responseType: "blob",
      })
    .then(response => response)
    .catch(e => e.response)
}

export const downloadFarmerLoan = async (uuid: any, payload: any) => {
  return await api
    .post(`farmer-loan/${uuid}`, payload,
      {
        responseType: "blob",
      })
    .then(response => response)
    .catch(e => e.response)
}

export const downloadFarmerYield = async (uuid: any, payload: any) => {
  return await api
    .post(`farmer-yield/${uuid}`, payload,
      {
        responseType: "blob",
      })
    .then(response => response)
    .catch(e => e.response)
}
export const approveFarmerActivity = async (uuid: any, payload: any) => {
  return await api
    .put(`approve-farm-activity/${uuid}`, payload)
    .then(response => response)
    .catch(e => e.response)
}
export const approveFarmerActivities = async (payload: any) => {
  return await api
    .post('approve-farm-activities', payload)
    .then(response => response)
    .catch(e => e.response)
}


export const removeFarmActivityYield = async (uuid: any) => {
  return await api
    .delete(`harvests/${uuid}`)
    .then(response => response)
    .catch(e => e.response)
}

