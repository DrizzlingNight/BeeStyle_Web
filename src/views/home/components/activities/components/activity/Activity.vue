<template>
  <div class="activity d-flex flex-column">
    <v-img :src="activityData.cover" width="100%" class="album-cover rounded mb-7"></v-img>
    <div class="activity-title d-flex align-center justify-space-between mb-2">
      <p class="activity-name">{{ activityData.name }}</p>
      <p class="tags d-flex">
        <v-img height="16" contain v-if="activityData.isPopular" src="./imgs/fire_icon.png"></v-img>
        <v-img height="16" contain v-if="activityData.isNew" src="./imgs/new_icon.png"></v-img>
      </p>
    </div>
    <p class="activity-description">{{ activityData.description }}</p>
  </div>
</template>

<script>
export default {
  name: 'Activity',
  props: {
    activityData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>

.activity {
  // border: 1px solid rgba($color: #ffffff, $alpha: .2);
  width: 20%;
  max-width: 388px;

  .activity-name {
    font-size: 20px;
    max-height: 60px;
    max-width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tags {
    gap: 4px;
  }

  .activity-description {
    font-size: 14px;
    height: 64px;
    max-height: 64px;
    max-width: 100%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;

  }
}

@media screen and (max-width: 1264px) {
  .activity {
    width: 40%;
  }
}

@media screen and (max-width: 960px) {
  .activity {
    width: 100%;
    margin: auto;
  }
  
}

@media screen and (max-width: 600px) {
  
}

</style>