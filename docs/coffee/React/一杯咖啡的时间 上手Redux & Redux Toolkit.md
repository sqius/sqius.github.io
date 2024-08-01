# 一杯咖啡的时间 上手Redux & Redux Toolkit

## 🐱 [Redux](https://redux.js.org/)

> Redux 是一个管理全局应用状态的库。

### 🐱 概念

#### 🐱 State 管理

- 这是一个包含以下部分的 React 计数器组件：

  - state：驱动应用的真实数据源头。
  - view：基于当前状态的视图声明性描述。
  - actions：根据用户输入在应用程序中发生的事件，并触发状态更新。

  ``` jsx
  function Counter() {
    // State: counter 值
    const [counter, setCounter] = useState(0)

    // Action: 当事件发生后，触发状态更新的代码
    const increment = () => {
      setCounter(prevCounter => prevCounter + 1)
    }

    // View: 视图定义
    return (
      <div>
        Value: {counter} <button onClick={increment}>Increment</button>
      </div>
    )
  }
  ```


  - 如果当有多个组件需要共享和使用相同 `state` 时，会变得很复杂，有时可以通过 `提升 state` 到父组件解决。当组件关系复杂庞大时，这并不是一个好方法。

  - 解决这个问题的一种方法是从组件中提取共享 `state`，并将其放入组件树之外的一个集中位置。这样，我们的组件树就变成了一个大 `view`，任何组件都可以访问 `state` 或触发 `action`，无论它们在树中的哪个位置。

  - 通过定义和分离 `state` 管理中涉及的概念并强制执行维护 `view` 和 `state` 之间独立性的规则，代码变得更结构化和易于维护。

  - 这就是 `Redux` 背后的基本思想：应用中使用集中式的全局状态来管理，并明确更新状态的模式，以便让代码具有可预测性。


#### 🐱 Immutability 不可变性

- "Mutable" 意为 "可改变的"，而 "immutable" 意为永不可改变。

- `Redux` 期望所有状态更新都是使用不可变的方式(Immutability)。

- `JavaScript` 的对象（object）和数组（array）默认都是 `mutable` 的:

``` js
const obj = { a: 1, b: 2 }
// 对外仍然还是那个对象，但它的内容已经变了
obj.b = 3

const arr = ['a', 'b']
// 同样的，数组的内容改变了
arr.push('c')
arr[1] = 'd'
```

### 🐱 Redux 术语

> `State`，`Actions`，和 `Reducers` 是 `Redux` 的构建模块。每个 `Redux` 应用都有 `state` 值，创建 `actions` 来描述发生的事情，并使用 `reducer` 函数根据之前的 `state` 和 `action` 计算新的状态值。

#### 🐱 Actions

`action` 是一个带有 `type` 并且描述发生了什么的普通对象:
``` js
const addTodoAction = { type: 'counter/increment', payload: 'ok ok' }
```

- type: 字符串。用来描述 `action`。通常写为 `域/事件名称` `feature/eventName`。
- payload: 通常用用描述发生的事情的附加信息。
- 操作应该包含描述发生的事情所需的最少数据量。

#### 🐱 Reducers

`(state, action) => newState。`

`Reducers` 函数。接收当前的 `state` 和一个 `action`。通常用于决定如何更新状态，并返回新状态:

``` js
const initialState = { value: 0 }

function counterReducer(state = initialState, action) {
  if (action.type === 'counter/increment') {
    return { ...state, value: state.value + 1 }
  }
  return state
}
```

Reducer 必需符合以下规则：
  - 仅使用 `state` 和 `action` 参数计算新的状态值。
  - 禁止直接修改 `state`。总是返回一个副本。来做 `不可变更新（immutable updates）`。
  - 禁止任何异步逻辑、依赖随机值或导致其他 “副作用” 的代码。

::: warning 在 Redux 中，我们的 reducer 永远不允许改变原始/当前状态值！
``` js
// ❌ 非法 - 默认情况下，这会改变状态！
state.value = 123

```
Reducers 只能 复制 原始值，并只能改变这些副本。
```
// ✅ 做了复制，所以是安全的
return { ...state, value: 123 }
```

