<template>
  <div>
    <v-dialog v-model="isRecharge" max-width="650" height="659" @click:outside="closeRecharge">
      <v-card class="text-center withdraw" style="width: 650px;height: 659px">
        <div class="text-right">
          <v-card-subtitle class="d-inline-block pt-5" style="cursor: pointer;" @click="closeRecharge">
            <v-img max-height="14" max-width="14" src="@/assets/fake/close.png"></v-img>
          </v-card-subtitle>
        </div>
        <v-card-text class="fontRecharge mt-8" style="font-size: 24px;font-weight: bold">
          {{ $t("recharge.title", [coin && coin.name]) }}
        </v-card-text>
        <v-card-text class="text" style="font-size: 16px">
          {{ $t("recharge.text", [coin && coin.name]) }}
        </v-card-text>
        <!-- 不同鏈選擇 -->
        <v-col cols="12">
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
        <vue-qrcode :value="QRcodeUrl" v-if="QRcodeUrl" class="my-7"/>
        <v-col v-else cols="12" style="height: 213px" class="d-flex align-center">
          <v-img contain width="231px" height="71px" src="@/assets/defaultPage.png"></v-img>
        </v-col>
        <v-col cols="9" class="ma-auto pb-0">
          <v-text-field
              v-model="QRcodeUrl"
              background-color="rgba(151, 151, 151, 0.14)"
              solo
              readonly
          >
          </v-text-field>
          <div class="float-right mt-n16">
            <v-btn class="mt-n2"
                   text
                   v-clipboard:copy="QRcodeUrl"
                   v-clipboard:success="onCopy"
                   v-clipboard:error="onError">
              <v-img
                  max-width="16"
                  max-height="15"
                  src="@/assets/fake/copy.png"
              ></v-img>
            </v-btn>
          </div>
        </v-col>
        <v-col cols="9" class="mx-auto mt-n5 pb-9">
          <v-btn
              large
              block
              class="btnColor"
              style="height: 50px;"
              @click="closeRecharge"
          >
            {{ $t("recharge.btn") }}
          </v-btn>
        </v-col>

      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import VueQrcode from 'vue-qrcode'
import {getUserWallet} from '@/api/wallet'
import i18n from '@/lang'

export default {
  name: "Recharge",
  components: {
    VueQrcode,
  },
  data: () => ({
    // QRcodeUrl: '',
    QRCodeMsg: "",
    QRcodeUrl: "",
    btnIndex: 0,
    wallet: [],
    serviceType: []
  }),
  computed: {
    ...mapGetters(["isShowRechargeDialog", "isShowCopyDialog", 'user', 'config', "getCoinById"]),
    // 幣種
    coin() {
      const coinId = this.config.coin // TODO: 先寫死成從config取，之後做多幣種時要改
      const coin = this.getCoinById(coinId) 

      if (coin && coin.code.split('_')[1] === 'USDT') coin.name = 'USDT' // 如果預設貨幣是USDT就統一稱USDT
      return coin
    },
    isRecharge: {
      get() {
        const coinId = this.config.coin // TODO: 先寫死成從config取，之後做多幣種時要改
        if (this.isShowRechargeDialog) {
          this.getUserWallet({coin: coinId, user: this.user.id})
        }
        return this.isShowRechargeDialog;
      },
      set(val) {
        this.$store.commit("ui/SET_IS_SHOW_RECHARGE_DIALOG", val);
      },
    },

  },
  methods: {
    ...mapActions('alert', ['showAlert']),
    closeRecharge() {
      this.isRecharge = false
      // this.refreshPage() // 2022.03.01 先把關閉充值後的刷新頁面拿掉
    },
    onCopy() {
      this.showAlert(i18n.t("copySuccess"))
    },
    onError() {
    },
    refreshPage() {
      location.reload();
    },
    changeChain(index) {
      this.QRcodeUrl = this.wallet[index].address
    },
    getUserWallet(info) {
      getUserWallet(info)
          .then((response) => {
            this.wallet = response.data
            this.QRcodeUrl = response.data[0].address // 2022.03.01 後端回傳格式變成陣列，所以改成取data[0]裡的值
          })
          .catch(() => {
          })
    }
  }
}
</script>

<style lang="scss" scoped>
.fontRecharge {
  color: rgba(224, 224, 224, 1) !important;
}

.text {
  color: rgba(158, 158, 158, 1) !important;
}

.btnToggle {
  background: transparent !important;

  .btnType {
    width: 118px;
    height: 46px;
    border: 0px !important;
    border-radius: 8px !important;
    margin-right: 10px;
  }
}
</style>
