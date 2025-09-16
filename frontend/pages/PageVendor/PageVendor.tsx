import { Link, useLoaderData } from 'react-router';

import { ProductCard } from './ProductCard';
import { VendorProduct } from './types';

import './PageVendor.css';

export const PageVendor = () => {
	const products: VendorProduct[] = useLoaderData() ?? [];
	return (
		<div className='conatiner-fluid d-flex flex-column gap-3 justify-content-center align-items-center flex-wrap m-4'>
			<Link to='/vendor/new-product' className='btn btn-primary align-self-end'>Add New Product</Link>
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
