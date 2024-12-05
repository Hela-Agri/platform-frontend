import { api } from '@/api'
import {GenerateUrl} from "@/api/shared";


export const fetchLoanProducts = async (filter: any) => {
  const url = GenerateUrl('loan-packages?', filter)

  return await api
    .get(url)
    .then(response => response)
    .catch(e => e.response)
}

export const addLoanProduct = async (postBody: any) => {
  return await api
    .post('loan-packages', postBody)
    .then(response => response)
    .catch(e => e.response)
}

export const updateLoanProduct = async (id: string, postBody: any) => {
  return await api
    .patch(`loan-packages/${id}`, postBody)
    .then(response => response)
    .catch(e => e.response)
}
export const updateLoanDate = async (id: string, postBody: any) => {

  return await api
    .post(`loans/update/date/${id}`, postBody)
    .then(response => response)
    .catch(e => e.response)
}


export const getLoanProduct = async (id: string) => {
  return await api
    .get(`loan-packages/${id}`)
    .then(response => response)
    .catch(e => e.response)
}

export const removeLoanProduct = async (id: string) => {
  return await api
    .delete(`loan-packages/${id}`)
    .then(response => response)
    .catch(e => e.response)
}

export const fetchLoans = async (filter: any) => {
  const url = GenerateUrl('loans?', filter)

  return await api
    .get(url)
    .then(response => response)
    .catch(e => e.response)
}
