<template>
  <div class="trans-wrapper">
    <v-container fluid class="table pa-0">
      <!-- 充提紀錄 表頭 -->
      <v-row v-if="data.length" no-gutters class="d-none d-md-block">
        <v-col cols="12" class="trans-table-title d-flex align-center justify-space-between px-5">
          <div class="group-left d-flex justify-space-between">
            <p class="title-text title-coin mb-0">{{ $t("trade.coinType") }}</p>
            <p class="title-text title-usage mb-0">{{ $t("trade.useType") }}</p>
            <p class="title-text title-price mb-0">{{ $t("trade.amount") }}</p>
          </div>
          <div class="group-mid d-flex">
            <p class="title-text title-address mb-0">{{ $t("trade.address") }}</p>
          </div>
          <div class="group-right d-flex">
            <p class="title-text title-status mb-0">{{ $t("trade.state") }}</p>
            <p class="title-text title-time mb-0">{{ $t("trade.date") }}</p>
          </div>
        </v-col>
      </v-row>
      <!-- 充提紀錄 表身 -->
      <v-row no-gutters class="d-none d-md-block">
        <!-- 一筆資料單位 -->
        <v-col v-for="(item, index) in data" :key="item.id" cols="12" class="trans-row table-row d-flex justify-space-between align-center px-5">
          <div class="group-left d-flex">
            <!-- 幣種 -->
            <div class="row-coin">
              <!-- <p class="mb-0">{{ item.coin.name }}</p> -->
              <v-img
                height="17"
                width="17"
                class="rounded-circle"
                :src="`/static/ui/utils/coin/coin_${item.coin}.png`"/>
            </div>
            <!-- 用途 -->
            <div class="row-usage">
              <p v-if="transationSpan(index)" class="desposit mb-0">{{ $t("transaction.recharge") }}</p>
              <p v-else class="withdrawal mb-0">{{ $t("transaction.withdraw") }}</p>
            </div>
            <!-- 金額 -->
            <div class="row-price">
              <p v-if="transationSpan(index)" class="desposit mb-0">{{ price(item.abs_amount) }}</p>
              <p v-else class="withdrawal mb-0">-{{ price(item.abs_amount) }}</p>
            </div>
          </div>
          <div class="group-mid d-flex">
            <!-- 地址 -->
            <div class="row-address">
              <p class="mb-0 text-wrap">{{ item.address }}</p>
            </div>
          </div>
          <div class="group-right d-flex align-center">
            <!-- 狀態 -->
            <div class="row-status">
              <p v-if="item.status === 1" class="withdrawal mb-0">{{ $t(`trade.stateType.${item.status}`) }}</p>
              <p v-if="item.status === 2" class="desposit mb-0">{{ $t(`trade.stateType.${item.status}`) }}</p>
              <p v-if="item.status === 3" class="error--text mb-0">{{ $t(`trade.stateType.${item.status}`) }}</p>
            </div>
            <!-- 時間 -->
            <div class="row-time">
              <p class="mb-0">{{ switchTimeFormat(item.updated_time) }}</p>
            </div>
          </div>
        </v-col>
      </v-row>
      <!-- Mobile view -->
      <v-row justify="center" no-gutters class="d-block d-md-none pt-10">
        <!-- 充提紀錄 -->
        <v-expansion-panels flat accordion>
          <v-expansion-panel
            v-for="(item, index) in data" :key="item.id"
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
                <span class="mr-4">{{ $t("trade.useType") }}</span>
                <span v-if="transationSpan(index)" class="desposit mb-0">{{ $t("transaction.recharge") }}</span>
                <span v-else class="withdrawal mb-0">{{ $t("transaction.withdraw") }}</span>
              </div>
              <div class="mb-3 d-flex">
                <span class="mr-4 text-no-wrap">{{ $t("trade.address") }}</span><span style="overflow-wrap: anywhere;">{{ item.address }}</span>
              </div>
              <div class="mb-3 d-flex">
                <span class="mr-4">{{ $t("trade.amount") }}</span>
                <span v-if="transationSpan(index)" class="desposit mb-0">{{ price(item.abs_amount) }}</span>
                <span v-else class="withdrawal mb-0">-{{ price(item.abs_amount) }}</span>
              </div>
              <div class="mb-3 d-flex">
                <span class="mr-4">{{ $t("trade.state") }}</span>
                <span v-if="item.status === 1" class="withdrawal mb-0">{{ $t(`trade.stateType.${item.status}`) }}</span>
                <span v-if="item.status === 2" class="desposit mb-0">{{ $t(`trade.stateType.${item.status}`) }}</span>
                <span v-if="item.status === 3" class="error--text mb-0">{{ $t(`trade.stateType.${item.status}`) }}</span> 
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
        :total-visible="7">
      </v-pagination>
    </v-row>
    <!-- Loading -->
    <overlay :loading="loading"></overlay>
  </div>
