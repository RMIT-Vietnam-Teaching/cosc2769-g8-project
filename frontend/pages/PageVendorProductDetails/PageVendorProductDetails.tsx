/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Link, useLoaderData } from 'react-router';

import { VendorProduct } from '../PageVendor/types';

import { productHelper } from '#/helpers/product';

export const PageVendorProductDetails = () => {
	const product: VendorProduct | null = useLoaderData() ?? null;

	if (!product) {
		return (
			<div className='container py-5'>
				<div className='alert alert-warning mb-0'>Product not found.</div>
			</div>
		);
	}

	return (
		<div className='container py-5 d-flex flex-column gap-3'>
			<div className='row'>
				<div className='col d-flex flex-row justify-content-start'>
					<Link
						to='/vendor'
						className='align-items-center border-0 btn btn-outline-secondary d-flex flex-row gap-3 pe-3 ps-2 py-2'
					>
						<IoMdArrowRoundBack className='fs-5' />
						<span className='position-relative'>View Products</span>
					</Link>
				</div>
			</div>
			<div className='row g-4 align-items-start'>
				<div className='col-6'>
					<div id='productCarousel' className='carousel slide'>
						<div className='carousel-indicators'>
							{product.image.map((_, i) => (
								<button
									key={i}
									type='button'
									data-bs-target='#productCarousel'
									data-bs-slide-to={i}
									className={i === 0 ? 'active' : ''}
									aria-current={i === 0 ? 'true' : undefined}
									aria-label={`Slide ${i + 1}`}
								/>
							))}
						</div>

						<div className='carousel-inner'>
							{product.image.map((src, i) => (
								<div
									className={`carousel-item ${i === 0 ? 'active' : ''}`}
									key={i}
								>
									<img
										className='d-block w-100 rounded-4'
										style={{ height: '520px', objectFit: 'cover' }}
										src={src}
										alt={`slide-${i}`}
									/>
								</div>
							))}
						</div>

						<button
							className='carousel-control-prev'
							type='button'
							data-bs-target='#productCarousel'
							data-bs-slide='prev'
						>
							<span className='carousel-control-prev-icon' aria-hidden='true' />
							<span className='visually-hidden'>Previous</span>
						</button>
						<button
							className='carousel-control-next'
							type='button'
							data-bs-target='#productCarousel'
							data-bs-slide='next'
						>
							<span className='carousel-control-next-icon' aria-hidden='true' />
							<span className='visually-hidden'>Next</span>
						</button>
					</div>
				</div>
				<div className='col-6'>
					<h1 className='display-10 mb-3'>{product.name}</h1>
					<div className='h3 text-secondary mb-4'>
						{productHelper.displayPrice(product.price)}
					</div>
					<p className='fs-5 text-muted mb-4'>{product.description}</p>
				</div>
			</div>
		</div>
	);
};
