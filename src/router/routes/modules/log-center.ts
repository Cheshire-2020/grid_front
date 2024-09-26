import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/log-center',
  name: 'log-center',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '日志中心',
    requiresAuth: true,
    icon: 'icon-file',
    order: 3,
  },
  children: [
    {
      path: 'audit-logs',
      name: 'audit-logs',
      component: () => import('@/views/log-center/audit-logs.vue'),
      meta: {
        locale: '审计日志',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
