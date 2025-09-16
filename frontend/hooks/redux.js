/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
import { useDispatch, useSelector } from 'react-redux';

/**
 * @import { TypedUseSelectorHook } from 'react-redux'
 * @import { AppDispatch, RootState } from '../redux/store.js'
 *
 */

/** @type {() => AppDispatch} */
export const useAppDispatch = useDispatch.withTypes();

/** @type {TypedUseSelectorHook<RootState>} */
export const useAppSelector = useSelector;