:::

::: tip 拆分/组合 Reducers

`Redux` 应用程序实际上只有一个 `reducer` 函数 `root reducer` 传递给 `createStore` 函数。

`Redux reducer` 通常根据更新的 `Redux state` 部分进行拆分：

``` jsx
import todosReducer from './features/todos/todosSlice'
import filtersReducer from './features/filters/filtersSlice'

export default function rootReducer(state = {}, action) {
  // 返回一个新的根 state 对象
  return {
    // `state.todos` 的值是 todos reducer 返回的值
    todos: todosReducer(state.todos, action),
    // 对于这两个 reducer，我们只传入它们的状态 slice
    filters: filtersReducer(state.filters, action)
  }
}
```

导入并使用 combineReducers ：

`combineReducers` 接受一个对象，其中键名将成为根 `state` 对象中的键，值是描述如何更新 `Redux` 状态的 `slice reducer` 函数。

你给 `combineReducers` 的键名决定了你的状态对象的键名是什么！

``` jsx
import { combineReducers } from 'redux'

import todosReducer from './features/todos/todosSlice'
import filtersReducer from './features/filters/filtersSlice'

const rootReducer = combineReducers({
  // 定义一个名为`todos`的顶级状态字段，由`todosReducer`处理
  todos: todosReducer,
  filters: filtersReducer
})

export default rootReducer


```

:::


#### 🐱 Store

当前 `Redux` 应用的状态存在于一个名为 `store` 的对象中。 `store` 是通过传入一个 `reducer` 来创建的。

``` js
import { createStore } from 'redux'
import rootReducer from './reducer'

const store = createStore(rootReducer)

export default store
```

- `Redux store` 汇集了构成应用程序的 `state`、`actions` 和 `reducers`:
  - 在内部保存当前应用程序 `state`
  - 通过 `store.getState()` 访问当前 `state`;
  - 通过 `store.dispatch(action)` 更新状态;
  - 通过 `store.subscribe(listener)` 注册监听器回调;
  - 通过 `store.subscribe(listener)` 返回的 unsubscribe 函数注销监听器。

- `Store enhancers` 让我们能够在创建 `store` 时进行自定义操作
  - `Enhancers` 包装了 `store` 并且可以覆盖它的方法
  - `createStore` 接受一个 `enhancer` 作为参数
  - 可以使用 `compose API` 将多个 `enhancers` 合并在一起

- `Middleware` 是自定义 `store` 的主要方式
  - 使用 `applyMiddleware enhancer` 添加 `middleware`
  - `Middleware` 被写成三个相互嵌套的函数
  - 每次 `dispatch action` 时都会运行 `middleware`
  - `Middleware` 内部可能有副作用


::: warning Redux Store
Redux 应用程序中只有一个 store。当你想要拆分数据处理逻辑时，你将使用 reducer composition 并创建多个可以组合在一起 reducer，而不是创建单独的 store。
:::

#### 🐱 Dispatch
`Redux store` 有一个方法叫 `dispatch`。更新 `state` 的唯一方法是调用 `store.dispatch()` 并传入一个 `action` 对象。

``` js
store.dispatch({ type: 'counter/incremented' })
store.dispatch({ type: 'counter/incremented', payload: 'Learn about stores' })

```

`dispatch` 一个 `action` 可以形象的理解为 "触发一个事件"。每次我们调用 store.dispatch(action) 时：
  - `store` 调用 `rootReducer(state, action)`。
  - `store` 将新的 `state` 保存在里面。
  - `store` 调用所有的监听器订阅回调。
  - 监听器现在通过调用 `store.getState()` 来访问 `store` 并读取最新的 `state。`

#### 🐱 Selectors

`Selector` 函数可以从 `store` 状态树中提取指定的片段。
``` js
const selectCounterValue = state => state.value

const currentValue = selectCounterValue(store.getState())
```

