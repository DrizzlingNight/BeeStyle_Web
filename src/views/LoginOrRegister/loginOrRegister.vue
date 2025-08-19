<template>
  <v-dialog v-model="loginOrRegisterDialog" width="542px" @keydown.esc="clickDialogOutside" @click:outside="clickDialogOutside" content-class="dialog-wrapper">
    <login v-if="login" @closeDialog="closeDialog" @showPassword="showPassword" @showRegister="showRegister"></login>
    <register v-if="register" @closeDialog="closeDialog" @showLogin="showLogin"></register>
    <password v-if="password" @closeDialog="closeDialog" @showLogin="showLogin"></password>
  </v-dialog>
</template>

<script>
import Login from "./components/Login";
import Register from "./components/Register";
import Password from "./components/Password";
import {mapGetters} from "vuex";

export default {
  name: "loginOrRegister",
  components: {Password, Register, Login},
  data: () => ({
    // login: false,
    // register: false,
    password: false,

  }),
  computed: {
    ...mapGetters(["isShowLoginDialog","isRegisterDialog"]),
    loginOrRegisterDialog: {
      get() {
        return this.login || this.register || this.password
      },
      set() {}
    },
    login: {
      get() {
        return this.isShowLoginDialog;
      },
      set(val) {
        this.$store.commit("ui/SET_IS_SHOW_LOGIN_DIALOG", val);
      },
    },
    register: {
      get() {
        return this.isRegisterDialog;
      },
      set(val) {
        this.$store.commit("ui/SET_IS_REGISTER_DIALOG", val);
      },
    },
  },
  methods:{
    //全部关闭
    closeDialog() {
      this.$store.commit("ui/SET_IS_SHOW_LOGIN_DIALOG", false);
      this.login = false
      this.register = false
      this.password = false
    },
    clickDialogOutside() {
      this.password = false
      this.$store.commit("ui/SET_IS_SHOW_LOGIN_DIALOG", false);
      this.$store.commit("ui/SET_IS_REGISTER_DIALOG", false);
    },
    showPassword() {
      this.login = false
      this.register = false
      this.password = true
    },
    showRegister() {
      this.login = false
      this.register = true
      this.password = false
    },
    showLogin() {
      this.login = true
      this.register = false
      this.password = false
    }
  }

}
</script>

<style lang="scss">

.dialog-wrapper.v-dialog {
  border-radius: 48px !important;
  z-index: 10;
}

::v-deep .v-dialog__content--active {

  .v-dialog {
    border-radius: 50px !important;
  }
}


</style>