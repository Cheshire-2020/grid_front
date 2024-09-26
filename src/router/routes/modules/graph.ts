import { DEFAULT_LAYOUT } from '@/router/routes/base';
import { AppRouteRecordRaw } from '@/router/routes/types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/graph',
  name: 'graph',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '图谱演示',
    requiresAuth: true,
    icon: 'icon-mosaic',
    order: 0,
  },
  children: [
    {
      path: 'render',
      name: 'render',
      component: () => import('@/views/graph/graph-render.vue'),
      meta: {
        locale: '图谱演示',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
