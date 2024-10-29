import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
    path: '/screen',
    name: 'screen',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: '可视化大屏',
        requiresAuth: true,
        icon: 'icon-computer',
        order: 0,
    },
    children: [
        {
            path: 'screen',
            name: 'screen',
            component: () => import('@/views/screen/screen.vue'),
            meta: {
                locale: '可视化大屏',
                requiresAuth: true,
                roles: ['*'],
            },
        },
    ],
};

export default DASHBOARD;
