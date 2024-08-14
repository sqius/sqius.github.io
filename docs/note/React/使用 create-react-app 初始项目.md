# 使用 create-react-app 初始项目

## 🚁 创建项目

- 使用 `create-react-app` 创建项目
``` bash
npx create-react-app your-app-name --template redux-typescript
```

- 安装需要的依赖
``` bash
npm install react-router-dom @types/react-router-dom antd
npm install axios -S
npm install sass -D
```

- 释放 `config`
``` bash
npm run eject
```

## 🚁 配置别名

``` ts title="webpack.config.ts" {2}
alias: {
  "@": path.resolve(__dirname, "../src"),
},
```

``` json title="tsconfig.json" {2,3}
{
  "baseUrl": "./",
  "paths": { "@/*": ["src/*"] }
}
```

## 🚁 配置路由

``` tsx title="src/index.tsx" {3,15,17}
import { createRoot } from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";

import "./index.scss";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

```

``` tsx title="src/App.tsx"
import { Navigate, Route, Routes } from "react-router-dom";
import { routersData } from "./app/config";
import Layout from "./components/layout";
import Login from "./pages/login";
import "./App.scss";

function App() {
  return (
    <Routes>
      {/* 默认重定向到 login */}
      <Route path="/" element={<Navigate to={"/login"}></Navigate>}></Route>
      {/* 登录 */}
      <Route path={routersData.login.path} element={<Login />} />
      {/* Layout 包裹 实现 Outlet */}
      <Route element={<Layout />}>
        <Route path={routersData.page1.path} element={<page1 />} />
        <Route path={routersData.page2.path} element={<page2 />} />
        <Route path={routersData.page3.path} element={<page3 />} />
      </Route>
    </Routes>
  );
}

export default App;
```

## 🚁 配置 `Axios`

- `create-react-app` 配置 `Proxy`

```json title="package.json"
  "proxy": "http://localhost:4000",
```

``` ts title="http.ts"
import axios from "axios";

const instance = axios.create({
});

export type AxiosRes<T = ResData> = {
    config: Object,
    data: T,
    headers: any,
    request: any,
    status: number,
    statusText: string
}

export type ResData<T = any> = {
    code: number,
    msg: string,
    data: T
}

export default instance
```

## 🚁 配置 `Store`

- createSlice
``` ts title="src/store/slice/demo.ts"
import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const xxSlice = createSlice({
  initialState,
  name: "demo",
  reducers: {},
  extraReducers: (builder) => {
  }
});

export default demoSlice.reducer;
```

- configureStore

``` tsx title="src/store/index.ts"
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import demo1Reducer from "./slice/demo1";
import demo2Reducer from "./slice/demo2";

// 类型定义
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const store = configureStore({
  reducer: { demo1: demo1Reducer, demo2: demo2Reducer },
});

```

- 一个请求示例

``` ts title="src/store/slice/demo.ts"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosRes, ResData } from "@/util/http";
import { RootState } from "../";

const initialState = {
  source_data: [],
  select_data: null,
};

export const fetchDemoSourceData = createAsyncThunk(
  "demo/fetchDemoSourceData",
  async () => {
    const { data }: AxiosRes = await axios.get("/api//xxx/xxx");
    return data.data;
  }
);

const demoSlice = createSlice({
  initialState,
  name: "demo",
  reducers: {
    set_demo_select_data: (state, action) => {
      state.select_data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDemoSourceData.fulfilled, (state, action) => {
      state.source_data = action.payload;
    });
  },
});

export const select_demo_source_data = (state: RootState) => {
  return state.demo.source_data;
};

export const select_demo_select_data = (state: RootState) => {
  return state.demo.select_data;
};

// 返回 reducer
export const { set_demo_select_data } = demoSlice.actions;

export default demoSlice.reducer;

```

``` tsx title="scr/pages/demo/index.tsx"

import { useEffect } from "react";
import styles from "./index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchDemoSourceData, select_demo_source_data, select_demo_select_data, set_demo_select_data } from "@/store/slice/demo";

function Demo() {
  const dispatch: AppDispatch = useDispatch();
  const sourceData = useSelector(select_demo_source_data);
  const currentData = useSelector(select_demo_select_data);

  // 默认选中数据中的第一项
  useEffect(() => {
    dispatch(fetchDemoSourceData()).then((res) => {
      const { title, value } = res.payload[0];
      dispatch(set_demo_select_data({ value, title }));
    });
  }, []);


  // 改变时
  const handleLessonChange = (value: any, labelList: React.ReactNode[]) => {
    dispatch(set_demo_select_data({ value, title: labelList[0] }));
  };

  // ......
}

export default Demo

```