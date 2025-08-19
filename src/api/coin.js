import request from '@/utils/request'

export function getCoin() {
    return request({
        url: '/coin/',
        method: 'get'
    })
}

export function getCoinExchangeList() {
    return request({
        url: '/coin/rate/',
        method: 'get'
    })
}
export function getConfig() {
    return request({
        url: '/config/1/',
        method: 'get'
    })
}
