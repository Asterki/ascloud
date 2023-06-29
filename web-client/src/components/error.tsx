import * as React from "react";

import { motion } from "framer-motion";

import { NextPage } from "next";
import styles from "../styles/components/error.module.scss";

interface ComponentProps {
	modalOpen: boolean;
}

const ErrorModal: NextPage<ComponentProps> = (props) => {
	const reloadPage = () => {
		return window.location.reload();
	};

	return (
		<motion.div
			variants={{
				visible: {
					opacity: 1,
					transition: { duration: 0.1 },
					display: "flex",
				},
				hidden: {
					opacity: 0,
					transition: { duration: 0.1 },
					transitionEnd: {
						display: "none",
					},
				},
			}}
			initial="hidden"
			animate={props.modalOpen ? "visible" : "hidden"}
			className={styles["component"]}
		>
			<main>
				<h1>Error</h1>
				<p>Something went wrong with AsCloud and the client could not recover from it</p>

				<button onClick={reloadPage}>Reload the page</button>

				<br />
				<br />

				<p>If the error persists, please contact your service administrator</p>
			</main>
		</motion.div>
	);
};

export default ErrorModal;
