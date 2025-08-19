<template>
  <div>
    <v-dialog v-model="withdraw" max-width="650" @click:outside="closeTotal">
      <v-card class="withdraw mx-auto" max-width="650" min-height="530">
        <v-card-subtitle class="text-right pt-3 pr-3">
          <v-btn @click="closeWithdraw" icon>
            <v-icon class="grey--text lighten-2 text-right">mdi-close</v-icon>
          </v-btn>
        </v-card-subtitle>
        <v-card-title class="d-flex justify-center pb-6" style="font-size: 24px;font-weight: bold">
          <span>{{ $t("withdraw.title") }}</span>
        </v-card-title>
        <v-card-subtitle class="d-flex justify-center">
          <span class="spanerror mt-3" style="font-size: 16px">{{ $t("withdraw.errorText") }}</span>
        </v-card-subtitle>
         <!-- 不同鏈選擇 -->
        <v-col v-if="!isLoading" cols="12">
          <v-btn-toggle
            v-model="btnIndex"
            mandatory
            class="btnToggle"
          >
            <v-btn v-for="(item, index) in wallet" :key="index" class="btnType" @click="changeChain(index)">
              {{ item.service_type }}
            </v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col v-else cols="12" class="text-center">Loading...</v-col>
        <v-form ref="login" v-model="valid" class="mt-10">
          <v-container>
            <v-row justify="center">
              <v-col cols="9" class="py-0">
                <v-text-field
                    color="#F7B500"
                    v-model="address"
                    :label='$t("withdraw.address")'
                    required
                    :rules="[addressRules]"
                ></v-text-field>
              </v-col>
              <v-col cols="9">
                <v-text-field
                    type="number"
                    class="inputPrice"
                    color="#F7B500"
                    v-model="price"
                    :label="$t('withdraw.price')"
                    required
                    :suffix="coin && coin.name"
                    :rules="[priceRules]"
                ></v-text-field>
              </v-col>
              <v-col cols="9" class="d-flex justify-space-between align-center mt-n7">
                <div>
                  <span class="ETHColor" style="font-size: 16px">{{ $t("withdraw.canPrice") }}</span><span
                    class="balance">{{ showBalance }} {{ coin && coin.name }}</span>
                </div>
                <a text color="rgba(30, 136, 229, 1)" @click="AllPrice" class="">
                  {{ $t("withdraw.total") }}</a>
              </v-col>
              <v-col cols="9" class="mt-11">
                <v-btn
                    large
                    block
                    class="btnColor mb-9"
                    style="height: 50px"
                    :disabled="!valid"
                    @click="confirmPrice"
                >
                  <span class="bottomText">
                    {{ $t("withdraw.confirmPrice") }}
                  </span>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="withdrawDetail" max-width="650" @click:outside="closeTotal">
      <v-card class="withdraw text-center mx-auto" max-width="650" min-height="520">
        <v-card-subtitle class="text-right pt-3 pr-3 pb-0">
          <v-btn @click="closeWithdraw" icon>
            <v-icon class="grey--text lighten-2">mdi-close</v-icon>
          </v-btn>
        </v-card-subtitle>
        <v-card-subtitle class="text-left mt-n5">
          <v-btn @click="openWithdraw" icon>
            <v-icon class="grey--text lighten-2">mdi-arrow-left</v-icon>
          </v-btn>
        </v-card-subtitle>

        <v-card-text class="white--text" style="font-size: 24px;font-weight: bold;">
          {{ $t("confrimWithraw.title") }}
        </v-card-text>
        <v-card-text class="mt-3 createdNFT" style="font-size: 16px">
          {{ $t("confrimWithraw.text") }}
        </v-card-text>
        <v-col cols="9" class="d-flex pb-0">
          <v-col cols="4" class="text-right detailFont" style="font-size: 16px">
            <p class="mt-1">{{ $t("confrimWithraw.count") }}:</p>
            <p class="mt-5">{{ $t("confrimWithraw.fee") }}:</p>
            <p class="mt-5">{{ $t("confrimWithraw.username") }}:</p>
            <p>{{ $t("confrimWithraw.address") }}:</p>
          </v-col>
          <v-col cols="12" class="text-left" style="font-size: 20px">
            <p class="mt-1">{{ showPrice }}{{ coin && coin.name }}</p>
            <p class="mt-5">{{ Interest }}{{ coin && coin.name }}</p>
            <p class="mt-5">{{ user ? user.username : '' }}</p>
            <p>{{ address }}</p>
          </v-col>
        </v-col>
        <v-col cols="9" class="d-flex mx-auto">
          <v-btn
              x-large
              block
              class="btnColor"
              @click="passwordConfrimMethod"
          >
            {{ $t("confirmBtn") }}
          </v-btn>
        </v-col>
      </v-card>
    </v-dialog>
    <v-dialog v-model="passwordDialog" max-width="650" @click:outside="closeTotal">
      <v-card class="withdraw text-center mx-auto" max-width="650" min-height="520">
        <v-card-subtitle class="text-right pt-3 pr-3 pb-0">
          <v-btn @click="closeWithdraw" icon>
            <v-icon class="grey--text lighten-2">mdi-close</v-icon>
          </v-btn>
        </v-card-subtitle>
        <v-card-text class="white--text mt-8" style="font-size: 24px;font-weight: bold">
          {{ $t("confirmPassword.title") }}
        </v-card-text>
        <v-card-text class="mt-4" style="font-size: 16px">
          {{ $t("confirmPassword.text") }}
        </v-card-text>
        <v-form v-model="passwordVilid">
          <v-col cols="8" class="d-flex pb-0 ma-auto mt-12">
            <v-text-field
                color="#F7B500"
                v-model="password"
                :label='$t("confirmPassword.password")'
                :rules="[passwordRules]"
                required
                type="password"
                @input="changePassword"
            ></v-text-field>
          </v-col>
          <v-col cols="8" class="d-flex mx-auto mt-16">
            <v-btn
                x-large
                block
                class="btnColor"
                :disabled="!passwordVilid"
                @click="passwordConfrim"
            >
              {{ $t("confirmBtn") }}
            </v-btn>
          </v-col>
        </v-form>

      </v-card>
    </v-dialog>
    <v-dialog v-model="withdrawSuccess" max-width="650" @click:outside="closeTotal">
      <v-card class="withdraw  text-center mx-auto" max-width="650" min-height="503">
        <div class="text-right">
          <v-card-subtitle class="d-inline-block pt-5" @click="closeTotal">
            <v-img max-height="14" max-width="14" src="@/assets/fake/close.png"></v-img>
          </v-card-subtitle>
        </div>
        <div @click="goTransationTotal" class="text-right blue--text darken-3 mr-12 detail" style="font-size:24px ">
          {{ $t("drawer.detail") }}
        </div>
        <v-img
            class="mx-auto mt-6"
            max-width="143"
            max-height="143"
            src="@/assets/fake/submit_success.png"
        ></v-img>
        <v-card-text class="white--text mt-8" style="font-size: 24px;font-weight: bold">
          {{ $t("confirmPassword.success") }}
        </v-card-text>
        <v-card-actions class="mt-4">
          <v-col cols="10" class="d-flex mx-auto">
            <v-btn
                x-large
                block
                class="btnColor"
                @click="closeTotal"
            >
              {{ $t("confirmBtn") }}
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import web3 from "web3";
import router from "@/router";
import {mapActions, mapGetters} from "vuex";
import {postTransations} from "@/api/user";
import {formatDecimal} from "@/utils/math";
import { isWallet, getUserWallet } from "@/api/wallet";
import {numFormat} from "../../../utils/math";

