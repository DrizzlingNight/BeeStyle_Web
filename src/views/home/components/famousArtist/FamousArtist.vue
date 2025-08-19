<template>
  <div class="famous-artist-wrapper">
    <div class="content-wrapper">
      <p class="section-title mb-lg-15 mb-md-12 md-sm-10 mb-8">{{ $t('home.famousArtist.sectionTitle') }}</p>
      <div class="slide-wrapper">
        <v-btn v-show="focusedArtist !== 0 && artists.length >= 3" :ripple="false" @click="prevOnclick" text class="action-btn prev-btn">
          <v-img src="/static/ui/home/famousArtist/arrow.png" class="arrow-img"></v-img>
        </v-btn>
        <v-slide-group
          class="slide"
          center-active
          v-model="focusedArtist"
          :show-arrows="false"
        >
          <v-slide-item
            v-for="artist in artists"
            :key="artist.id"
          >
            <v-card
              class="artist-card d-flex flex-column mr-lg-12 mr-md-8 mr-sm-6 mr-4 pb-8"
            >
              <v-img class="artist-cover" cover :src="artist.cover"></v-img>
              <div class="artist-avatar" :class="{ 'verified': artist.isVerified }">
                <v-img class="artist-avatar-img rounded-circle" width="100%" height="100%"  :src="artist.avatar"></v-img>
              </div>
              <p class="artist-name text-center pt-lg-16 pt-md-12 pt-sm-10 pt-8 mb-lg-4">{{ artist.name }}</p>
              <p class="artist-description text-center">{{ artist.description }}</p>
            </v-card>
          </v-slide-item>
        </v-slide-group>
        <v-btn v-show="focusedArtist !== artists.length - 1 && artists.length >= 3" :ripple="false" @click="nextOnclick" text class="action-btn next-btn">
          <v-img src="/static/ui/home/famousArtist/arrow.png"></v-img>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FamousArtist',
  data() {
    return {
      focusedArtist: 0,
      artists: [
        {
          id: 1,
          cover: '/static/ui/home/famousArtist/art-0.png',
          name: 'LuLu Market',
          avatar: 'static/ui/home/famousArtist/artist_0.png',
          description: 'LULU Market是新一代的元宇宙基礎設施🥳，平台提供原材料種植游戲和其交易市場🤓🤓，用游戲生產真實可交付🚛的商品，打破次元壁👈，真正通過區塊鏈為實體經濟提供服務。',
          isVerified: true,
        },
        {
          id: 2,
          cover: '/static/ui/home/famousArtist/art-1.png',
          name: '淨耀法師',
          avatar: 'https://static.zhimingfoxue.com/templeimg/202201271551304lt0nl.jpg',
          description: '淨耀法師現為臺北慈法禪寺方丈。並且是臺北普賢講堂住持、臺中普賢講堂住持、花蓮東富禪寺住持、臺灣中國佛教會國際事務部主任委員。臺灣並且是中華國際供佛齋僧功德會主席。',
          isVerified: true,
        },
        {
          id: 3,
          cover: '/static/ui/home/famousArtist/art-2.png',
          name: '陳紹恭',
          avatar: 'https://static.zhimingfoxue.com/templeimg/20220217194818ekijyp.jpeg',
          description: '法名常定，號難忍，1964生於中國福建省福安。1979年在福建支提山華藏寺出家，1980年春到普陀山親近妙善老和尚，1980年冬經明晹大和尚推薦，得到中國佛教協會會長趙樸初居士的賞識，報考中國佛學院靈巖山分院，是改革開放後首屆佛學院畢業生，畢業後留校任教。從1985年開始在佛學院講授《遺教經》、《二課合解》、《大乘起信論》、《因明入正理論》、《心經》、《楞嚴經》《金剛經》等。',
          isVerified: false,
        },
        // {
        //   id: 3,
        //   cover: '/static/ui/home/famousArtist/art-3.png',
        //   name: 'Deadfella',
        //   avatar: '/static/ui/home/famousArtist/artist_3.png',
        //   description: '以太坊區塊鏈上的 10,000 個不死 NFT。Deadfella 帶來了實用性、社區和機會。加入部落。',
        //   isVerified: true,
        // },
        // {
        //   id: 4,
        //   cover: '/static/ui/home/famousArtist/art-4.png',
        //   name: 'Xb37_!',
        //   avatar: '/static/ui/home/famousArtist/artist_4.png',
        //   description: '對於身處網絡文化的年輕一代與遊戲愛好者來說，對來自於紐約的數位藝術家Xb37_!肯定不陌生，他的數位畫作創新前衛，往往令人側目，這是一種透過程式設計產生的隨機圖像，因此成為發燒友之間的追捧對象，不但在Instagram吸引300萬位追隨者，更與GUCCI和Nike等國際品牌，以及Kat Perkan和Child Gaston等網路明星展開備受注目的聯名合作',
        //   isVerified: false,
        // },
      ],
    }
  },
  methods: {
    prevOnclick() {
      if (this.focusedArtist !== 0) {
        this.focusedArtist --
      }
    },
    nextOnclick() {
      if (this.focusedArtist !== this.artists.length - 1) {
        this.focusedArtist ++
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.famous-artist-wrapper {
  position: relative;
  padding: 112px 216px 112px 216px;
  // background: var(--bg2);

  .content-wrapper {
    max-width: 1280px;
    margin: auto;

    .section-title {
      font-size: 40px;
    }
  
    .slide-wrapper {
      position: relative;

        .action-btn {
          position: absolute;
          top: 50%;
          transform: translate(0, -50%);
          z-index: 3;
          width: 45px;
          height: 60px;
      
          &.prev-btn {
            left: -100px;

            .arrow-img {
              transform: rotate(180deg);
              -webkit-transform: rotate(180deg);
            }
          }
          &.next-btn {
            right: -100PX;
          }
        }

      .slide {
        position: relative;
    
        .artist-card {
          width: 512px;
          border-radius: 35px;
          background: #ffffff;
          overflow: hidden;
    
          .artist-cover {
            width: 100%;
            max-height: 220px;
            border: none;
            background: #333333;
            border-radius: 0px;
          }
          .artist-avatar {
            position: absolute;
            width: 100px;
            height: 100px;
            top: 220px;
            left: 50%;
            border: 2px solid #ffffff;
            border-radius: 50%;
            transform: translate(-50%, -65%);
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.13);

            &.verified::after {
              content: '';
              display: block;
              background-image: url('/static/ui/home/famousArtist/tick.png');
              background-size: contain;
              background-position: center;
              background-repeat: no-repeat;
              width: 35%;
              height: 35%;
              position: absolute;
              bottom: -5%;
              right: -5%;
            }
          }
          .artist-name {
            font-size: 20px !important;
            font-family: 'TC-bold' !important;
            color: #000000;
          }
          .artist-description {
            font-size: 14px;
            color: #000000;
            max-width: 75%;
            line-height: 20px;
            margin: auto;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
            border-radius: 0px;
          }
        }
    
        ::v-deep .v-slide-group__prev,
        ::v-deep .v-slide-group__next {
          display: none !important;
        }
      }
    }
  }
}

@media screen and ( max-width: 1264px ) {
  .famous-artist-wrapper {
    padding: 100px 160px 100px 160px;

    .content-wrapper {

      .section-title {
        font-size: 36px;
      }
    
      .slide-wrapper {
          .action-btn {
            scale: .8;
        
            &.prev-btn {
              left: -80px;
            }
            &.next-btn {
              right: -80PX;
            }
          }

        .slide {
          
          .artist-card {
            width: 480px;
            border-radius: 35px;
      
            .artist-cover {
              max-height: 220px;
              height: 220px;
            }
            .artist-avatar {
              width: 100px;
              height: 100px;
              top: 220px;
            }
            .artist-name {
              font-size: 22px !important;
            }
            .artist-description {
              font-size: 14px;
              max-width: 320px;
              line-height: 18px;
            }
          }
        }
      }
    }
  }
}

@media screen and ( max-width: 960px ) {
  .famous-artist-wrapper {
    padding: 80px 120px 80px 120px;

    .content-wrapper {

      .section-title {
        font-size: 32px;
        text-align: center;
      }
    
      .slide-wrapper {
          .action-btn {
            scale: .6;
        
            &.prev-btn {
              left: -80px;
            }
            &.next-btn {
              right: -80PX;
            }
          }

        .slide {
          
          .artist-card {
            width: 320px;
            border-radius: 24px;
      
            .artist-cover {
              max-height: 160px;
              height: 160px;
            }
            .artist-avatar {
              width: 80px;
              height: 80px;
              top: 160px;
            }
            .artist-name {
              font-size: 20px !important;
            }
            .artist-description {
              font-size: 12px;
              max-width: 240px;
              line-height: 14px;
            }
          }
        }
      }
    }
  }
}

@media screen and ( max-width: 600px ) {
  .famous-artist-wrapper {
    padding: 60px 16px 60px 16px;

    .content-wrapper {

      .section-title {
        font-size: 28px;
      }
    
      .slide-wrapper {
          .action-btn {
            scale: .4;
            display: none;
          }

        .slide {
          .artist-card {
            width: calc(100vw - 20px) !important;
            max-width: 340px;
            border-radius: 20px;
      
            .artist-cover {
              max-height: 128px;
              height: 128px;
            }
            .artist-avatar {
              width: 60px;
              height: 60px;
              top: 128px;
            }
            .artist-name {
              font-size: 16px !important;
            }
            .artist-description {
              font-size: 12px;
              max-width: 240px;
              line-height: 14px;
            }
          }
        }
      }
    }
  }
}

</style>