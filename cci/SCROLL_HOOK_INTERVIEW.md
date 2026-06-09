## 1. IntersectionObserver

### 考点

- 异步、非主线程阻塞，性能优于在 `scroll` 事件里轮询 `scrollTop`
- `root` 指定滚动容器，`threshold` 控制触发灵敏度，`rootMargin` 可提前/延迟触发（预加载场景）
- 本文件用法：在容器底部放一个 1px sentinel 元素，sentinel 可见 → 在底部，sentinel 离屏 → 用户已向上滚动

### 常见问题

**Q：实现图片懒加载，有哪些方案？各自优缺点？**

| 方案                                    | 优点                                 | 缺点                                     |
| --------------------------------------- | ------------------------------------ | ---------------------------------------- |
| `scroll` 事件 + `getBoundingClientRect` | 兼容性好                             | 主线程执行，高频触发需节流，仍有性能损耗 |
| IntersectionObserver                    | 异步、不阻塞主线程，浏览器原生批处理 | IE 不支持（需 polyfill）                 |

**Q：IntersectionObserver 的 `threshold` 和 `rootMargin` 分别控制什么？**

- `threshold: 0.1` — 目标元素 10% 进入 root 时触发
- `rootMargin: '0px 0px 200px 0px'` — 将 root 底部边界向外扩 200px，图片距底部 200px 时提前触发加载

---

## 2. 状态机设计（scrollMode）

### 考点

用 `'locked' | 'free'` 单一状态机替代多个布尔值（`pinnedToBottom + isNearBottom`），消除状态组合爆炸与不一致。

```
状态转换：
  user scrolls up          → locked → free
  user scrolls to bottom   → free   → locked
  jumpToLatestMessage()    → free   → locked
  jumpToMessage()          → any    → free
  forceScrollToBottom()    → any    → locked（初始化）
```

### 常见问题

**Q：你用过状态机思想设计前端组件吗？如何避免多个 boolean 之间的状态冲突？**

A：多个布尔值的问题在于 `2^n` 种理论组合，大多数是非法状态（如 `pinnedToBottom=true` 同时 `isNearBottom=false`）。用字符串枚举状态机后，非法状态在类型层面就被排除，逻辑分支也更清晰。XState 是专门的状态机库，轻量场景直接用 `ref<'locked'|'free'>` 即可。

---

## 3. defineAsyncComponent 两阶段渲染

### 考点

`defineAsyncComponent` 渲染分两个阶段：

1. **Phase 1**：渲染占位符（loading slot 或空内容），此时 `scrollHeight` 很小
2. **Phase 2**：chunk 加载完成，实际内容渲染，`scrollHeight` 增大

`nextTick` 只等待同步 DOM 更新（Phase 1），**不等待异步 chunk 加载**。所以在 `nextTick` 里检测 `isScrollBottom` 会得到 Phase 1 的高度 → 误判为"已在底部" → 不再滚动 → Phase 2 内容出现后停在中间。

**解决方案**：用 IntersectionObserver 监听 sentinel，Phase 2 内容撑高后 sentinel 离屏，watcher 触发重新滚底。

### 常见问题

**Q：`nextTick` 的原理是什么，解决什么问题？**

A：Vue 的响应式更新是异步批处理的（microtask），`nextTick` 本质是 `Promise.then`，在当前更新队列 flush 完成后执行。它保证能拿到**本次同步代码触发的 DOM 更新结果**，但拿不到异步加载（网络请求、动态 import）后的 DOM 结果。

**Q：`defineAsyncComponent` 加载失败如何兜底？**

A：可传入 `errorComponent` 和 `timeout` 选项：

```ts
defineAsyncComponent({
  loader: () => import('./HeavyComponent.vue'),
  errorComponent: ErrorFallback,
  timeout: 3000,
})
```

---

## 4. 节流 vs 立即更新的竞态问题

### 考点

```ts
const onScroll = () => {
  // 立即更新 scrollMode — 无节流
  scrollMode.value = isScrollBottom(containerRef.value) ? 'locked' : 'free'
  // 重操作节流 300ms
  throttledScroll()
}
```

**为什么 `scrollMode` 不能节流？**

IntersectionObserver 回调异步触发，如果 `scrollMode` 在 300ms throttle 里，watcher 触发时读到的是旧值 → 误判用户意图：

- 用户刚向上滚（应该 free），但 throttle 还没更新，watcher 读到 `locked` → 强制滚回底部

### 常见问题

**Q：节流和防抖的区别，什么场景用哪个？**

|        | 节流（throttle）                         | 防抖（debounce）                               |
| ------ | ---------------------------------------- | ---------------------------------------------- |
| 行为   | 固定间隔最多执行一次                     | 停止触发后延迟执行                             |
| 适合   | scroll/resize 持续高频事件，需要实时反馈 | 搜索输入、窗口 resize 结束后的回调             |
| 本文件 | `handleScrollLogic` 用 throttle 300ms    | `stickyScrollAfterListResize` 用 debounce 50ms |

**Q：如何避免 Vue watch 中读到 stale state？**

A：watch 回调读取的 ref 值是**回调执行时的最新值**，不是 watch 触发时的值。竞态通常发生在"触发源 A 更新了状态，触发源 B 的回调在 A 的更新之前执行"。解决方案：让关键状态同步更新（不进节流），确保任何异步回调执行前状态已是最新。

---

## 5. nextTick + requestAnimationFrame 的执行时序

### 考点

```ts
debounce(() => {
  nextTick(() => {
    // microtask：等 Vue DOM patch 完成
    requestAnimationFrame(() => {
      // 下一帧 layout 前：等浏览器 layout 计算完
      scrollBottom(el, { instant: true })
    })
  })
}, 50)
```

