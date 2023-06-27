import * as React from "react";
import locale from "locale";

import Head from "next/head";

import { store } from "@/store";
import { Provider } from "react-redux";
import { setLanguage } from "@/store/pageSlice";

import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import LangPack from "../../../shared/types/lang";

const CustomApp = ({ Component, pageProps }: AppProps) => {
	React.useEffect(() => {
		if ("language" in navigator) {
			const languages = {
				en: require("../../locales/en").default as typeof LangPack,
			};

			// Get the supported language files and the languages that the browser supports
			const supported = new locale.Locales("en".split(","));
			const locales = new locale.Locales(navigator.language);

			// Get the language file using the best match, then load it into the state
			const language: string = locales.best(supported).language;
			store.dispatch(setLanguage(languages[language as "en"]));
		}

		// if ("serviceWorker" in navigator) {
		// 	navigator.serviceWorker
		// 		.register("/serviceWorker.js")
		// 		.then((reg) => console.log("Registered service worker"))
		// 		.catch((err) => console.log("Failure: ", err));
		// }
	}, []);

	return (
		<Provider store={store}>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=1" />
				<meta name="theme-color" content="#5294e2" />

				{/* PWA Stuff */}
				{/* <link rel="apple-touch-icon" href="/apple-touch-icon.png"></link> */}
				{/* <link rel="manifest" href="manifest.json" /> */}

				{/* <!-- Primary Meta Tags --> */}
				<title>AsCloud</title>
				<meta name="title" content="AsCloud" />
				<meta name="description" content="Cloud storage service" />
				<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />

				{/* <!-- Open Graph / Facebook --> */}
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://ascloud.ml/" />
				<meta property="og:title" content="AsCloud" />
				<meta property="og:description" content="Cloud storage service" />
				<meta property="og:image" content="/assets/images/banner.png" />

				{/* <!-- Twitter --> */}
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://ascloud.ml/" />
				<meta property="twitter:title" content="AsCloud" />
				<meta property="twitter:description" content="Cloud storage service" />
				<meta property="twitter:image" content="/assets/images/banner.png" />
			</Head>
			<Component {...pageProps} />
		</Provider>
	);
};

export default CustomApp;
