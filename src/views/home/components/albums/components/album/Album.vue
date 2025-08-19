<template>
  <div class="album d-flex flex-column">
    <v-img :src="albumData.cover" width="100%" class="album-cover rounded mb-7"></v-img>
    <p class="album-name mb-3">{{ albumData.name }}</p>
    <div class="album-info d-flex justify-space-between">
      <span class="album-amount mb-2 mb-lg-0">{{ albumData.amount }}{{ $t('home.albums.album.amount') }}</span>
      <p class="author-info d-flex align-center mb-0">
        <v-img max-width="20" height="20" :src="albumData.authorAvatar" class="author-avatar rounded-circle mr-1"></v-img>
        <span class="author-name">{{ albumData.authorName }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Album',
  props: {
    albumData: {
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

.album {
  // border: 1px solid rgba($color: #ffffff, $alpha: .2);
  width: 30%;
  max-width: 388px;

  .album-name {
    font-size: 20px;
    max-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .album-amount {
    font-size: 16px;
  }

  .author-info {

    .author-avatar {
      border: 1px solid #ffffff;
    }

    .author-name {
      font-size: 14px;
    }
  }
}

@media screen and (max-width: 1264px) {
  .album-info {
    flex-direction: column;
  }
}

@media screen and (max-width: 960px) {
  .album {
    width: 100%;
    margin: auto;

    .album-info {
      flex-direction: row;
    }
  }
  
}

@media screen and (max-width: 600px) {
  
}

</style>