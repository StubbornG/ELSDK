const model = require('../../model/index.js');

module.exports = (app) => {
    const BaseService = require('./base')(app);
    const modelList = require('../../model/index.js')(app);
    return class ProjectService extends BaseService {

        /**
         * 根据 proj_key 获取项目配置
        */
        get(projKey) {
            let projConfg;

            modelList.forEach(modelItem => {
               if (modelItem.project[projKey]) {
                projConfg = modelItem.project[projKey];
               }
            });

            return projConfg;
        }

        /**
         *获取统一模型下的项目列表（如果无 projKey, 全量获取）
        */
        getList({ projKey }) {
            const projectList = modelList.reduce((preList, modeItem) => {
                const { project } = modeItem;
                // 如果有穿 projKey, 则只取当前模型下的项目，不传的情况下则取全量
                if (projKey && !project[projKey]) {
                    return preList;
                }

                for(const pKey in project) {
                    preList.push(project[pKey]);
                }

                return preList;
            }, []);
            return projectList;

        }
        /**
         * 获取所有模型与项目的结构化数据
        */
        async getModelList() {
            return modelList;
        }
    }
}