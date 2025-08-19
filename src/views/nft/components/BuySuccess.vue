<template>
  <div style="height: 100%" class="d-flex align-center">
    <v-card class="text-center mx-auto" width="650" height="503">
      <div class="text-right">
        <v-card-subtitle class="d-inline-block pt-5">
          <v-img
              max-height="14"
              max-width="14"
              src="@/assets/fake/close.png"
              style="cursor: pointer"
              @click="goDetail"
          ></v-img>
        </v-card-subtitle>
      </div>
      <v-img
          class="mx-auto mt-10"
          max-width="143"
          max-height="143"
          src="@/assets/fake/submit_success.png"
      ></v-img>
      <v-card-text class="white--text mt-5" style="font-size: 24px">
        {{ title }}
      </v-card-text>
      <div class="white--text" style="font-size: 16px">
        {{ body }}
      </div>
      <v-card-actions class="mt-2 mx-auto">
        <v-col cols="11" class="d-flex mx-auto">
          <v-col cols="6" class="d-flex mx-auto">
            <v-btn x-large block class="btnColor" @click="goMarket" style="height: 50px">
              {{ $t("listed.sellSuccess.continueBuy") }}
            </v-btn>
          </v-col>
          <v-col cols="6" class="d-flex mx-auto">
            <v-btn x-large block @click="goDetail" style="height: 50px;border: 1px solid rgba(255, 193, 7, 1)">
              {{ $t("listed.sellSuccess.lookDetail") }}
            </v-btn>
          </v-col>
        </v-col>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import router from "@/router";
import {mapGetters} from "vuex";

export default {
  name: "BuySuccess",
  props: [
    "title",
    "body",
    "toPath",
    "NFTData"
  ],
  computed: {
    ...mapGetters(["name", "user", "host"]),
  },
  methods: {
    goMarket() {
      router.push("/explore/")
    },
    goDetail() {
      // TODO: 2022.02.15 查看詳情都先讓頁面重整就行 
      // if(this.$route.path === this.toPath) {
      //   location.reload()
      // }else {
      //   router.push(this.toPath)
      // }
      location.reload()
    }
  }
}
</script>

<style scoped>

</style>