import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

import { Nav } from './Nav/Nav';

import './Layout.css';

import { useAppSelector } from '#/hooks/redux';
import { userSelect } from '#/redux/slices/userSlice';

export const Layout = () => {
	const isUserChecked = useAppSelector(userSelect.isChecked);
	const isAuthenticated = useAppSelector(userSelect.isAuthenticated);
	const isAdmin = useAppSelector(userSelect.isAdmin);
	const navigate = useNavigate();
	const { pathname, search } = useLocation();
	const [checkedPath, setCheckedPath] = useState('');
	const isPathChecked = pathname === checkedPath;

	useEffect(() => {
		if (isUserChecked) {
			if (pathname !== '/login' && !isAuthenticated) {
				navigate(`/login?return=${encodeURIComponent(`${pathname}${search}`)}`);
			} else {
				if (isAdmin && !pathname.startsWith('/admin')) {
					navigate('/admin/book');
				} else if (!isAdmin && pathname.startsWith('/admin')) {
					navigate('/browse');
				}
				setCheckedPath(pathname);
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
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
