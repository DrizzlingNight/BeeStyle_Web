<template>
  <v-container fluid class="my-md-12 pa-0 d-md-flex justify-center">
    <v-col class="mr-md-5 pa-0" cols="12" md="5" lg="6" style="border-radius: 10px">
      <v-card flat>
        <v-row class="d-flex justify-center" no-gutters>
          <v-col cols="10">
            <v-card-title class="pl-0 mt-8">
              <div style="font-size: 40px;font-weight: bold;">
                {{ $t("createNFT.title") }}
              </div>
            </v-card-title>
            <v-card-text class="pl-0 mt-10">
              <p class=" mb-3 createdNFT" style="font-size: 20px">{{ $t("createNFT.imgText") }}</p>
              <p class="mb-0 createdNFT" style="font-size: 14px">
                {{ $t("createNFT.text") }}
              </p>
            </v-card-text>
            <!-- 預設檔案上傳沒有glb，但創建NFT時多加glb（3D Model） -->
            <files-input
                acceptedFileTypes=".jpg, .png, .svg, .gif, .webp, .glb"
                @update="updateFiles"
                class="pa-0 mt-2"
            >
            </files-input>
          </v-col>
          <v-col cols="10" class="my-15">
            <v-form ref="form" v-model="valid">
              <!-- // ! 名稱 -->
              <div class="mb-2" style="font-size: 12px">{{ $t("createNFT.itemName") }}*</div>
              <v-text-field
                  color="#F7B500"
                  class="mt-0 pt-0 body-2"
                  v-model="name"
                  :rules="textRules"
                  :label="$t('createNFT.namePlaceholder')"
                  single-line
                  required
                  :counter="50"
                  maxlength="50"
              ></v-text-field>
              <!-- // ! 序列號 -->
              <!-- <div class="mb-2 mt-4" style="font-size: 12px">{{ $t("createNFT.serialNo") }}*</div>
              <v-text-field
                  color="#F7B500"
                  class="mt-0 pt-0 body-2"
                  v-model="serialNo"
                  :rules="serialNoRules"
                  :label="$t('createNFT.noPlaceholder')"
                  single-line
                  required
                  :counter="50"
                  maxlength="50"
              ></v-text-field> -->
              <!-- // ! 行權價、到期、年費率 -->
              <!-- <v-row class="mb-3">
                <v-col cols="12" sm="4">
                  <div class="mb-2 mt-4" style="font-size: 12px">{{ $t("createNFT.liabillties") }}*</div>
                  <VuetifyNumberInput
                      v-model.number="liabilities"
                      v-bind:options="liabilitiesVNIOption"
                      backgroundColor=""
                  ></VuetifyNumberInput>
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="mb-2 mt-4" style="font-size: 12px">{{ $t("createNFT.expiration") }}*</div>
                  <v-select
                      color="#F7B500"
                      class="mt-0 pt-0 body-2"
                      v-model="expiration"
                      :items="expirationitems"
                      :rules="selectRules"
                      required
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="mb-2 mt-4" style="font-size: 12px">{{ $t("createNFT.rate") }}*</div>
                  <VuetifyNumberInput
                      v-model.number="annualized"
                      v-bind:options="annualizedVNIOption"
                      backgroundColor=""
                  ></VuetifyNumberInput>
                </v-col>
              </v-row> -->
              <!-- // ! 描述 -->
              <div class="mb-1" style="font-size: 12px">{{ $t("createNFT.description") }}*</div>
              <v-textarea
                  color="#F7B500"
                  class="mt-0 pt-0 body-2"
                  v-model="description"
                  :rules="textareaRules"
                  :label="$t('createNFT.desPlaceholder')"
                  single-line
                  required
                  auto-grow
                  rows="1"
                  :counter="200"
                  maxlength="200"
              ></v-textarea>
              <!-- // ! 分類 -->
              <div class="mb-2 mt-4" style="font-size: 12px">{{ $t("createNFT.category") }}*</div>
              <v-select
                  color="#F7B500"
                  class="mt-0 pt-0 body-2"
                  v-model="category"
                  :items="categoryItems"
                  :rules="selectRules"
                  required
              ></v-select>
              <!-- // ! 關鍵字-->
              <div class="mb-1" style="font-size: 12px">{{ $t("createNFT.keyword") }}</div>
              <v-textarea
                  color="#F7B500"
                  class="mt-0 pt-0 body-2"
                  v-model.trim="keyword"
                  :rules="keywordRules"
                  :label="$t('createNFT.keywordDescription')"
                  single-line
                  auto-grow
                  rows="1"
                  :counter="64"
                  maxlength="64"
              ></v-textarea>
              <!-- // ! 選擇幣種-->
              <!-- <div class="mb-1" style="font-size: 12px">{{ $t("createNFT.selectCoin") }}</div>
              <v-select
                  v-model="selectedCoin"
                  :items="coinList"
                  item-text="code"
                  item-value="id"
                  :label="$t('createNFT.coin')"
                  return-object
                  single-line
                  class="mt-n2"
              ></v-select> -->
              <!-- // ! 評分 -->
              <!-- <div class="mb-2 mt-4" style="font-size: 12px">{{ $t("createNFT.rating") }}*</div>
              <v-text-field
                  color="#F7B500"
                  class="mt-0 pt-0 body-2"
                  v-model="rating"
                  :rules="textRules"
                  :label="$t('createNFT.ratingPlaceholder')"
                  single-line
                  required
                  :counter="50"
                  maxlength="50"
              ></v-text-field> -->
              <!-- // ! 鑑定 -->
              <!-- <div class="mb-2 mt-4" style="font-size: 12px">{{ $t("createNFT.authentication") }}*</div>
              <v-text-field
                  color="#F7B500"
                  class="mt-0 pt-0 px-0 body-2"
                  v-model="authentication"
                  :rules="textRules"
                  :label="$t('createNFT.authentPlaceholder')"
                  single-line
                  required
                  :counter="50"
                  maxlength="50"
              ></v-text-field> -->
              <!-- // ! 託管機構名稱 -->
              <!-- <div class="mb-2 mt-4" style="font-size: 12px">{{ $t("createNFT.archiveName") }}*</div>
              <v-text-field
                  color="#F7B500"
                  class="mt-0 pt-0 body-2"
                  v-model="archiveName"
                  :rules="textRules"
                  :label="$t('createNFT.archiveNamePlaceholder')"
                  single-line
                  required
                  :counter="50"
                  maxlength="50"
              ></v-text-field> -->
              <!-- // ! 託管機構地址 -->
              <!-- <div class="mb-2 mt-4" style="font-size: 12px">{{ $t("createNFT.archiveAddress") }}*</div>
              <v-text-field
                  color="#F7B500"
                  class="mt-0 pt-0 body-2 mb-10"
                  v-model="archiveAddress"
                  :rules="addressRules"
                  :label="$t('createNFT.archiveAddressPlaceholder')"
                  single-line
                  required
                  :counter="100"
                  maxlength="100"
              ></v-text-field> -->
            </v-form>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <div class="px-7" style="background-color: #1E1E1E;min-width: 464px;border-radius: 10px;">
      <v-card flat>
        <v-col cols="12" class="mt-md-10">
          <div>
            <span class="createdNFT" style="font-size: 20px">{{ $t("createNFT.fee") }}</span>
            <p class="owner mt-2" style="font-size: 14px">{{ $t("createNFT.feeText") }}</p>
          </div>
        </v-col>
        <v-col cols="12" class="d-flex justify-space-between pa-0 mt-3">
          <v-col class="ETHColor" style="font-size: 16px">
            <div>{{ $t("createNFT.balance") }}</div>
            <div class="mt-2">{{ $t("createNFT.fee") }}</div>
          </v-col>
          <v-col class="text-right" style="font-size: 18px">
            <div v-if="!lowerPrice">{{ showPrice }} USDT</div>
            <div v-else class="errorColor">{{ showPrice }} USDT</div>
            <div class="mt-2 fee">{{ fee }} USDT</div>
          </v-col>
        </v-col>
        <v-col cols="12">
          <v-btn
              block
              x-large
              :disabled="!valid || lowerPrice || !files.length"
              class="mt-14 btnColor"
              dark
              @click="createNFT"
          >
            {{ $t("createNFT.btn") }}
          </v-btn>
        </v-col>
        <v-col
            v-if="lowerPrice"
            class="d-flex justify-space-between py-0"
            style="font-size: 14px"
        >
          <span class="errorColor">{{ $t("productDetail.sellDialog.lowBalance") }}</span>
          <a class="mt-n1" text color="#1E88E5" @click="goRecharge">{{
              $t("productDetail.sellDialog.recharge")
            }}
          </a>
        </v-col>
      </v-card>
    </div>
  </v-container>