</template>

<script>
import {mapGetters} from "vuex"
import {getTransations} from "@/api/user"
import {formatDecimal} from "@/utils/math"
import Overlay from "@/components/Overlay"
import {numFormat} from "@/utils/math"

export default {
  name: 'TransHistory',
  components: {Overlay},
  data: () => ({
    data: '',
    page:1,
    length:0,
    limit:10,
    loading:false,
    TRANSACTIONS_TYPE: {
      TransactionIn: 0, //充值
      TransactionOut: 1,  //提现
    },
    tabItem: ['coinType', 'useType', 'amount', 'address', 'date']
  }),
  created() {
    this.getTransations()
  },
  computed: {
    ...mapGetters([
      'name', 'user', 'config', "getRate"
    ]),
    rate() {
      return function (item) {
        return this.getRate(item.coin, Number(process.env.VUE_APP_RATE_TO_COIN_ID))
      }
    },
    //现金价值
    cash() {
      return function (item) {
        return formatDecimal(Number(this.rate(item).rate) * Number(this.price(item.abs_amount)), 4)
      }
    },
    price() {
      return function (amount) {
        return numFormat(formatDecimal(amount, 4))
      }
    },

    transationSpan() {
      return function (index) {
        let type = this.data[index].type
        if (type === this.TRANSACTIONS_TYPE.TransactionIn) {
          return true
        } else {
          return false
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
    page(){
      this.getTransations()
    }
  },
  methods: {
    getTransations() {
      this.loading = true
      let info = {}
      info.limit = this.limit
      info.offset = this.limit * (this.page - 1)
      getTransations(info).then((response) => {
        this.loading = false
        this.data = response.data.results
        this.length = parseInt(Number(response.data.count)/10)+1
      }).catch(() => {
      })
    }
  },
}
</script>

<style lang="scss" scoped>

.table {
  min-height: 450px;

  .trans-table-title {
    height: 32px;

      .group-left {
        width: 20%;
        min-width: 120px;

        .title-coin {
          width: 25%;
        }
        .title-usage {
          width: 25%;
        }
        .title-price {
          width: 50%;
        }
      }

      .group-mid {
        width: 50%;
        padding: 0px 40px;
      }

      .group-right {
        width: 30%;
        min-width: 112px;

        .title-status {
          width: 30%;
        }
        .title-time {
          width: 70%;
        }
      }
    
  }
  .change-table-title {
    height: 32px;
  }
  .order-table-title {
    height: 32px;
  }
}

.table-row {
  min-height: 32px;
  display: flex;
  align-items: center;

  &.trans-row {
    .group-left {
      width: 20%;
      min-width: 120px;

      .row-coin {
        width: 25%;
      }
      .row-usage {
        width: 25%;
      }
      .row-price {
        width: 50%;
      }
    }

    .group-mid {
      width: 50%;
      padding-left: 40px;
      padding-right: 20px;

      .row-address {
        width: 100% !important;

        p {
          overflow-wrap: anywhere;
        }
      }
    }

    .group-right {
      width: 30%;
      min-width: 112px;

      .row-status {
        width: 30%;
      }
      .row-time {
        width: 70%;
      }
    }
  }

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

.withdrawal {
  color: #166AFA !important;
}

</style>