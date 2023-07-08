import request from './request'

export const banner = ( ) =>{
    return request ({
        url:`/banner`,methods:'GET'
    })
}