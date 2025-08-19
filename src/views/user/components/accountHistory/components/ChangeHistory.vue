<template>
  <div class="change-wrapper">
    <v-container fluid class="table pa-0">
      <!-- 帳變紀錄 表頭 -->
      <v-row v-if="data.length" no-gutters class="d-none d-md-block">
        <v-col cols="12" class="change-table-title d-flex justify-space-between align-center px-5">
          <p class="title-text title-coin mb-0" style="width: 10%;">{{ $t("trade.coinType") }}</p>
          <p class="title-text title-usage mb-0" style="width: 20%;">{{ $t("trade.useType") }}</p>
          <p class="title-text title-price mb-0" style="width: 10%;">{{ $t("trade.amount") }}</p>
          <p class="title-text title-balance mb-0" style="width: 20%;">{{ $t("trade.balance") }}</p>
          <p class="title-text title-time mb-0" style="width: 20%;">{{ $t("trade.date") }}</p>
        </v-col>
      </v-row>
      <!-- 帳變紀錄 表身 -->
      <v-row no-gutters class="d-none d-md-block">
        <!-- 一筆資料單位 -->
        <v-col v-for="item in data" :key="item.id" cols="12" class="change-row table-row d-flex justify-space-between px-5">
          <!-- 幣種 -->
          <div class="row-coin" style="width: 10%;">
            <!-- <p class="mb-0">{{ item.coin.name }}</p> -->
            <v-img
              height="17"
              width="17"
              class="rounded-circle"
              :src="`/static/ui/utils/coin/coin_${item.coin.id}.png`"/>
          </div>
          <!-- 用途 -->
          <div class="row-usage" style="width: 20%;">
            <p class="mb-0">{{ $t(`trade.recordType.${useType(item.type)}`) }}</p>
          </div>
          <!-- 金額 -->
          <div class="row-price" style="width: 10%;">
            <p v-if="isJust(item.changed)" class="desposit mb-0">+{{ price(item.changed) }}</p>
            <p v-else class="error--text mb-0">{{ price(item.changed) }}</p>
          </div>
          <!-- 餘額 -->
          <div class="row-balance" style="width: 20%;">
            <p class="mb-0">{{ price(item.current) }}</p>
          </div>
          <!-- 時間 -->
          <div class="row-time" style="width: 20%;">
            <p class="mb-0">{{ switchTimeFormat(item.created_time) }}</p>
          </div>
        </v-col>
      </v-row>
      <!-- Mobile view -->
      <v-row justify="center" no-gutters class="d-block d-md-none pt-10">
        <!-- 帳變紀錄 -->
        <v-expansion-panels flat accordion>
          <v-expansion-panel
            v-for="item in data"
            :key="item.id"
            class="history-panel"
          >
            <v-expansion-panel-header style="min-height: 40px;">
              <p class="mb-0">{{ switchTimeFormat(item.created_time) }}</p>
            </v-expansion-panel-header>
            <v-divider></v-divider>
            <v-expansion-panel-content>
              <div class="mb-3 d-flex pt-5">
                <span class="mr-4">{{ $t("trade.coinType") }}</span><span>{{ item.coin.name }}</span>
              </div>
              <div class="mb-3 d-flex">
                <span class="mr-4">{{ $t("trade.useType") }}</span><span>{{ $t(`trade.recordType.${useType(item.type)}`) }}</span>
              </div>
              <div class="mb-3 d-flex">
                <span class="mr-4">{{ $t("trade.amount") }}</span>
                <span v-if="isJust(item.changed)" class="desposit mb-0">+{{ price(item.changed) }}</span>
                <span v-else class="error-color mb-0">{{ price(item.changed) }}</span>
              </div>
              <div class="mb-3 d-flex">
                <span class="mr-4">{{ $t("trade.balance") }}</span><span>{{ price(item.current) }}</span>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
      <!-- 空狀態 -->
      <v-card height="400px" class="d-flex align-center" flat v-if="data.length === 0 && !loading">
        <div class="mx-auto">
          <v-img
              class="mx-auto"
              max-height="192"
              max-width="361"
              src="@/assets/fake/transaction.png"
          ></v-img>
          <div class="text-center mt-10" style="font-size: 28px">
            {{ $t("transaction.text") }}
          </div>
        </div>
      </v-card>
    </v-container>
    <!-- 分頁器 -->
    <v-row class="d-flex justify-center my-10">
      <v-pagination
      v-model="page"
      :length="length"
      :total-visible="7"
    ></v-pagination>
    </v-row>
    <!-- Loading -->
    <overlay :loading="loading"></overlay>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {getRecord} from "@/api/user";
