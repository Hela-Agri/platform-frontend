import { api } from '@/api'
import { GenerateUrl } from '@/api/shared'

export const getActivityLogs = async (params?: any) => {
  const url = GenerateUrl('activity-logs?', params)

  return await api
    .get(url)
    .then(response => response)
    .catch(e => e.response)
}
