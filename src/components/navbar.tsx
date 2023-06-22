import React from "react";
import { NextPage } from "next";
import { motion } from "framer-motion";

import styles from "../styles/components/navbar.module.scss";
import { User } from "../../shared/types/models";

interface ComponentProps {
	user: User;
}

const Navbar: NextPage<ComponentProps> = (props) => {
	const [navbarMenuOpen, setNavbarMenuOpen] = React.useState<boolean>(false);

	return (
		<div className={styles["component"]}>
			<div className={styles["navbar"]}>
				<div className={styles["branding"]}>
					<h1>AsCloud</h1>
					<p>Open Source Cloud/Local Storage Service</p>
				</div>

				<div className={styles["navbar-menu-trigger"]}>
					<p>{props.user.username}</p>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
