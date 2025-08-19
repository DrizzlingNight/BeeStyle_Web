
const state = {
  isUserTab:-1,
  isUserDataLoading: false, // 拉使用者資料時的loading狀態 -> navbar顯示登入與使用者會用到
  isShowLoginDialog: false,
  isRegisterDialog: false,
  isShowRechargeDialog: false,
  isShowCopyDialog:false,
  isShowCopyDialogState:true,
  isShowDrawerDialog:false,
  // 轉入/轉出 NFT相關 Start
  isShowSelectNFTNetworkDialog: false,
  isShowTransferInNFTDialog: false,
  isShowLinkToWalletDialog: false,
  connectedWalletAccount: '',
  isNFTTransferIn: true,
  isMetaMask: true,
  // 轉入/轉出 NFT相關 End
  isServicePageDialog:false,
  isLoginDialogPersistent: false, // 登入彈窗是否能按邊邊關掉
  host: process.env.VUE_APP_FILE_BASE_API,
  // host:''
  // host: 'https://s3.ap-northeast-2.amazonaws.com/www.vmm.zone/'
}

const mutations = {
  SET_IS_SHOW_LOGIN_DIALOG: (state, isShow) => {
    state.isShowLoginDialog = isShow
  },
  SET_LOGIN_DIALOG_persistent: (state, isPersistent) => {
    state.isLoginDialogPersistent = isPersistent
  },
  SET_IS_REGISTER_DIALOG: (state, isRegister) => {
    state.isRegisterDialog = isRegister
  },
  SET_IS_SHOW_RECHARGE_DIALOG:(state,isAtRechargeState) => {
    state.isShowRechargeDialog = isAtRechargeState
  },
  SET_IS_SHOW_DRAWER_DIALOG:(state,isShowDrawerDialog) => {
    state.isShowDrawerDialog = isShowDrawerDialog
  },
  SET_IS_SHOW_COPY_DIALOG:(state,isShowCopyDialog) => {
    state.isShowCopyDialog = isShowCopyDialog
  },
  SET_IS_SHOW_COPY_DIALOG_STATE:(state,isShowCopyDialogState) => {
    state.isShowCopyDialogState = isShowCopyDialogState
  },
  SET_IS_USER_TAB:(state,isUserTab) => {
    state.isUserTab = isUserTab
  },
  SET_IS_SERVICE_PAGE_DIALOG: (state, isShow) => {
    state.isServicePageDialog = isShow
  },
  SET_IS_USER_DATA_LOADING: (state, isLoading) => {
    state.isUserDataLoading = isLoading
  },
  SET_IS_SHOW_TRANSFER_IN_NFT_DIALOG: (state, isShow) => {
    state.isShowTransferInNFTDialog = isShow
  },
  SET_IS_META_MASK: (state, isMetaMask) => {
      state.isMetaMask = isMetaMask
  },
  SET_CONNECTED_WALLET_ACCOUNT:(state, account) => {
      state.connectedWalletAccount = account
  },
  SET_IS_SHOW_SELECT_NFT_NETWORK_DIALOG: (state, isShow) => {
      state.isShowSelectNFTNetworkDialog = isShow
  },
  SET_IS_SHOW_LINK_TO_WALLET_DIALOG: (state, isShow) => {
      state.isShowLinkToWalletDialog = isShow
  },
  SET_IS_NFT_TRANSFER_IN: (state, isIn) => {
      state.isNFTTransferIn = isIn
  }

}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
