//对axios进行二次封装
import axios from 'axios'
//引入进度条
import nprogress from 'nprogress'
//引入进度条样式
// import 'nprogress/nprogress.css'

//利用axios对象的方法create，去创建一个axios实例对象
//下面的request其实就是axios，只不过可以进行配置
const requests = axios.create({
  //配置对象

  //配置基础路径，让发送请求的路径端口号后面都加上api

  baseURL: process.env.VUE_APP_API_URL, // 使用开发或生产环境

  // baseURL: '/api', // 不使用开发或生产环境

  //设置请求超时的时间
  timeout: 30000,
  // 设置允许跨域
  withCredentials: true,
})

//请求拦截器：在发请求之前，请求拦截器可以检测到，就可以在发送请求之前进行一些操作
requests.interceptors.request.use((config) => {
  //config是一个配置对象，对象里有一个header请求头属性

  //让发送请求的进度条开始动
  // nprogress.start()
  return config
})

//响应拦截器
requests.interceptors.response.use(
  (res) => {
    //成功的回调函数，当数据返回成功之后，响应拦截器可以检测到，就可以做一些操作

    //让发送请求的进度条完成
    // nprogress.done()

    return res.data
  },
  (error) => {
    if (error.response) {
      //相应失败的回调函数
      ElMessage({
        message: `${
          error.response.data.message || '未知错误, 请打开控制台查看'
        }`,
        grouping: true,
        type: 'error',
      })
    }
    return new Promise.reject(new Error('failed'))
  }
)

//对外暴露axios

export default requests
