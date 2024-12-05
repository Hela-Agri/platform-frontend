import { api } from '@/api'
import { GenerateUrl } from "@/api/shared";


export const getProducts = async ( params?: any) => {
  const url = GenerateUrl('products?', params)

  return await api
    .get(url)
    .then(response => response)
    .catch(e => e.response)
}

export const addProduct = async (postBody: any) => {
  return await api
    .post('products', postBody)
    .then(response => response)
    .catch(e => e.response)
}

export const updateProduct = async (id: string, postBody: any) => {
  return await api
    .patch(`products/${id}`, postBody)
    .then(response => response)
    .catch(e => e.response)
}
export const getProduct = async (id: string) => {
  return await api
    .get(`products/${id}`)
    .then(response => response)
    .catch(e => e.response)
}



export const removeProduct = async (id: number) => {
  return await api
    .delete(`products/${id}`)
    .then(response => response)
    .catch(e => e.response)
}

export const uploadProductList = async (params: any) => {
  return await api
    .post('import-products', params)
    .then(response => response)
    .catch(e => e.response)
}
