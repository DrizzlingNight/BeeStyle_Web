
import {getCoin, getCoinExchangeList} from "@/api/coin";


const state = {
    coinList:[],
    rateList:[]
}

const mutations = {
    SET_STATE_LIST: (state, coinList) => {
        state.coinList = coinList
    },
    SET_RATE_LIST: (state, rateList) => {
        state.rateList = rateList
    }
}

const actions = {
    getCoin({commit}) {
        return new Promise((resolve, reject) => {
            getCoin().then(response => {
                const data = response.data.results
                // 過濾掉active: false (禁用) 的幣種
                const activeCoins = data.filter(coin => coin.active)
                commit('SET_STATE_LIST', activeCoins)
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    getCoinExchangeList({commit}) {
        return new Promise((resolve, reject) => {
            getCoinExchangeList().then(response => {
                const data = response.data
                commit('SET_RATE_LIST', data)
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
