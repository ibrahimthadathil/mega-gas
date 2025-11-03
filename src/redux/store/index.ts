import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "@/redux/slice/auth/authSlicer";
import { PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { encryptor } from "@/lib/persister/persister_encryptor";
import persistReducer from "redux-persist/es/persistReducer";

const persist_Config: PersistConfig<RootState> = {
  key: "root",
  version: 1,
  whitelist: ["user"],
  storage,
  transforms: [encryptor],
  // Throttle writes to storage to improve performance (ms)
  throttle: 200,
  // Write to storage with a delay to batch updates
  writeFailHandler: (err) => {
    console.error("Persist write error:", err);
  },
};

type RootState = ReturnType<typeof rootReducer>;
const rootReducer = combineReducers({
  user: authSlice,
});
const PersisitedReducer = persistReducer(persist_Config, rootReducer);

const store = configureStore({
  reducer: PersisitedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type Rootstate = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