### 🐱 Redux 原则

#### 🐱 单一数据源
- 应用程序的全局状态作为对象存储在单个 `store` 中。任何给定的数据片段都应仅存在于一个位置，而不是在许多位置重复。

#### 🐱 State 是只读的
- 更改状态的唯一方法是 `dispatch` 一个 `action`，这是一个描述所发生事件的对象。

#### 🐱 使用 Reducer 纯函数进行更改
- 若要指定如何基于 `action` 更新状态树，请编写 `reducer` 函数。
- 与任何其他函数一样，你可以将 `Reducer` 拆分为较小的函数以帮助完成工作，或者为常见任务编写可重用的 `Reducer`。

### 🐱 Redux 数据流

#### 🐱 单向数据流（one-way data flow）

- 用 `state` 来描述应用程序在特定时间点的状况。
- 基于 `state` 来渲染出 `View`。
- 当发生某些事情时（例如用户单击按钮），`state` 会根据发生的事情进行更新，生成新的 `state`。
- 基于新的 `state` 重新渲染 `View`。


![](../image/2024-07-29/redux-0.jpg)

#### 🐱 Redux 数据流
Redux 使用 "单向数据流"，可以将这些步骤分解为更详细的内容：

- 初始启动：
  - 使用最顶层的 `root reducer` 函数创建 `Redux store`
  - `store` 调用一次 `root reducer`，并将返回值保存为它的初始 `state`
  - 当 `UI` 首次渲染时，`UI` 组件访问 `Redux store` 的当前 `state`，并使用该数据来决定要呈现的内容。
  - 同时监听 `store` 的更新，以便他们可以知道 `state` 是否已更改。

- 更新环节：
  - 应用程序中发生了某些事情，例如用户单击按钮
  - `dispatch` 一个 `action` 到 `Redux store`，例如 `dispatch({type: 'counter/increment'})`
  - `store` 用之前的 `state` 和当前的 `action` 再次运行 `reducer` 函数，并将返回值保存为新的 `state`
  - `store` 通知所有订阅过的 `UI`，通知它们 `store` 发生更新
  - 每个订阅过 `store` 数据的 `UI` 组件都会检查它们需要的 `state` 部分是否被更新。
  - 发现数据被更新的每个组件都强制使用新数据重新渲染，紧接着更新网页。

![](../image/2024-07-29/redux-1.gif)

``` html title="代码实现"
<body>
  <div>
    <span id="value">0</span>
    <button id="increment">+10</button>
    <button id="decrement">-10</button>
  </div>
  <script type="module">
    import { createStore } from "https://unpkg.com/redux@latest/dist/redux.browser.mjs";

    // 定义State： 定义一个初始状态值
    const initialSate = { value: 0 }

    // 定义Reducer： 参数接收 state(初始值initialSate) 和 action
    const reducer = (state = initialSate, action) => {
      // / Reducers 通常会查看发生的 action 的 type 来决定如何更新状态
      switch (action.type) {
        case "counter/incremented":
          return { value: state.value + 10 }
        case "counter/decremented":
          return { value: state.value - 10 }
        default:
          return state
      }
    }

    // 创建Store：调用 Redux 库 createStore 来创建一个 store 实例
    // createStore 会执行一次 reducer，对 state 进行初始化
    const store = createStore(reducer)

    // 获取 HTML 元素
    const valueEl = document.getElementById('value')

    // 获取 Store 状态并更新 UI
    function render() {
      const state = store.getState()
      valueEl.innerHTML = state.value.toString()
    }

    // 初始化调用 更新 UI
    render()

    // 订阅 Store 的状态
    store.subscribe(render)

    // 点击按钮时 发起 action
    document
      .getElementById("increment")
      .addEventListener("click", function () {
        store.dispatch({ type: "counter/incremented" });
      });

    document
      .getElementById("decrement")
      .addEventListener("click", function () {
        store.dispatch({ type: "counter/decremented" });
      });
  </script>
</body>
```

