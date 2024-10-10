import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/task',
  name: 'task',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '任务管理',
    requiresAuth: true,
    icon: 'icon-select-all',
    order: 0,
  },
  children: [
    {
      path: 'task-list',
      name: 'task-list',
      component: () => import('@/views/task/task-list.vue'),
      meta: {
        locale: '任务管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
