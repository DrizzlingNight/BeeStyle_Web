<template>
  <div style="height: 100%" class="d-flex align-center">
    <v-card class="text-center mx-auto" width="650" height="463">
      <div class="text-right">
        <v-card-subtitle class="d-inline-block">
          <v-icon class="btnColor--text" @click="goCurrentPage">close</v-icon>
        </v-card-subtitle>
      </div>
      <v-img
          class="mx-auto mt-10"
          max-width="143"
          max-height="143"
          src="@/assets/fake/submit_success.png"
      ></v-img>
      <v-card-text class="navI18n--text mt-5" style="font-size: 24px">
        {{ successTitle }}
      </v-card-text>
      <div class="fontColor9--text" style="font-size: 16px">
        {{ successText }}{{ successUser ? successUser.creator.username : "" }}
      </div>
      <v-card-actions class="mt-2 mx-auto">
        <v-col cols="9" class="d-flex mx-auto">
          <v-btn
              block
              depressed
              class="btnColor btnWhite--text"
              @click="goCurrentPage"
              style="height: 50px;font-size: 20px"
          >
            {{ $t("confirmBtn") }}
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
// import router from '@/router';
export default {
  name: 'Success',
  props: ['successTitle', 'successText', 'successUser'],
  methods: {
    //刷新当前页
    goCurrentPage() {
      location.reload();
    },
  },
};
</script>

<style scoped>
</style>