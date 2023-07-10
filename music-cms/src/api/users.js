import axios from "axios";
// import { useUsersStore } from '../stores/users';


const requests =axios.create({
    baseURL:'/api',
    timeout:5000
});

const request = axios.create({
  
    baseURL: '/api',
  
    timeout: 30000,
 
    withCredentials: true,
  })

  request.interceptors.response.use(
    (res) => {
      
        return res.data
      },
      (error) => {
        if (error.response) {
         
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

export default requests