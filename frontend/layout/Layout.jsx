import { useEffect, useState } from 'react';
import { Outlet, useLocation, useMatches, useNavigate } from 'react-router';

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
		<div className='layout__container vw-100 vh-100'>
			<Nav />

			<main className='layout__main vw-100 overflow-auto bg-body-tertiary'>
				{isPathChecked ? <Outlet /> : null}
			</main>
		</div>
	);
};
