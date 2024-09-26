import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/labels',
  name: 'labels',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '标签管理',
    requiresAuth: true,
    icon: 'icon-tag',
    order: 4,
  },
  children: [
    {
      path: 'labels',
      name: 'labels_main',
      component: () => import('@/views/labels/label-manage.vue'),
      meta: {
        locale: '标签管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
