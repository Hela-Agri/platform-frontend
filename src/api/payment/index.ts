import { api } from '@/api'

const createPaymentUrl = (root: string, filter: any, page?: number): string => {
  let url = root
  if (filter?.value !== undefined) {
    if (page !== undefined)
      url = `${url}&page=${page}`

    if (filter.value.search_query)
      url = `${url}&searchFields=name:like;&search=${filter.value.search_query}`
  }
  url = url.replace('payments?&', 'payments?')

  return url
}

export const fetchPayments = async (filter: any, page?: number) => {
  const url = createPaymentUrl('payments?orderBy=id&sortedBy=desc', filter, page)

  return await api
    .get(url)
    .then(response => response)
    .catch(e => e.response)
}

export const addPayment = async (postBody: any) => {
  return await api
    .post('payments', postBody)
    .then(response => response)
    .catch(e => e.response)
}

export const updatePayment = async (id: string, postBody: any) => {
  return await api
    .put(`payments/${id}`, postBody)
    .then(response => response)
    .catch(e => e.response)
}
export const getPayment = async (id: string) => {
  return await api
    .get(`payments/${id}`)
    .then(response => response)
    .catch(e => e.response)
}

export const getPaymentMethods = async () => {
  return await api
    .get('payment-modes')
    .then(response => response)
    .catch(e => e.response)
}
