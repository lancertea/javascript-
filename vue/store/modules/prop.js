const state = {
    currentProps: [], //当前组件的属性列表
    currentStyleProps: [], //当前组件的样式列表
    typesMap: new Map(),   //当前组件属性分组索引
    currentSelectProp: {},  //当前组件属性-值对象
    currentSelectStyle: {}, //当前组件样式-值对象
    bindObj: {},// 源码属性绑定信息
    bindList: {}, //变量列表
  };

  export default {
    namespaced: true,
    state,
    getters:{
        currentProps: state=>state.currentProps,
    },
    mutations:{

    },
    actions:{
        
    }
  }