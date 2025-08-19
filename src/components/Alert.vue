<template>
  <v-alert color="rgba(76, 76, 76, 0.6)" class="close white--text">
    {{ data }}
  </v-alert>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "Alert",
  data:() =>({
    data:''
  }),
  computed: {
    ...mapGetters([
      'showAlert',"alertData"
    ]),
  },
  created() {
    this.alertErr(this.alertData)
    setTimeout(() => {
      this.$store.commit("alert/SHOW_ALERT", true);
    }, 0);
    setTimeout(() => {
      this.$store.commit("alert/SHOW_ALERT", false);
    }, 2000);
  },
  methods:{
    alertErr(code) {
      if(typeof code !== 'number') {
        this.data = code
        setTimeout(() => {
          this.$store.commit("alert/SHOW_ALERT", true);
        }, 0)
        setTimeout(() => {
          this.$store.commit("alert/SHOW_ALERT", false);
        }, 2000)
      }else {
        let key = `errorCode.${code}`
        let text = this.$t(key)
        if (text.localeCompare(key) !== 0)
          this.data = text
        else {
          this.data = this.$t(this.$t(`systemErr`) + `(${code})`)
        }
        setTimeout(() => {
          this.$store.commit("alert/SHOW_ALERT", true);
        }, 0)
        setTimeout(() => {
          this.$store.commit("alert/SHOW_ALERT", false);
        }, 2000)
      }
    }
  }

}
</script>

<style scoped>

</style>