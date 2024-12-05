import { api } from '@/api'

export const getStatus = async (params: any) => {
  return await api
    .get('status', params)
    .then(response => response)
    .catch(e => e.response)
}

export const getCountries = async (params: any) => {
  return await api
    .get('countries', params)
    .then(response => response)
    .catch(e => e.response)
}

export const getAdministrationLevelOne = async (uuid: string) => {
  return await api
    .get(`administration-level-ones?country_id=${uuid}`)
    .then(response => response)
    .catch(e => e.response)
}
export const getAdministrationLevelTwo = async (uuid: string) => {
  return await api
    .get(`administration-level-twos?administration_level_one=${uuid}`)
    .then(response => response)
    .catch(e => e.response)
}
export const getAdministrationLevelThree = async (uuid: string) => {
  return await api
    .get(`administration-level-threes?administration_level_two=${uuid}`)
    .then(response => response)
    .catch(e => e.response)
}

export const getUnits = async (params: any) => {
  return await api
    .get('units?classification='+params?.classification??'product')
    .then(response => response)
    .catch(e => e.response)
}
export const getRelationships = async (params: any) => {
  return await api
    .get('relationships', params)
    .then(response => response)
    .catch(e => e.response)
}
export const getActions = async (params: any) => {
  return await api
  .get('actions', params)
  .then(response => response)
  .catch(e => e.response)
}
export const addSiteVisit = async (params: any) => {
  return await api
  .post('site-visits', params)
  .then(response => response)
  .catch(e => e.response)
}

export const GenerateUrl = (root: string, params: any): string => {
  let url = root;

  url += Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== '' && params[key] !== null) // Filter out empty and undefined params
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
    .join('&');

  if (url.includes('?&')) {
    url = url.replace('?&', '?'); // Fix the URL if it contains '?&'
  }

  return url;
}

