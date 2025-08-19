<template>
    <div>
        <v-dialog v-model="isShowDialog" width="614" @click:outside="isShowDialog = false">
            <v-card class="d-flex justify-center flex-column align-center" style="width:100%;">
                <div class="d-flex justify-end pr-3 pt-3" style="width:100%;">
                    <button @click="isShowDialog = false">
                        <v-icon color="white">close</v-icon>
                    </button>
                </div>
                <v-card-title class="mb-2">{{ $t('transferNFT.importNFT')}}</v-card-title>

                <v-container class="px-3 px-md-10">
                    <v-col>
                        <v-row no-gutters class="d-flex flex-column">
                            <div style="font-size:14px;color:#fff;">{{ $t('transferNFT.walletAddress')+ '：'}}</div>
                            <div class="d-flex flex-row align-center mt-2 rounded-5" style="background-color:#F6F5F3; width:100%;min-height:40px;">
                                <v-img class="ml-4" max-width="22" max-height="22" src="@/assets/transferNFT/binance.png"></v-img>
                                <div class="ml-4 my-4" style="word-break: break-word; color:#000;">{{ walletAddress }}</div>
                                <v-spacer></v-spacer>
                                <button v-clipboard:copy="walletAddress" v-clipboard:success="copyWalletAddress">
                                    <v-img class="mr-5" max-width="20" max-height="20" src="@/assets/transferNFT/copy.png"></v-img>
                                </button>
                                
                            </div>
                        </v-row>

                        <v-row no-gutters class="d-flex flex-column mt-4">
                            <div style="font-size:14px;color:#fff;">{{ $t('transferNFT.contractAddress')+ '：'}}</div>
                            <div class="d-flex flex-column flex-sm-row flex-lg-row align-center"  style="width:100%;min-height:40px;">

                                <v-select solo flat color="#cc9933" class="my-4 contract-address" 
                                    v-model="selectedContractAddress" :items="allContractAddresses"
                                    @input="getWalletNFT"></v-select>
                                

                                <v-btn class="btnColor confirm-btn ml-2" style="color: #fff;" @click="confirmContractAddress">{{ $t('transferNFT.confirm') }}</v-btn>
                                
                            </div>
                        </v-row>

                        <v-row no-gutters class="d-flex flex-column mt-4">
                            <div style="font-size:14px;color:#fff;">{{$t('transferNFT.selectYourNFT')+'：'}}</div>
                            <div style="font-size:14px;color:#7D7D7D;">{{walletNfts.length + (walletNfts.length > 0 ? ($t('transferNFT.addressMatch')+ '，'+$t('transferNFT.selectToken')) : $t('transferNFT.addressMatch'))}}</div>


                            <v-container style="height:300px;overflow:auto;" :style="{ height: (walletNfts.length > 0 ? 300 : 50) + 'px'}">
                                <v-row>
                                    <v-col
                                    v-for="(nft, idx) in walletNfts"
                                    :key="nft.title"
                                    cols="6"
                                    sm="4"
                                    >

                                        <v-card elevation="0" class="d-flex flex-column nft-card" :class="selectedIndex === idx ? 'selected-nft' : 'non-select'" @click="selectNFT(nft, idx)">
                                            <v-img :src="host+nft.cover_img" width="168px" min-height="168px" max-height="168px" class="rounded-10">
                                                <template v-slot:placeholder>
                                                    <v-row
                                                    class="fill-height ma-0"
                                                    align="center"
                                                    justify="center"
                                                    >
                                                    <v-progress-circular
                                                        indeterminate
                                                        color="grey lighten-5"
                                                    ></v-progress-circular>
                                                    </v-row>
                                                </template>
                                            </v-img>
                                            <!-- <v-card-title class="mt-n4" style="font-size:16px;height:30px;">{{nft.name}}</v-card-title> -->
                                            <div class="ml-3 mt-2 nft-title">{{nft.name}}</div>
                                            <div class="mt-1 ml-3 nft-desc">
                                                {{'Token ID:'}}
                                                <span style="font-size:16px;color:#050505;">{{nft.token_id || ''}}</span>
                                            </div>
                                        </v-card>
                                    

                                    </v-col>
                                </v-row>
                                
                            </v-container>

                        </v-row>

                        <v-row class="d-flex align-center justify-center my-5">
                            <v-btn class="btnColor ml-2" style="color: #fff;" width="184px" height="50px" :disabled="selectedIndex < 0" @click="confirm">{{$t('transferNFT.confirmImport')}}</v-btn>
                        </v-row>

                    </v-col>
                </v-container>

            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getNFTContract, getNFTTokenBalance } from '@/api/NFT'
import { getUserWallet } from '@/api/wallet'
import walletConnect from '@/api/walletConnect'

