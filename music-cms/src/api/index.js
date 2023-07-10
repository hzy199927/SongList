import request from './request'

export const banner = ( ) =>{
    return request ({
        url:`/banner`,methods:'GET'
    })
}
export const personalized = () => {
    return request ({
        url: `/personalized`, method: 'GET'
    })
}