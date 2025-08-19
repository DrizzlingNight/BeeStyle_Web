const state = {
    showAlert: false,
    alertData:''
}

const mutations = {
    SHOW_ALERT: (state, showAlert) => {
        state.showAlert = showAlert
    },
    SHOW_ALERT_DATA: (state, showAlertData) => {
        state.alertData = showAlertData
    }
}

const actions = {
    showAlert({commit},playList) {
        return new Promise((resolve) => {
            commit('SHOW_ALERT', true)
            commit('SHOW_ALERT_DATA', playList)
            resolve()
        })
    }
}


export default {
    namespaced: true,
    state,
    mutations,
    actions
}
