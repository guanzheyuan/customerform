export default [
  //自定义表单设计
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/',
        redirect: '/customer/customerlist',
        authority: ['admin'],
      },
      {
        path: '/customer',
        name: '自定义表单设计',
        icon: 'table',
        routes: [
          {
            path: '/customer/customerlist',
            name: '动态表单',
            component: './CustomerMgr/CustomerFormList',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