三层时序的必要性：

1. `debounce 50ms`：聚合连续 resize 事件，避免频繁触发
2. `nextTick`：确保 Vue 已将新的尺寸数据 patch 进 DOM
3. `rAF`：确保浏览器已完成 layout（`scrollHeight` 已更新为最终值）

### 常见问题

**Q：nextTick 和 requestAnimationFrame 的执行时机有什么区别？**

```
宏任务（setTimeout/事件回调）
  └─ 微任务队列（Promise.then / nextTick）← Vue 的 nextTick 在这里
       └─ 渲染流水线
            ├─ Style
            ├─ Layout
            ├─ rAF 回调 ← requestAnimationFrame 在这里
            ├─ Paint
            └─ Composite
```

- `nextTick` → 微任务，DOM 节点已更新，但浏览器可能还没 layout（`scrollHeight` 可能是旧值）
- `rAF` → 在浏览器下一帧 Paint 前执行，layout 已完成，读取几何属性安全

---

## 6. 资源泄漏防护

### 考点

三类资源必须在合适时机清理：

| 资源                 | 清理方法                            | 清理时机                                        |
| -------------------- | ----------------------------------- | ----------------------------------------------- |
| IntersectionObserver | `observer.disconnect()`             | `onUnmounted` + `resetScrollState`              |
| setTimeout           | `clearTimeout(timer); timer = null` | `onUnmounted` + `resetScrollState` + 新 jump 前 |
| throttle/debounce    | `.cancel()`                         | `onUnmounted`                                   |

**为什么 `resetScrollState` 也要清理 timer？**

engagement 切换时（切换聊天对象），上一次 `jumpToMessage` 的高亮 timer 可能还未触发。不清理的话，3 秒后回调执行，会操作新 engagement 的 `enableTopLoading`，导致上拉加载失效。

### 常见问题

**Q：Vue 组件销毁时需要做哪些清理工作？**

A：`onUnmounted` 中：

- 取消定时器（`clearTimeout` / `clearInterval`）
- 断开 Observer（`IntersectionObserver.disconnect` / `MutationObserver.disconnect`）
- 移除全局事件监听（`document.removeEventListener`）
- 取消节流/防抖（`lodash throttle/debounce .cancel()`）
- 取消请求（`AbortController.abort()`）

**Q：为什么 lodash throttle 需要手动 `.cancel()`？**

A：throttle 内部持有一个 pending timer，组件销毁后如果 timer 还在等待，回调执行时会访问已销毁组件的状态，轻则 warning，重则内存泄漏。`.cancel()` 清除这个 pending timer。

---

## 7. CSS.escape

### 考点

```ts
containerRef.value.querySelector(`#${CSS.escape(messageId)}`)
```

消息 ID 可能包含 CSS 选择器特殊字符（`.` `/` `@` `[` `]` 等），直接插入会导致 `querySelector` 抛出 `SyntaxError` 或匹配到错误元素。`CSS.escape()` 将特殊字符转义为合法的 CSS 标识符。

### 常见问题

**Q：如何安全地用动态字符串查询 DOM 元素？**

A：

- 用 `id` 查询时：`CSS.escape()` 转义后拼选择器
- 用 `data-*` 属性查询时：`querySelector('[data-id="xxx"]')` 中的属性值不需要 escape
- 更安全的方案：维护一个 `Map<id, HTMLElement>` 引用，避免字符串选择器

---

## 8. 综合业务场景设计题（最高频）

### 题目

> 设计一个 IM 消息列表的滚动管理系统，需支持：
>
> 1. 初始化完成后自动滚到底部
> 2. 发送消息时自动滚到最新消息
> 3. 收到新消息时，若用户正在查看历史消息，右下角显示"有新消息"按钮，不强制滚动
> 4. 支持外部事件跳转到指定历史消息，并高亮显示

### 答题框架

**核心状态设计**

```ts
// ❌ 多 boolean 容易不一致
const pinnedToBottom = ref(true)
const isNearBottom = ref(true)

// ✅ 单一状态机
const scrollMode = ref<'locked' | 'free'>('locked')
```

**检测"是否在底部"**

- ❌ 在 scroll 事件里每次计算 `scrollTop + clientHeight >= scrollHeight`（高频 + 浮点误差）
- ✅ IntersectionObserver 监听 sentinel 元素，异步非阻塞，精确

**处理异步内容增长（如 defineAsyncComponent）**

- `nextTick` 不够用，只保证同步 DOM 更新
- sentinel 被内容撑走后触发 watcher → 若 `scrollMode === 'locked'` → 重新滚底

**竞态防护**

- `scrollMode` 在 `onScroll` 中**同步**更新，不进节流
- 保证 IntersectionObserver 回调执行时读到的 `scrollMode` 是最新值

**完整状态重置**

- engagement 切换时 `resetScrollState()`：清 timer、断 Observer、重置所有状态
- 防止上一次会话的异步回调污染新会话

---

## 快速记忆

| 技术                         | 核心价值                                      |
| ---------------------------- | --------------------------------------------- |
| IntersectionObserver         | 非主线程检测元素可见性，替代高频 scroll 计算  |
| 状态机                       | 消除布尔组合爆炸，状态转换显式可审计          |
| 同步 scrollMode + 异步副作用 | 竞态防护：先建立意图，再执行重操作            |
| nextTick → rAF 双重等待      | DOM patch 完 → 浏览器 layout 完，再读几何属性 |
| onUnmounted 全量清理         | 防定时器/Observer 泄漏跨 engagement 触发      |
