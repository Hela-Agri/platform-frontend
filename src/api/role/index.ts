import { api } from '@/api'
export const getRoles = async (params: any) => {
  return await api
    .get('roles', params)
    .then(response => response)
    .catch(e => e.response)
}

export const createRole = async (payload: any) => {
  return await api
    .post('roles', payload)
    .then(response => response)
    .catch(e => e.response)
}
export const updateRole = async (uuid:any,payload: any) => {
  return await api
    .put('roles/'+uuid, payload)
    .then(response => response)
    .catch(e => e.response)
}
export const getRole = async (uuid:any) => {
  return await api
    .get('roles/'+uuid)
    .then(response => response)
    .catch(e => e.response)
}

