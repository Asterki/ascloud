// * Imports
// Lib Imports
import React from "react";

// components Imports
import { motion } from "framer-motion";

// Styles And Types Imports
import styles from "@/styles/accounts/settings/index.module.scss";
import { User } from "@/../shared/types/models";
import { GetServerSideProps, NextPage } from "next";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	if (!context.req.isAuthenticated())
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};

	return {
		props: {
			user: JSON.parse(JSON.stringify(context.req.user)),
		},
	};
};

interface PageProps {
	user: User;
}

const Settings: NextPage<PageProps> = (props) => {
	return (
		<div className={styles["page"]}>
			<main>
				<motion.div
					variants={{
						showing: {
							opacity: 1,
							y: 0,
						},
						hidden: {
							opacity: 0,
							y: -100,
						},
					}}
					initial={"hidden"}
					animate={"showing"}
					className={styles["settings-form"]}
				>
					<div className={styles["left-content"]}>
						<h1>Settings</h1>

						<button>General</button>
						<button>Account</button>
						<button>Notifications</button>
						<button>Security</button>
					</div>

					<div className={styles["right-content"]}>
                        <h1>General Information</h1>
						
                        <h2>Username: {props.user.username}</h2>
                        <h2>User ID: {props.user.userID}</h2>
                        <h2>Email: {props.user.email.value}</h2>
                        <h2>Storage Limit: {props.user.storageLimit}</h2>
					</div>
				</motion.div>
			</main>
		</div>
	);
};

export default Settings;
