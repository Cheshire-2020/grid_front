import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/resources',
  name: 'resources',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '资源库',
    requiresAuth: true,
    icon: 'icon-image',
    order: 2,
  },
  children: [
    {
      path: 'fingerprints',
      name: 'fingerprints',
      component: () => import('@/views/resources/fingerprints.vue'),
      meta: {
        locale: '指纹库',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'vulnerabilities',
      name: 'vulnerabilities',
      component: () => import('@/views/resources/vulnerabilities.vue'),
      meta: {
        locale: '漏洞库',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'POCs',
      name: 'POCs',
      component: () => import('@/views/resources/POCs.vue'),
      meta: {
        locale: 'POC库',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'locations_manage',
      name: 'locations_manage',
      component: () => import('@/views/resources/locations-manage.vue'),
      meta: {
        locale: '定位管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
