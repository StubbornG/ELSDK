<template>
    <el-drawer
    v-model="isShow"
    direction="rtl"
    :destroy-on-close="true"
    :size="550">
    <template #header>
        <h3 class="title">{{ title }}</h3>
    </template>
    <template #default>
        <schema-form ref="schemaFormRef" v-loading="loading" :schema="components[name]?.schema" :model="dtoModel"></schema-form>
    </template>
    <template #footer>
        <el-button type="primary" @click="save">
            {{ saveBtnText }}
        </el-button>
    </template>
    </el-drawer>
</template>

<script setup>
import { ref, inject } from 'vue';
import { ElNotification } from 'element-plus';
import $curl from '$common/curl.js';
import SchemaForm from '$widgets/schema-form/schema-form.vue';


const {
    api,
    components
} = inject('schemaViewData');

const emit = defineEmits(['command']);

const schemaFormRef = ref(null);
const loading = ref(false);
const title = ref('');
const saveBtnText = ref('');    
const mainKey = ref('');
const mainValue = ref('');
const dtoModel = ref({});
const name = ref('editForm');

const isShow = ref(false);

const show = (rowData) => {
    const { config } = components.value[name.value];

    title.value = config.title;
    saveBtnText.value = config.saveBtnText;
    mainKey.value = config.mainKey;
    mainValue.value = rowData[mainKey.value];
    dtoModel.value = {};

    isShow.value = true;

    fetchFormData()
}

const fetchFormData = async() => {
    if (loading.value) { return; }
    loading.value = true;
    const res = await $curl({
        method: 'get',
        url: api.value,
        query: {
            [mainKey.value]: mainValue.value
        }
    });

    loading.value = false;

    if (!res || !res.success || !res.data) {
        return;
    }

    dtoModel.value = res.data;
}

defineExpose({
    name,
    show
})

const save = async() => {
    if (loading.value) { return; }
    if (!schemaFormRef.value.validate()) {
        return;
    }

    loading.value = true;

    const res = await $curl({
        method: 'put',
        url: api.value,
        data: {
            ...schemaFormRef.value.getValue()
        }
    });


    loading.value = false;

    if (!res || !res.success) {
        return;
    }

    ElNotification({
        title: "修改成功",
        message: "修改成功",
        type: "success"
    });

    close();

    emit('command', {
        event: 'loadTableData'
    });
}

const close = () => {
    isShow.value = false;
}
</script>

<style lang="less" scoped></style>