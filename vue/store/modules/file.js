const state = {
    modify: [], //  修改过的文件内容{path:content}
    cache: [], // 暂存后台获取的数据{path:content}
    conflict: [], // 冲突文件列表
    historyPaths: [], // 历史打开路径列表
    directory: [], // 文件目录
    activeFile: null, // 当前选中的文件/文件夹
    lastChangedPage: null, // 上次修改的页面
  };

  export default {
    namespaced: true,
    state,
    getters:{
        modify: state=>state.modify,
    },
    mutations:{

    },
    actions:{
        
    }
  }