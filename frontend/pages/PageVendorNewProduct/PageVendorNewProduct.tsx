/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
import { FormEvent, useState } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Link, useNavigate } from 'react-router';
import { clsx } from 'clsx';

import { fetchHelper } from '#/helpers/fetch';
import { useNumberInput, useTextInput } from '#/hooks/input';

export const PageVendorNewProduct = () => {
	const [name, _setName, handleName] = useTextInput('');
	const [description, _setDescription, handleDescription] = useTextInput('');
	const [price, _setPrice, handlePrice] = useNumberInput(0);
	const [error, setError] = useState<Record<string, string[]>>({});
	const [pending, setPending] = useState(false);

	const navigate = useNavigate();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError({});
		setPending(true);
		try {
			const formData = new FormData(e.currentTarget);
			const res: app.Response = await fetchHelper
				.postForm('/api/vendor/new-product', formData);
			if (res.success) {
				navigate('/vendor');
			} else {
				setError(res.error);
			}
		} catch (e) {
			console.error('[Vendor New Product]', e);
			setError({ __global: ['Network Error'] });
		} finally {
			setPending(false);
		}
	};

	return (
		<div className='container-fluid h-100'>
			<div className='row justify-content-center h-100'>
				<div className='col-12 col-md-10 col-lg-8 col-xl-6 d-flex flex-column justify-content-xs-start justify-content-md-center'>
					<div className='my-4 d-flex flex-column gap-4 p-4 rounded-2 shadow bg-body'>
						<Link
							to='/vendor'
							className='btn btn-outline-secondary border-0 d-flex flex-row gap-3 align-items-center px-3'
						>
							<IoMdArrowRoundBack className='fs-5' />
							<span className='position-relative'>View Products</span>
						</Link>

						<form className='d-flex flex-column gap-4' onSubmit={handleSubmit}>
							<h4 className='px-3'>Add New Product</h4>

							<div className='px-3'>
								<label className='form-label fw-medium' htmlFor='name'>
									Name:
								</label>
								<input
									className={clsx(
										'form-control',
										error.name != null && 'is-invalid',
									)}
									type='text'
									id='name'
									placeholder='Between 10 - 20 characters'
									name='name'
									value={name}
									onChange={handleName}
								/>
								{error.name == null ? null : (
									<ul className='ps-4 invalid-feedback m-0'>
										{(error.name ?? []).map((e, i) => (
											<li key={i}>{e}</li>
										))}
									</ul>
								)}
							</div>

							<div className='px-3'>
								<label className='form-label fw-medium' htmlFor='price'>
									Price:
								</label>
								<input
									className={clsx(
										'form-control',
										error.price != null && 'is-invalid',
									)}
									type='number'
									id='price'
									placeholder='> 0'
									name='price'
									value={price}
									onChange={handlePrice}
								/>
								{error.price == null ? null : (
									<ul className='ps-4 invalid-feedback m-0'>
										{(error.price ?? []).map((e, i) => (
											<li key={i}>{e}</li>
										))}
									</ul>
								)}
							</div>

							<div className='px-3'>
								<label className='form-label fw-medium' htmlFor='description'>
									Description:
								</label>
								<textarea
									className={clsx(
										'form-control',
										error.description != null && 'is-invalid',
									)}
									id='description'
									rows={4}
									name='description'
									value={description}
									onChange={handleDescription}
								>
								</textarea>
								{error.description == null ? null : (
									<ul className='ps-4 invalid-feedback m-0'>
										{(error.description ?? []).map((e, i) => (
											<li key={i}>{e}</li>
										))}
									</ul>
								)}
							</div>

							<div className='px-3'>
								<label htmlFor='mainImage' className='form-label fw-medium'>
									Main Picture:
								</label>
								<input
									className={clsx(
										'form-control',
										error.mainImage != null && 'is-invalid',
									)}
									type='file'
									id='mainImage'
									name='mainImage'
								/>
								{error.mainImage == null ? null : (
									<ul className='ps-4 invalid-feedback m-0'>
										{(error.mainImage ?? []).map((e, i) => (
											<li key={i}>{e}</li>
										))}
									</ul>
								)}
							</div>

							<div className='px-3'>
								<label htmlFor='image' className='form-label fw-medium'>
									Extra Picture:
								</label>
								<input
									className={clsx(
										'form-control',
										error.image != null && 'is-invalid',
									)}
									type='file'
									id='image'
									name='image'
									multiple
								/>
								{error.image == null ? null : (
									<ul className='ps-4 invalid-feedback m-0'>
										{(error.image ?? []).map((e, i) => (
											<li key={i}>{e}</li>
										))}
									</ul>
								)}
							</div>

							{error.__global == null ? null : (
								<ul className='alert alert-danger ps-4 m-0'>
									{(error.__global ?? []).map((e, i) => (
										<li key={i}>{e}</li>
									))}
								</ul>
							)}

							<button
								type='submit'
								value='Submit'
								className={clsx(
									'btn btn-primary btn rounded-pill',
									pending && 'placeholder',
								)}
								disabled={pending}
							>
								{pending ? 'Adding...' : 'Add'}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};