![](../image/2024-07-29/redux-2.jpg)

## 🐱 [Redux Toolkit](https://redux-toolkit.js.org/)
> 官方推荐的编写 Redux 逻辑的方法（最佳实践）也称为 "RTK"。

::: tip 为什么要用 redux-toolkit 而不是redux
  - 配置一个 Redux store 过于复杂。
  - Redux Toolkit (RTK) 是编写 Redux 逻辑的标准方式。
  - Redux 需要太多的样板代码。
  - 围绕 Redux 核心，并包含其他有用的包.

:::

### 🐱 configureStore

- `configureStore` 用来设置一个具有良好默认值的 `Redux store`。

- `Redux Toolkit` 的 `configureStore API`，可简化 `store` 的设置过程。

- `toolkit` 其实只是对 `redux` 进行了封装，实际上 `store` 和 `redux` 中的是一样的。


``` jsx
import { configureStore } from '@reduxjs/toolkit'

import todosReucer from './features/todos/todosSlice'
import filtersReducer from './features/filters/filtersSlice'

const store = configureStore({
  reducer: {
    // 定义一个名为 `todos` 的顶级 state 字段，值为 `todosReducer`
    todos: todosReducer,
    filters: filtersReducer
  }
})

export default store
```

`configureStore` 为我们完成了所有工作：

  - 自动组合 slice reducers 来创建根 reducer
  - 自动添加更多 `middleware` 来检查常见错误，例如意外改变`（mutate）state`
  - 自动设置 `Redux DevTools` 扩展连接

### 🐱 createSlice

- `createSlice` 简化了 `Redux actions` 和 `reducers` 的编写

- 根据 `slice/reducer` 名称自动生成 `action creators`

- `Reducers` 可以使用 `Immer` 在 `createSlice` 中 `“改变”（mutate）state`


``` jsx
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  entities: [],
  status: null
}

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded(state, action) {
      // ✅ “突变”（mutate）代码在 createSlice 中是可以的！
      state.entities.push(action.payload)
    },
    todoToggled(state, action) {
      const todo = state.entities.find(todo => todo.id === action.payload)
      todo.completed = !todo.completed
    },
    todosLoading(state, action) {
      return {
        ...state,
        status: 'loading'
      }
    }
  }
})

export const { todoAdded, todoToggled, todosLoading } = todosSlice.actions

export default todosSlice.reducer

```

- `createSlice` 接收一个包含三个主要选项字段的对象：
  - `name`：一个字符串，将用作生成的 `action types` 的前缀
  - `initialState`：`reducer` 的初始 `state`
  - `reducers`：一个对象，其中键是字符串，值是处理特定 `actions` 的 `case reducer` 函数


### 🐱 createAsyncThunk

- `createAsyncThunk` 为异步调用生成 `thunk`
  - `dispatch thunk` 运行 `payload creator` 并 `dispatch actions`
  - 可以在 `createSlice.extraReducers` 中处理 `thunk actions`


- `createAsyncThunk` 接收两个参数：
  - 一个字符串，用作生成的 `action types` 的前缀
  - 一个 `payload creator` 回调函数，应该返回一个 `Promise`。这通常使用 `async/await` 语法编写，因为 `async` 函数会自动返回一个 `Promise`。

``` jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// 省略 imports 和 state

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await client.get('/fakeApi/todos')
  return response.todos
})

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // 省略 reducer cases
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        const newEntities = {}
        action.payload.forEach(todo => {
          newEntities[todo.id] = todo
        })
        state.entities = newEntities
        state.status = 'idle'
      })
  }
})

// 省略 exports
```

### 🐱 createEntityAdapter

`createEntityAdapter` 为标准化 `state` 提供了 `reducers + selectors`

  - 自动生成一个 `thunk + pending/fulfilled/rejected action creators`
  - 包括用于常见任务的 `reducer` 功能，例如添加/更新/删除 `items`
  - 为 `selectAll` 和 `selectById` 生成记忆化 `selectors`