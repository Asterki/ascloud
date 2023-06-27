import { NextPage } from "next";
import { motion } from "framer-motion";

import styles from "../styles/components/modal.module.scss";

interface ComponentProps {
	children: any;
	modalOpen: boolean;
	modalTitle: string;
}

const Modal: NextPage<ComponentProps> = (props) => {
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
			<div className={styles["modal-content"]}>
				<h1>{props.modalTitle}</h1>

				{props.children}
			</div>
		</motion.div>
	);
};

export default Modal;
