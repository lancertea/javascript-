const state = {
    current: {
        page: '', // 当前选中的页面名称
        activePath: '', // 当前选中的文件路径
        codeActivePath: '', // 代码编辑器当前选中的文件路径
        compId: '', // 当前选中组件的data-id
        sourceCode: '', // 当前页面的源码
    },
    tempData: {
        historyIndex: 0, // 撤销回退的索引,默认是最后一位，切换页面、返回项目列表时置0
        isEmpty: true,  // 当前modify的内容是否已上传到后台后被清空
        canRedo: false, // 是否可以撤销
        canUndo: false, // 是否可以重做
      }, 
};

const getState = function (){
    const obj = JSON.parse(JSON.stringify(state));
    return obj;
};

export default getState;