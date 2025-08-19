import Vue from 'vue'
import VueRouter from 'vue-router'

// 首頁
const Home = () => import('@/views/home/Home')

// NFT 鑄造頁
const CreateNft = () => import('@/views/createNft/CreateNft')

// NFT 轉移頁
const TransferNft = () => import('@/views/TransferNft/transfernft')

// NFT 詳情頁
const Nft = () => import('@/views/nft/Nft')

// 交易市場
const Explore = () => import('@/views/explore/Explore')

// 用戶頁面
const User = () => import('@/views/user/User')

// NFT 上架頁
const Listed = () => import('@/views/Listed/listed')



Vue.use(VueRouter)

const routes = [
    // 首頁
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    // 交易市場
    {
        path: '/explore',
        name: 'explore',
        component: Explore
    },
    // 創建 NFT
    {
        path: '/create_nft',
        name: 'createNft',
        component: CreateNft,
        meta: {requireAuth : true}
    },
    // NFT 詳情頁
    {
        path: '/nft/:id',
        name: 'nft',
        component: Nft,
    },
    // nft 轉讓頁
    {
        path: '/transfernft/:id',
        name: 'transfernft',
        component: TransferNft
    },
    // 使用者個人頁
    {
        path: '/user/:id/',
        name: 'user',
        component: User,
    },
    // nft 上架頁
    {
        path: '/sell/:id',
        name: 'listed',
        component: Listed
    },
]

const createRouter = () =>
    new VueRouter({
        mode: 'history',
        scrollBehavior(to, from, savedPosition) {
            if (savedPosition) {
                return savedPosition
            } else {
                return { y: 0 }
            }
        },
        routes,
    })

const router = createRouter()

const VueRouterPush = VueRouter.prototype.push

VueRouter.prototype.push = function push (to) {
    return VueRouterPush.call(this, to).catch(err => err)
}
export default router
