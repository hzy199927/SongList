import { createRouter, createWebHistory } from 'vue-router'
// import {info} from '../api/users'
// import { useUsersStore } from '../stores/users'

const Index = ( ) => import('@/views/Index.vue')
const Find = ( ) => import('@/views/find/Find.vue')
const Like = ( ) => import('@/views/Like.vue')
const Video = ( ) => import('@/views/Video.vue')
const Login = ( ) => import('@/views/Login.vue')
const List = () => import ('@/views/find/content/List.vue')
const Recommend = () => import ('@/views/find/content/Recommend.vue')
const Singer = ( ) => import ('@/views/find/content/Singer.vue')
const TheCharts = () => import ('@/views/find/content/TheCharts.vue')

const router =createRouter ({
  history:createWebHistory(import.meta.env.BASE_URL),
  routes:[
    {
      path:'/',
      name: 'index',
      component:Index,
      redirect : '/index/find',
      children:[
        {
          path:'/index/like',
          name:'like',
          component:Like,
        },
        {
          path:'/index/video',
          name: 'video',
          component:Video,
        },
        {
          path:'/index/login',
          name:'login',
          component:Login,
        },
        {
          path:'/index/find',
          name: 'find',
          component:Find,
          redirect : '/find/recommend',
          children : [
            {
              path : '/find/list',
              name : 'findList',
              component:List,
            
            },
            {
              path : '/find/recommend',
              name : 'findRecommend',
              component:Recommend,
              meta : {
                breadcrumbs : ['个性推荐']
              }
            },
            {
              path : '/find/singer',
              name : 'findSinger',
              component:Singer,
              meta : {
                breadcrumbs : ['歌手']
              }
            },
            {
              path : '/find/thecharts',
              name : 'findTheCharts',
              component:TheCharts,
              meta : {
                breadcrumbs : ['排行榜']
              }
            },
            // { 
            //   path: '/:pathMatch(.*)*', 
            //   redirect: '/' 
            // }
          ]
        },
      ]
    },
  ]
})

// router.beforeEach((to, from, next) => {

//   if(to.meta.auth) {  
//     info().then((res) => {
//       if(res.data.errcode === 0) {
//         const usersStore = useUsersStore()
//         usersStore.updateUsername(res.data.username)
//         next()
//       }
//       else {
//         next('/login')
//       }
//     })

//   }
//   else {
//     next()
//   }

// })
export default router
