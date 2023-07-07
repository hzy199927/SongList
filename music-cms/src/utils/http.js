import axios from 'axios'

const instance = axios.create({
    // loacalhost: 8080
    baseURL: '/api',
    // 超时
    timeout: 5000,
    headers: {}
  })

// 添加拦截器
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  })

// 统一接口写法
// const http = {
//     get(url, data, config){
//         return instance.get(url, {... config, params: data})},
//     post(url, data, config){
//         return instance.post(url, data, config)
//     },
//     post(url, data, config){
//         return instance.post(url, data, config)
//     },
//     put(url, data, config){
//         return instance.put(url, data, config)
//     },
//     patch(url, data, config){
//         return instance.patch(url, data, config)
//     },
//     delete (url, data, config){
//         return instance.delete (url, {...config, data})
//     },
    
// }


const http = {
  get(url, data, config){
    return instance.get(url, { ...config, params:data })
  },
  post(url,data, confi){
    return instance.post(url, data, confi)
  },
  patch(url, data, config){
    return instance.patch(url, data, config)
  },
  put(url, data, config){
    return instance.put(url, data, config)
  },
  delete(url, data, config){
    return instance.delete(url,{...config, data})
  }
} 