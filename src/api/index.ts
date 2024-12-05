import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_ROOT,
})

api.interceptors.request.use(config => {
  config.headers.Accept = 'application/json'

  const token = localStorage.getItem('access_token')
  if (token)
    config.headers.Authorization = `Bearer ${token}`

  return config
})

export { api }

