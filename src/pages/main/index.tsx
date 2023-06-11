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
				<motion.div
					variants={{
						visible: {
							opacity: 1,
							y: 0,
							transition: { duration: 0.3, delay: 0.5 },
							display: "flex",
						},
						hidden: {
							opacity: 0,
							y: -100,
							transition: { duration: 0.3, delay: 0.5 },
							transitionEnd: {
								display: "none",
							},
						},
					}}
					initial="hidden"
					animate="visible"
					className={styles["homepage-navbar"]}
				>
					<div className={styles["left-bar"]}>
						<h1>AsCloud</h1>

						<nav>
							<Link href="/placeholder">About</Link>
							<Link href="/placeholder">Open Source</Link>
						</nav>
					</div>
					<div className={styles["right-bar"]}>
						<nav>
							<Link href="/login">Login</Link>
							<Link href="/login">Register</Link>
						</nav>
					</div>
				</motion.div>

				<div className={styles["main-content"]}>
					<motion.div
						variants={{
							visible: {
								opacity: 1,
								y: 0,
								transition: { duration: 0.5 },
								display: "flex",
							},
							hidden: {
								opacity: 0,
								y: 100,
								transition: { duration: 0.5 },
								transitionEnd: {
									display: "none",
								},
							},
						}}
						initial="hidden"
						animate="visible"
						className={styles["title"]}
					>
						<h1>AsCloud</h1>
						<p>Open source cloud/local storage service</p>
					</motion.div>

                    <div className={styles["features"]}>
                        <h1>Features</h1>
                        <img src="https://placehold.co/600x400/000000/FFFFFF/png" alt="" />
                    </div>
				</div>
			</main>
		</div>
	);
};

export default Index;