export default {
  name: "withdraw",

  data: () => ({
    valid: false,
    address: '',
    price: '',
    password: '',
    coinList: '',
    chain: '', // 鏈
    btnIndex: 0,
    wallet: [],
    exists: false,
    withdrawDetail: false,
    passwordDialog: false,
    passwordVilid: false,
    passwordJudge: false,
    withdrawSuccess: false,
    isLoading: false,
  }),
  props: {
    withdraw: {
      type: Boolean,
      default: false
    },
    totalPrice: String
  },
  watch: {
    withdraw(newVal) {
      if (newVal) {
        const coinId = this.config.coin // TODO: 先寫死成從config取，之後做多幣種時要改
        this.getUserWallet({coin: coinId, user: this.user.id})
      }
    }
  },
  computed: {
    ...mapGetters([
      'name', 'user', 'config', "getCoinById", 
    ]),
    passwordRules(val) {
      if (val.password === '') {
        return false
      }
      if (this.passwordJudge) {
        return this.$t("confirmPassword.errorPassword")
      }
      return true;
    },
    // 幣種
    coin() {
      const coinId = this.config.coin // TODO: 先寫死成從config取，之後做多幣種時要改
      const coin = this.getCoinById(coinId) 

      if (coin && coin.code.split('_')[1] === 'USDT') coin.name = 'USDT' // 如果預設貨幣是USDT就統一稱USDT
      return coin
    },
    showBalance() {
      return numFormat(this.totalPrice)
    },
    showPrice() {
      return numFormat(this.price)
    },
    Interest() {
      if (this.exists) {
        return 0
      } else return this.coin ? numFormat(formatDecimal(this.coin.withdraw_fee, 4)) : null
    },
  },
  // mounted() {
  //   const coinId = this.config.coin // TODO: 先寫死成從config取，之後做多幣種時要改
  //   this.getUserWallet({coin: coinId, user: this.user.id})
  // },
  methods: {
    ...mapActions('alert', ['showAlert']),
    closeTotal() {
      this.$emit('showWithdraw', false)
      this.withdrawDetail = false
      this.passwordDialog = false
      this.withdrawSuccess = false
    },
    goTransationTotal() {
      this.$emit('showWithdraw', false)
      this.withdrawDetail = false
      this.passwordDialog = false
      this.withdrawSuccess = false
      router.push('/trade')
    },
    AllPrice() {
      this.price = this.totalPrice
    },
    changePassword() {
      this.passwordJudge = false
    },
    //輸入框只能輸入數字
    handleInput() {
      this.price = this.price.replace(/[^\d.]/g, '')
    },
    addressRules(val) {
      if (!web3.utils.isAddress(this.address) || val === '') {
        return this.$t("withdraw.errorAddress")
      }
      return true;
    },
    priceRules(val) {
      if (Number(val) > this.totalPrice || val === '') {
        return this.$t("withdraw.errorPrice")
      }
      return true;
    },
    openWithdraw() {
      this.withdrawDetail = false
      this.$emit('showWithdraw', true)
    },
    confirmPrice() {
      isWallet({address: this.address})
          .then(response => {
            this.exists = response.data.exists
          })
          .catch(() => {
          });
      this.$emit('showWithdraw', false)
      this.withdrawDetail = true
    },
    closeWithdraw() {
      // this.toasterErr(this.$t("withdraw.errorRecharge"))
      this.$emit('showWithdraw', false)
      this.withdrawDetail = false
      this.passwordDialog = false
    },
    passwordConfrimMethod() {
      this.withdrawDetail = false
      this.passwordDialog = true
    },
    passwordConfrim() {
      postTransations({
        abs_amount: this.price,
        //根据币种不同在传入后端时，将price*不同的位数
        // amount: this.price * this.schedule,
        coin: this.coin.id,
        address: this.address,
        password: this.password,
        service_type: this.chain,
      }).then((response) => {
        if (response.code != 0) {
          this.passwordJudge = true
          this.toasterErr(response.code);
        } else {
          this.withdrawSuccess = true
        }
      }).catch(() => {
      })
    },
    goTransation() {
      if (this.$route.path !== '/transation') {
        router.push('/transation')
      }
    },
    changeChain(index) {
      this.chain = this.wallet[index].service_type
    },
    getUserWallet(info) {
      this.isLoading = true
      getUserWallet(info)
          .then((response) => {
            this.wallet = response.data
            this.chain = response.data[0].service_type
            this.isLoading = false
          })
          .catch(() => {
            this.isLoading = false
          })
    }
  }
}
</script>
<style>
.inputPrice input[type='number'] {
  -moz-appearance: textfield;
}

.inputPrice input::-webkit-outer-spin-button,
.inputPrice input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>

<style lang="scss" scoped>
.spanerror {
  color: rgba(183, 28, 28, 1);
}

input:-webkit-autofill {
  -webkit-text-fill-color: red !important;
}

::v-deep .v-input input {
  max-height: 50px;
}

.detailFont {
  color: rgba(204, 204, 204, 1)
}

.detail {
  cursor: pointer;
}

.balance {
  color: rgba(189, 189, 189, 1);
}

.btnToggle {
  background: transparent !important;
  display: flex;
  justify-content: center;

  .btnType {
    width: 118px;
    height: 46px;
    border: 0px !important;
    border-radius: 8px !important;
    margin-right: 10px;
  }
}

</style>