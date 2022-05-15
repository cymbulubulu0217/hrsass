import { getToken, removeToken, setTimeStamp, setToken } from '@/utils/auth'
import { getUserDetailById, getUserInfo, login } from '@/api/user'
import router, { resetRouter } from '@/router'

export default {
  namespaced: true,
  state: {
    token: getToken(),
    userInfo: {}
  },
  mutations: {
    // 修改token的方法
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    // 移除token的方法
    removeToken(state) {
      state.token = null
      removeToken()
    },
    // 定义修改用户信息的mutations
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    removeUserInfo(state) {
      state.userInfo = {}
    }
  },
  // 执行异步
  actions: {
    async login(context, data) {
      // 调用登录的接口
      try {
        const res = await login(data)
        // console.log(res)
        // 调用这个方法将token存入本地
        context.commit('setToken', res)
        // 跳转页面
        router.push('/')
        setTimeStamp() // 将当前的最新时间写入缓存
      } catch (err) {
        console.log(err)
      }
    },
    // 定义获取用户信息的action
    async getUserInfo(context) {
      try {
        // 两个都获取用户信息后合并
        const res = await getUserInfo()
        const baseUserInfo = await getUserDetailById(res.userId)
        // console.log(res)
        context.commit('setUserInfo', {
          ...res, ...baseUserInfo
        })
        return { ...res, ...baseUserInfo }
      } catch (error) {
        console.log(error)
      }
    },
    // 退出删除token和用户信息
    logout(context) {
      context.commit('removeToken')
      context.commit('removeUserInfo')
      // 重置路由匹配信息
      resetRouter()

      // 置空 routes 数组
      context.commit('permission/setRoutes', [], { root: true })
    }
  }

}

// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'
//
// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }
//
// const state = getDefaultState()
//
// const mutations = {
//   RESET_STATE: (state) => {
//     Object.assign(state, getDefaultState())
//   },
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }
//
// const actions = {
//   // user login
//   login({ commit }, userInfo) {
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       login({ username: username.trim(), password: password }).then(response => {
//         const { data } = response
//         commit('SET_TOKEN', data.token)
//         setToken(data.token)
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },
//
//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response
//
//         if (!data) {
//           return reject('Verification failed, please Login again.')
//         }
//
//         const { name, avatar } = data
//
//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },
//
//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },
//
//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // must remove  token  first
//       commit('RESET_STATE')
//       resolve()
//     })
//   }
// }
//
// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }

