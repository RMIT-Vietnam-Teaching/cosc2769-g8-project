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