export default {
    name: 'DepositNFT',
    computed: {
        ...mapGetters(['isShowTransferInNFTDialog','user', 'connectedWalletAccount', 'host', 'isMetaMask']),

        isShowDialog: {
            get() {
                if (this.isShowTransferInNFTDialog && this.user) {
                    return true
                }
                return false
            },
            set(val) {
                this.$store.commit('ui/SET_IS_SHOW_TRANSFER_IN_NFT_DIALOG', val);
            },
        },
        walletAddress() {
            return this.connectedWalletAccount
        }
    },
    mounted() {
        this.getContract()
    },
    data() {
        return {
            selectedIndex: -1,
            selectedContractAddress: '',
            allContractAddresses: '',

            transferToAddress: '',

            contractCoins: {},
            walletNfts: []
        }
    },
    watch: {
        isShowTransferInNFTDialog(newVal) {
            this.isShowDialog = newVal
        },
        walletAddress(newVal) {
            if (newVal) {
                this.getWalletNFT()
            }
        }
    },
    methods: {
        confirm() {
            // 先检查钱包当前所在链
            
            if (this.isMetaMask) {
                this.transferInNFTByMetaMask()
            } else {
                this.transferInNFTByWalletConnect()
            }
        },
        confirmContractAddress() {
            this.getWalletNFT()
        },
        copyWalletAddress() {
            this.$toast.success(this.$t('tip.copySuccess'))
        },
        selectNFT(nft, idx) {
            this.selectedIndex = idx
        },
        // 获取合约地址
        getContract() {
            getNFTContract().then( res => {
                if (res.code == 0) {
                    const list = res.data.results
                    let contractSet = new Set()
                    let contractCoins = {}
                    for (let i = 0;i < list.length;++i) {
                        const c = list[i]
                        if (c.address) {
                            contractSet.add(c.address)
                            if (c.deposit_coin) {
                                contractCoins[c.address] = c.deposit_coin
                            }
                        }
                    }
                    this.contractCoins = contractCoins
                    this.allContractAddresses = Array.from(contractSet)
                    if (this.allContractAddresses.length > 0) {
                        this.selectedContractAddress = this.allContractAddresses[0]
                        this.getWalletNFT()
                    }
                }
            }).catch(err => {
                console.log('getNFTContract err:', err)
            })
        },
        getWalletNFT() {
            if (!this.selectedContractAddress || !this.walletAddress) return
            const params = {
                contract: this.selectedContractAddress,
                address: this.walletAddress
            }
            // test data
            // const params = {
            //     contract: '0x632de27b801f5e9bb97c8b92e900dd8a017730ef',
            //     address: '0xe0a9e5b59701a776575fdd6257c3f89ae362629a'
            // }
            getNFTTokenBalance(params).then( res => {
                if (res.code == 0) {
                    this.walletNfts = res.data
                    this.getContractWallet()
                }
            }).catch( err => {
                console.log('getNFTTokenBalance err', err)
            })
        },
        getContractWallet() {

            const coin = this.contractCoins[this.selectedContractAddress]
            const userId = this.user.id
            if (!coin) return
            const params = {
                coin: coin.coin,
                user: userId
            }
            getUserWallet(params).then (res => {
                if (res.code === 0) {
                    const data = res.data[0]
                    this.transferToAddress = data.address
                }
            }).catch(err => {
                console.log('getUserWallet err:', err)
            })
        },
        async transferInNFTByMetaMask() {

            const selectedNft = this.walletNfts[this.selectedIndex]

            const walletChainId = walletConnect.metaMask.getChainId()
            if (walletChainId != selectedNft.contract.chain_id) {
                this.$toast.error(this.$t('transferNFT.networkTips') + (selectedNft.contract ? (selectedNft.contract.chain_id || '0x38') : '0x38'))
                return
            }

            if (this.transferToAddress.length <= 0) {
                this.getContractWallet()
                this.toasterErr('')
                return
            }

            const params = [
                this.walletAddress, //from 当前持有nft的地址
                this.transferToAddress, //to 要转移nft的目标地址
                Number(selectedNft.token_id)// tokenId
            ]

            const data = walletConnect.metaMask.encodeSafeTransferData(params)


            await walletConnect.metaMask.sendTransaction({
                to: this.selectedContractAddress, //to 合约地址
                data}).then( res => {
                    this.isShowDialog = false
                    this.$toast.success(this.$t('transferNFT.successText') + res)
                    this.$store.commit('ui/SET_CONNECTED_WALLET_ACCOUNT', '')
                }).catch(err => {
                    const errStr = String(err)
                    this.$toast.error(errStr)
                })
        },

        async transferInNFTByWalletConnect() {

            const walletChainId = walletConnect.walletConnect.getChainId()
            const selectedNft = this.walletNfts[this.selectedIndex]

            if (walletChainId != selectedNft.contract.chain_id) {
                this.$toast.error(this.$t('transferNFT.networkTips') + (selectedNft.contract ? (selectedNft.contract.chain_id || '0x38') : '0x38'))
                return
            }

            if (this.transferToAddress.length <= 0) {
                this.getContractWallet()
                this.toasterErr('')
                return
            }

            const params = [
                this.walletAddress, //from 当前持有nft的地址
                this.transferToAddress, //to 要转移nft的目标地址
                Number(selectedNft.token_id)// tokenId
            ]

            const data = walletConnect.walletConnect.encodeSafeTransferData(params)


            await walletConnect.walletConnect.sendTransaction({
                to: this.selectedContractAddress, //to 合约地址
                data}).then( res => {
                    this.isShowDialog = false
                    this.$toast.success(this.$t('transferNFT.successText') + res)

                    this.$store.commit('ui/SET_CONNECTED_WALLET_ACCOUNT', '')
                }).catch(err => {
                    const errStr = String(err)
                    this.$toast.error(errStr)
                })
        },
    }
}
</script>

<style scoped land="scss">

/* override */
.theme--light.v-sheet--outlined {
    border: thin solid #cc9933;
}

.contract-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    
}

.confirm-btn {
    width: 116px;
    height: 50px;
    max-height: 50px;
    min-height: 50px;
}

.contract-address {
    border: 1px solid #CC9933;
    border-radius: 5px;
    height: 50px;
    font-size: 14px;
}



.selected-nft {
    outline: 1px solid #CC9933;
}

.non-select {
    outline: none;
}

.nft-card {
    height: 230px;
    
}

.nft-title {
    font-size:16px;
    font-weight:500;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.nft-desc {
    font-size:14px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color:#7D7D7D;
}

@media screen and (max-width: 599px) {
    .confirm-btn {
        width: 100%;
        height: 30px;
        max-height: 30px;
        min-height: 30px;
    }

    .contract-address {
        width: 100%;
    }
}

</style>