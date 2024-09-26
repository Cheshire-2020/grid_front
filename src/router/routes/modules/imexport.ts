import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/im-export',
  name: 'im-export',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '导入导出',
    requiresAuth: true,
    icon: 'icon-download',
    order: 5,
  },
  children: [
    {
      path: 'import',
      name: 'import',
      component: () => import('@/views/im-ex-port/import.vue'),
      meta: {
        locale: '数据导入',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'export',
      name: 'export',
      component: () => import('@/views/im-ex-port/export.vue'),
      meta: {
        locale: '数据导出',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
