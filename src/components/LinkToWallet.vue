<template>
    <div>
        <v-dialog v-model="isShowDialog" width="614" @click:outside="isShowDialog = false">
            <v-card class="d-flex justify-center flex-column align-center">
                <div class="d-flex justify-end pr-3 pt-3" style="width:100%;">
                    <button @click="isShowDialog = false">
                        <v-icon color="white">close</v-icon>
                    </button>
                </div>
                <v-card-title class="mx-10">{{$t('transferNFT.linkToWallet')}}</v-card-title>
                <v-card-subtitle class="mx-sm-15 mx-4 mt-5"><span>{{$t('transferNFT.linkAgreement')}}<a style="color:#cc9933;" @click="goService">{{$t('transferNFT.linkTerms')}}</a>{{$t('transferNFT.readAndConfirmTerms')}} <a style="color:#cc9933;" @click="goService">{{$t('transferNFT.statement')}}</a>。</span></v-card-subtitle>

                <v-container class="mb-4">
                    <v-col>

                        <v-row no-gutters class="mt-4 mx-sm-15 mx-4">
                            <v-btn elevation="0" @click="clickMenu(0)" class="btn" height="100">
                                <div class="ml-8 text-h6 text-sm-h5 font-weight-medium font-weight-sm-bold">MetaMask</div>
                                <v-spacer></v-spacer>
                                <v-img class="mr-7 ml-2" max-width="94" max-height="94" :aspect-ratio="1" min-width="60" min-height="60" src="@/assets/transferNFT/metamask.png"></v-img>
                            </v-btn>
                        </v-row>

                        <!-- 暫時只支援MetaMask -->
                        <!-- <v-row no-gutters class="mt-4 mx-sm-15 mx-4">
                            <v-btn elevation="0" @click="clickMenu(1)" class="btn" height="100">
                                <div class="ml-8 text-h6 text-sm-h5 font-weight-medium font-weight-sm-bold">WallletConnect</div>
                                <v-spacer></v-spacer>
                                <v-img class="mr-10 ml-2" max-width="74" max-height="74" :aspect-ratio="1" min-width="44" min-height="44" src="@/assets/transferNFT/walletconnect.png"></v-img>
                            </v-btn>
                        </v-row> -->

                    </v-col>
                </v-container>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import walletConnect from '@/api/walletConnect'

export default {
    name: 'SelectNFTNetwork',
    computed: {
        ...mapGetters(['isShowLinkToWalletDialog', 'isNFTTransferIn', 'user']),

        isShowDialog: {
            get() {
                if (this.isShowLinkToWalletDialog && this.user) {
                    return true
                }
                return false
            },
            set(val) {
                this.$store.commit('ui/SET_IS_SHOW_LINK_TO_WALLET_DIALOG', val)
            },
        },
    },
    data() {
        return {

        }
    },
    watch: {
        isShowLinkToWalletDialog(newVal) {
            this.isShowDialog = newVal
        }
    },
    methods: {
        goService() {
            this.$store.commit('ui/SET_IS_SERVICE_PAGE_DIALOG', true);
        },
        clickMenu(index) {
            this.isShowDialog = false
            if (index === 0) { // metamask
                this.$store.commit('ui/SET_IS_META_MASK', true)
                if (typeof window.ethereum !== 'undefined') {
                    
                     walletConnect.metaMask.switchToBSC().then( () => {
                         this.getMetaMaskWalletAccount()
                     }).catch(err => {
                         console.log('err:',err)
                     })
                }
            } else if (index === 1) { // wallet connect
                this.$store.commit('ui/SET_IS_META_MASK', false);
                if (this.isNFTTransferIn) {
                    walletConnect.walletConnect.switchToBSC().then( () => {
                        this.getWalletConnectAccount()
                    }).catch(err => {
                        const errStr = String(err)
                        if (errStr.indexOf('JSON RPC response format is invalid') != -1) {
                            this.getWalletConnectAccount()
                        }
                    })
                } else {
                    walletConnect.walletConnect.getAccountAddress().then (account => {
                        this.isShowDialog = false
                        this.$store.commit('ui/SET_CONNECTED_WALLET_ACCOUNT', account)
                    })
                }
            }
        },
        getMetaMaskWalletAccount() {
            walletConnect.metaMask.getAccounts().then (accounts => {
                if (this.isNFTTransferIn) {
                    this.$store.commit('ui/SET_IS_SHOW_TRANSFER_IN_NFT_DIALOG', true)
                } else {
                    this.isShowDialog = false
                    this.$store.commit('ui/SET_CONNECTED_WALLET_ACCOUNT', '')
                }
                this.$store.commit('ui/SET_CONNECTED_WALLET_ACCOUNT', accounts[0])

            }).catch( err => {
                console.log('err:', err)
            })
        },
        getWalletConnectAccount() {
            walletConnect.walletConnect.getAccountAddress().then (account => {
                if (this.isNFTTransferIn) {
                    this.$store.commit('ui/SET_IS_SHOW_TRANSFER_IN_NFT_DIALOG', true)
                } else {
                    this.isShowDialog = false
                    this.$store.commit('ui/SET_CONNECTED_WALLET_ACCOUNT', '')
                }
                this.$store.commit('ui/SET_CONNECTED_WALLET_ACCOUNT', account)
            })
        }
    }
}
</script>

<style scoped land="scss">


.btn {
    width:100%;
    height:100px;
    background-color: #F6F5F3;
}

@media screen and (max-width: 599px) {
    .wallet-img {
        max-height: 44px;
        max-width: 44px;
        min-width: 44px;
        min-height: 44px;
    }
}

</style>