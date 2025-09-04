import { useDispatch, useSelector, useStore } from 'react-redux';

/**
 * @import { TypedUseSelectorHook } from 'react-redux'
 * @import { store } from '../redux/store.js'
 *
 * @typedef {ReturnType<typeof store.getState>} RootState
 * @typedef {typeof store.dispatch} AppDispatch
 * @typedef {typeof store} AppStore
 */

/** @type {() => AppDispatch} */
export const useAppDispatch = useDispatch.withTypes();

/** @type {TypedUseSelectorHook<RootState>} */
export const useAppSelector = useSelector;

/** @tpye {() => AppStore} */
export const useAppStore = useStore;
