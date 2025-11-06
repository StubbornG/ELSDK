{
    mode: 'dashboard', // 模版类型，不同模版类型对应不一样的模版数据结构
    name: '', // 名称
    desc: '', // 描述
    icon: '', // icon
    homePage: '', // 首页（项目配置）
    // 头部菜单
    menu: [{
        key: '', // 菜单唯一描述
        name: '', // 菜单名称
        menuType: '', // 枚举值， group / module

        // 当 menuType = gruop 时，可填
        subMenu: [{
            // 可递归menuItem
        }, ...],

        // 当 menuType = module 时，可填
        moduleType: '', // 枚举值： sider/ iframe / custom/ schema
        // 当 moduleType = sider 时
        siderConfig: {
            menu: [{
                // 可递归menuItem(除moduleType = sider 外)
            }],
        },

        // 当 moduleType = iframe 时
        iframeConfig: {
            path: '', // iframe路径
        },

        // 当 moduleType = custom 时
        customConfig: {
            path: '', // 自定义路由路径
        },

        // 当 moduleType = schema 时
        schemaConfig: {
            api: '', // 数据源API(遵循 RESTFULL 规范)
            schema: { // 模板数据结构
                type: 'object',
                properties: {
                    key: {
                        ...schema, // 标准 schema 配置
                        type: '', // 字符类型
                        label: '', // 字段中文名
                        // 字段在  table 中的相关配置
                        tableOption: {
                            ...elTableColumnConfig //标准 el-table-column 配置
                            toFixed: 0, // 小数点后保留位数
                            visiable: true, // 默认为 true (false时，表示不在表单中显示)
                        },
                        // 字段在  search-bar 中的相关配置
                        searchOption: {
                            ...elComponentConfig //标准 el-component-bar 配置
                            comType: '', // 配置组件类型 input/select/......
                            default: '', // 默认值
                            enumList: [], // 下拉框可选项

                            // 当 comType = dynamic 时
                            api: ''
                        },
                        // 字段在不同动态 comPonent 中的相关配置，前缀对应 componentConfig 中的键值
                        // 如： componentConfig.createForm, 这里对应 createFormOption
                        // 字段在 createForm 中相关配置
                        createFormOption: {
                            ...eleComponentConfig, // 标准 el-component 配置
                            comType: '', // 配置组件类型 input/select/......
                            visiable: true, // 默认为 true (false，标识不在表单中显示)
                            disabled: false, // 默认为 false (true，标识在表单中禁用)
                            default: '', // 默认值

                            // compType === 'select' 时生效
                            enumList: [] // 下拉框可选项
                        },
                        // 字段在 editForm 中相关配置
                        editFormOption: {
                            ...eleComponentConfig, // 标准 el-component 配置
                            comType: '', // 配置组件类型 input/select/......
                            visiable: true, // 默认为 true (false，标识不在表单中显示)
                            disabled: false, // 默认为 false (true，标识在表单中禁用)
                            default: '', // 默认值

                            // compType === 'select' 时生效
                            enumList: [] // 下拉框可选项
                        }
                        // ..支持用户动态扩展
                    },
                    ...
                }
            },
            // table 相关配置
            tableConfig: {
                headerButtons: [{
                    label: '', // 按钮中文名
                    eventKey: '', // 按钮事件名
                    // 按钮事件具体配置
                    eventOption: {
                        // 当 eventKey === 'showComponent'
                        comName: '', // 组件名称
                    },
                    ...elButtonConfig, // 标准 el-button 配置
                }, ...],
                rowButtons: [{
                    label: '', // 按钮中文名
                    eventKey: '', // 按钮事件名
                    eventOption: {
                        // 当 eventKey === 'showComponent'
                        comName: '', // 组件名称
                        
                        // 当 eventKey === 'remove'
                        params:{
                            // paramsKey = 参数键值
                            // rowValueKey = 参数值（当格式为 schema: xxx 的时候，到 table 中找相应的字段）
                            paramsKey: rowValueKey,
                        }
                    }, // 按钮事件具体配置
                    ...elButtonConfig, // 标准 el-button 配置  
                }, ...]
            }, // table 相关配置
            searchConfig: {}, // search-bar 相关配置
            // 动态组件 相关配置
            componentConfig: {
                // create-form 表单相关配置
                createForm: {
                    title: '', // 表单标题
                    saveBtnText: '', // 保存按钮文本
                },
                // ..editForm 表单相关配置
                editForm: {
                    mainKey: '', // 表单主键，用于唯一标识要修改的数据对象
                    title: '', // 表单标题
                    saveBtnText: '', // 保存按钮文本
                }
                // ..支持用户动态扩展
            }
        }
    }, ...]
    
} 