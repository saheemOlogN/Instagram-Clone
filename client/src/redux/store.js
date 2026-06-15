import {configureStore} from "@reduxjs/toolkit"
import authSlice from "./authSlice.js"

import { combineReducers } from 'redux'
import { persistStore, persistReducer,FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER } from 'redux-persist'
import storageImport from 'redux-persist/lib/storage' // defaults to localStorage for web
import  postSlice  from "./postSlice.js"
import socketSlice from "./socketSlice.js"
import chatSlice from "./chatSlice.js"

const storage = storageImport?.default || storageImport

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
    auth:authSlice,
    post:postSlice,
    socketio:socketSlice,
    chat:chatSlice
})
const persistedReducer = persistReducer(persistConfig, rootReducer)


const store = configureStore({
   reducer:persistedReducer,
   middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
        serializableCheck:{
            ignoredActions:[FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER],
        },
    }),
    devTools: true
})

export const persistor = persistStore(store)

export default store
