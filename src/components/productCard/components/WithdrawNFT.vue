<template>
  <div style="height: 100%" class="d-flex align-center">
    <v-card width="480px" class="mx-auto">
      <div class="text-right">
        <v-card-subtitle
            class="d-inline-block"
            @click="closeTransferOut"
        >
          <v-icon class="btnColor--text" style="cursor: pointer;">close</v-icon>
        </v-card-subtitle>
      </div>
      <v-container class="mt-n6">
        <v-row class="d-flex justify-center">
          <v-col cols="11">
            <v-card-text class="navI18n--text text-center" style="font-size: 24px;font-weight: bold">
              {{ $t("nft.withdrawNFT.title") }}
            </v-card-text>
            <v-col class="d-flex justify-start px-3 py-0 mt-5">
              <v-img
                  v-if="!is3dModel"
                  class="borderRadius"
                  max-height="63"
                  max-width="63"
                  :src="item.image"
              ></v-img>
              <model-viewer v-else :src="item.image" camera-controls environment-image="neutral" shadow-intensity="1" autoplay id="nft-model" class="nft-model" />
              <div class="ml-3 mt-2">
                <div class="description navI18n--text text-truncate" style="width: 320px">{{
                    item ? item.name : ""
                  }}
                </div>
                <div class="fontColor10--text mt-1" style="font-size: 14px">
                  {{ $t("owner") }}{{ `${item ? item.user.username : ""}` }}
                </div>
              </div>
            </v-col>
            <v-col class="d-flex justify-space-between pt-0 mt-8">
              <div class="fontColor6--text">{{ $t("nft.withdrawNFT.transferUser") }} {{
                  item.user.username
                }}
              </div>
            </v-col>
            <v-col v-if="!isExternalWithdraw" class="mt-8">
              <v-col class="d-flex pa-0">
                <v-form v-model="TransferOutAddress" style="width: 100%">
                  <v-text-field
                      color="btnColor"
                      v-model="address"
                      :label="$t('nft.withdrawNFT.text')"
                      required
                      :rules="[addressRule]"
                  ></v-text-field>
                </v-form>
              </v-col>
            </v-col>
            <v-col v-if="!isExternalWithdraw" class="d-flex justify-space-between pa-0 mt-6">
              <v-col style="color:#999999;">
                <div>{{ $t("productDetail.sellDialog.balance") }}</div>
                <div class="mt-2">{{ $t("productDetail.sellDialog.formalities") }}</div>
              </v-col>
              <v-col class="text-right">
                <div v-if="!lowerPrice" class="navI18n--text" style="font-size: 13px">
                  {{ totalPrice + ' ' + baseCoin.code }}
                </div>
                <div v-else class="errorColor" style="font-size: 13px">{{ totalPrice + ' ' + baseCoin.code }}</div>
                <div class="mt-2" style="color:#CC9933;font-size:13px;font-weight:500;">{{ fee + ' ' + baseCoin.code }}</div>
              </v-col>
            </v-col>
            <v-col v-if="isExternalWithdraw">
              <div class="withdraw-nft-title">{{$t('transferNFT.network')}}</div>
              <div class="d-flex flex-row align-center my-3" style="background-color: #F6F5F3;height:50px;">
                <div class="ml-3" style="font-size:14px;color:#000;">BSC</div>
                <div class="ml-3" style="font-size:14px;color:#7D7D7D;">Binance Smart Chain</div>
              </div>

              <div class="mt-6 withdraw-nft-title d-flex flex-row">
                <div>{{$t('transferNFT.targetWalletAddress')}}</div>
                  <v-spacer></v-spacer>
                  <button style="color:#CC9933;font-size:16px;" @click="addAddress">{{$t('transferNFT.add')}}</button>
                </div>
              <div class="d-flex flex-row align-center mt-3" style="height:50px;">
                <div style="font-size:14px;color:#fff;">BSC</div>
                  <v-text-field
                      :placeholder="$t('transferNFT.targetWalletAddressPlaceholder')"
                      color="#ffffff"
                      v-model="externalTargetAddress"
                      flat
                      solo
                      style="height:50px;"
                  ></v-text-field>
              </div>
              <v-divider></v-divider>
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
            </v-col>
            <div style="margin-bottom: 14px">
              <v-col class="mt-7">
                <div class="hintText mb-2" style="font-size: 12px"><span class="hintText">{{
                    $t("productDetail.sellDialog.text")
                  }}</span>
                  <a @click="goService" text class="pa-0 fontColor11--text" height="17px">
                    {{ $t("productDetail.sellDialog.textService") }}
                  </a>
                </div>
                <v-btn
                    depressed
                    block
                    style="font-size: 16px"
                    class="btnColor btnWhite--text"
                    :height="btnHeight"
                    :disabled="isBtn"
                    @click="showPasswordPage"
                >
                  {{ $t("confirmBtn") }}
                </v-btn>

                <v-btn
                    v-if="!isExternalWithdraw"
                    plain
                    block
                    class="withdraw-nft mt-3"
                    :height="btnHeight"
                    @click="withdrawNFT"
                >
                  {{$t('transferNFT.externalTransferOut')}}
                </v-btn>
              </v-col>
              <v-col
                  style="font-size: 14px"
                  v-if="lowerPrice"
                  class="d-flex justify-space-between py-0"
              >
                <span class="errorColor">{{ $t("productDetail.sellDialog.lowBalance") }}</span>
                <a class="mt-n1" text color="#1E88E5" @click="goRecharge">{{
                    $t("productDetail.sellDialog.recharge")
                  }}
                </a>
              </v-col>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import { formatDecimal, cutZero, numFormat } from '@/utils/math'
