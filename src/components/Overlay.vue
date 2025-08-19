<template>
  <v-overlay opacity="0.6" z-index="10" color="#ffffff" :value="loading">
    <div class="loading-wrapper w-100 d-flex flex-column align-center">
      <!-- <v-img class="loading-image mb-2" src="@/assets/fake/loading/loading.svg"></v-img> -->
      <p class="loading-text mb-10">Loading...</p>
      <v-progress-linear
        indeterminate
        color="primary"
        rounded
        class="loading-progress"
      ></v-progress-linear>
    </div>
  </v-overlay>
</template>

<script>
export default {
  name: "Overlay",
  props:["loading"]
}
</script>

<style lang="scss" scoped>

.loading-wrapper {
  width: 100vw;

  .loading-text {
    font-size: var(--text-title);
  }

  .loading-progress {
    width: 30%;
  }
  
  .loading-image {
    width: 112px;
    height: 112px;
    background-image: url('./../assets/fake/loading/loading.svg');
    background-repeat: no-repeat;
    background-size: contain;
    animation: rotate 1s infinite linear;
    margin-bottom: 90px;
  }
}


@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}

</style>