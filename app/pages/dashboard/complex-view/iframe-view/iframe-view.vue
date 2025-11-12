<template>
 <iframe :src="path" class="iframe"></iframe>
</template>

<script setup>
import { ref, watch, onMounted  } from 'vue';
import { useRoute } from 'vue-router';
import { useMenuStore } from '$elpisStore/menu.js';

const route = useRoute();
const path = ref('');
const menuStore = useMenuStore();
const setPath = function() {
    const { key, sider_key: siderKey } = route.query;
    const menuItem = menuStore.findMenuItem({
        key: "key",
        value: siderKey ?? key
    });
    path.value = menuItem?.iframeConfig?.path ?? '';
}

watch([
    () => route.query.key,
    () => route.query.sider_key,
    () => menuStore.menuList,
], () => {
    setPath();
}, { deep: true })


</script>

<style lang="less" scoped>
.iframe {
    width: 100%;
    height: 100%;
}
</style>