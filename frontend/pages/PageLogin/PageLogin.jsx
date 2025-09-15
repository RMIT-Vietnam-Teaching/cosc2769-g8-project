import { useActionState, useEffect } from 'react';
import { NavLink, useHref, useLocation, useNavigate } from 'react-router';
import Select from 'react-select';

import { fetchHelper } from '#/helpers/fetch';
import { reactSelectHelper } from '#/helpers/reactSelect';
import { useCheckInput, useSelect, useTextInput } from '#/hooks/input';
import { useAppDispatch, useAppSelector } from '#/hooks/redux';
import { userAction, userSelect } from '#/redux/slices/userSlice';

/**
 * @typedef {{ user: app.User | null, errors: string[] }} ResData;
 *
 * @param {any} _
 * @param {FormData} form
 * @returns {Promise<ResData>}
 */
const login = async (_, form) => {
	/** @type {app.Response<app.User>} */
	const res = await fetchHelper.post('/api/login', {
		role: form.get('role')?.toString() ?? '',
		username: form.get('username')?.toString() ?? '',
		password: form.get('password')?.toString() ?? '',
		remember: form.has('remember'),
	}).json();

	await new Promise(resolve => setTimeout(resolve, 200));

	if (res.success) {
		return { user: res.data, errors: [] };
	} else {
		return { user: null, errors: res.error.__global };
	}
};

const roleSelectOptions = /** @type {const} */([
	{ value: 'Customer', label: 'Customer' },
	{ value: 'Shipper', label: 'Shipper' },
	{ value: 'Vendor', label: 'Vendor' },
]);

export const PageLogin = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const returnHref = useHref(decodeURIComponent(new URLSearchParams(location.search).get('return') ?? '/'));
	const isAuthenticated = useAppSelector(userSelect.isAuthenticated);

	const [role, _setRole, handleRole] = useSelect(/** @type {(typeof roleSelectOptions)[number]} */(roleSelectOptions[0]));
	const [username, _setUsername, handleUsername] = useTextInput('');
	const [password, _setPassword, handlePassword] = useTextInput('');
	const [remember, _setRemember, handleRemember] = useCheckInput(false);

	const [{ user, errors }, formAction, isPending] = useActionState(login, { user: null, errors: [] });

	useEffect(() => {
		if (user != null) dispatch(userAction.setUser(user));
	}, [user, dispatch]);

	useEffect(() => {
		if (isAuthenticated) navigate(returnHref);
	}, [navigate, isAuthenticated]);

	if (isAuthenticated) {
		return null;
	}

	return (<>
		<title>Log In</title>
		<div className='container-fluid h-100'>
			<div className='row justify-content-center h-100'>
				<div className='col-12 col-sm-9 col-md-8 col-lg-6 col-xl-5 col-xxl-4 d-flex flex-column justify-content-xs-start justify-content-md-center'>
					<div className='my-4 d-flex flex-column gap-4 p-5 rounded-2 shadow bg-body'>
						<h4 className='m-0'>Welcome to <span className='text-primary'>Shop</span></h4>
						<form action={formAction} className='d-flex flex-column gap-3'>
							<Select
								className='react-select__container z-3'
								classNames={reactSelectHelper.classNames}
								options={roleSelectOptions}
								value={role}
								name='role'
								onChange={/** @type {(e: any) => any} */(handleRole)}
							/>

							<div className='form-floating'>
								<input
									type='text' className='form-control' id='username' placeholder='Username'
									name='username' autoComplete='username'
									value={username} onChange={handleUsername}
								/>
								<label htmlFor='username'>Username</label>
							</div>

							<div className='form-floating'>
								<input
									type='password' className='form-control' id='password' placeholder='Password'
									name='password' autoComplete='current-password'
									value={password} onChange={handlePassword}
								/>
								<label htmlFor='password'>Password</label>
							</div>

							<div className='form-check'>
								<input
									className='form-check-input' type='checkbox' name='remember' id='remember'
									checked={remember} onChange={handleRemember}
								/>
								<label className='form-check-label' htmlFor='remember'>
									Remember me
								</label>
							</div>

							{errors.length > 0 && (
								<ul className='alert alert-danger m-0 ps-4' role='alert'> {
									errors.map((e, id) => <li key={id} className='text-danger'>{e}</li>)
								}
								</ul>
							)}

							{isPending ? (
								<div className='placeholder-glow'>
									<button type='submit' className='btn btn-primary rounded-pill mt-2 placeholder fst-italic w-100 bg-primary'>Logging In...</button>
								</div>
							) : (
								user == null ? (
									<button type='submit' className='btn btn-primary mt-2 rounded-pill'>Log In</button>
								) : (
									<button className='btn btn-success mt-2' disabled>Logged In</button>
								)
							)}
						</form>

						<div className='d-flex flex-row justify-content-center gap-2'>
							<span className='text-secondary d-none d-sm-inline-block text-nowrap'>Don&apos;t have an account?</span>
							<span className='text-secondary d-inline-block d-sm-none text-nowrap'>No account?</span>
							<NavLink to='/signup' className='link-primary link-offset-1'>
								Register Now
							</NavLink>
						</div>
					</div>
				</div>
			</div>
		</div>
	</>);
};
