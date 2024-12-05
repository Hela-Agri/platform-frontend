import { api } from '@/api'

export const addSettings = async (postBody: any) => {
  return await api
    .post('settings', postBody)
    .then(response => response)
    .catch(e => e.response)
}
export const getSettings = async () => {
  return await api
    .get(`settings`)
    .then(response => response)
    .catch(e => e.response)
}

export const updateSettings = async (id: string, postBody: any) => {
  return await api
    .post(`update/settings/${id}`, postBody)
    .then(response => response)
    .catch(e => e.response)
}
