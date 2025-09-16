import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { MdAccountCircle, MdOutlineLogin, MdOutlineLogout, MdPerson } from 'react-icons/md';
import { NavLink } from 'react-router';
import { FaCartShopping } from "react-icons/fa6";


import { fetchHelper } from '#/helpers/fetch';
import { useAppDispatch, useAppSelector } from '#/hooks/redux';
import { userAction, userSelect } from '#/redux/slices/userSlice';
import {useSelector} from "react-redux";
import {productsSelectors} from "#/redux/slices/productSlice.js";

export const NavItems = () => {
	const user = useAppSelector(userSelect.info);
    const products = useSelector(productsSelectors.products);
    const cartCount = products.length;
	const dispatch = useAppDispatch();
	/** @type {import('react').Ref<HTMLDivElement>} */
	const logoutToastRef = useRef(null);

	const handleLogOut = async () => {
		let hasError = false;
		try {
			/** @type {app.Response} */
			const res = await fetchHelper.post('/api/logout').json();
			if (res.success) {
				dispatch(userAction.clearUser());
			} else {
				hasError = true;
			}
		} catch {
			hasError = true;
		}

		if (hasError && logoutToastRef.current != null) {
			bootstrap.Toast.getOrCreateInstance(logoutToastRef.current).show();
		}
	};

	return (<>
		{user == null ? (
			<li className='nav-item'>
				<NavLink className='nav-link' to='/login'>
					<MdOutlineLogin /> Login
				</NavLink>
			</li>
		) : (<>
            <li className='nav-item'>
                <NavLink className='nav-link' to='/cart'>
                    <FaCartShopping />
                    {(() => {
                        return cartCount > 0 ? (
                            <span
                                className='badge rounded-pill bg-danger ms-2'
                                style={{ fontSize: '0.75rem', lineHeight: 1, padding: '0.35rem 0.5rem' }}
                                aria-label={`Items in cart: ${cartCount}`}
                            >
          {cartCount}
        </span>
                        ) : null;
                    })()}

                </NavLink>
            </li>
                <li className='nav-item'>
                    <NavLink className='nav-link' to='/shipper'>
                        Shipper
                    </NavLink>
                </li>
                <li className='nav-item dropdown'>
                    <a className='nav-link active dropdown-toggle' href='#' role='button' data-bs-toggle='dropdown' aria-expanded='false'>
                        <MdAccountCircle /> {user.name}
                    </a>
                    <ul className='dropdown-menu dropdown-menu-end'>
                        <li>
                            <NavLink className='dropdown-item' to='/my-account'>
                                <MdPerson /> My Account
                            </NavLink>
                        </li>
                        <li><hr className='dropdown-divider' /></li>
                        <li>
                            <a className='dropdown-item' href='#' onClick={handleLogOut}>
                                <MdOutlineLogout /> Log Out
                            </a>
                        </li>
                    </ul>
                </li>
		</>)}

		{createPortal(
			<div className='toast-container position-fixed top-content start-0 p-3'>
				<div ref={logoutToastRef} className='toast rounded-4 border-0' role='alert' aria-live='assertive' aria-atomic='true'>
					<div className='toast-body alert alert-danger m-0 d-flex justify-content-between'>
						Unable to Log Out!
						<button type='button' className='btn-close' data-bs-dismiss='toast' aria-label='Close'></button>
					</div>
				</div>
			</div>,
			document.body,
		)}
	</>);
};
