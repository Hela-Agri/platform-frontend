import { api } from '@/api'

const createDepositUrl = (root: string, filter: any, page?: number): string => {
  let url = root
  if (filter?.value !== undefined) {
    if (page !== undefined)
      url = `${url}&page=${page}`

    if (filter.value.search_query)
      url = `${url}&searchFields=name:like;&search=${filter.value.search_query}`

    if (filter.value.shop_id)
      url = `${url}&shop_id=${filter.value.shop_id}`
  }
  url = url.replace('deposits?&', 'deposits?')

  return url
}

const createWithdrawalsUrl = (root: string, filter: any, page?: number): string => {
  let url = root
  if (filter?.value !== undefined) {
    if (page !== undefined)
      url = `${url}&page=${page}`

    if (filter.value.search_query)
      url = `${url}&searchFields=name:like;&search=${filter.value.search_query}`

    if (filter.value.type)
      url = `${url}&type=${filter.value.type}`
  }
  url = url.replace('wallet-transactions?&', 'wallet-transactions?')

  return url
}

export const fetchDeposits = async (filter: any, page?: number) => {
  const url = createDepositUrl('deposits?orderBy=id&sortedBy=desc', filter, page)

  return await api
    .get(url)
    .then(response => response)
    .catch(e => e.response)
}

export const addDeposit = async (postBody: any) => {
  return await api
    .post('deposits', postBody)
    .then(response => response)
    .catch(e => e.response)
}

export const updateDeposit = async (uuid: any, payload: any) => {
  return await api
    .put(`deposits/${uuid}`, payload)
    .then(response => response)
    .catch(e => e.response)
}

export const fetchWithdrawals = async (filter: any, page?: number) => {
  const url = createWithdrawalsUrl('wallet-transactions?orderBy=id&sortedBy=desc', filter, page)

  return await api
    .get(url)
    .then(response => response)
    .catch(e => e.response)
}
