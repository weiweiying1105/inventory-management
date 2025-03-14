"use client"
import { useRef } from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  Provider,
} from "react-redux";
import globalReducer from "./state";
import { api } from "./state/api";
import { setupListeners } from "@reduxjs/toolkit/query";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

/* REDUX PERSISTENCE */
// 创建一个空存储函数
const createNoopStorage = () => {
  // 返回一个对象，包含三个方法
  return {
    // 获取指定键的值，返回一个Promise，如果键不存在，则返回null
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    // 设置指定键的值，返回一个Promise，如果设置成功，则返回设置的值
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    // 删除指定键的值，返回一个Promise，如果删除成功，则返回undefined
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window === "undefined"
    ? createNoopStorage()
    : createWebStorage("local");

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["global"],
};
const rootReducer = combineReducers({
  global: globalReducer,
  [api.reducerPath]: api.reducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

/* REDUX STORE */
// 导出一个函数makeStore，用于创建store
export const makeStore = () => {
  // 使用configureStore函数创建store，传入reducer和middleware参数
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      // 获取默认的middleware，并传入serializableCheck参数，忽略指定的action
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(api.middleware),
  });
};

/* REDUX TYPES */
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
// 导出一个名为useAppDispatch的函数，该函数返回一个AppDispatch类型的dispatch函数
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/* PROVIDER */
// 导出一个默认函数，名为StoreProvider
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // 使用useRef创建一个AppStore的引用
  const storeRef = useRef<AppStore | undefined>();
  // 如果storeRef中没有当前值，则创建一个新的store，并设置监听器
  if (!storeRef.current) {
    storeRef.current = makeStore();
    setupListeners(storeRef.current.dispatch);
  }
  // 使用persistStore创建一个持久化的store
  const persistor = persistStore(storeRef.current);

  // 返回一个Provider组件，将storeRef.current作为store传入
  return (
    <Provider store={storeRef.current}>
      {/* 使用PersistGate组件，将persistor传入，loading设置为null，表示不显示加载中状态 */}
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}