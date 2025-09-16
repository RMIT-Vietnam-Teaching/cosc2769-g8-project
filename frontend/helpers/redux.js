/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
import { asyncThunkCreator, buildCreateSlice } from '@reduxjs/toolkit';

const helper = {};

helper.createSlice = buildCreateSlice({
	creators: { asyncThunk: asyncThunkCreator },
});

export const reduxHelper = helper;
