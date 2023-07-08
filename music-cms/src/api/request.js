
import axios from 'axios'

const requests = axios.create({
  baseURL: '/api',
  timeout: 30000,

  withCredentials: true,
})



export default requests

  