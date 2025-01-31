"use client"

import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'

import styles from "../../styles/components/header.module.scss"

import { IconType } from 'react-icons'
import { IoFastFoodOutline } from 'react-icons/io5'

interface IProps {
	href: string;
	icon: IconType,
	name: string;
}
interface INavigationProps {
  navLinks: IProps[];
}

export const Navigation: React.FC<INavigationProps> = ({ navLinks }) => {
	const pathname = usePathname();

  return (
    <header className={styles.header}>
			<nav>
				<Link href={"/"}>
					<IoFastFoodOutline size={60}/>
				</Link>

				<ul>
					{navLinks.map((link: IProps) => {
						const isActive = pathname === link.href;

						return (
							<li key={link.name}>
								<Link href={link.href} className={isActive ? styles.active : ""} prefetch={true}>
									{link.icon}
									<span>{link.name}</span>
								</Link>
							</li>
						)
					})}
				</ul>
			</nav>
  	</header>
  )
}
