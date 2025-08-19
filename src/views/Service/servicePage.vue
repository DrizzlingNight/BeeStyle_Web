<template>
  <v-dialog v-model="servicePage" width="1192px" @click:outside="close">
    <v-card
        class="mx-auto list"
        max-width="1192"
        height="80vh"
        color="rgba(24, 26, 28, 1)"
        style="z-index: 100;border-radius: 4px;"
        z-index="100"
    >
      <div class="text-right">
        <v-card-subtitle
            class="d-inline-block pt-5"
            @click="close"
            style="cursor: pointer;"
        >
          <v-img
              max-height="14"
              max-width="14"
              src="@/assets/fake/close.png"
          ></v-img>
        </v-card-subtitle>
      </div>
      <v-card flat class="list mt-7" color="rgba(24, 26, 28, 1)" style="overflow-y: auto;">
        <div class="px-16 mb-16 text-justify" v-html="$t('privacy')" style="line-height: 2em;"></div>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "servicePage",
  data: () => ({}),

  computed: {
    ...mapGetters(["config", "isServicePageDialog"]),
    servicePage: {
      get() {
        return this.isServicePageDialog;
      },
      set(val) {
        this.$store.commit("ui/SET_IS_SERVICE_PAGE_DIALOG", val);
      },
    },
  },
  methods: {
    close() {
      this.$store.commit("ui/SET_IS_SERVICE_PAGE_DIALOG", false);
    },
  }
}
</script>

<style scoped>

</style>