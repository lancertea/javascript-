class FileBase{
    constructor(rawData, parent){
        this.name = rawData.name;
        this.parent = parent;
    }
    parent = null;
    name = '';
    get path(){
        return `${this.parent ? `${this.parent.path}/`: ''}${this.name}`;
    }
}

export class File extends FileBase{
    constructor(rawData, parent){
        super(rawData,parent);
            this.language = rawData.language;
            this.content = rawData.content || '';
            this.lastContent = rawData.lastContent || '';
        }

    type = 'file';
    language = '';
    content = '';
    lastContent = '';

    get changeFlag(){
        return this.content !== this.lastContent;
    }
    get pageShow(){
        return this.name.endsWith('.vue');
    }

    save(){
        this.lastContent = this.content;
    }
    reset(){
       this.content = this.lastContent;
    }
    rename(name){
        this.name = name;
        this.language = name.split('.').slice(-1)[0];
    }
}

export class Dir extends FileBase {
    constructor(rawData, parent){
        super(rawData,parent);
        this.children = generateFileTree(rawData.children, this);
    }
    type = 'dir';
    children = [];

    get changeFlag(){
        return this.children.some(file=>file.changeFlag);
    }
    get pageShow(){
        return this.children.some(file=>file.pageShow);
    }
    rename(name){
        this.name = name;
    }
}

const generateFileTree = (files, parent = null) => 
files.map(file=>(file.type === 'file' ? new File(file,parent) : new Dir(file,parent)));