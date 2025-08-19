import request from '@/utils/request'

export function getUserWallet(params) {
    return request({
        url: '/wallet/get_wallet/',
        method: 'get',
        params
    })
}

export function isWallet(params) {
    return request({
        url: '/wallet/exists/',
        method: 'get',
        params
    })
}