</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {createNFT} from "@/api/NFT";
// import VuetifyNumberInput from "@/components/VuetifyNumberInput";
import router from "@/router";
import i18n from "@/lang";
import FilesInput from "@/components/FilesInput";
import {formatDecimal, numFormat} from "@/utils/math"

import { v4 as uuidv4 } from 'uuid'

export default {
  name: "createnft",
  components: {
    FilesInput,
    // VuetifyNumberInput
  },
  data: () => ({
    files: [],
    valid: false,
    closeCreatedNFT: false,
    expirationitems: [
      {text: "2 months", value: 60},
      {text: "3 months", value: 90},
      {text: "6 months", value: 180},
      {text: "1 years", value: 360},
      {text: "3 years", value: 1080},
      {text: "5 years", value: 1800},
    ],
    // NFT分類種類項目
    categoryItems: [
      {
        id: 1,
        text: '宗教藝術', // TODO 先寫死 還要改
        value: 1,
      },
      {
        id: 2,
        text: '街頭藝術', // TODO 先寫死 還要改
        value: 2,
      },
      {
        id: 3,
        text: 'GAME-FI', // TODO 先寫死 還要改
        value: 3,
      },
      {
        id: 4,
        text: '其他', // TODO 先寫死 還要改
        value: 4
      }
    ],

    keyword: '',  // NFT關鍵字
    selectedCoin: {}, // 選擇的幣種

    liabilitiesVNIOption: {
      locale: i18n.locale,
      prefix: "₩",
      length: 9,
      fixed: 0,
    },
    annualizedVNIOption: {
      locale: i18n.locale,
      suffix: "%",
      length: 4,
      fixed: 2,
    },
    loading: false,
    name: "",
    serialNo: "",
    description: "",
    category: 4,
    liabilities: "",
    expiration: "",
    annualized: "",
    rating: "",
    authentication: "",
    archiveName: "",
    archiveAddress: "",
    selectRules: [(v) => !!v || i18n.t("createNFT.textRule")],
    textRules: [
      (v) => !!v || i18n.t("createNFT.textRule"),
      (v) => (v && v.length <= 50) || i18n.t("createNFT.textRules"),
    ],
    addressRules: [
      (v) => !!v || i18n.t("createNFT.addressRules"),
      (v) => (v && v.length <= 100) || i18n.t("createNFT.addressRules"),
    ],
    textareaRules: [
      (v) => !!v || i18n.t("createNFT.textRule"),
      (v) => (v && v.length <= 200) || i18n.t("createNFT.textareaRules"),
    ],
    serialNoRules: [
      (v) => /^[a-zA-Z0-9]+$/.test(v) || i18n.t("createNFT.inputRules"),
    ],
    keywordRules: [
      // 如果沒有值就pass
      // 如果有值的話就驗證是否為 XXX, XXX, 最後一個,可加可不加
      (v) => !v ? true : (/^([^,]+,)+$/.test(v) || (v.split(',')[v.split(',').length - 1] ? true : i18n.t("createNFT.keywordDescription"))),
    ]
  }),
  created() {
    // 若未登入就返回原頁
    if (!this.isLogin) {
      this.$router.go(-1)
    }
    this.getBalance()
    this.selectedCoin = this.coinList[0] // 預設幣種選擇第一個
  },
  computed: {
    ...mapGetters(["user", "host", "getRate", "config", "getBalanceById", "coinList"]),
    //判斷是否登錄
    isLogin() {
      return this.user ? true : false
    },
    //余额
    totalPrice() {
      if (this.config) {
        let balance = this.getBalanceById(this.config.coin)
        return balance && formatDecimal(balance.amount, 4) || "- -"
      } else
        return ''
    },
    showPrice() {
      return numFormat(this.totalPrice)
    },
    //手续费
    fee() {
      return numFormat(formatDecimal(this.config.gasFee, 4))
    },
    //比较余额和手续费
    lowerPrice() {
      if (Number(this.totalPrice) < Number(this.config.gasFee)) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapActions('alert', ['showAlert']),
    updateFiles(files) {
      this.files = files
      console.log()
    },
    goRecharge() {
      this.$store.commit("ui/SET_IS_SHOW_RECHARGE_DIALOG", true);
    },
    getBalance() {
      this.$store
          .dispatch("user/balance")
          .then(() => {
          })
          .catch(() => {
          });
    },
    // 創建NFT 送出request
    createNFT() {
      this.loading = true

      // 基礎請求資料
      let requestData = {
        // 預設為已發放 (沒有發放的話沒有登入就看不到)
        is_deliver: true,
        // NFT 圖片檔案資源
        files: this.files,
        // NFT 名稱
        name: this.name,
        // NFT 序列號 (必填 給亂數)
        serialNo: uuidv4(),
        // NFT 描述
        description: this.description,
        // 託管機構地址 (必填 給亂數)
        archiveAddress: uuidv4()
      }
      
      // 若有分類 就加入分類 key-value
      if (this.category !== 4) {
        requestData = {...requestData, cate: this.category}
      }

      // 若有關鍵字 就加入keyword
      if (this.keyword) {
        this.keyword = this.keyword.replace(/\s+/g, '') // 去除空白
        this.keyword = this.keyword.replace(/(,)$/g, '') // 把最後一個','拿掉
        requestData = {...requestData, keywords: this.keyword}
      }

      // 加入幣種
      // requestData = {...requestData, coin: this.selectedCoin}

      console.log('requestData', requestData)

      createNFT(requestData)
          .then((response) => {
            if (response.code === 0) {
              this.$toast.success(this.$t("createNFT.successNFT"))
              router.push(`/nft/` + response.data.id);
            } else {
              this.toasterErr(response.code)
            }

          })
          .catch(() => {
            this.loading = false;
          });

    },
  },
};
</script>

<style scoped>
.fee {
  color: rgba(255, 193, 7, 1);
}

::v-deep .v-input input {
  max-height: 50px;
}

::v-deep .theme--dark.v-text-field > .v-input__control > .v-input__slot:before {
  border-color: rgba(102, 102, 102, 1) !important;
}

::v-deep .theme--dark.v-text-field.v-input--is-disabled .v-input__slot::before {
  border-image: 0 !important;
}
</style>
