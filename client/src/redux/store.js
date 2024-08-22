import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from './user/userSlice';
import uiSettingReducer from "./uiSetting/uiSettingsSlice";
import categoryReducer from './categories/categorySlice';
import productsReducer from './products/productsSlice';
import {persistReducer, persistStore} from 'redux-persist';
import storage from "redux-persist/lib/storage";


const rootReducer = combineReducers({user: userReducer, uisetting: uiSettingReducer, categories: categoryReducer, products: productsReducer});

const persistConfig = {
    key: 'root',
    storage,
    version: 1
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
