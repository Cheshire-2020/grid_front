import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/settings',
  name: 'settings',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '配置中心',
    requiresAuth: true,
    icon: 'icon-settings',
    order: 1,
  },
  children: [
    {
      path: 'users',
      name: 'users',
      component: () => import('@/views/setting-center/user-manage.vue'),
      meta: {
        locale: '用户管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'me',
      name: 'me',
      component: () => import('@/views/setting-center/me.vue'),
      meta: {
        locale: '个人中心',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'detection_nodes',
      name: 'detection_nodes',
      component: () =>
        import('@/views/setting-center/detection-node-config.vue'),
      meta: {
        locale: '探测节点管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'gateway',
      name: 'gateway',
      component: () => import('@/views/setting-center/gateway-config.vue'),
      meta: {
        locale: '网关配置',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'node_group',
      name: 'node_group',
      component: () => import('@/views/setting-center/node-group.vue'),
      meta: {
        locale: '节点组',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'port_group',
      name: 'port_group',
      component: () => import('@/views/setting-center/port-group.vue'),
      meta: {
        locale: '常用端口组',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'exceptional_ip',
      name: 'exceptional_ip',
      component: () =>
        import('@/views/setting-center/exceptional-ip-group.vue'),
      meta: {
        locale: '例外端口组管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
