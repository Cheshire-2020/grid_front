import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/maintenance',
  name: 'maintenance',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '系统管理',
    requiresAuth: true,
    icon: 'icon-code-block',
    order: 8,
  },
  children: [
    {
      path: 'basic_info',
      name: 'basic_info',
      component: () => import('@/views/system-maintenance/basic-info.vue'),
      meta: {
        locale: '系统信息',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'network_config',
      name: 'network_config',
      component: () => import('@/views/system-maintenance/network-config.vue'),
      meta: {
        locale: '网络配置',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'update',
      name: 'update',
      component: () => import('@/views/system-maintenance/update.vue'),
      meta: {
        locale: '升级管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'diagnosis',
      name: 'diagnosis',
      component: () => import('@/views/system-maintenance/auto-diagnosis.vue'),
      meta: {
        locale: '诊断工具',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'syslog',
      name: 'syslog',
      component: () => import('@/views/system-maintenance/syslog-config.vue'),
      meta: {
        locale: 'syslog配置',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
