<template>
  <div>
    <!-- 側欄 -->
    <v-navigation-drawer
        right
        fixed
        temporary
        v-model="drawer"
        overlay-color="#333333"
        overlay-opacity=".7"
        width="470px"
        class="personal-account"
    >
      <v-app-bar flat v-if="user">
        <div class="d-flex align-center">
          <span style="font-size: 14px">{{ user ? user.username : '' }}</span>
          <v-btn
              class="px-0"
              text
              x-small
              v-clipboard:copy="user ? user.username : ''"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
          >
            <v-img
                class="d-inline-block"
                max-height="13"
                max-width="14"
                src="@/assets/fake/copy.png"
            ></v-img>
          </v-btn>
        </div>
        <v-spacer></v-spacer>
        <div class="text-right">
          <!-- 重整按鈕 -->
          <v-btn @click="getRecentBalanceAndRate()" color="primary" text>
            <v-icon>mdi-cached</v-icon>
          </v-btn>
          <!-- 查看帳號紀錄按鈕 -->
          <!-- <v-btn
              text color="rgba(0, 145, 255, 1)" style="font-size: 20px" @click="goTransation"
          >{{ $t('navbar.walletSideDrawer.record') }}
          </v-btn> -->
        </div>
      </v-app-bar>
      <!-- 沒有登入 只顯示"我的帳號" -->
      <v-app-bar flat height="70" v-else>
        <span class="createdNFT" style="font-size: 16px">{{ $t('navbar.walletSideDrawer.myAccount') }}</span>
      </v-app-bar>
      <!-- 餘額顯示 -->
      <v-row v-if="user" class="d-flex justify-center mt-16">
        <!-- 帳戶餘額 -->
        <v-col cols="12" class="text-center pb-0 balance" style="font-size: 20px">
          {{ $t('navbar.walletSideDrawer.accountBalance') }}
        </v-col>
        <!-- 餘額數值 -->
        <v-col cols="12" class="text-center pt-0 mb-5" style="font-size: 30px">
          {{totalBalanceToUsd}} USD
        </v-col>
        <!-- 各幣種餘額顯示 -->
        <v-col v-for="balanceCoin in balance" :key="balanceCoin.id" cols="10" class="coin-wrapper d-flex align-center pa-3 pa-sm-5 mb-5">
          <div class="coin-info-wrapper d-flex align-center ">
            <v-img width="20" height="20" :src="`/static/ui/utils/coin/coin_${balanceCoin.coin}.png`" class="mr-1 mr-sm-3"></v-img>
            <span class="info-text">{{ balanceCoin.coin_code }}</span>
          </div>
          <v-spacer></v-spacer>
          <div class="coin-balance-wrapper d-flex flex-column align-end mr-2">
            <!-- 幣種餘額數值 -->
            <span class="balance-amount-text">{{ Number(balanceCoin.amount) || 0 }}</span>
            <!-- 換算美金 -->
            <span class="balance-amount-usd">$ {{ getCoinBalanceValue(balanceCoin.coin).toFixed(4) }} USD</span>
          </div>
          <!-- 操作dropdown -->
          <v-menu offset-y left :position-y="30">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                text
                v-bind="attrs"
                v-on="on"
                class="pa-0"
                min-width="40"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                @click="actionOnclick(balanceCoin.coin, action.name)"
                v-for="(action, index) in actions"
                :key="index"
                class="action-item"
                style="width: 120px;"
              >
                <v-list-item-title>
                  <v-icon class="mr-3">{{ action.icon }}</v-icon>
                  {{ $t(`navbar.walletSideDrawer.${action.name}`) }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <!-- 充值按鈕 -->
        <!-- <v-col cols="10" class="mt-6">
          <v-btn
              block
              elevation="0"
              color="primary"
              style="height: 50px"
              @click="goRecharge"
          >
            {{ $t('navbar.walletSideDrawer.recharge') }}
          </v-btn>
        </v-col> -->
        <!-- 提現按鈕 -->
        <!-- <v-col cols="10">
          <v-btn
              block
              elevation="0"
              class="lighten-1"
              style="height: 50px"
              color="#424242"
              @click="goWithdraw"
          >
            {{ $t('navbar.walletSideDrawer.deposit') }}
          </v-btn>
        </v-col> -->
      </v-row>
      <!-- 沒有登入的提示 -->
      <v-row v-else >
        <v-col class="text-center errorlogin mt-16" style="font-size: 14px">
          <p class="mt-10">{{ $t('navbar.walletSideDrawer.notSignInHint') }}</p>
        </v-col>
      </v-row>
      <!-- 導入NFT -->
      <!-- TODO: 2022.04.08 為了上正式，先把導入功能隱藏 -->
      <!-- <div class="d-flex justify-center">
        <button class="select-nft" @click="selectNFTNetwork">
          {{ $t("navbar.walletSideDrawer.depositNFT") }}
        </button>
      </div> -->
    </v-navigation-drawer>
    <withdraw :withdraw="withdraw" v-on:showWithdraw="showWithdraw" :totalPrice="totalPrice"></withdraw>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import Withdraw from "./withdraw/withdraw";
import router from "@/router";
import {formatDecimal,numFormat} from "@/utils/math";
import i18n from '@/lang'

export default {
  name: "PersonalAccount",
  components: {Withdraw},
  data: () => ({
    username: '',
    withdraw:false,
    withdrawPage:false,
    // 幣種衝提操作按鈕
    actions: [
      { name: 'recharge', icon: 'mdi-plus-circle-outline' },
      { name: 'deposit', icon: 'mdi-cached' },
    ]

  }),
  created() {
    this.username = this.user ? this.user.username : ''
  },
  watch: {
    drawer(newVal) {
      if (newVal) {
        this.getRecentBalanceAndRate()
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'user',
      'balance',
      'isShowDrawerDialog',
      'config',
      'coinList',
      'getBalanceById',
      'getCoinById',
      'getRate'
    ]),
    // 幣種
    coin() {
      const coinId = this.config.coin// TODO: 先寫死成從config取，之後做多幣種時要改
      const coin = this.getCoinById(coinId) 
      // console.log('coin', coin)
      
      if ( coin && coin.code.split('_')[1] === 'USDT') coin.name = 'USDT' // 如果預設貨幣是USDT就統一稱USDT
      return coin
    },

    // 全部幣種家總餘額換算成美金
    totalBalanceToUsd() {
      const balance = this.balance
      let total = 0
      balance.forEach( balanceCoin => {
        total += Number(this.getCoinBalanceValue(balanceCoin.coin)) || 0
      })

      return total.toFixed(4)
    },

    //config幣種余额
    totalPrice() {
      if (this.config) {
        let balance = this.getBalanceById(this.config.coin)
        return balance && formatDecimal(balance.amount,4) || "0"
      } else
        return null
    },
    showBalance() {
      return numFormat(this.totalPrice)
    },
    drawer: {
      get() {
        this.getBalance()
        return this.isShowDrawerDialog;
      },
      set(val) {
        this.$store.commit("ui/SET_IS_SHOW_DRAWER_DIALOG", val);
      },
    },
  },
  methods: {
    ...mapActions('alert',['showAlert']),
    onCopy() {
      this.showAlert(i18n.t("copySuccess"))
    },
    onError() {
    },

    // 拉取最新匯率與錢包餘額
    getRecentBalanceAndRate() {
      this.$store.dispatch('user/balance')
      this.$store.dispatch('coin/getCoinExchangeList')
    },

    // 吐回單一幣種的當前餘額美金價值
    getCoinBalanceValue(coinId) {
      const coinRate = this.getRate(coinId, 2) ? Number(this.getRate(coinId, 2).rate) : null // 2為USDT ， 這會返還該id幣種等於多少USDT
      const coinAmount = Number(this.balance.find(coin => coin.coin == coinId).amount) // 當前使用者擁有多少該幣種餘額
      return Number(coinRate * coinAmount)
    },

    // 充提下拉選單按鈕被點按
    actionOnclick(coinId, actionName) {
      // 把要操作的幣種先設置到 config
      this.$store.commit("user/SET_CONFIG_COIN", coinId)
      
      if (actionName === 'recharge') {
        this.goRecharge()
      } else {
        this.goWithdraw()
      }
    },
    
    goWithdraw() {
      this.withdraw = true
      this.withdrawPage = true
      this.$store.commit('ui/SET_IS_SHOW_DRAWER_DIALOG', false)
    },
    goRecharge() {
      this.$store.commit("ui/SET_IS_SHOW_RECHARGE_DIALOG", true)
      this.$store.commit('ui/SET_IS_SHOW_DRAWER_DIALOG', false)
    },
    selectNFTNetwork() {
      this.$store.commit("ui/SET_IS_SHOW_SELECT_NFT_NETWORK_DIALOG", true);
      this.$store.commit('ui/SET_IS_SHOW_DRAWER_DIALOG', false)
    },
    showWithdraw(showWithdraw) {
      this.withdraw = showWithdraw
    },
    goTransation() {
      console.log('GOGO')
      // TODO 2021.11.26 因不再使用 /trade 這個頁面，因此改導到個人頁
      router.push(`/user/${this.user.id}/`)

      // if(this.$route.path !== '/trade') {
      //   router.push('/trade')
      // }
    },
    getBalance() {
      this.$store
          .dispatch("user/balance")
          .then(() => {
          })
          .catch(() => {
          });
    },
  }
}
</script>

<style lang="scss" scoped>
.balance {
  color: rgba(158, 158, 158, 1);
}
.errorlogin {
  color: rgba(235, 235, 235, 1);
}

.personal-account {
  margin-top: 72px;
}

.select-nft {
  font-size: 16px;
  /* color: $mainColor; */
  color: #CC9933;
}

@media screen and (max-width: 960px) {
  .personal-account {
    margin-top: 56px;
  }
}

.coin-wrapper {
  border: 1px solid rgba($color: #fff, $alpha: .2);
  border-radius: 8px;

  .coin-info-wrapper {
    .info-text {
      font-size: var(--text-lg);
    }
  }

  .coin-balance-wrapper {
    .balance-amount-text {
      font-size: var(--text-lg);
    }
    .balance-amount-usd {
      font-size: var(--text-sm);
      opacity: .6;
    }
  }
}

@media screen and (max-width: 600px) {
  .coin-wrapper {
    .coin-info-wrapper {
      .info-text {
        font-size: 14px;
      }
    }

    .coin-balance-wrapper {
      .balance-amount-text {
        font-size: var(--text-md);
      }
      .balance-amount-usd {
        font-size: 14px;
        opacity: .6;
      }
    }
  }
}

</style>