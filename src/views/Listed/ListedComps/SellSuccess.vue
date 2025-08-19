<template>
  <div style="height: 100%" class="d-flex align-center">
    <v-card class="text-center mx-auto" width="650" height="503">
      <div class="text-right">
        <v-card-subtitle class="d-inline-block pt-5">
          <v-img
              max-height="14"
              max-width="14"
              src="@/assets/fake/close.png"
              @click="goNft"
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
        {{ $t("listed.sellSuccess.title") }}
      </v-card-text>
      <v-card-actions class="mt-7 px-10" >
        <v-col cols="6" class="d-flex mx-auto">
          <v-btn x-large block class="btnColor" @click="goMarketPlace" style="height: 50px">
            {{ $t("listed.sellSuccess.continueSell") }}
          </v-btn>
        </v-col>
        <v-col cols="6" class="d-flex mx-auto">
          <v-btn x-large block @click="goNft" style="height: 50px;border: 1px solid rgba(255, 193, 7, 1)">
            {{ $t("listed.sellSuccess.lookDetail") }}
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import router from "@/router";
import {mapGetters} from "vuex";
export default {
  name: "SellSuccess",
  computed: {
    ...mapGetters([
      'name', 'user', 'host'
    ]),
  },
  methods:{
    goMarketPlace() {
      router.push("/user/" + this.user.id)
    },
    goNft() {
      router.push("/nft/" + this.$route.params.id)
    }
  }
}
</script>

<style scoped>

</style>