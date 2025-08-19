<template>
  <v-card class="text-center" width="650px" height="463px">
    <div class="text-right">
      <v-card-subtitle class="d-inline-block pt-5" @click="NFTsuccess">
        <v-img max-height="14" max-width="14" src="@/assets/fake/close.png"></v-img>
      </v-card-subtitle>
    </div>

    <v-img
        class="ma-auto"
        max-width="143"
        max-height="143"
        src="@/assets/fake/submit_success.png"
    ></v-img>
    <v-card-text class="white--text mt-10" style="font-size: 24px">
      {{$t("transferNFT.successTransfer")}}
    </v-card-text>
    <v-card-text class="white--text mt-3" style=" font-size: 16px">
      {{$t("transferNFT.successText")}}：{{ receiverUsername }}
    </v-card-text>
    <v-card-actions class="px-10 pb-8 d-flex justify-space-between">
      <v-col cols="6">
        <v-btn
            x-large
            block
            class="btnColor"
            @click="NFTsuccess"
        >
          {{$t("confirmBtn")}}
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn
            x-large
            block
            class="continue amber--text lighten-1"
            @click="NFTCreated"
        >
          {{$t("transferNFT.continueTransfer")}}
        </v-btn>
      </v-col>

    </v-card-actions>
  </v-card>
</template>

<script>
import router from "@/router";
import {mapGetters} from "vuex";
export default {
  name: "successDialog",
  props:["receiverUsername"],
  computed:{
    ...mapGetters(["host", "user"]),
  },
  methods:{
    // closeDialog() {
    //   this.$emit("closeDialog")
    // },
    NFTsuccess() {
      this.$emit("closeDialog")
      router.push(`/user/${this.user.id}/1`)
    },
    NFTCreated() {
      this.$emit("closeDialog")
      router.push(`/create_nft/`)
    },
  }
}
</script>

<style scoped>

</style>