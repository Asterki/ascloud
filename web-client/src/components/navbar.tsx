import React from "react";

import Img from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

import styles from "../styles/components/navbar.module.scss";
import { User } from "../../../shared/types/models";
import { NextPage } from "next";

interface ComponentProps {
	user: User;
	currentPage: "personal" | "shared" | "trash";
}

const Navbar: NextPage<ComponentProps> = (props) => {
	const router = useRouter();

	const [navbarMenuOpen, setNavbarMenuOpen] = React.useState<boolean>(false);

	return (
		<div className={styles["component"]}>
			<div className={styles["navbar"]}>
				<div className={styles["top-navbar"]}>
					<div className={styles["branding"]}>
						<h1>AsCloud</h1>
						<p>Open Source Cloud/Local Storage Service</p>
					</div>

					<motion.div
						variants={{
							open: {
								filter: "brightness(1.2)",
							},
							closed: {
								filter: "brightness(1)",
							},
						}}
						animate={navbarMenuOpen ? "open" : "closed"}
						initial={"closed"}
						className={styles["navbar-menu-trigger"]}
						onClick={() => setNavbarMenuOpen(!navbarMenuOpen)}
					>
						<p>{props.user.username}</p>

						<motion.img
							variants={{
								open: {
									rotate: "180deg",
								},
								closed: {
									rotate: "0deg",
								},
							}}
							animate={navbarMenuOpen ? "open" : "closed"}
							initial={"closed"}
							src="/svg/upload.svg"
							alt=""
						/>
					</motion.div>

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
						<div className={styles["left-navbar-mobile"]}>
							<button
								onClick={() => router.push("/home")}
								className={props.currentPage == "personal" ? styles["active"] : ""}
							>
								Personal Folder
							</button>
							<button
								onClick={() => router.push("/home/shared")}
								className={props.currentPage == "shared" ? styles["active"] : ""}
							>
								Shared
							</button>
							<button
								onClick={() => router.push("/home/trash")}
								className={props.currentPage == "trash" ? styles["active"] : ""}
							>
								Trash
							</button>

							<hr />
						</div>

						<button onClick={() => router.push("/accounts/settings")}>Settings</button>
						<button onClick={() => router.push("/main/about")}>About</button>
						<button onClick={() => router.push("/home/trash")}>Placeholder</button>
					</motion.div>
				</div>

				<div className={styles["left-navbar"]}>
					<div>
						<button
							onClick={() => router.push("/home")}
							className={props.currentPage == "personal" ? styles["active"] : ""}
						>
							<Img width={30} height={30} src="/svg/folder.svg" alt="folder" />
							Personal folder
						</button>
						<button
							onClick={() => router.push("/home/shared")}
							className={props.currentPage == "shared" ? styles["active"] : ""}
						>
							<Img width={30} height={30} src="/svg/link.svg" alt="link" />
							Shared
						</button>
					</div>
					<div>
						<button
							onClick={() => router.push("/home/trash")}
							className={props.currentPage == "trash" ? styles["active"] : ""}
						>
							<Img width={30} height={30} src="/svg/delete-bin.svg" alt="bin" />
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
