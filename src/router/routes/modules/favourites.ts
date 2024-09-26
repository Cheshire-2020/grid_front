import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/favourites',
  name: 'favourites',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '收藏管理',
    requiresAuth: true,
    icon: 'icon-star',
    order: 0,
  },
  children: [
    {
      path: 'favourites',
      name: 'favourites_main',
      component: () => import('@/views/favourites/favourites-manage.vue'),
      meta: {
        locale: '收藏管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
