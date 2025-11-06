<template>
    <el-form
    v-if="schema && schema.properties"
    inline
    class="schema-search-bar">
    <!-- 动态组件 -->
     <el-form-item
        v-for="(schemaItem, key) in schema.properties"
        :key="key"
        :label="schemaItem.label">
        <!-- 展示子组件 -->
         <component
         :ref="searchComList"
         :is="SearchItemConfig[schemaItem.option?.comType]?.component"
         :schema-key="key"
         :schema="schemaItem"
         @loaded="handleChildLoaded"></component>
    </el-form-item>

    <!-- 操作区域 -->
     <el-form-item>
        <el-button
         type="primary"
         plain
         class="search-btn"
         @click="search">
         搜索</el-button>
        <el-button
         plain
         class="reset-btn"
        @click="reset">
        重置
        </el-button>
     </el-form-item>
</el-form>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import SearchItemConfig from './search-item-config.js';

const props = defineProps({
    /**
     * schema 配置，结构如下：
     * {
        type: 'object',
            properties: {
                key: {
                    ...schema, // 标准 schema 配置
                    type: '', // 字符类型
                    label: '', // 字段中文名
                    // 字段在  search-bar 中的相关配置
                    option: {
                        ...elComponentConfig //标准 el-component-bar 配置
                        comType: '', // 配置组件类型 input/select/......
                        default: '', // 默认值
                    }
                },
                ...
            }
     }
    */
    schema: Object,
});
const { schema } = toRefs(props);

const emit = defineEmits(['load', 'search', 'reset']);

const searchComList = ref([]);

const getValue = () => {
    let dtoObj = {};
    searchComList.value.forEach(component => {
        dtoObj = {
            ...dtoObj,
            ...component?.getValue()
        }
    })
    return dtoObj;
}

let childComLoadCount = 0
const handleChildLoaded = (value) => {
    childComLoadCount++;
    if (childComLoadCount >= Object.keys(schema?.value?.properties).length) {
        emit('load', getValue());
    }
}

const search = () => {
    emit('search', getValue());
}

const reset = () => {
    searchComList.value.forEach(component => {
        component?.reset();
    })
    emit('reset');
}

defineExpose({
    reset,
    getValue
})

</script>

<style lang="less" scoped>
.schema-search-bar {
    min-width: 500px;
    .input {
        width: 180px;
    }
    .select {
        width: 180px;
    }
    .dynamic-select {
        width: 180px;
    }
    .search-btn {
        width: 100px;
    }
    .reset-btn {
        width: 100px;
    }
}
</style>