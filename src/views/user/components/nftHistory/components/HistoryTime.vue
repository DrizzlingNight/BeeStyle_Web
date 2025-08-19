<template>
  <div class="">
    <span class="">{{ time }}</span>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "HistoryTime",
  props: ['item'],
  computed: {
    ...mapGetters(["user", "host"]),
    date() {
      return function (time) {
        let current = time
            .replace(/-/g, "/")
            .replace(/T/g, " ")
            .split(/\./g)[0];
        return current;
      };
    },
    time() {
      return this.date(this.item)
    }
  }
}
</script>

<style scoped>

</style>