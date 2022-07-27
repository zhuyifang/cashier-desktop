const routes = [
  {
    path: '/',
    component: () => import('layouts/BaseLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/startUpPage.vue')
      },
      {
        path: 'login',
        component: () => import('pages/passport/loginPage.vue')
      },
      {
        path: 'bootstrap',
        meta: {authUser: true},
        component: () => import('pages/boot-strap/bootstrapPage.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'order',
        meta: {authUser: true, authMall: true},
        component: () => import('pages/order/orderPage.vue')
      },
      {
        path: 'goods',
        meta: {authUser: true, authMall: true},
        component: () => import('pages/goods/goodsPage.vue')
      },
      {
        path: 'workbench',
        meta: {authUser: true, authMall: true},
        component: () => import('pages/workbench/workbenchPage.vue')
      },
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
