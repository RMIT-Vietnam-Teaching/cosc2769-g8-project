/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useMatches, useNavigate } from 'react-router';

import { Footer } from './Footer/Footer';
import { Nav } from './Nav/Nav';

import './Layout.css';

import { useAppSelector } from '#/hooks/redux';
import { userSelect } from '#/redux/slices/userSlice';

export const Layout = () => {
	const isUserChecked = useAppSelector(userSelect.isChecked);
	const isAuthenticated = useAppSelector(userSelect.isAuthenticated);
	const role = useAppSelector(userSelect.role);
	const navigate = useNavigate();
	const { pathname, search } = useLocation();

	const currentRoute = /** @type {app.AppUIMatch} */(useMatches().at(-1));
	const layoutRoute = /** @type {app.AppLayoutUIMatch} */(useMatches().at(0));
	const [checkedPath, setCheckedPath] = useState('');
	const isPathChecked = pathname === checkedPath;

	useEffect(() => {
		if (isUserChecked) {
			if (currentRoute?.handle?.requireAuth === true) {
				if (!isAuthenticated) {
					navigate(`/login?return=${encodeURIComponent(`${pathname}${search}`)}`);
				} else if (currentRoute.handle.roles != null && role != null && !currentRoute.handle.roles.includes(role)) {
					navigate(layoutRoute.handle.defaultRouteForRole[role]);
				} else {
					setCheckedPath(pathname);
				}
			} else {
				setCheckedPath(pathname);
			}
		}
	}, [isUserChecked, isAuthenticated, navigate, pathname]);

	return (
		<div className='layout__container vw-100 vh-100 d-flex flex-column'>
			<Nav />

			<main className='layout__main vw-100 overflow-auto bg-body-tertiary d-flex flex-column'>
				<div className='flex-grow-1'>
					{isPathChecked ? <Outlet /> : null}
				</div>
				<Footer />
			</main>
		</div>
	);
};
