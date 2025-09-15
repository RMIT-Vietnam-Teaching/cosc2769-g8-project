import { asyncThunkCreator, buildCreateSlice } from '@reduxjs/toolkit';

const helper = {};

helper.createSlice = buildCreateSlice({
	creators: { asyncThunk: asyncThunkCreator },
});

export const reduxHelper = helper;
