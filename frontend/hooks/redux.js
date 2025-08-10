import { useDispatch, useSelector } from 'react-redux';

/**
 * @import { TypedUseSelectorHook } from 'react-redux'
 * @import { store } from '../redux/store.js'
 *
 * @typedef {ReturnType<typeof store.getState>} RootState
 * @typedef {typeof store.dispatch} AppDispatch
 */

/** @type {() => AppDispatch} */
export const useAppDispatch = useDispatch;

/** @type {TypedUseSelectorHook<RootState>} */
export const useAppSelector = useSelector;
