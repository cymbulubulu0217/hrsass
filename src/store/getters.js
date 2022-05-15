const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,

  token: state => state.user.token,
  name: state => state.user.userInfo.username, // 建立用户名称的映射
  // token: state => state.user.token,
  avatar: state => state.user.userInfo.staffPhoto,
  companyId: state => state.user.userInfo.companyId, // 建立对于user模块的companyId的快捷访问
  myRoutes: state => state.permission.routes
  // name: state => state.user.name
}
export default getters