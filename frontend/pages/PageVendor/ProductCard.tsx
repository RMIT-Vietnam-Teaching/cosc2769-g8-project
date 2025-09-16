/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
import { Link } from 'react-router';

import { VendorProduct } from './types';

import { productHelper } from '#/helpers/product';

export const ProductCard = ({ product }: { product: VendorProduct }) => {
	return (
		<div className='col-12 col-sm-6 col-md-4 col-lg-3 '>
			<Link
				className='card shadow-sm h-100 text-decoration-none stretched-link m-0'
				to={`/vendor/product/${product._id}`}
			>
				<div className='ratio ratio-4x3'>
					{product.image.length > 0 ? (
						<img
							src={product.image[0]}
							className='w-100 h-100 object-fit-cover'
							alt=''
						/>
					) : (
						<div className='w-100 h-100 bg-secondary d-flex justify-content-center align-items-center light'>
							Product
						</div>
					)}
				</div>
				<div className='card-body'>
					<h5 className='card-title'>{product.name}</h5>
					<p className='card-title'>
						{productHelper.displayPrice(product.price)}
					</p>
				</div>
			</Link>
		</div>
	);
};
