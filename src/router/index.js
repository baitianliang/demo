import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: '主页',
        component: () => import('../views/home.vue'),
        meta: {
            hidden: true
        }
    },
    {
        path: '/sexFlyChess',
        name: '情侣自走棋',
        component: () => import('../views/sexFlyChess.vue')
    },
    {
        path: '/markdown',
        name: 'markdown编辑器',
        component: () => import('../views/markdown.vue')
    },
    {
        path: '/jsonEditor',
        name: 'JSON格式化',
        component: () => import('../views/jsonEditor.vue')
    },
    {
        path: '/colorConverter',
        name: '颜色转换器',
        component: () => import('../views/colorConverter.vue')
    },
    {
        path: '/QRCodeGenerator',
        name: '二维码生成器',
        component: () => import('../views/qrCodeGenerator.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})

export default router