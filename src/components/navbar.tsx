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
				<div className={styles["top-navbar"]}>
					<div className={styles["branding"]}>
						<h1>AsCloud</h1>
						<p>Open Source Cloud/Local Storage Service</p>
					</div>

					<div
						className={styles["navbar-menu-trigger"]}
						onClick={() => setNavbarMenuOpen(!navbarMenuOpen)}
					>
						<p>{props.user.username}</p>
					</div>

					<motion.div
						variants={{
							open: {
								opacity: 1,
								transition: { duration: 0.1 },
								position: "absolute",
								display: "block",
							},
							closed: {
								opacity: 0,
								transition: { duration: 0.1 },
								transitionEnd: {
									display: "none",
								},
							},
						}}
						animate={navbarMenuOpen ? "open" : "closed"}
						initial={"closed"}
						className={styles["navbar-menu"]}
					>
						<button>ejqwoiej</button>
						<button>ejqwoiej</button>
						<button>ejqwoiej</button>
						<button>ejqwoiej</button>
					</motion.div>
				</div>

				<div className={styles["left-navbar"]}>
					<div>
						<button>
							<img src="/svg/folder.svg" alt="" />
							Personal folder
						</button>
						<button>
							<img src="/svg/link.svg" alt="" />
							Shared
						</button>
					</div>
					<div>
						<button>
							<img src="/svg/delete-bin.svg" alt="" />
							Trash
						</button>
						<br />
						<br />
						AsCloud, open source at <a href="">GitHub</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
