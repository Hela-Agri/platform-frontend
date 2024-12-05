import { api } from '@/api'
import { GenerateUrl } from "@/api/shared"

export const login = async (postBody: any) => {
  return await api
    .post('auth/login', postBody)
    .then(response => response)
    .catch(e => e.response)
}
export const getModules = async (params: any) => {
  return await api
    .get('modules', params)
    .then(response => response)
    .catch(e => e.response)
}
export const getPermissions = async (params: any) => {
  return await api
    .get('permissions', params)
    .then(response => response)
    .catch(e => e.response)
}

export const getUsers = async (params: any) => {
  return await api
    .get('users', params)
    .then(response => response)
    .catch(e => e.response)
}

export const createUser = async (payload: any) => {
  return await api
    .post('users', payload)
    .then(response => response)
    .catch(e => e.response)
}
export const updateUser = async (uuid: any, payload: any) => {
  return await api
    .put(`users/${uuid}`, payload)
    .then(response => response)
    .catch(e => e.response)
}

export const getUser = async (uuid: any) => {
  return await api
    .get(`users/${uuid}`)
    .then(response => response)
    .catch(e => e.response)
}

// eslint-disable-next-line camelcase
const users_url = (root: string, filter: any, page?: number): string => {
  let url = root
  if (filter?.value !== undefined) {
    if (page !== undefined)
      url = `${url}&page=${page}`

    if (filter.value.search_query)
      url = `${url}&searchFields=name:like;&search=${filter.value.search_query}`

    if (filter.value.type)
      url = `${url}&type=${filter.value.type}`

    if (filter.value.role_type)
      url = `${url}&role_type=${filter.value.role_type}`
  }
  url = url.replace('users?&', 'users?')

  return url
}

export const fetchUsers = async (params:any) => {
  const url = GenerateUrl('users?', params)

  return await api
    .get(url)
    .then(response => response)
    .catch(e => e.response)
}
export const changePassword = async ( payload: any) => {
  return await api
    .post(`/users/change-password`, payload)
    .then(response => response)
    .catch(e => e.response)
}
