/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Nguyễn Hoàng Long
# ID: s4131459
*/
import { Link, useLoaderData } from 'react-router';

import { ProductCard } from './ProductCard';
import { VendorProduct } from './types';

import './PageVendor.css';

export const PageVendor = () => {
	const products: VendorProduct[] = useLoaderData() ?? [];
	return (
		<div className='container-fluid my-4 d-flex flex-column gap-4'>
			<div className='row'>
				{
					products.map(product => (
						<ProductCard
							key={product._id}
							product={product}
						/>
					))
				}
			</div>
		</div>

	);
};