import {formatDecimal} from "@/utils/math"
import Overlay from "@/components/Overlay";
import {numFormat} from "@/utils/math";

export default {
  name: 'ChangeHistory',
  components: {Overlay},
  data: () => ({
    data: '',
    page: 1,
    length: 0,
    limit: 10,
    loading: false,
    tabItem: ['coinType', 'useType', 'amount', 'address', 'date']
  }),
  created() {
    this.getRecord()
  },
  computed: {
    ...mapGetters([
      'name', 'user', 'config', "getRate"
    ]),
    rate() {
      return function (item) {
        return this.getRate(item.coin.id, Number(process.env.VUE_APP_RATE_TO_COIN_ID))
      }
    },
    //现金价值
    cash() {
      return function (item) {
        return formatDecimal(Number(this.rate(item).rate) * Number(this.price(item.changed)), 4)
      }
    },
    //余额现金价值
    balance() {
      return function (item) {
        return formatDecimal(Number(this.rate(item).rate) * Number(this.price(item.current)), 4)
      }
    },
    price() {
      return function (amount) {
        return numFormat(formatDecimal(amount, 4))
      }
    },
    isJust() {
      return function (just) {
        if (Number(just) < 0) {
          return false
        } else return true

      }

    },
    useType() {
      return function (type) {
        switch (type) {
          case 0:
            return 'transferIn'
          case 1:
            return 'transferOut'
          case 2:
            return 'transferOutReturn'
          case 3:
            return 'transferOutFee'
          case 4:
            return 'transferOutFeeReturn'
          case 5:
            return 'NFTSold'
          case 6:
            return 'NFTBought'
          case 7:
            return 'NFTFee'
          case 8:
            return 'NFTBid'
          case 9:
            return 'NFTOffer'
          case 10:
            return 'NFTBidReturn'
          case 11:
            return 'NFTFeeReturn'
          case 12:
            return 'NFTOfferReturn'
          case 13:
            return 'MintGasFee'
          case 14:
            return 'MintGasFeeReturn'
          case 15:
            return 'TransferGasFee'
          case 16:
            return 'TransferGasFeeReturn'
          case 17:
            return 'BurnGasFee'
          case 18:
            return 'BurnGasFeeReturn'
        }
      }
    },
    switchTimeFormat() {
      return function (time) {
        let data = new Date(time).toJSON();
        return new Date(+new Date(data) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/-/g, '/').replace(/\.[\d]{3}Z/, '')
      }
    }
  },
  watch: {
    page() {
      this.getRecord()
    }
  },
  methods: {
    getRecord() {
      this.loading = true
      let info = {}
      info.limit = this.limit
      info.offset = this.limit * (this.page - 1)
      getRecord(info).then((response) => {
        this.loading = false
        this.data = response.data.results
        this.length = parseInt(Number(response.data.count) / 10) + 1
      }).catch(() => {
      })
    }
  },
}
</script>

<style lang="scss" scoped>

.table {
  min-height: 450px;

  .change-table-title {
    height: 32px;
  }
}

.table-row {
  min-height: 32px;
  display: flex;
  align-items: center;

  &:nth-child(odd) {
    background: #f4f4f4;
  }
  .row-time {
    width: 160px;
  }
}

.desposit {
  color: #20A763 !important;
}

</style>