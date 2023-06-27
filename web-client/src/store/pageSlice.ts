import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";
import LangPack from "../../shared/types/lang";

const languages = {
	en: require("../../shared/locales/en").default as typeof LangPack,
	initial: require("../../shared/locales/template").default as typeof LangPack,
};

interface InitialStateType {
	hostURL: string;
	lang: typeof LangPack;
}

const initialState: InitialStateType = {
	hostURL: process.env.NEXT_PUBLIC_SERVER_URL as string,
	lang: languages["initial"],
};

export const pageSlice = createSlice({
	name: "page",
	initialState,
	reducers: {
		setLanguage: (state, value: PayloadAction<typeof LangPack>) => {
			state.lang = value.payload;
		},
	},
});

export default pageSlice.reducer;
export const { setLanguage } = pageSlice.actions;
