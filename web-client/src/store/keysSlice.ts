import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

interface InitialStateType {
	storageKey: string | null;
	storageIV: string | null;
}

const initialState: InitialStateType = {
	storageKey: null,
	storageIV: null,
};

export const keysSlice = createSlice({
	name: "page",
	initialState,
	reducers: {
		setKeys: (state, value: PayloadAction<{ iv: string; key: string }>) => {
			state.storageIV = value.payload.iv;
			state.storageKey = value.payload.key;
		},
	},
});

export default keysSlice.reducer;
export const { setKeys } = keysSlice.actions;
