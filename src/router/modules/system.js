export default {
  name: 'system',
  path: '/system',
  meta: { title: '系统管理', unauth: false },
  component: () => import('@/views/pages/system/Index.vue'),
  redirect: '/system/account',
  children: [
    {
      name: 'system/account',
      path: '/system/account',
      meta: { title: '账号管理', unauth: false },
      component: () => import('@/views/pages/system/account/Index.vue'),
    },
    {
      name: 'system/role',
      path: '/system/role',
      meta: { title: '角色管理', unauth: false },
      component: () => import('@/views/pages/system/role/Index.vue'),
    },
    {
      name: 'system/access',
      path: '/system/access',
      meta: { title: '资源管理', unauth: false },
      component: () => import('@/views/pages/system/access/Index.vue'),
    },
    {
      name: 'system/dict',
      path: '/system/dict',
      meta: { title: '字典管理', unauth: false },
      component: () => import('@/views/pages/system/dict/Index.vue'),
    },
  ],
};
