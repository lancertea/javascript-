uploadChooseFile (files) {
    let reg = /^[\.0-9_a-zA-Z]+$/;
    let mapArr = [!files.every(item => (lodash.endsWith(item.name, '.sh') ||
        lodash.endsWith(item.name, '.bat') ||
        lodash.endsWith(item.name, '.ps1'))), !files.every(item => reg.test(item.name)), !files.every(item => item.size < ONEMB)];
    if (mapArr.some(item => item === true)) {
        this.$showErr('请上传sh、bat或ps1格式文件，文件名不含中文字符，大小不超过1MB');
        return Promise.reject();
    }
    if (files.some(item => item.size === 0)) {
        this.$showErr(_('文件大小不能为0'));
        return Promise.reject();
    }
    let name = files[0].name;
    this.script_path = name;
    Object.assign(this.agentsSelectFieldData, {
        fileType : name.substring(name.lastIndexOf('.') + 1, name.length)
    });
    this.files = files;
    return false;
}