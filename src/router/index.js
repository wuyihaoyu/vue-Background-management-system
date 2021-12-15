import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/user/Users.vue'
import rights from '../components/power/rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'
import Params from '../components/goods/Params'



Vue.use(VueRouter)


const router = new VueRouter({
  routes:[
    {path:'/',redirect:'/login'},
    {path:'/login',component:Login},
    {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children: [{ path:'/welcome',component:Welcome},
               { path:'/users',component:Users },
               { path:'/rights',component:rights},
               { path:'/roles',component:Roles},
               { path:'/categories',component:Cate},
               { path:'/params',component:Params}
              ]
    }
  ]
})

router.beforeEach((to,from,next)=>{
  if(to.path==='/login')
    return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()//直接放行
})
export default router
