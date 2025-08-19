<template>
  <v-dialog v-model="successdialog" hide-overlay>
    <div class="text-center"><span class="px-5 py-3 d-inline-block success">{{isShowCopyDialog?'复制成功':'复制失败'}}</span></div>
  </v-dialog>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "Copy",
  computed: {
    ...mapGetters(["isShowCopyDialog","isShowCopyDialogState"]),
    successdialog: {
      get() {
        return this.isShowCopyDialog;
      },
      set(val) {
        this.$store.commit("ui/SET_IS_SHOW_COPY_DIALOG", val);
      },
    },
  }

}
</script>

<style scoped>

</style>