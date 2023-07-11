//引入路由配置
//Vue3中需要引入createRouter来配置路由，引入 createWebHashHistory 指定路由工作模式
import { createRouter, createWebHashHistory } from 'vue-router'
//引入路由组件
import Discover from '@/page/Discover'
import Recommend from '@/page/Discover/Recommend'
import SongList from '@/page/Discover/SongList'
import TopList from '@/page/Discover/TopList'
import Singer from '@/page/Discover/Singer'
import Search from '@/page/Search'
import Single from '@/page/Search/Single'
import SearchSinger from '@/page/Search/Singer'
import Collection from '@/page/Search/Collection'
import SearchSongList from '@/page/Search/SongList'
import Video from '@/page/Search/Video'
import PlaylistDetails from '@/page/PlaylistDetails'
import CollectionDetails from '@/page/CollectionDetails'
import SingerDetails from '@/page/SingerDetails'
import UserDetails from '@/page/UserDetails'
import VideoDetails from '@/page/VideoDetails'
import Personal from '@/page/Personal'
import Videos from '@/page/Videos'
import VideoList from '@/page/Videos/VideoList'
import MvList from '@/page/Videos/MvList'
import Enshrine from '@/page/Enshrine'
import EnshrineCollection from '@/page/Enshrine/Collection'
import EnshrineSingle from '@/page/Enshrine/Singer'
import EnshrineVideo from '@/page/Enshrine/Video'
import Recommendation from '@/page/Recommendation'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    //重定向：在项目运行的时候，立马定向到发现音乐页面，否则页面可能不展示内容或者展示非路由组件的内容
    {
      //Vue3需要使用正则的形式配置指定未识别的路径
      path: '/:pathMatch(.*)*',
      redirect: '/discover/recommend',
    },
    {
      path: '/discover',
      component: Discover,
      redirect: '/discover/recommend',
      children: [
        {
          path: '/discover/recommend',
          component: Recommend,
          name: 'recommend',
        },
        {
          path: '/discover/songList',
          component: SongList,
          name: 'songList',
        },
        {
          path: '/discover/topList',
          component: TopList,
          name: 'topList',
        },
        {
          path: '/discover/singer',
          component: Singer,
          name: 'singer',
        },
      ],
    },
    {
      path: '/search',
      component: Search,
      redirect: '/search/single',
      children: [
        {
          path: '/search/single/:keywords',
          component: Single,
          name: 'searchSingle',
          props($route) {
            return {
              keywords: $route.params.keywords,
            }
          },
        },
        {
          path: '/search/singer/:keywords',
          component: SearchSinger,
          name: 'searchSinger',
          props($route) {
            return {
              keywords: $route.params.keywords,
            }
          },
        },
        {
          path: '/search/collection/:keywords',
          component: Collection,
          name: 'searchCollection',
          props($route) {
            return {
              keywords: $route.params.keywords,
            }
          },
        },
        {
          path: '/search/songList/:keywords',
          component: SearchSongList,
          name: 'searchSongList',
          props($route) {
            return {
              keywords: $route.params.keywords,
            }
          },
        },
        {
          path: '/search/video/:keywords',
          component: Video,
          name: 'searchVideo',
          props($route) {
            return {
              keywords: $route.params.keywords,
            }
          },
        },
      ],
    },
    {
      path: '/playlistDetails/:id',
      component: PlaylistDetails,
      name: 'playlistDetails',
      props($route) {
        return {
          id: $route.params.id,
        }
      },
    },
    {
      path: '/collectionDetails/:id',
      component: CollectionDetails,
      name: 'collectionDetails',
      props($route) {
        return {
          id: $route.params.id,
        }
      },
    },
    {
      path: '/singerDetails/:id',
      component: SingerDetails,
      name: 'singerDetails',
      props($route) {
        return {
          id: $route.params.id,
        }
      },
    },
    {
      path: '/userDetails/:id',
      component: UserDetails,
      name: 'userDetails',
      props($route) {
        return {
          id: $route.params.id,
        }
      },
    },
    {
      path: '/videoDetails/:id/:type',
      component: VideoDetails,
      name: 'videoDetails',
      props($route) {
        return {
          id: $route.params.id,
          type: $route.params.type,
        }
      },
    },
    {
      path: '/personal/:id',
      component: Personal,
      name: 'personal',
      props($route) {
        return {
          id: $route.params.id,
        }
      },
    },
    {
      path: '/videos',
      component: Videos,
      redirect: '/videos/videoList',
      children: [
        {
          path: '/videos/videoList',
          component: VideoList,
          name: 'videoList',
        },
        {
          path: '/videos/mvList',
          component: MvList,
          name: 'mvList',
        },
      ],
    },
    {
      path: '/enshrine',
      component: Enshrine,
      redirect: '/enshrine/collection',
      children: [
        {
          path: '/enshrine/collection',
          component: EnshrineCollection,
          name: 'enshrineCollection',
        },
        {
          path: '/enshrine/single',
          component: EnshrineSingle,
          name: 'enshrineSingle',
        },
        {
          path: '/enshrine/video',
          component: EnshrineVideo,
          name: 'enshrineVideo',
        },
      ],
    },
    {
      path: '/recommendation',
      component: Recommendation,
      name: 'recommendation',
    },
  ],
})
