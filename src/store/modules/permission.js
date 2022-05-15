import { asyncRoutes, constantRoutes } from '@/router'

// vuex中的permission模块用来存放当前的 静态路由 + 当前用户的 权限路由
const state = {
  // 默认拥有静态路由
  // 动态路由拿到用户的权限信息之后进行动态的添加
  routes: constantRoutes
}
const mutations = {
  // newRoutes可以认为是 用户登录 通过权限所得到的动态路由的部分
  setRoutes(state, newRoutes) {
    // 应该是每次更新 都应该在静态路由的基础上进行追加
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  filterRouters(context, menus) {
    const routers = asyncRoutes.filter(item => menus.includes(item.name))
    context.commit('setRoutes', routers)
    return routers
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
