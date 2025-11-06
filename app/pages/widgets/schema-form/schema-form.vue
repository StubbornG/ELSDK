<template>
<el-row v-if="schema && schema.properties" class="schema-form">
    <template v-for="(itemSchema, key) in schema.properties">
        <component
        v-show="itemSchema.option.visiable !== false"
        ref="formComList"
        :is="FormItemConfig[itemSchema.option?.comType]?.component" 
        :schema-key="key" 
        :schema="itemSchema"
        :model="model ? model[key] : undefined" />
    </template>
</el-row>
</template>

<script setup>
import { ref, provide, toRefs }  from 'vue';
import FormItemConfig from './form-item-config.js';

const Ajv = require('ajv');
const ajv = new Ajv();
provide('ajv', ajv);


const props = defineProps({
    /**
     * { // 模板数据结构
        type: 'object',
        properties: {
            key: {
                ...schema, // 标准 schema 配置
                type: '', // 字符类型
                label: '', // 字段中文名
                // 字段在不同动态 comPonent 中的相关配置，前缀对应 componentConfig 中的键值
                // 如： componentConfig.createForm, 这里对应 createFormOption
                // 字段在 createForm 中相关配置
                option: {
                    ...eleComponentConfig, // 标准 el-component 配置
                    comType: '', // 配置组件类型 input/select/......
                    required: false, // 表单是否必填， 默认为 false
                    visiable: true, // 默认为 true (false，标识不在表单中显示)
                    disabled: false, // 默认为 false (true，标识在表单中禁用)
                    default: '', // 默认值

                    // compType === 'select' 时生效
                    enumList: [] // 下拉框可选项
                }
                // ..支持用户动态扩展
            },
            ...
        },
    }
     * 
     * **/
    schema: Object,

    /**
     * 表单数据
    */
    model: Object,
})
const { schema } = toRefs(props);

const formComList = ref([]);

// 表单校验
const validate = () => {
    return formComList.value.every(component => component.validate());
}

// 获取表单值
const getValue = () => {
    return formComList.value.reduce((dtoObj, component) => {
        return {
            ...dtoObj,
            ...component.getValue()
        };
    }, {});
}

defineExpose({
    validate,
    getValue
})
</script>

<style lang="less">
.schema-form {
    .form-item {
        margin-bottom: 20px;
        min-width: 500px;

        .item-label {
            margin-right: 10px;
            min-width: 70px;
            text-align: right;
            font-size: 14px;
            color: #ffffff;
            word-break: break-all;

            .required {
                top: 2px;
                padding-left: 4px;
                color: #f56c6c;
                font-size: 20px;
            }
        }
        .item-value {
            .component {
                width: 320px;
            }
            .valid-border {
                .el-input__inner {
                    border: 1px solid #F93F3F;
                    box-shadow: 0 0 0 0;
                }
            }
        }
        .valid-tips {
            margin-left: 10px;
            height: 36px;
            line-height: 36px;
            overflow: hidden;
            font-size: 12px;
            color: #F93F3F;
        }
    }
}
</style>
