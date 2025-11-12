<template>
   <sider-container>
    <template #menu-content>
        <el-menu
            :default-active="activeKey"
            :ellipsis="false"
            @select="onMenuSelect"
            >
            <template :key="item.key" v-for="item in menuList">
                <!-- group -->
                 <sub-menu
                    v-if="item.subMenu && item.subMenu.length > 0"
                    :menu-item="item">
                </sub-menu>
                <el-menu-item v-else :index="item.key">
                    {{ item.name }}
                </el-menu-item>
                 <!-- module -->
            </template> 
        </el-menu>
    </template>
    <template #main-content>
       <router-view></router-view>
    </template>
   </sider-container>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMenuStore } from '$elpisStore/menu.js';
import SiderContainer from '$elpisWidgets/sider-container/sider-container.vue';
import SubMenu from './complex-view/sub-menu/sub-menu.vue';

const router = new useRouter();
const route = useRoute();
const menuStore = useMenuStore();

const activeKey = ref('');
const menuList = ref([]);

const setActiveKey = function() {
    let siderMenuItem = menuStore.findMenuItem({
        key: "key",
        value: route.query.sider_key
    });

    // 如果首次加载 sider-view, 用户未选中左侧菜单，需要默认选中第一个
    if (!siderMenuItem) {
        const hMenuItem = menuStore.findMenuItem({
            key: "key",
            value: route.query.key
        });
        if (hMenuItem && hMenuItem.siderConfig && hMenuItem.siderConfig.menu) {
            const siderMenuList = hMenuItem?.siderConfig?.menu;
            siderMenuItem = menuStore.findFirstMenuItem(siderMenuList); // 找到第一个菜单
            if (siderMenuItem) {
                handleMenuSelect(siderMenuItem.key);
            }
        }
    }
    activeKey.value = siderMenuItem?.key;
}

const setMenuList = function() {
    const menuItem = menuStore.findMenuItem({
        key: "key",
        value: route.query.key
    });
    if (menuItem && menuItem.siderConfig && menuItem.siderConfig.menu) {
        menuList.value = menuItem?.siderConfig?.menu;
    }

}

watch(() => route.query.key, () => {
    setMenuList();
    setActiveKey();
}, { deep: true })

watch(() => menuStore.menuList, () => {
    setMenuList();
    setActiveKey();
}, { deep: true })

onMounted(() => {
    setMenuList();
    setActiveKey();
})

const onMenuSelect = function(menuKey) {
    handleMenuSelect(menuKey);
}

const handleMenuSelect = function(menuKey) {

    const menuItem = menuStore.findMenuItem({
        key: "key",
        value: menuKey
    });
    
    const { moduleType, key, customConfig } = menuItem;

    // 如果是当前页面，不处理
    if (key == route.query.sider_key) { return; }

    const patMap = {
        iframe: '/iframe',
        custom: customConfig?.path,
        schema: '/schema',
    }

    router.push({
        path: `/view/dashboard/sider${patMap[moduleType]}`,
        query:{
            key: route.query.key,
            sider_key: menuKey,
            proj_key: route.query.proj_key
        }
    })
}


</script>
<style lang="less" scoped></style>