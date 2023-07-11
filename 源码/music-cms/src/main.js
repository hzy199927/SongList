import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import iconfont from '@/assets/icon/iconfont.css'
import cloudmusic from '@/assets/css/cloudmusic.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 引入 Elmessage 和 Elloading 的css样式文件
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message.css'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app
  .use(router) //挂载路由
  .use(store) //挂载vuex
  .mount('#app')
