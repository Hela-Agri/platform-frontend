import { api } from '@/api'
import { GenerateUrl } from '@/api/shared'

export const getCohorts = async (params?: any) => {
  const url = GenerateUrl('cohorts?', params)

  return await api
    .get(url)
    .then(response => response)
    .catch(e => e.response)
}

export const addCohort = async (postBody: any) => {
  return await api
    .post('cohorts', postBody)
    .then(response => response)
    .catch(e => e.response)
}
export const getCohort = async (id: string) => {
  return await api
    .get(`cohorts/${id}`)
    .then(response => response)
    .catch(e => e.response)
}

export const downloadCohortLoan = async (uuid: any, payload: any) => {
  return await api
    .post(`cohort-loan/${uuid}`, payload,
      {
        responseType: "blob",
      })
    .then(response => response)
    .catch(e => e.response)
}


export const updateCohort = async (id: number, postBody: any) => {
  return await api
    .put(`cohorts/${id}`, postBody)
    .then(response => response)
    .catch(e => e.response)
}

export const removeCohort = async (id: number) => {
  return await api
    .delete(`cohorts/${id}`)
    .then(response => response)
    .catch(e => e.response)
}
