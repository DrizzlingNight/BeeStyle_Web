<template>
  <v-card class="text-center mx-auto" width="650px" height="463px">
    <div class="text-right">
      <v-card-subtitle class="d-inline-block pt-5" @click="NFTfailed">
        <v-img max-height="14" max-width="14" src="@/assets/fake/close.png"></v-img>
      </v-card-subtitle>
    </div>
    <v-img
        class="ma-auto"
        max-width="143"
        max-height="143"
        src="@/assets/fake/submit_failed.png"
    ></v-img>
    <v-card-text class="white--text mt-10" style="font-size: 24px">
      {{$t("transferNFT.errorTransfer")}}
    </v-card-text>
    <v-card-actions class="mt-8">
      <v-col cols="10" class="mx-auto">
        <v-btn
            x-large
            block
            class="btnColor"
            @click="NFTfailed"
        >
          {{$t("transferNFT.backTransfer")}}
        </v-btn>
      </v-col>
    </v-card-actions>
  </v-card>
</template>

<script>
import router from "@/router";
import {mapGetters} from "vuex";
export default {
  name: "failedDialog",
  computed:{
    ...mapGetters(["host", "user"]),
  },
  methods:{
    // closeDialog() {
    //   this.$emit("closeDialog")
    // },
    NFTfailed() {
      this.$emit("closeDialog")
      router.push(`/user/${this.user.id}/1`)
    }
  }
}
</script>

<style scoped>

</style>