<template>
  <v-window
      v-model="selected"
  >
    <v-window-item
        v-for="(item,i) in items"
        :key="i"
        crycle
        @click="goNFT(item.id)"
        style="cursor: pointer"
    >
      <v-card>
        <v-img
            aspect-ratio="1.5"
            :src="item.files
              ? (item.files.indexOf('http') === 0 && item.files || (host + item.files))
              : 'https://cdn.vuetifyjs.com/images/cards/house.jpg'
              "
        ></v-img>
      </v-card>
    </v-window-item>
  </v-window>
</template>

<script>
import {mapGetters} from "vuex";
import {getNFTList} from "@/api/NFT";
export default {
  name: "LeftImage",
  computed: {
    ...mapGetters(["host"]),
    selectedItem(){
      return this.items[this.selected]
    }
  },
  data: ()=>{
    return {
      items: [],
      selected: 0
    }
  },
  mounted() {
    setInterval(()=>{
      this.next()
    }, 5000)
    this.getNFTList()
  },
  methods:{
    getNFTList(){
      // let info = {}
      // info.status = 0 //去掉销毁的数据
      // info.is_recommend = true
      getNFTList().then((res)=>{
        this.items = res.data.results
      }).catch((err)=>{
        console.error(err)
      })
    },
    goNFT(_id) {
      this.$router.push("/nft/" + _id);
    },
    next(){
      if (this.selected >= this.items.length - 1)
        this.selected = 0
      else
        this.selected ++
    }
  }
}
</script>

<style scoped>

</style>
