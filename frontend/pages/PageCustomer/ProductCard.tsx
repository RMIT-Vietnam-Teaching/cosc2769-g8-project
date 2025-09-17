/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Đoàn Đắc Nguyên
# ID: s4131473
*/
import { MouseEventHandler } from 'react';
import { Link } from 'react-router';

import './PageCustomer.css';

import { productHelper } from '#/helpers/product';

interface ProductType {
	id: string;
	name: string;
	price: number;
	description: string;
	image: string[];
}

interface ProductCardProps {
	product: ProductType;
	showDelete?: boolean;
	onDelete?: (id: string) => void;
}

const ProductCard = ({ product, showDelete = false, onDelete }: ProductCardProps) => {
	const imgSrc = Array.isArray(product.image) ? product.image[0] : product.image;

	const handleDelete: MouseEventHandler = (e) => {
		e.stopPropagation();
		if (onDelete) {
			onDelete(product.id);
		}
	};

	return (
		<div className='col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 '>
			<Link className='card shadow-sm h-100 text-decoration-none stretched-link' to={`/product/${product.id}`}>
				<div className='ratio ratio-4x3'>
					<img src={imgSrc} className='w-100 h-100 object-fit-cover' alt='' />
				</div>
				<div className='card-body'>
					<h5 className='card-title'>{product.name}</h5>
					<p className='card-title'>{productHelper.displayPrice(product.price)}</p>
				</div>
				{showDelete && (
					<div className='card-footer bg-transparent border-0'>
						<button type='button' className='btn btn-outline-danger w-100' onClick={handleDelete}>
							Delete
						</button>
					</div>
				)}

			</Link>
		</div>
	);
};

export default ProductCard;
