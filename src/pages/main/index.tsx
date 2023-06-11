import React from "react";

import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";

import { useSelector } from "react-redux";
import { RootState } from "../../store";

import styles from "../../styles/main/index.module.scss";
import { GetServerSideProps, NextPage } from "next";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	if (context.req.isAuthenticated())
		return {
			redirect: {
				destination: "/home",
				permanent: false,
			},
		};

	return {
		props: {},
	};
};

const Index: NextPage = () => {
	return (
		<div className={styles["page"]}>
			<main>
				<div className={styles["homepage-navbar"]}>
					<div className={styles["left-bar"]}>
						<h1>AsCloud</h1>

						<nav>
							<a href="/placeholder">About</a>
							<a href="/placeholder">Open Source</a>
						</nav>
					</div>
					<div className={styles["right-bar"]}>
						<nav>
							<a href="/login">Login</a>
							<a href="/login">Register</a>
						</nav>
					</div>
				</div>

				<div className={styles["title"]}>
					<h1>AsCloud</h1>
					<p>Open source cloud/local storage service</p>
				</div>
			</main>
		</div>
	);
};

export default Index;
