import { createRouter, createWebHistory } from 'vue-router'
import {info} from '../api/users'
import { useUsersStore } from '../stores/users'

const Index = ( ) => import('@/views/Index.vue')
const Find = ( ) => import('@/views/Find.vue')
const Like = ( ) => import('@/views/Like.vue')
const Video = ( ) => import('@/views/Video.vue')
const Login = ( ) => import('@/views/Login.vue')


const router =createRouter ({
  history:createWebHistory(import.meta.env.BASE_URL),
  routes:[
    {
      path:'/',
      name:'index',
      component:Index,
      redirect:'/home',
      meta:{
        auth:true
      }
    },
    {
      path:'/like',
      name:'like',
      component:Like,
      meta: {
        auth:false
      }
    },
    {
      path:'/login',
      name:'login',
      component:Login,
      meta: {
        auth:false
      }
    },
    {
      path:'/find',
      name: 'find',
      component:Find,
      meta: {
        auth:false
      }
    },
    {
      path:'/video',
      name: 'video',
      component:Video,
      meta: {
        auth:false
      }
    },
  ]
})

router.beforeEach((to, from, next) => {

  if(to.meta.auth) {  
    info().then((res) => {
      if(res.data.errcode === 0) {
        const usersStore = useUsersStore()
        usersStore.updateUsername(res.data.username)
        next()
      }
      else {
        next('/login')
      }
    })

  }
  else {
    next()
  }

})
export default router
