import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/licences',
  name: 'licences',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '许可证管理',
    requiresAuth: true,
    icon: 'icon-qrcode',
    order: 6,
  },
  children: [
    {
      path: 'licences',
      name: 'licences_main',
      component: () => import('@/views/licences/licence-management.vue'),
      meta: {
        locale: '许可证管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
