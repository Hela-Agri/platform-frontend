import { api } from '@/api'

const createCategoryUrl = (root: string, filter: any, page?: number): string => {
  let url = root
  if (filter?.value !== undefined) {
    if (page !== undefined)
      url = `${url}&page=${page}`

    if (filter.value.search_query)
      url = `${url}&searchFields=name:like;&search=${filter.value.search_query}`

  }
  url = url.replace('categories?&', 'products?')

  return url
}

export const getCategories = async (filter: any, page?: number) => {
  const url = createCategoryUrl('categories?', filter, page)

  return await api
    .get(url)
    .then(response => response)
    .catch(e => e.response)
}

export const addCategory = async (postBody: any) => {
  return await api
    .post('categories', postBody)
    .then(response => response)
    .catch(e => e.response)
}

export const updateCategory = async (id: number, postBody: any) => {
  return await api
    .post(`categories/${id}`, postBody)
    .then(response => response)
    .catch(e => e.response)
}

export const removeCategory = async (id: number) => {
  return await api
    .delete(`categories/${id}`)
    .then(response => response)
    .catch(e => e.response)
}
