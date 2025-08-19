import request from '@/utils/request'

export function createNFT(data) {
    return request({
        url: '/nft/token/',
        method: 'post',
        data
    })
}

export function getNFTList(params) {
    return request({
        url: '/nft/token/',
        method: 'get',
        params
    })
}

export function getNewNFTList() {
    return request({
        url: '/nft/token/new/',
        method: 'get',
    })
}

export function transferNFT(id, data) {
    return request({
        url: '/nft/token/' + id + '/transfer/',
        method: 'post',
        data
    })
}

export function sellNFT(id, data) {
    return request({
        url: '/nft/token/' + id + '/sell/',
        method: 'post',
        data
    })
}

export function buyNFT(data) {
    return request({
        url: '/bill/',
        method: 'post',
        data
    })
}

export function getNFT(id) {
    return request({
        url: '/nft/token/' + id + '/',
        method: 'get',
    })
}

export function likeNFT(id) {
    return request({
        url: `/nft/token/${id}/like/`,
        method: 'post'
    })
}

export function getNFTOffer(params) {
    return request({
        url: '/nft/offer/',
        method: 'get',
        params
    })
}

export function checkNFTOffer(offerId) {
    return request({
        url: `/nft/offer/${offerId}/`,
        method: 'get',
    })
}

export function getNFTBid(params) {
    return request({
        url: '/nft/bid/',
        method: 'get',
        params
    })
}

export function getNFTHistory(params) {
    return request({
        url: '/nft/opt_history/',
        method: 'get',
        params
    })
}

export function getOptionHistory(params) {
    return request({
        url: "/nft/opt_history/",
        method: "get",
        params
    })
}

export function getNFTBidList(params) {
    return request({
        url: "/nft/bid/",
        method: "get",
        params
    })
}

export function OfferDeal(data) {
    return request({
        url: '/nft/offer/' + data.id + '/deal/',
        method: "post",
        data
    })
}

export function deleteNFT(id) {
    return request({
        url: '/nft/token/' + id.id + '/',
        method: "delete",
        data: {password: id.password}
    })
}


export function cancelSaleNFT(id) {
    return request({
        url: '/nft/token/' + id + '/cancel_sale/',
        method: "post",
    })
}

export function bidNFT(data) {
    return request({
        url: '/nft/bid/',
        method: "post",
        data
    })
}

export function cancelBidNFT(id) {
    return request({
        url: '/nft/offer/' + id + '/cancel/',
        method: "post",
    })
}

export function offerNFT(data) {
    return request({
        url: '/nft/offer/',
        method: "post",
        data
    })
}

export function withdrawNFT(data) {
    return request({
        url: '/nft/token/' + data.id + '/withdraw/',
        method: "post",
        data
    })
}

export function collectionNFT(id) {
    return request({
        url: '/nft/token/' + id + '/like/',
        method: "post",
    })
}

export function getNFTContract() {
    return request({
        url: '/nft/contract/',
        method: 'get',
    })
}

export function getNFTTokenBalance(params) {
    return request({
        url: 'nft/token/balance/',
        method: 'get',
        params
    })
}
