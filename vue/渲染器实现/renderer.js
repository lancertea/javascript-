const h = (tag, props, children) => {
  // vnode -> javascript对象
  return {
    tag,
    props,
    children,
  };
};

const mount = (vnode, container) => {
  //TODO: 如果container上已经有内容了，应该先清空
  if (container.innerHTML.trim() !== "" && container.id === "app") {
    container.innerHTML = "";
  }
  // vnode -> element
  // 1. 创建出真实的原生，并且在vnode上保留el
  const el = (vnode.el = document.createElement(vnode.tag));
  // 2. 设置属性
  if (vnode.props) {
    for (const key in vnode.props) {
      const value = vnode.props[key];
      if (key.startsWith("on")) {
        el.addEventListener(key.slice(2).toLocaleLowerCase(), value);
      } else {
        el.setAttribute(key, value);
      }
    }
  }

  // 3. 处理children
  if (vnode.children) {
    if (typeof vnode.children === "string") {
      el.textContent = vnode.children;
    } else {
      vnode.children.forEach((child) => {
        mount(child, el);
      });
    }
  }
  // 4. 将el挂载到container上
  container.appendChild(el);
};

const patch = (n1, n2) => {
  if (n1.tag !== n2.tag) {
    const n1ELParent = n1.el.parentElement;
    n1ELParent.removeChild(n1.el);
    mount(n2, n1ELParent);
  } else {
    // 1. 取出element对象，并在n2中进行保存
    const el = (n2.el = n1.el);
    // 2. 更新属性
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    // 2.1.获取所有的newProps添加到el
    for (const key in newProps) {
      const newValue = newProps[key];
      const oldValue = oldProps[key];
      if (newValue !== oldValue) {
        if (key.startsWith("on")) {
          el.addEventListener(key.slice(2).toLocaleLowerCase(), newValue);
        } else {
          el.setAttribute(key, newValue);
        }
      }
    }
    // 2.2.删除旧的props
    for (const key in oldProps) {
      if (!(key in newProps)) {
        if (key.startsWith("on")) {
          el.removeEventListener(
            key.slice(2).toLocaleLowerCase(),
            oldProps[key]
          );
        } else {
          el.removeAttribute(key);
        }
      }
    }

    // 3. 更新children
    const oldChildren = n1.children || [];
    const newChildren = n2.children || [];
    // 3.1.如果newChildren是字符串，直接设置文本内容
    if (typeof newChildren === "string") {
      if (typeof oldChildren === "string") {
        if (oldChildren !== newChildren) {
          el.textContent = newChildren;
        }
      } else {
        el.innerHTML = newChildren;
      }
    }
    // 3.2.如果newChildren是数组，遍历数组进行更新
    else {
      // 3.2.1.如果oldChildren是字符串，直接清空el
      if (typeof oldChildren === "string") {
        el.innerHTML = "";
      }
      // 3.2.2.如果oldChildren是数组，进行diff算法
      // oldChildren: [v1, v2, v3, v8, v9]
      // newChildren: [v1, v5, v6]
      else {
        const oldLength = oldChildren.length;
        const newLength = newChildren.length;
        const minLength = Math.min(oldLength, newLength);
        // 前面有相同节点的原生进行patch操作
        for (let i = 0; i < minLength; i++) {
          patch(oldChildren[i], newChildren[i]);
        }
        // 如果newChildren比oldChildren长，说明有新增的节点
        if (newLength > oldLength) {
          newChildren.slice(minLength).forEach((child) => {
            mount(child, el);
          });
        }

        // 如果oldChildren比newChildren长，说明有删除的节点
        if (oldLength > newLength) {
          oldChildren.slice(newLength).forEach((child) => {
            el.removeChild(child.el);
          });
        }
      }
    }
  }
};
