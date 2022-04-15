export default {
  queryRouteList: '/routes',

  queryUserInfo: '/user',
  logoutUser: '/user/logout',
  loginUser: 'POST /user/login',

  queryUser: '/user/:id',
  updateUser: 'Patch /user/:id',
  createUser: 'POST /user',
  removeUser: 'DELETE /user/:id',
  removeUserList: 'POST /users/delete',

  queryPostList: '/posts',

  queryDashboard: '/dashboard',
  queryTableTitles: 'OPTIONS /sv/voyage/',
  queryVoyageList: 'GET /sv/voyage/',
  queryFilter: 'POST /sv/voyage/',
  querySort:'POST /sv/voyage/',
  queryAutoComplete:'POST /sv/voyage/autocomplete',

  queryIntegerRange:'GET /sv/voyage/aggregations'

}
