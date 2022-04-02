import { Constant } from './_utils'
const { ApiPrefix } = Constant

const database = [
  {
    id: '1',
    icon: 'dashboard',
    name: 'Dashboard',
    zh: {
      name: '仪表盘'
    },
    'pt-br': {
      name: 'Dashboard'
    },
    route: '/dashboard',
  },
  
  {
    id: '2',
    breadcrumbParentId: '1',
    name: 'Users',
    zh: {
      name: '用户管理'
    },
    'pt-br': {
      name: 'Usuário'
    },
    icon: 'user',
    route: '/user',
  },
  
  {
    id: '21',
    menuParentId: '-1',
    breadcrumbParentId: '2',
    name: 'User Detail',
    zh: {
      name: '用户详情'
    },
    'pt-br': {
      name: 'Detalhes do usuário'
    },
    route: '/user/:id',
  },

  {
    id: '3',
    breadcrumbParentId: '1',
    name: 'Config',
    zh: {
      name: '配置'
    },
    'pt-br': {
      name: ' '
    },
    icon:'edit',

    route: '/post',
  },

  

  
]

module.exports = {
  [`GET ${ApiPrefix}/routes`](req, res) {
    res.status(200).json(database)
  },
}
