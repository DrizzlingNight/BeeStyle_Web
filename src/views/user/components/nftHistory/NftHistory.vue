<template>
  <div class="history-wrapper">
    <v-container fluid class="table pa-0">
      <!-- 表頭 -->
      <v-row no-gutters class="d-none d-sm-block">
        <v-col cols="12" class="table-title d-flex align-center px-3">
          <p class="title-event text-center mb-0">事件</p>
          <p class="title-name mb-0">NFT名稱</p>
          <v-spacer></v-spacer>
          <p class="title-time mb-0">時間</p>
        </v-col>
      </v-row>
      <!-- 表身 -->
      <v-row no-gutters class="d-none d-md-block">
        <!-- 一筆資料單位 -->
        <v-col v-for="history in historyList" :key="history.id" cols="12" class="table-row d-flex px-3">
          <div class="row-event text-center">
            <Event :eventId="history.opt"></Event>
          </div>
          <div class="row-name">
            <simple-nft-show :item="history"></simple-nft-show>
          </div>
          <v-spacer></v-spacer>
          <div class="row-time">
            <history-time :item="history.created_time"></history-time>
          </div>
        </v-col>
      </v-row>
      
      <!-- Mobile view -->
      <v-row justify="center" no-gutters class="d-block d-md-none">
        <v-expansion-panels flat accordion>
          <v-expansion-panel
            v-for="history in historyList"
            :key="history.id"
            class="history-panel"
          >
            <v-expansion-panel-header style="min-height: 40px;">
              <history-time :item="history.created_time"></history-time>
            </v-expansion-panel-header>
            <v-divider></v-divider>
            <v-expansion-panel-content>
              <div class="mb-3 pt-5">
                <event :eventId="history.opt"></event>
              </div>
              <div class="d-flex">
                <span class="mr-4">NFT名稱</span><simple-nft-show :item="history"></simple-nft-show>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>

      <!-- 空狀態畫面 -->
      <v-card height="400px" class="d-flex align-center" flat v-if="historyList.length === 0 && !loading">
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
    <v-row no-gutters class="d-flex justify-center">
      <v-col cols="12">
        <v-pagination
            v-model="page"
            :length="pageLength"
            :total-visible="7"
        ></v-pagination>
      </v-col>
    </v-row>
    <overlay :loading="loading"></overlay>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {getOptionHistory} from "@/api/NFT";
import Event from "./components/Event";

import SimpleNftShow from "./components/SimpleNftShow"
import Overlay from "@/components/Overlay"
import router from "@/router"
import i18n from "@/lang"
import HistoryTime from "./components/HistoryTime"

export default {
  name: "History",
  components: {
    HistoryTime,
    Overlay,
    Event,
    SimpleNftShow,
  },
  watch: {
    user() {
      if (this.user) {
        this.getHistory()
      }
    },
    page() {
      this.getHistory(this.searchInfo, false)
    }
  },
  computed: {
    ...mapGetters(["user", "host"]),
    headers() {
      return [
        {
          text: i18n.t("persetting.history.event"),
          align: 'start',
          sortable: false,
          value: 'opt',
        },
        {text: i18n.t("persetting.history.project"), value: 'name'},
        // { text: 'price', value: '' },
        // { text: 'number', value: '' },
        // { text: 'from', value: '' },
        // { text: 'to', value: '' },
        {text: i18n.t("persetting.history.date"), value: 'created_time'},
      ]
    }
  },
  data: () => ({
    historyList: [],
    loading: false,
    limit: 10,
    page: 1,
    pageLength: 1,
    searchInfo: {},
    // 2021.11.19 暫時加入假資料
    dummyData: [
      {
        
      }
    ]
  }),
  created() {
    if (this.user) {
      this.getHistory()
    }
  },
  methods: {
    clickData(item) {
      let now = this.moment();
      let expired = this.moment(item ? item.token.expiration : "");
      if (expired.diff(now) < 0) {
        return i18n.t(i18n.t("persetting.history.errorExpired"))
      } else if (item.status === 1) {
        return i18n.t(i18n.t("persetting.history.errorDestory"))
      } else {
        router.push(`/nft/${item.token.id}`)
      }
    },
    getHistory(info = {}, resetPage = true) {
      this.loading = true
      info.limit = this.limit
      if (resetPage)
        this.page = 1
      info.offset = this.limit * (this.page - 1)
      this.searchInfo = info
      info.user = this.$route.params.id

      getOptionHistory(info)
          .then((response) => {
            this.loading = false
            this.historyList = response.data.results;
            this.pageLength = parseInt(response.data.count / this.limit) + ((response.data.count % this.limit) && 1 || 1)
          })
          .catch(() => {
            this.loading = false
          });
    },
  }
}
</script>

<style lang="scss" scoped>

.history-wrapper {
  padding: 40px 208px 160px 208px;
  max-width: 1440px;
  margin: auto;

  .table {
    min-height: 450px;

    .table-title {
    height: 32px;

    .title-event {
      width: 60px;
      margin-right: 100px;
    }
    // .title-name {
    // }
    .title-time {
      width: 160px;
    }
  }

  ::v-deep .table-row {
    height: 32px;
    display: flex;
    align-items: center;

    &:nth-child(odd) {
      background: #f4f4f4;
      
      span,i {
        color: #000000 !important;
      }
    }

    .row-event {
      width: 60px;
      margin-right: 100px;
    }
    // .row-name {
    // }
    .row-time {
      width: 160px;
    }
  }
  }

  ::v-deep .history-panel:nth-child(odd) {
    background: #f4f4f4;

    span,i {
      color: #000000 !important;
    }
  }
}

@media screen and (max-width: 960px) {
  .history-wrapper {
    padding: 40px 120px 160px 120px;

    .title-event, .row-event {
      margin-right: 24px !important;
    }
  }
  
}

@media screen and (max-width: 600px) {
  .history-wrapper {
    padding: 40px 16px 160px 16px;
  }
  
}

// ::v-deep .v-data-table > .v-data-table__wrapper > table > tbody > tr {

//   &:nth-child(odd) {
//     background: #f3f3f3;
//   }

//   td {
//     padding-left: 80px !important;
//     border: 0 !important;
//   }
// }

// ::v-deep .theme--dark.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th {
//   background-color: rgba(21, 21, 21, 1);
//   font-size: 18px;
//   color: rgba(238, 238, 238, 1);
//   font-weight: 600;
//   padding-left: 80px;
// }

// @media (max-width: 1156px) {
//   ::v-deep .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
//     padding-left: 0px !important;
//   }

//   ::v-deep .theme--dark.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th {
//     padding-left: 0px;
//   }
// }
</style>
