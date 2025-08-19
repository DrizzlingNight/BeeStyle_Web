<template>
  <div style="height: 100%" class="d-flex align-center">
    <v-card class="d-flex justify-center flex-column align-center" style="width:480px;">
      <div class="d-flex justify-end pr-3 pt-3" style="width:100%;">
          <button>
              <v-icon color="white" style="cursor: pointer;" @click="close">close</v-icon>
          </button>
      </div>
      <v-img src="@/assets/transferNFT/transfer_out_confirm.png"></v-img>
      <v-card-title class="mb-2">{{$t('transferNFT.confirmWithdraw')}}</v-card-title>
      <div>{{$t('transferNFT.sureWithdraw')}}</div>
      <div>{{$t('transferNFT.need24h')}}</div>
          
      <v-container class="px-3 px-md-10">
        <v-col>
          <v-row no-gutters class="d-flex flex-column">
            <div class="confirm-title">{{$t('transferNFT.nftName') + '：'}}</div>
            <div class="confirm-info">{{ item.name || ''}}</div>
          </v-row>

          <v-row no-gutters class="d-flex flex-column mt-4">
            <div class="confirm-title">{{$t('transferNFT.contractAddress') + '：'}}</div>
            <div class="d-flex flex-row mt-1 align-center">
              <div class="confirm-info">{{ contractAddress }}</div>
              <button class="ml-2" v-if="contractAddress.length > 0" v-clipboard:copy="contractAddress" v-clipboard:success="copySuccess">
                <v-img class="mr-5" max-width="20" max-height="20" src="@/assets/transferNFT/copy.png"></v-img>
              </button>
            </div>
          </v-row>

          <v-row no-gutters class="d-flex flex-column mt-4">
            <div class="confirm-title">{{$t('transferNFT.tokenId')+'：'}}</div>
            <div class="d-flex flex-row mt-1 align-center">
              <div class="confirm-info">{{ item.token_id || ''}}</div>
              <button class="ml-2" v-if="(item.token_id || '').length > 0" v-clipboard:copy="item.token_id || ''" v-clipboard:success="copySuccess">
                <v-img class="mr-5" max-width="20" max-height="20" src="@/assets/transferNFT/copy.png"></v-img>
              </button>
            </div>
          </v-row>

          <div class="d-flex flex-row align-center mt-2 rounded-5" style="background-color:#F6F5F3;width:100%;min-height:40px;">
            <div class="ml-3" style="font-size:14px;color:#000;">BSC</div>
            <div class="ml-3" style="font-size:14px;color:#7D7D7D;">Binance Smart Chain</div>
          </div>

          <v-row no-gutters class="d-flex flex-column mt-4">
              <div class="confirm-title">{{$t('transferNFT.targetWalletAddress') + '：'}}</div>
              <div class="d-flex flex-row mt-1 align-center">
                <div class="confirm-info">{{ item.externalTargetAddress || ''}}</div>
                <button class="ml-2" v-if="(item.externalTargetAddress || '').length > 0" v-clipboard:copy="item.externalTargetAddress || ''" v-clipboard:success="copySuccess">
                  <v-img class="mr-5" max-width="20" max-height="20" src="@/assets/transferNFT/copy.png"></v-img>
                </button>
              </div>
          </v-row>

          <v-row no-gutters class="d-flex flex-column mt-4">
              <div class="d-flex flex-row mt-5">
                <div style="color:#999999;font-size:16px;">{{$t('createNFT.balance')}}</div>
                <v-spacer></v-spacer>
                <div style="color:#ffffff;font-size:16px;font-weight:500;">{{ totalPrice + ' ' + baseCoin.code }}</div>
              </div>
              <div class="d-flex flex-row mt-2">
                <div style="color:#999999;font-size:16px;">{{$t('createNFT.fee')}}</div>
                <v-spacer></v-spacer>
                <div style="color:#CC9933;font-size:16px;font-weight:500;">{{ fee + ' ' + baseCoin.code }}</div>
              </div>
          </v-row>

          <v-row class="d-flex align-center flex-row justify-center mt-8 mb-3">
            <v-btn plain class="amber--text lighten-1 ml-2" style="border: 1px solid #ffc107;" width="45%" height="50px" @click="close">{{$t('transferNFT.cancel')}}</v-btn>
            <v-btn class="btnColor ml-2 ml-sm-4" style="color: #fff;" width="45%" height="50px " @click="confirm">{{$t('transferNFT.confirm')}}</v-btn>
          </v-row>
        </v-col>
      </v-container>
    </v-card>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { formatDecimal, cutZero, numFormat } from '@/utils/math'
import { withdrawNFT } from '@/api/NFT'

export default {
  name: 'WithdrawNFTConfirm',
  props: [
    'item',
  ],
  computed: {
    ...mapGetters(['config', 'getBalanceById', 'getCoinById']),
    contractAddress() {
      return this.item.contract ? (this.item.contract.address || '') : ''
    },
    btnHeight() {
      if (this.$vuetify.breakpoint.name === 'xs') {
        return '30px'
      } else {
        return '50px'
      }
    },
    //餘額
    totalPrice() {
      if (this.config) {
        let balance = this.getBalanceById(this.config.base_coin)
        return balance && cutZero(numFormat(formatDecimal(balance.amount, 4))) || '0'
      } else {
        return null
      }  
    },
    //默認幣種
    baseCoin() {
      return this.getCoinById(this.config.base_coin)
    },
    fee() {
      return cutZero(numFormat(formatDecimal(this.config.gasFee, 4)))
    },
  },
  methods: {
    async confirm() {
      this.$emit('showPasswordPage',
        this.$t('nft.withdrawNFT.titleSuccess'),
        '',
        '',
        withdrawNFT,
        {id: this.item.id, to: this.item.externalTargetAddress}
      )
      this.$store.commit('ui/SET_CONNECTED_WALLET_ACCOUNT', '')
    },
    copySuccess() {
      this.$toast.success(this.$t('invitation.copySuccess'))
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>

.confirm-btn {
  width: 116px;
  height: 50px;
  max-height: 50px;
  min-height: 50px;
}

.confirm-title {
  font-size:14px;
  color:#fff;
  margin-top: 10px;
}

.confirm-info {
  color: #7D7D7D;
  font-size: 14px;
  margin-top: 5px;
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
}

</style>