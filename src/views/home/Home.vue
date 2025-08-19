<template>
  <v-container fluid class="homepage-wrapper pa-0">
    <Carousel />
    <FamousArtist />
    <!-- <Albums /> -->
    <!-- <Activities /> -->
    <Selects />
    <!-- <StoryBanner /> -->
    <Intro />
    <Explore />
  </v-container>
</template>
<script>

import Carousel from './components/carousel/Carousel.vue'
import FamousArtist from './components/famousArtist/FamousArtist.vue'
// import Albums from './components/albums/Albums.vue'
// import Activities from './components/activities/Activities.vue'
import Selects from './components/selects/Selects.vue'
// import StoryBanner from './components/storyBanner/StoryBanner.vue'
import Intro from './components/intro/Intro.vue'
import Explore from './components/explore/Explore.vue'

export default {
  name: "Home",
  components: {
    Carousel,
    FamousArtist,
    // Albums,
    // Activities,
    Selects,
    // StoryBanner,
    Intro,
    Explore
  },

}
</script>

<style lang="scss" scoped>
</style>
