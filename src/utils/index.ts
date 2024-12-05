import type {UnwrapRef} from 'vue'
import type Category from '@/pages/forms/category.vue'

export const formatDate = (dateString: UnwrapRef<Category['created_at']>): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }

  const date = new Date(dateString)

  return date.toLocaleDateString('en-US', options)
}

export const calculateDaysFromToday = (dateString) => {
  const givenDate = new Date(dateString);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffInMilliseconds = givenDate - today;

  return Math.round(diffInMilliseconds / (1000 * 60 * 60 * 24));
}


const formatFieldName = (field: any) => {
  return field.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export const getQuantityColorTagCode = (status: any) => {
  if (status === 'APPROVED' || status === 'PAID' || status === 'CLOSED') {
    return 'success'
  } else if (status === 'UNAPPROVED' || status === 'PENDING') {
    return 'warning'
  } else if (status === 'ACTIVE') {
    return 'primary'
  } else if (status === 'ALLOCATED' || status === 'PARTIALLY PAID') {
    return 'info'
  } else if (status === 'DEACTIVATED' || status === 'REJECTED' || status === 'OVERDUE') {
    return 'error'
  } else {
    return 'default'
  }
}

export const formattedErrors = (errors: any) => {
  let formatted = ''
  for (const [field, messages] of Object.entries(errors)) {
    const formattedField = formatFieldName(field)

    formatted += `${formattedField}:${messages}\n`
  }

  return formatted
}
export const hasPermission = (permission: string) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  if (user && Array.isArray(user.permissions))
    return user.permissions.includes(permission)

  return false
}
