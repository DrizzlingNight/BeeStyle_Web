<template>
  <v-row
      class="mx-auto mt-16"
      style="max-width: 612px"
  >
    <v-col class="d-flex justify-center">
      <v-img
          max-height="250"
          max-width="350"
          v-if="type==='networkErr'"
          src="@/assets/fake/networkErr.png"
      ></v-img>
      <v-img
          max-height="250"
          max-width="350"
          v-else-if="type==='getNothing'"
          src="@/assets/fake/getNothing.png"
      ></v-img>
      <v-img
          max-height="250"
          max-width="350"
          v-else
          src="@/assets/fake/defaultnull.png"
      ></v-img>
    </v-col>
    <v-col cols="12" class="text-center">
      <p v-if="type==='networkErr'"
         style="font-size: 20px;color: #D9D7D7">網路有些問題!</p>
      <p v-else-if="type==='getNothing'"
         style="font-size: 20px;color: #D9D7D7">沒有搜尋到相關結果</p>
      <p v-else
         style="font-size: 20px;color: #D9D7D7">暫無相關內容</p>
    </v-col>
  </v-row>
</template>

<script>
export default {
name: "DefaultNone",
  props:[
      "type"
  ]
}
</script>

<style scoped>

</style>