import { withdrawNFT } from '@/api/NFT'
import i18n from '@/lang'
import web3 from 'web3'

// 3D Model viewer
import { ModelViewer } from '@google/model-viewer'

export default {
  name: 'WithdrawNFT',
  components: {
    ModelViewer
  },
  props: [
    'item'
  ],
  data: () => ({
    address: '',
    TransferOutAddress: false,
    emailRules: [
      (v) => /.+@.+\..+/.test(v) || i18n.t('register.errorEmail'),
    ],
    externalTargetAddress: '',
    isExternalWithdraw: false,
  }),
  computed: {
    ...mapGetters(['user', 'host', 'config', 'getBalanceById', 'getCoinById']),

    btnHeight(){
        if (this.$vuetify.breakpoint.name === 'xs') {
          return '30px'
        }
        return '50px'
    },

    //余额
    totalPrice() {
      if (this.config) {
        let balance = this.getBalanceById(this.config.base_coin)
        return balance && cutZero(numFormat(formatDecimal(balance.amount, 4))) || '0'
      } else
        return null
    },
    //默认币种
    baseCoin() {
      return this.getCoinById(this.config.base_coin)
    },
    isBtn() {
      if (this.isExternalWithdraw) {
        if (this.externalTargetAddress.length > 0) {
          return false
        }
        return true
      } else {
        if (this.address === '') {
          return true
        }
        if (this.lowerPrice) {
          return true
        }
        return false
      }
    },
    fee() {
      if (this.isExternalWithdraw) {
        return cutZero(numFormat(formatDecimal(this.config.gasFee, 4)))
      }
      if (web3.utils.isAddress(this.address))
        return cutZero(numFormat(formatDecimal(this.config.gasFee, 4)))
      else return 0
    },
    lowerPrice() {
      if (this.totalPrice) {
        let totalPrice = Number(this.getBalanceById(this.config.base_coin).amount)
        let fee = Number(this.fee)
        if (fee > totalPrice) {
          return true
        }
      }
      return false
    },
    // 判斷是否為3D Model
    is3dModel() {
      const file = this.item.image.split('.')
      const fileExtension = file[file.length -1]
      if (fileExtension === 'gltf-binary') {
        return true
      } else {
        return false
      }
    },
  },
  methods: {
    addAddress() {
      this.$store.commit('ui/SET_IS_NFT_TRANSFER_IN', false);
      this.$store.commit('ui/SET_IS_SHOW_LINK_TO_WALLET_DIALOG', true);
    },
    goService() {
      this.$store.commit('ui/SET_IS_SERVICE_PAGE_DIALOG', true);
    },
    addressRule(val) {
      if (!val) {
        return this.$t('nft.withdrawNFT.errorAddress')
      }
      if (!web3.utils.isAddress(this.address) || val === '') {
        if (/.+@.+\..+/.test(val))
          return true
        return this.$t('nft.withdrawNFT.errorAddress')
      }
      return true;
    },
    closeTransferOut() {
      this.$emit('closeDialog')
    },
    goRecharge() {
      this.$store.commit('ui/SET_IS_SHOW_DRAWER_DIALOG', true);
    },
    showPasswordPage() {
      if (this.isExternalWithdraw) {
        this.item.externalTargetAddress = this.externalTargetAddress
        this.$emit('showWithdrawNFTConfirm', this.item)
      } else {
        this.$emit('showPasswordPage',
          this.$t('nft.withdrawNFT.titleSuccess'),
          '',
          '',
          withdrawNFT,
          {id: this.item.id, to: this.address}
        )
      }
    },
    withdrawNFT() {
      this.isExternalWithdraw = true
    }
  },
  watch: {
      '$store.state.ui.connectedWalletAccount':{
      handler:function(newVal){
        if (newVal.length > 0) {
          this.externalTargetAddress = newVal
        }
      },
      deep: true,
      immediate: true
    }
  }

}
</script>

<style lang="scss" scoped>

.withdraw-nft {
  border: 1px solid #cc9933;
  color: #cc9933;
  font-size: 16px;
  height: 50px;
}

.withdraw-nft-title {
  font-size: 16px;
  color: #ffffff;
  font-weight: 500;
}

// 3D Model Viewer
.nft-model {
  width: 67px;
  height: 67px;
}


>>> .theme--dark.v-text-field > .v-input__control > .v-input__slot:before {
  border-color: rgba(102, 102, 102, 1) !important;
}

>>> .theme--dark.v-text-field.v-input--is-disabled .v-input__slot::before {
  border-image: 0 !important;
}

>>> .v-input input {
  max-height: 30px;
}

>>> .theme--dark.v-label {
  color: #9999;
}
</style>