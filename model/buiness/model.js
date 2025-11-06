const { renderToWebStream } = require("vue/server-renderer");

module.exports = {
    model: 'dashboard',
    name: '电商系统',
    menu: [
        {
            key: 'product',
            name: '商品管理',
            menuType: 'module',
            moduleType: 'schema',
            schemaConfig: {
                api: '/api/proj/product',
                schema: {
                    type: 'object',
                    properties: {
                        product_id: {
                            type: 'string',
                            label: '商品ID',
                            tableOption: {
                                width: 300,
                                'show-overflow-tooltip': true
                            },
                            editFormOption: {
                                comType: 'input',
                                disabled: true,
                            }
                        },
                        product_name: {
                            type: 'string',
                            label: '商品名称',
                            tableOption: {
                                width: 200
                            },
                            searchOption: {
                                comType: 'dynamicSelect',
                                api: '/api/proj/product_enum/list'
                            },
                            createFormOption: {
                                comType: 'input',
                                required: true,
                                default: '哲玄新课程',
                            },
                            editFormOption: {
                                comType: 'input'
                            }
                        },
                        price: {
                            type: 'number',
                            label: '商品价格',
                            tableOption: {
                                width: 200
                            },
                            searchOption: {
                                comType: 'select',
                                enumList: [
                                    {
                                        value: 39.9,
                                        label: '￥39.9'
                                    },
                                    {
                                       value: 199,
                                        label: '￥199'
                                    },
                                    {
                                        value: 1999,
                                        label: '￥1999'
                                    }
                                ]
                            },
                            createFormOption: {
                                comType: 'inputNumber'
                            },
                            editFormOption: {
                                comType: 'inputNumber'
                            }
                        },
                        inventory: {
                            type: 'number',
                            label: '库存',
                            tableOption: {
                                width: 200
                            },
                            searchOption: {
                                comType: 'input'
                            },
                            createFormOption: {
                                comType: 'select',
                                enumList: [{
                                    label: '100',
                                    value: 100
                                }, {
                                    label: '200',
                                    value: 200
                                }, {
                                    label: '300',
                                    value: 300
                                }, {
                                    label: '400',
                                    value: 400
                                }, {
                                    label: '500',
                                    value: 500
                                }]
                            },
                            editFormOption: {
                                comType: 'select',
                                enumList: [{
                                    label: '100',
                                    value: 100
                                }, {
                                    label: '200',
                                    value: 200
                                }, {
                                    label: '300',
                                    value: 300
                                }, {
                                    label: '400',
                                    value: 400
                                }, {
                                    label: '500',
                                    value: 500
                                }]
                            }
                        },
                        create_time: {
                            type: 'string',
                            label: '创建时间',
                            tableOption: {},
                            searchOption: {
                                comType: 'dateRange'
                            }
                        }
                        }
                    },
                    tableConfig: {
                        headerButtons: [
                            {
                                label: '新增商品',
                                eventKey: 'showComponent',
                                eventOption: {
                                    comName: 'createForm'
                                },
                                type: 'primary',
                                plain: true
                            }
                        ],
                        rowButtons: [
                            {
                                label: '修改2',
                                eventKey: 'showComponent',
                                eventOption: {
                                    comName: 'editForm'
                                },
                                type: 'warning',
                            },
                            {
                                label: '删除1',
                                eventKey: 'remove',
                                type: 'danger',
                                eventOption: {
                                    params: {
                                        product_id: 'schema::product_id'
                                    }
                                }
                            },
                        ]
                },
                componentConfig: {
                    createForm: {
                        title: '新增商品',
                        saveBtnText: '新增商品'
                    },
                    editForm: {
                        mainKey: 'product_id',
                        title: '修改商品',
                        saveBtnText: '修改商品'
                    }
                }
            }
        },
        {
            key: 'order',
            name: '订单管理',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
                path: '/todo'
            }
        },
        {
            key: 'client',
            name: '客户管理',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
                path: '/todo'
            }
        },
    ]
}
