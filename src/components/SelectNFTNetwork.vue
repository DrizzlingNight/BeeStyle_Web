<template>
    <div>
        <v-dialog v-model="isShowDialog" width="400" @click:outside="isShowDialog = false">
            <v-card class="d-flex justify-center flex-column align-center">
                <div class="d-flex justify-end pr-3 pt-3" style="width:100%;">
                    <button @click="isShowDialog = false">
                        <v-icon color="white">close</v-icon>
                    </button>
                </div>
                <v-card-title class="mb-2">{{$t('transferNFT.selectNFTNetwork')}}</v-card-title>
                <v-card-subtitle>{{$t('transferNFT.onlySupportBSCETH')}}</v-card-subtitle>

                <v-card class="mt-10 mb-10 d-flex flex-column align-center" height="242" width="180" outlined>
                    <v-img class="mt-12" max-width="62" max-height="62" src="@/assets/transferNFT/binance.png"></v-img>
                    <v-card-title class="mt-4" style="color: #fff;">BSC</v-card-title>
                    <v-card-subtitle>{{$t('transferNFT.binance')}}</v-card-subtitle>

                </v-card>

                <v-btn width="152" height="50" class="btnColor mb-10" style="color: #fff;" @click="confirm">{{$t('transferNFT.confirm')}}</v-btn>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'SelectNFTNetwork',
    computed: {
        ...mapGetters(['isShowSelectNFTNetworkDialog','user']),

        isShowDialog: {
            get() {
                if (this.isShowSelectNFTNetworkDialog && this.user) {
                    return true
                }
                return false
            },
            set(val) {
                this.$store.commit('ui/SET_IS_SHOW_SELECT_NFT_NETWORK_DIALOG', val);
            },
        },
    },
    data() {
        return {

        }
    },
    watch: {
        isShowSelectNFTNetworkDialog(newVal) {
            this.isShowDialog = newVal
        }
    },
    methods: {
        confirm() {
            this.isShowDialog = false
            this.$store.commit('ui/SET_IS_NFT_TRANSFER_IN', true)
            this.$store.commit('ui/SET_IS_SHOW_LINK_TO_WALLET_DIALOG', true)
        }
    }
}
</script>

<style scoped land="scss">

/* override */
.theme--light.v-sheet--outlined {
    border: thin solid #cc9933;
}

</style>