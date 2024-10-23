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
      path: 'task-scan',
      name: 'task-scan',
      component: () => import('@/views/task/task-scan.vue'),
      meta: {
        locale: '新建任务',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'task-list',
      name: 'task-list',
      component: () => import('@/views/task/task-list.vue'),
      meta: {
        locale: '任务列表',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'task-detail/:id', // 动态路由参数
      name: 'task-detail',
      component: () => import('@/views/task/task-detail.vue'),
      meta: {
        hidden: true,
        locale: '任务详情',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'try',
      name: 'try',
      component: () => import('@/views/task/try.vue'),
      meta: {
        locale: 'try',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
