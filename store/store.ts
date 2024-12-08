import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  type WebStorage,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  createMigrate,
} from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import configReducer from './config-slice';
import configPassportReducer from './config-passport-slice';

const createNoopStorage = (): WebStorage => {
  return {
    getItem(_key: string): Promise<string | null> {
      return Promise.resolve(null);
    },
    setItem(_key: string, _item: string): Promise<void> {
      return Promise.resolve();
    },
    removeItem(_key: string): Promise<void> {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage();

const migrations = {
  0: (state: any) => {
    return {
      ...state,
      Config: {
        ...state.Config,
        genericRpcMethodName: 'magic_auth_login_with_email_otp',
        genericRpcMethodParams:
          '{"showUI": true, "email": "david.he@magic.link"}',
      },
    };
  },
};

const persistConfig = {
  key: 'root',
  storage,
  version: 0,
  migrate: createMigrate(migrations, { debug: false }),
};

const rootReducer = combineReducers({
  Config: configReducer,
  ConfigPassport: configPassportReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
