import axios from "axios";
import { useUsersStore } from '../stores/users';


const instance =axios.create({
    baseURL:'/api',
    timeout:5000
});

instance.interceptors.request.use(function(config){
    const usersStore = useUsersStore()
    config.headers.Authorization = usersStore.token
    return config;
},function(error){
    return Promise.reject(error);
});


instance.interceptors.response.use(function(response){
    return response;
},function (error){
    return Promise.reject(error)
});


const http = {
    get(url,data,config){
        return instance.get(url, {...config, params: data})
    },
    post(url,data,config){
        return instance.post(url,data,config)
    },
    put(url,data,config){
        return instance.put(url,data,config)
    },
    patch(url,data,config){
        return instance.patch(url,data,config)
    },
    delete(url, data, config) {
        return instance.delete(url, {...config, data})
      }
}

export default http