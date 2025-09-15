import { useActionState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Link, useNavigate } from 'react-router';
import { clsx } from 'clsx';

import { useTextInput, useToggler } from '#/hooks/input';
import { accountService } from '#/services/accountService';

export const PageSignupVendor = () => {
	const navigate = useNavigate();

	const [showPassword, _setShowPassword, handleShowPassword] = useToggler(false);
	const [showConfirmPassword, _setShowConfirmPassword, handleShowConfirmPassword] = useToggler(false);
	const [state, signUpAction, isSigningUp] = useActionState(accountService.signUp, { success: false, error: {} });
	const [name, _setName, handleName] = useTextInput('');
	const [address, _setAddress, handleAddress] = useTextInput('');
	const [username, _setUsername, handleUsername] = useTextInput('');
	const [password, _setPassword, handlePassword] = useTextInput('');
	const [confirmPassword, _setConfirmPassword, handleConfirmPassword] = useTextInput('');
	const signupToastRef = useRef(/** @type {HTMLDivElement | null} */(null));

	useEffect(() => {
		if (state.success) {
			if (signupToastRef.current != null) {
				bootstrap.Toast.getOrCreateInstance(signupToastRef.current, { delay: 1000 }).show();
				setTimeout(() => navigate('/login'), 1300);
			}
		}
	}, [state]);

	return (<>
		<title>Sign Up as Customer</title>
		<div className='container-fluid h-100'>
			<div className='row justify-content-center h-100'>
				<div className='col-12 col-md-10 col-lg-8 col-xl-6 d-flex flex-column justify-content-xs-start justify-content-md-center'>
					<div className='my-4 d-flex flex-column gap-4 p-4 rounded-2 shadow bg-body'>
						<Link to='/signup' className='btn btn-outline-secondary border-0 d-flex flex-row gap-3 align-items-center px-3'>
							<IoMdArrowRoundBack className='fs-5' />
							<span className='position-relative '>Choose Role</span>
						</Link>

						<form id='form' className='d-flex flex-column gap-4' action={signUpAction}>
							<h4 className='px-3'>
								<span>Sign up as</span>
								<span className='text-primary ms-2'>Vendor</span>
							</h4>

							<input type='hidden' name='role' value='Vendor' readOnly />

							<div className='px-3'>
								<label className='form-label fw-medium' htmlFor='name'>Business Name:</label>
								<input
									id='name' type='text' name='businessName' placeholder='At least 5 characters'
									className={clsx('form-control', !isSigningUp && state.error.businessName != null && 'is-invalid')}
									value={name} onChange={handleName}
								/>
								{isSigningUp || state.error.businessName == null ? null : (
									<ul className='ps-4 invalid-feedback m-0'>
										{(state.error.businessName ?? []).map((e, i) => (
											<li key={i}>{e}</li>
										))}
									</ul>
								)}
							</div>

							<div className='px-3'>
								<label className='form-label fw-medium' htmlFor='address'>Business Address:</label>
								<input
									type='text' name='businessAddress' placeholder='At least 5 characters'
									className={clsx('form-control', !isSigningUp && state.error.businessAddress != null && 'is-invalid')}
									value={address} onChange={handleAddress}
								/>
								{isSigningUp || state.error.businessAddress == null ? null : (
									<ul className='ps-4 invalid-feedback m-0'>
										{(state.error.businessAddress ?? []).map((e, i) => (
											<li key={i}>{e}</li>
										))}
									</ul>
								)}
							</div>

							<div className='px-3'>
								<label htmlFor='profilePicture' className='form-label fw-medium'>Profile Picture:</label>
								<input className='form-control' type='file' id='profilePicture' name='profilePicture' />
							</div>

							<div className='px-3'>
								<label className='form-label fw-medium' htmlFor='username'>Username:</label>
								<input
									id='username' type='username' name='username' placeholder='8 - 15 letters/digits'
									className={clsx('form-control', !isSigningUp && state.error.username != null && 'is-invalid')}
									value={username} onChange={handleUsername}
								/>
								{isSigningUp || state.error.username == null ? null : (
									<ul className='ps-4 invalid-feedback m-0'>
										{(state.error.username ?? []).map((e, i) => (
											<li key={i}>{e}</li>
										))}
									</ul>
								)}
							</div>

							<div className='px-3'>
								<label className='form-label fw-medium' htmlFor='password'>Password:</label>
								<div className={clsx('input-group', !isSigningUp && state.error.password != null && 'has-validation')}>
									<input
										name='password' id='password' aria-describedby='passwordHelp'
										value={password} onChange={handlePassword}
										className={clsx('form-control', !isSigningUp && state.error.password != null && 'is-invalid')}
										placeholder='8 - 20 characters'
										type={showPassword ? 'text' : 'password'}
									/>
									<button
										className='input-group-text btn btn-outline-secondary' type='button' data-target='password' aria-label='Show password' aria-pressed='false'
										aria-controls='password' onClick={handleShowPassword}
									>
										{showPassword ? <FaEyeSlash /> : <FaEye />}
									</button>
									{isSigningUp || state.error.password == null ? null : (
										<ul className='ps-4 invalid-feedback m-0'>
											{state.error.password.map((e, i) => (
												<li key={i}>{e}</li>
											))}
										</ul>
									)}
								</div>
								<ul className='form-text m-0 mt-2 ps-4' id='passwordHelp'>
									<li>Allow special characters !@#$%^&*</li>
									{state.error.password != null ? null : (
										<li>Must include uppercase, lowercase, digit, and special character</li>
									)}
								</ul>
							</div>

							<div className='px-3'>
								<label className='form-label fw-medium' htmlFor='confirmPassword'>Confirm Password:</label>
								<div className={clsx('input-group', !isSigningUp && state.error.confirmPassword != null && 'has-validation')}>
									<input
										name='confirmPassword' id='confirmPassword' placeholder='Enter your password again'
										value={confirmPassword} onChange={handleConfirmPassword}
										className={clsx('form-control', !isSigningUp && state.error.confirmPassword != null && 'is-invalid')}
										type={showConfirmPassword ? 'text' : 'password'}
									/>
									<button
										className='input-group-text btn btn-outline-secondary' type='button' data-target='password' aria-label='Show password' aria-pressed='false'
										aria-controls='password' onClick={handleShowConfirmPassword}
									>
										{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
									</button>
									{isSigningUp || state.error.confirmPassword == null ? null : (
										<ul className='ps-4 invalid-feedback m-0'>
											{(state.error.confirmPassword ?? []).map((e, i) => (
												<li key={i}>{e}</li>
											))}
										</ul>
									)}
								</div>
							</div>

							{isSigningUp || state.error.__global == null ? null : (
								<ul className='alert alert-danger ps-4 m-0'>
									{(state.error.__global ?? []).map((e, i) => (
										<li key={i}>{e}</li>
									))}
								</ul>
							)}

							<button
								type='submit' value='Submit'
								className={clsx(
									'btn rounded-pill',
									state.success ? 'btn-success' : 'btn-primary',
									isSigningUp && 'placeholder',
								)}
								disabled={isSigningUp}
							>
								{isSigningUp ? 'Signing up...' : 'Sign up'}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
		{createPortal(
			<div className='toast-container position-fixed top-content start-0 p-3'>
				<div ref={signupToastRef} className='toast rounded-4 border-0' role='alert' aria-live='assertive' aria-atomic='true'>
					<div
						className={clsx(
							'toast-body alert m-0 d-flex justify-content-between',
							state.success ? 'alert-success' : 'alert-danger',
						)}
					>
						{state.success ? 'Signed Up!' : 'Failed to sign you up!'}
						<button type='button' className='btn-close' data-bs-dismiss='toast' aria-label='Close'></button>
					</div>
				</div>
			</div>,
			document.body,
		)}
	</>);
};
