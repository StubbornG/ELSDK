import createForm from './create-form/create-form.vue';
import editForm from './edit-form/edit-form.vue';

// 业务扩展 component 配置
import BusinessComponentConfig from '$businessComponentConfig';


const ComponentConfig = {
    createForm: {
        component: createForm,
    },
    editForm: {
        component: editForm,
    }
}

export default {
    ...ComponentConfig,
   ...BusinessComponentConfig
};