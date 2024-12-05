import { api } from '@/api'
import { GenerateUrl } from "@/api/shared"

export const getStatistics = async (filter: any, page?: number) => {
  const url = GenerateUrl('statistics?', filter, page)

  return await api
    .get(url)
    .then(response => response)
    .catch(e => e.response)
}
export const downloadYieldReport = async ( payload: any) => {
  return await api
    .post(`reports/yield`, payload,
      {
        responseType: "blob",
      })
    .then(response => response)
    .catch(e => e.response)
}
export const downloadLoanReport = async ( payload: any) => {
  return await api
    .post(`reports/loan`, payload,
      {
        responseType: "blob",
      })
    .then(response => response)
    .catch(e => e.response)
}

export const downloadWalletStatement = async ( payload: any) => {
  return await api
    .post(`export-wallet-transactions`, payload,
      {
        responseType: "blob",
      })
    .then(response => response)
    .catch(e => e.response)
}
export const getHarvests = async (payload: any) => {
  const url = GenerateUrl('data/yields?', payload)

  return await api
    .post(url)
    .then(response => response)
    .catch(e => e.response)
}

export const getLoans = async (payload: any) => {
  const url = GenerateUrl('data/loans?', payload)

  return await api
    .post(url)
    .then(response => response)
    .catch(e => e.response)
}

export const getWalletStatements = async (payload: any) => {
  const url = GenerateUrl('data/wallet-statements?', payload)

  return await api
    .get(url)
    .then(response => response)
    .catch(e => e.response)
}

