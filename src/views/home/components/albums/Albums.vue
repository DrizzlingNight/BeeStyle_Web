<template>
  <div class="albums-container-wrapper">
    <div class="content-wrapper">
      <p class="section-title mb-lg-15 mb-md-12 md-sm-10 mb-8">{{ $t('home.albums.sectionTitle') }}</p>
      <div class="albums-wrapper d-flex justify-space-between">
        <Album v-for="album in albums" :key="album.id" :album-data="album" />
      </div>
    </div>
  </div>
</template>

<script>
import Album from './components/album/Album.vue'

export default {
  name: 'FamousArtist',
  components: {
    Album
  },
  data() {
    return {
      albums: [
        {
          id: 1,
          cover: '/static/ui/home/albums/collection_1.png',
          name: 'LuLu Market Collections Vol.1',
          authorAvatar: '/static/ui/home/albums/artist_1.png',
          authorName: 'LuLu Games',
          amount: 12,
        },
        {
          id: 2,
          cover: '/static/ui/home/albums/collection_2.png',
          name: '福.來自一顆懂得布施的心',
          authorAvatar: '/static/ui/home/albums/artist_2.png',
          authorName: 'buk234ss',
          amount: 7,
        },
        {
          id: 3,
          cover: '/static/ui/home/albums/collection_3_1.png',
          name: 'Beefi Game Selects',
          authorAvatar: '/static/ui/home/albums/artist_3.png',
          authorName: 'fk43l',
          amount: 6,
        },
      ],
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>

.albums-container-wrapper {
  position: relative;
  padding: 112px 216px 112px 216px;
  background: var(--bg2);

  .content-wrapper {
    max-width: 1280px;
    margin: auto;

    .section-title {
      font-size: 40px;
    }
  }
}

@media screen and ( max-width: 1264px ) {
  .albums-container-wrapper {
    padding: 100px 160px 100px 160px;

    .content-wrapper {
      .section-title {
        font-size: 36px;
      }
    }
  }
}

@media screen and ( max-width: 960px ) {
  .albums-container-wrapper {
    padding: 80px 120px 80px 120px;

    .content-wrapper {
      .section-title {
        font-size: 32px;
        text-align: center;
      }

      .albums-wrapper {
        flex-direction: column;
        gap: 100px;
      }
    }
  }
}

@media screen and ( max-width: 600px ) {
  .albums-container-wrapper {
    padding: 60px 16px 60px 16px;

    .content-wrapper {
      .section-title {
        font-size: 28px;
      }

      .albums-wrapper {
        gap: 60px;
      }
    }
  }
}

</style>