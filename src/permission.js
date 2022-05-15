// 引入
import store from '@/store'
import router from '@/router'
// 定义白名单
const whiteList = ['/login', '404']
// 路由守卫
router.beforeEach(async(to, from, next) => {
  const token = store.getters.token

  // 如果有 token
  if (token) {
    // 获取用户信息
    if (!store.state.user.userInfo.userId) {
      const { roles } = await store.dispatch('user/getUserInfo')
      // console.log(res.roles.menus)
      const routers = await store.dispatch('permission/filterRouters', roles.menus)
      router.addRoutes(routers)
      router.addRoutes([...routers, { path: '*', redirect: '/404', hidden: true }])
      return next(to.path)
    }
    // 如果是去登录页面，
    if (to.path === '/login') {
      // 就跳到主页
      next('/')
    } else {
      // 如果不是去登录页面，就放行
      next()
    }
    // 如果没有 token
  } else {
    // 是否是在白名单
    if (whiteList.includes(to.path)) {
      // 是在白名单，放过通行
      next()
    } else {
      // 如果不在白名单，就跳到登录页面
      next('/login')
    }
  }
  // 后置守卫
  // router.afterEach(function() {
  //   NProgress.done() // 关闭进度条
  // })

//   if (token) {
//     if (to.path === '/login') {
//       next('/')
//     } else {
//       next()
//     }
//   } else {
//     if (whiteList.indexOf(to.path) > -1) {
//       next()
//     } else {
//       next('/login')
//     }
//   }
})

// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'
//
// NProgress.configure({ showSpinner: false }) // NProgress Configuration
//
// const whiteList = ['/login'] // no redirect whitelist
//
// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()
//
//   // set page title
//   document.title = getPageTitle(to.meta.title)
//
//   // determine whether the user has logged in
//   const hasToken = getToken()
//
//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')
//
//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/
//
//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })
//
// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
