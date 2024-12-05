<script lang="ts" setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
import { hasPermission } from '@/utils'
</script>

<template>
  <!-- 👉 Dashboards -->
  <VerticalNavLink

    :item="{
      title: 'Dashboards',
      icon: 'bx-home-alt',
      to: '/dashboard',
    }"
  />
  <VerticalNavLink
    v-if="hasPermission('list.report')"
    :item="{
        title: 'Reports',
        to: '/list/reports',
         icon: 'bx bxs-report',
      }"
  />
  <!-- 👉 Apps & Pages -->
  <VerticalNavSectionTitle
    v-if="
      hasPermission('list.product')
        || hasPermission('list.category')
        || hasPermission('list.service')
        || hasPermission('list.rate_card')"
    :item="{
      heading: 'Farm Management',
    }"
  />
  <VerticalNavGroup
    v-if="
      hasPermission('list.product')
        || hasPermission('list.category')
        || hasPermission('list.service')
        || hasPermission('list.rate_card')"
    :item="{
      title: 'Farm Inputs',
      icon: 'bx-fork',
    }"
  >
    <VerticalNavLink
      v-if="hasPermission('list.category')"
      :item="{
        title: 'Categories',
        to: '/list/categories',
      }"
    />
    <VerticalNavLink
      v-if="
        hasPermission('list.product')"
      :item="{
        title: 'Products',
        to: '/list/products',
      }"
    />
    <VerticalNavLink
      v-if="hasPermission('list.service')"
      :item="{
        title: 'Services',
        to: '/list/services',
      }"
    />
    <VerticalNavLink
      v-if="hasPermission('list.rate_card')"
      :item="{
        title: 'Rate Card',
        to: '/list/rate-cards',
      }"
    />
  </VerticalNavGroup>

  <VerticalNavGroup
    v-if="
      hasPermission('list.cohort')
        || hasPermission('list.farmer')
        || hasPermission('list.farm_activity')"
    :item="{
      title: 'Farm',
      icon: 'bx-shape-polygon',
    }"
  >
    <VerticalNavLink
      v-if="
        hasPermission('list.center')"
      :item="{
        title: 'Centers',
        to: '/list/centers',
      }"
    />
    <VerticalNavLink
      v-if="
        hasPermission('list.cohort')"
      :item="{
        title: 'Cohorts',
        to: '/list/cohorts',
      }"
    />
    <VerticalNavLink
      v-if="hasPermission('list.farmer')"
      :item="{
        title: 'Farmers',
        to: '/list/farmers',
      }"
    />
    <VerticalNavLink
      v-if="hasPermission('list.farm_activity')"
      :item="{
        title: 'Farm Activities',
        to: '/list/farm-activities',
      }"
    />

  </VerticalNavGroup>

  <VerticalNavSectionTitle
    v-if="
      hasPermission('list.loan')
        || hasPermission('list.payment')
        || hasPermission('list.loan_product')"
    :item="{
      heading: 'Account Management',
    }"
  />
  <VerticalNavGroup
    :item="{
      title: 'Accounts',
      icon: 'bx-money',
    }"
  >
    <VerticalNavLink
      v-if="hasPermission('list.loan')"
      :item="{
        title: 'Active Loans',
        to: '/list/active-loans',
      }"
    />
    <VerticalNavLink
      v-if="hasPermission('list.payment')"
      :item="{
        title: 'Payments',
        to: '/list/payments',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Debts',
        to: '/list/debts',
      }"
    />
      <VerticalNavLink
      v-if="hasPermission('list.loan_product')"
      :item="{
        title: 'Loan Products',
        to: '/list/loan-products',
      }"
    />
  </VerticalNavGroup>
  <VerticalNavGroup
    v-if="
      hasPermission('list.wallet')
        || hasPermission('list.deposit')"
    :item="{
      title: 'Wallets',
      icon: 'bx-transfer',
    }"
  >
    <VerticalNavLink
      v-if="hasPermission('list.deposit')"
      :item="{
        title: 'Wallet Deposits',
        to: '/list/deposits',
      }"
    />
    <VerticalNavLink
      v-if="hasPermission('list.withdraw')"
      :item="{
        title: 'Withdrawals',
        to: '/list/withdrawals',
      }"
    />
  </VerticalNavGroup>
  <VerticalNavSectionTitle
    :item="{
      heading: 'System Management',
    }"
  />
  <VerticalNavGroup
    v-if="
      hasPermission('list.user')
        || hasPermission('list.role')"
    :item="{
      title: 'Users',
      icon: 'bx-user',
    }"
  >
    <VerticalNavLink
      v-if="hasPermission('list.role')"
      :item="{
        title: 'Roles',
        to: '/list/roles',
      }"
    />
    <VerticalNavLink
      v-if="hasPermission('list.user')"
      :item="{
        title: 'Users',
        to: '/list/users',
      }"
    />
  </VerticalNavGroup>
  <VerticalNavLink
    v-if="hasPermission('view.setting')"
    :item="{
      title: 'System Settings',
      icon: 'bx-cog',
      to: '/account-settings',
    }"
  />
  <VerticalNavLink
    v-if="hasPermission('list.activity_logs')"
    :item="{
        title: 'Activity Logs',
        to: '/list/activity-logs',
         icon: 'bx bx-list-ul',
      }"
  />
</template>
