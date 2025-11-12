<template>
    <el-config-provider :locale="zhCn">
        <header-view :proj-name="projName" @menu-select="onMenuSelect">
            <template #main-content>
                <router-view></router-view>
            </template>
        </header-view>
    </el-config-provider>
</template>
<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import HeaderView from './complex-view/header-vieww/header-view.vue';
import $curl from '$elpisCommon/curl.js';
import { useProjectStore } from '$elpisStore/project.js';
import { useMenuStore } from '$elpisStore/menu.js';

const router = useRouter();
const route = useRoute();
const projectStore = useProjectStore();
const menuStore = useMenuStore();

// 使用computed来安全地获取路由查询参数
const routeQueryKey = computed(() => route?.query?.key || '');
const routeQueryProjKey = computed(() => route?.query?.proj_key || '');

// 监听路由变化，当路由准备好时执行初始化
watch(() => route?.query, (newQuery) => {
    if (newQuery !== undefined) {
        getProjectList();
        getProjectConfig();
    }
});

onMounted(() => {
    getProjectList();
    getProjectConfig();
});


const projName = ref('');

// 请求 /api/project/list 接口, 并缓存到 project-store 中
async function getProjectList() {
    const projKey = route?.query?.proj_key || '';
    if (!projKey) { return; }
    const res = await $curl({
        method: 'get',
        url: '/api/project/list',
        query: {
            // 动态获取项目key
            proj_key: projKey
        }
    });

    if (!res || !res.success || !res.data) {
        return;
    }

    projectStore.setProjectList(res.data);
}

// 请求 /api/project 接口, 并缓存到 menu-store 中
async function getProjectConfig() {
    const projKey = route?.query?.proj_key || '';
    if (!projKey) {
        return;
    }
    const res = await $curl({
        method: 'get',
        url: '/api/project',
        query: {
            // 动态获取项目key
            proj_key: projKey
        }
    });

    if (!res || !res.success || !res.data) {
        return;
    }

    const { name, menu } = res.data;
    projName.value = name;
    menuStore.setMenuList(menu);
}

// 点击菜单回调
const onMenuSelect = function(menuItem) {
    const { moduleType, key, customConfig } = menuItem;

    // 如果是当前页面，不处理
    if (key === routeQueryKey.value) { return; }

    const pathMap = {
        sider: '/sider',
        iframe: '/iframe',
        schema: '/schema',
        custom: customConfig?.path
    }

    router.push({
        path: `/view/dashboard${pathMap[moduleType]}`,
        query: {
            key,
            proj_key: routeQueryProjKey.value
        }
    })
}
</script>

<style  lang="less" scoped>
:deep(.el-main) {
    padding: 0;
}
</style>