import { hasPermission } from '@/utils'

export const routes = [

  { path: '/', redirect: '/login' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'list/reports',
        component: () => import('@/pages/list/reports.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'report/yields',
        component: () => import('@/pages/list/YieldReport.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'report/loans',
        component: () => import('@/pages/list/LoanReport.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'report/wallet-statement',
        component: () => import('@/pages/list/walletStatement.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'list/roles',
        name: 'List Roles',
        component: () => import('@/pages/list/roles.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'form/role',
        name: 'Add Role',
        component: () => import('@/pages/forms/role.vue'),
        meta: { requiresAuth: true, hasPerm: hasPermission('create.role') },
      },
      {
        path: 'form/role/:uuid',
        name: 'Edit Role',
        component: () => import('@/pages/forms/role.vue'),
        meta: { requiresAuth: true, hasPerm: hasPermission('edit.role') },
      },
      {
        path: 'list/users',
        name: 'List Users',
        component: () => import('@/pages/list/users.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'form/user',
        component: () => import('@/pages/forms/user.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'form/user/:uuid',
        component: () => import('@/pages/forms/user.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'views/user/:uuid',
        component: () => import('@/pages/views/user.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'list/products',
        component: () => import('@/pages/list/products.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'form/product',
        component: () => import('@/pages/forms/product.vue'),
        meta: { requiresAuth: true, hasPerm: hasPermission('create.product') },
      },
      {
        path: 'form/product/:uuid',
        component: () => import('@/pages/forms/product.vue'),
        meta: { requiresAuth: true, hasPerm: hasPermission('edit.product') },
      },
      {
        path: 'list/categories',
        component: () => import('@/pages/list/categories.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'form/category',
        component: () => import('@/pages/forms/category.vue'),
        meta: { requiresAuth: true, hasPerm: hasPermission('create.category') },
      },
      {
        path: 'list/services',
        component: () => import('@/pages/list/services.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'form/service/:uuid',
        component: () => import('@/pages/forms/service.vue'),
        meta: { requiresAuth: true, hasPerm: hasPermission('edit.service') },
      },
      {
        path: 'form/service',
        component: () => import('@/pages/forms/service.vue'),
        meta: { requiresAuth: true, hasPerm: hasPermission('create.service') },
      },
      {
        path: 'list/farmers',
        name: 'List Farmers',
        component: () => import('@/pages/list/farmers.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'form/farmer/wizard',
        component: () => import('@/pages/forms/farmer_wizard.vue'),
        meta: { requiresAuth: true, hasPerm: hasPermission('create.farmer') },
      },
      {
        path: 'view/farmer/:uuid',
        component: () => import('@/pages/views/farmer.vue'),
        meta: { requiresAuth: true, hasPerm: hasPermission('view.farmer') },
      },
      {
        path: 'form/farmer/wizard/:uuid',
        component: () => import('@/pages/forms/farmer_wizard.vue'),
        meta: { requiresAuth: true, hasPerm: hasPermission('edit.farmer') },
      },
      {
        path: 'list/rate-cards',
        component: () => import('@/pages/list/rateCard.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'list/cohorts',
        component: () => import('@/pages/list/cohorts.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'form/cohort',
        component: () => import('@/pages/forms/cohort.vue'),
        meta: { requiresAuth: true, hasPerm: hasPermission('create.cohort') },
      },
      {
        path: 'form/cohort/:uuid',
        component: () => import('@/pages/forms/cohort.vue'),
        meta: { requiresAuth: true, hasPerm: hasPermission('create.cohort') },
      },

      {
        path: 'list/centers',
        component: () => import('@/pages/list/centers.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'form/center',
        component: () => import('@/pages/forms/center.vue'),
        meta: { requiresAuth: true, hasPerm: hasPermission('create.center') },
      },
      {
        path: 'form/center/:uuid',
        component: () => import('@/pages/forms/center.vue'),
        meta: { requiresAuth: true, hasPerm: hasPermission('create.center') },
      },

      {
        path: 'form/rate-card',
        component: () => import('@/pages/forms/rateCard.vue'),
        meta: { requiresAuth: true, hasPerm: hasPermission('create.rate_card') },
      },
      {
        path: 'list/rate-cards',
        component: () => import('@/pages/list/rateCard.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'form/loan-product',
        component: () => import('@/pages/forms/loadProduct.vue'),
        meta: { requiresAuth: true, hasPerm: hasPermission('create.loan_product') },
      },
      {
        path: 'form/loan-product/:uuid',
        component: () => import('@/pages/forms/loadProduct.vue'),
        meta: { requiresAuth: true, hasPerm: hasPermission('edit.loan_product') },
      },
      {
        path: 'list/loan-products',
        component: () => import('@/pages/list/loanProducts.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'form/deposit',
        component: () => import('@/pages/forms/deposit.vue'),
        meta: { requiresAuth: true, hasPerm: hasPermission('create.deposit') },
      },
      {
        path: '/list/deposits',
        component: () => import('@/pages/list/deposits.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'form/farm-activity',
        component: () => import('@/pages/forms/farmActivity.vue'),
        meta: { requiresAuth: true, hasPerm: hasPermission('create.farm_activity') },
      },
      {
        path: 'form/farm-activity/:uuid',
        component: () => import('@/pages/forms/editFarmActivity.vue'),
        meta: { requiresAuth: true, hasPerm: hasPermission('edit.farm_activity') },
      },
      {
        path: '/edit/form/farm-activity/:uuid',
        component: () => import('@/pages/forms/farmActivity.vue'),
        meta: { requiresAuth: true, hasPerm: hasPermission('edit.farm_activity') },
      },
      {
        path: 'list/farm-activities',
        component: () => import('@/pages/list/farmActivities.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'view/farmer-activity/:uuid',
        component: () => import('@/pages/views/farmActivity.vue'),
        meta: { requiresAuth: true, hasPerm: hasPermission('view.farm_activity') },
      },
      {
        path: 'list/active-loans',
        component: () => import('@/pages/list/loans.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'view/loan/:uuid',
        component: () => import('@/pages/views/loan.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: '/view/payment/:uuid',
        component: () => import('@/pages/views/payment.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'list/payments',
        component: () => import('@/pages/list/payments.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'form/payment',
        component: () => import('@/pages/forms/payment.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'complete/payment/:uuid',
        component: () => import('@/pages/forms/payment.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'list/debts',
        component: () => import('@/pages/list/debts.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'list/withdrawals',
        component: () => import('@/pages/list/withdrawals.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'account-settings',
        component: () => import('@/pages/views/setting.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'account-settings/edit',
        component: () => import('@/pages/forms/setting.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },
      {
        path: 'list/activity-logs',
        component: () => import('@/pages/list/activityLogs.vue'),
        meta: { requiresAuth: true, hasPerm: true },
      },

    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/pages/login.vue'),
        meta: { guest: true },
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/error.vue'),
      },
    ],
  },
]
