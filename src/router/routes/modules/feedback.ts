import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/feedback',
  name: 'feedback',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '问题反馈管理',
    requiresAuth: true,
    icon: 'icon-customer-service',
    order: 7,
  },
  children: [
    {
      path: 'feedback',
      name: 'feedback_main',
      component: () => import('@/views/feedback/feedback.vue'),
      meta: {
        locale: '问题反馈管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
