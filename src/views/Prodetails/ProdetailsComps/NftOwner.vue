<template>
  <div>
    <v-card-actions class="pa-0">
      <v-list-item class="grow px-0" @click="$router.push(`/user/${NFT.user.id}`)">
        <v-list-item-avatar color="grey darken-3">
          <v-img class="elevation-6" src="@/assets/fake/people.png"></v-img>
        </v-list-item-avatar>
        <div>
          <v-list-item-title>{{
              NFT ? NFT.user.username : "--"
            }}
          </v-list-item-title>
          <div class="ETHColor mt-1" style="font-size: 12px">{{ $t("productDetail.owner") }}</div>
        </div>

      </v-list-item>
    </v-card-actions>
  </div>
</template>

<script>
export default {
  name: "NftOwner",
  props: [
    "NFT"
  ]
}
</script>

<style scoped>

</style>
