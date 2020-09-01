<script>

    /**
     * @file table, 基于element-ui table组件封装
     */

    import {Table, Loading} from 'element-ui';
    import TableStore from './store';
    import SfTableMessage from './message';
    import Empty from './empty.vue';
    import MultiOptionsLayer from './multi_options_layer.vue';
    import RowEditor from './row-edit/index.vue';
    import cloneDeep from 'lodash/cloneDeep';
    import isEmpty from 'lodash/isEmpty';
    import { cascadeComponent } from 'util/walk';

    let elTableEvents = [
        'select',
        'select-all',
        'selection-change',
        'cell-mouse-enter',
        'cell-mouse-leave',
        'cell-click',
        'cell-dblclick',
        'row-click',
        'row-contextmenu',
        'row-dblclick',
        'header-click',
        'header-contextmenu',
        'sort-change',
        'filter-change',
        'current-change',
        'header-dragend',
        'expand-change'
    ];


    export default {
        name: 'SfTable',

        provide () { // 依赖注入，提供给后代组件的数据/方法
            return {
                _tableStore: this._tableStore
            };
        },

        props: {
            ...Table.props,
            showBothSidesBorder: {
                type: Boolean,
                default: false
            },
            border: {
                type: Boolean,
                default: true
            },
            toggleColumns: {
                type: Array,
                default: () => []
            },
            multiLayerWidth: {
                type: [Number, String],
                default: 130
            },
            api: String,
            autoLoad: {
                type: Boolean,
                'default': true
            },
            stripe: { // 默认隔行换色
                type: Boolean,
                'default': true
            },
            type: {  // 请求的方式
                type: String,
                default: 'post'
            },
            params: {
                type: Object,
                default () {
                    return {};
                }
            },
            isServerPagination: { // 是否服务器端分页
                type: Boolean,
                'default': true
            },
            successCallback: Function, // 成功后给外部的回调

            failCallback: Function, // 失败后给外部的回调

            showLoading: {
                type: Boolean,
                default: true
            },

            /**
             * 第一次发送请求时是否需要携带默认参数
             * params: {
             *   order: 'asc',
             *   offset: 0,
             *   limit: 10,
             *   keyword: ''
             * }
             * 一般后台分页时需要携带这些参数，前台分页时不需要
             */
            needDefaultParam: {
                type: Boolean,
                'default': true
            },

            rememberParam: {   // 是否记住选中参数，记住后再回到页面参数会自动填上
                type: Boolean,
                default: false
            },

            rowEditable: {     // 表格行是否可增删
                type: Boolean,
                default: false
            },

            beforeRowDelete: {  // 删除行之前的回调，若返回 false，则不执行删除行操作
                type: Function
            },

            afterRowDelete: {   // 删除行后的回调
                type: Function
            }
        },

        data () {
            return {
                records: [], // 加入索引后的当前页数据
                currentPage: 1,
                pageSize: 10,
                calcToggleColumns: [], // 用来判断表格列是否展示
                currentRow: null
            };
        },

         computed: {
            storeJsonData () {
                return this._tableStore.state.jsonData;
            },
            storeData () {
                return this._tableStore.state.data;
            },
            isLoading () {
                return this._tableStore.state.isLoading;
            },
            noPagination () {
                return !this.$slots.pagination;
            }
        },

        watch: {
            data: {
                immediate: true,
                handler (val) {
                    Array.isArray(val) && this._tableStore.commit('dataLoaded', {
                        list: val,
                        total: val.length
                    });
                }
            },
            storeData: {
                immediate: true,
                handler (val) {
                    this.records = val.map((item, index) => {
                        item.index = (this.currentPage - 1) * this.pageSize + (index + 1);
                        return item;
                    });
                }
            },
            storeJsonData: {
                immediate: true,
                handler (val) {

                    // 不传分页条时，要设置展示的数据
                    if (this.noPagination) {
                        this._tableStore.commit('setPageData', val.list || []);
                    }
                }
            },
            isLoading (val) {
                if (this.showLoading) {
                    val && this._showLoading();
                    !val && this._hideLoading();
                }
            },
            params: {
                deep: true,
                handler (newVal) {

                    // 当表格外部传进来的 params 变化时，需要重新触发 setParams 设置 params 的值
                    this._tableStore.commit('setParams', newVal);
                }
            },
            '_tableStore.state.params': {
                deep: true,
                handler (newVal) {
                    this.rememberParam &&
                    this.$slots.toolbar &&
                    this._setTableParamsToSession(newVal);
                }
            }
        },

        components: {
            ElTable: Table,
            RowEditor,
            MultiOptionsLayer
        },

        beforeCreate () {
            this._tableStore = new TableStore();
        },

        created () {
            this._tableStore.$on('page-info', val => {
                this.currentPage = val.currentPage;
                this.pageSize = val.pageSize;
            });
        },

        mounted () {
            this._tableStore.commit('setApi', this.api);
            this._tableStore.commit('setType', this.type);
            this._tableStore.commit('setSuccessCallback', this.successCallback);
            this._tableStore.commit('setFailCallback', this.failCallback);
            (!this.needDefaultParam || this.noPagination) && this._tableStore.commit('cleanDefaultParams');
            this._initMethodsProxy();
            this._initTableMessageComp();
            this._tableStore.commit('setParams', this.params);
            this._tableStore.commit('storeClearSelection', this.storeSelection);
            this.rememberParam && this.$slots.toolbar && this._resetTableParamsFromSession();
            this._getCalcToggleColumns();
            this._setColumns();

            // 缓存筛选参数写入到store是异步的过程，这里我们使用nextTick包括loadData
            // 保证在loadData时，已经把缓存中的筛选参数写入store
            this.$nextTick(() => {
                this.autoLoad && this._tableStore.dispatch('loadData');
            });
        },
         render (h) {
            return h('div', {
                class: [
                    'sf-table',
                    {'sf-table--row__editable': this.rowEditable},
                    {'sf-table--border__left__right': this.showBothSidesBorder},
                    this.storeData.length ? '' : 'sf-table-empty__wrapper'
                ]
            }, [
                this.$slots.toolbar || '',

                h('el-table', {
                    props: {
                        ...this.$props,
                        data: this.records,
                        stripe: this.stripe
                    },
                    ref: 'elTable',
                    on: {
                        ...this._initEventsProxy(),
                        'cell-mouse-enter': this._cellMouseEnterProxy,
                        'selection-change': this._selectionChangeProxy
                    },
                    scopedSlots: {
                        empty: () => this.$slots.empty || this._renderEmpty()
                    }
                }, this.$slots.default),

                this.$slots.pagination || '',
                !isEmpty(this.toggleColumns) && h('multi-options-layer', {
                    on: {
                        'on-change': this._changeColumns
                    },
                    props: {
                        toggleColumns: this.calcToggleColumns,
                        multiLayerWidth: this.multiLayerWidth
                    }
                }),
                this.rowEditable && h(RowEditor, {
                    attrs: {
                        tableElement: this.$el,
                        tableData: this.data,
                        currentRow: this.currentRow
                    },
                    on: {
                        'add-row': this._addTableRow,
                        'delete-row': this._deleteTableRow
                    }
                })
            ]);
        },

        methods: {
            storeSelection () { // 清除选中数据的方法
                if (this.$refs.elTable) {
                    Table.methods.clearSelection.call(this.$refs.elTable);
                }
            },

            /**
             * 请求数据
             * @param {Object} params 请求额外的参数
             * @param {Boolean} needClearSelection 是否需要清除选中的列表
             * @param {object} options 各种额外配置项 目前仅有 noShowLoading , 使用对象方便后续扩展参数
             */
            loadData (params, needClearSelection = true, options = {}) {
                let loadParams = {
                    ...this.params,
                    ...params
                };

                this._tableStore.commit('setParams', loadParams);
                this._tableStore.dispatch('loadData', { needClearSelection, ...options });
            },
            getParams () {
                return cloneDeep(this._tableStore.state.params);
            },

           /**
             * 根据外部传入的toggleColumns去计算calcToggleColumns的值
             * @private
             */
            _getCalcToggleColumns () {
                if (isEmpty(this.toggleColumns)) {
                    return;
                }

                if (this.toggleColumns === 'all') {
                    this.calcToggleColumns = this._getAllSfTableColumnComp().map((item) => {
                        let { componentInstance: {$attrs} } = item;

                        return {
                            prop: $attrs.prop,
                            name: $attrs.label,
                            checked: true
                        };
                    });
                } else {
                    this.calcToggleColumns = this.toggleColumns.map((item) => {
                        let tempName = '';

                        this._getAllSfTableColumnComp().forEach((insideItem) => {
                            let { componentInstance: {$attrs} } = insideItem;

                            if ($attrs.prop === item.prop) {
                                tempName = $attrs.label;
                            }
                        });

                        return {
                            prop: item.prop,
                            name: tempName,
                            checked: item.defaultShow
                        };
                    });
                }
            },
            _getAllSfTableColumnComp () {
                return this.$slots.default.filter((item) => item.tag && item.tag.includes('SfTableColumn'));
            },
            _changeColumns (val) {
                this.calcToggleColumns = this.calcToggleColumns.map((item) => {
                    item.checked = val.includes(item.prop);

                    return item;
                });
                this._setColumns();
            },

            /**
             * 设置表格列的可见性
             * @private
             */
            _setColumns () {
                this._getAllSfTableColumnComp().forEach((item) => {
                    let { componentInstance, componentInstance: {$attrs} } = item;

                    if (isEmpty(this.toggleColumns)) { // 不存在相关配置则全部设为可见
                        componentInstance.hidden = false;
                    } else {
                        let targetColumns = this.calcToggleColumns.filter((filterItem) => filterItem.prop === $attrs.prop);

                        if (targetColumns.length && !targetColumns[0].checked) {
                            componentInstance.hidden = true;
                        } else {
                            componentInstance.hidden = false;
                        }
                    }
                });
            },
            _initMethodsProxy () {
                let vm = this;

                Object.keys(Table.methods).forEach(key => {
                    vm[key] = function () {
                        /* eslint-disable prefer-rest-params */
                        return Table.methods[key].apply(vm.$refs.elTable, arguments);
                        /* eslint-enable prefer-rest-params */
                    };
                });
            },
            _initEventsProxy () {
                let vm = this;

                return elTableEvents.reduce((map, key) => {
                    map[key] = (...params) => {
                        vm.$emit(key, ...params);
                    };

                    return map;
                }, {});
            },
            _selectionChangeProxy (selection) {
                this.$emit('selection-change', selection);
                this._tableStore.commit('setSelections', selection);
            },
            _cellMouseEnterProxy (row, column, cell) {
                this.$emit('cell-mouse-enter', row, column, cell);
                this.currentRow = row;
            },
            _renderEmpty () {
                return Empty.render.call(this);
            },
                      _showLoading () {
                this._loadingInstance = Loading.service({
                    target: this.$el.querySelector('.el-table__body-wrapper'),
                    background: '#fff',
                    customClass: 'sf-table-loading'
                });
            },
            _hideLoading () {
                this._loadingInstance && this._loadingInstance.close();
            },
            _initTableMessageComp () {
                let messageBar = this.$slots.messageBar;
                if (!messageBar) {
                    return;
                }
                let table = this.$el.querySelector('.el-table'),
                    tbody = this.$el.querySelector('.el-table__body-wrapper'),
                    el = document.createElement('div');

                table.insertBefore(el, tbody);

                new SfTableMessage({
                    propsData: {
                        _tableStore: this._tableStore
                    },
                    render () {
                        return messageBar[0];
                    }
                }).$mount(el);
            },
            _setTableParamsToSession (params) {
                let route = this.$route && this.$route.fullPath,
                    tableParamsSession = this._getTableParamsFromSession();

                if (route) {
                    tableParamsSession[route] = params;
                    this._tableStore.commit('setSessionStorageKey', route);
                    sessionStorage.tableParams = JSON.stringify(tableParamsSession);
                }
            },
            _getTableParamsFromSession () {
                return JSON.parse(sessionStorage.tableParams || '{}');
            },
            _resetTableParamsFromSession () {

                // 根据已保存到 session 的表格筛选项信息，自动填写表格筛选栏数据
                let route = this.$route && this.$route.fullPath,
                    tableParamsSession = this._getTableParamsFromSession(),
                    routeParams = tableParamsSession[route];

                if (!routeParams) {
                    return;
                }

                // 当从缓存中读取请求参数写入各toolbar组件时，不触发loadData方法
                this._tableStore.state.shouldLoadData = false;

                cascadeComponent(this.$slots.toolbar[0].componentInstance, (child) => {
                    if (!child.isToolbarFilterComp) {
                        return;
                    }

                    let componentName = child.$options.name,
                        paramKey = child.paramKey;

                    if (componentName === 'SfToolbarDatePicker') {
                        child.time = routeParams[paramKey];
                    } else if (componentName === 'cascader') {

                        // cascader 使用 firstParamKey 和 secondParamKey 对应的值保存 value
                        if (child.secondParamKey) {
                            child.value = [
                                routeParams[child.firstParamKey],
                                routeParams[child.secondParamKey]
                            ];
                        } else {
                            child.value = routeParams[child.firstParamKey];
                        }
                    } else if (paramKey) {
                        child.value = routeParams[paramKey];
                    }
                });

                /*
                * 改变child.value后会触发各toolbar组件的watch value绑定的回调
                * 触发watch回调在Vue内部是通过$nextTick包裹的一个异步操作
                * 所以这里我们把 shouldLoadData = true 也用nextTick包裹，保证在触发的watch回调中shouldLoadData为false
                */
                this.$nextTick(() => {
                    this._tableStore.state.shouldLoadData = true;
                });
            },
            _addTableRow (rowData = {}) {
                let newData = this.storeData.concat(rowData);
                this._tableStore.commit('setPageData', newData);

                // 新插入的行，默认给一个换行字符以便于对单元格进行编辑时光标指示位置正常
                this.$nextTick(() => {
                    let lastestCellDoms = this.$el.querySelectorAll('.el-table__body-wrapper tr:last-child .cell');
                    if (!lastestCellDoms) {
                        return;
                    }

                    for (let cell of lastestCellDoms) {
                        if (!cell.innerText) {
                           cell.innerHTML = '<br>';
                        }
                    }
                });
            },
            _deleteTableRow (row = {}) {
                let rowIndex = row.index;
                if (this.beforeRowDelete && this.beforeRowDelete(row) === false) {
                    return;
                }
                if (rowIndex) {
                    let newData = this.storeData.filter((item, index) => {
                        return rowIndex !== (index + 1);
                    });
                    this._tableStore.commit('setPageData', newData);
                    this.afterRowDelete && this.afterRowDelete();
                }
            }
        }
    };
</script>
<style lang="less">
    .sf-table{
        font-size: 12px;
    }
    .sf-table .sf-table-loading{
        z-index: 1000;
        bottom: 1px;
        right: 1px;
        z-index: 1000;
    }
    .sf-table thead th{
        border-top: 1px solid #ebeef5;
        padding:8px 0;
    }
    .sf-table .caret-wrapper {
        height: 23px;
    }
    .sf-table .sort-caret.ascending {
        top: -1px
    }
    .sf-table .sort-caret.descending {
        bottom: 2px
    }
    .sf-table .cell .el-button--text{
        padding: 0;
    }
</style>

<style lang="less" scoped>
    .sf-table {
        position: relative;
    }
    .sf-table-empty{
        height: 300px;
        color: #ddd;
        display: table;
        width: 100%;

        .empty-box{
            display: table-cell;
            vertical-align: middle;
        }

        .icon{
            font-size: 70px;
        }
    }
    .sf-table--row__editable /deep/ .el-table {
        overflow: visible;

        .el-table__body-wrapper {
            overflow: visible;
        }
    }
</style>
