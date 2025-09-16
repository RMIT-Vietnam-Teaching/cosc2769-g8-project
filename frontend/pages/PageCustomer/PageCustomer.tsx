import { useEffect, useState } from 'react';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router';
import Select from 'react-select';

import ProductCard from './ProductCard';

import './PageCustomer.css';

import { reactSelectHelper } from '#/helpers/reactSelect';
import { useNumberInput, useSelect } from '#/hooks/input';
import productService from '#/services/productService';

interface ProductType {
	id: string;
	name: string;
	price: number;
	description: string;
	image: string[];
}

const sortOptions = [
	{ value: 'latest', label: <div className='d-flex flex-row align-items-center gap-2'><FaSortAmountDown />Latest</div> },
	{ value: 'priceDesc', label: <div className='d-flex flex-row align-items-center gap-2'><FaSortAmountDown />Price</div> },
	{ value: 'priceAsc', label: <div className='d-flex flex-row align-items-center gap-2'><FaSortAmountUp />Price</div> },
];

const PageCustomer = () => {
	const [products, setProducts] = useState<ProductType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [queries, setQueries] = useSearchParams();
	const [priceFrom, _setPriceFrom, handlePriceFrom] = useNumberInput(0);
	const [priceTo, _setPriceTo, handlePriceTo] = useNumberInput(100000);
	const [sort, _setSort, handleSort] = useSelect(
		sortOptions.find(o => o.value === queries.get('sort')) ?? sortOptions[0],
	);

	useEffect(() => {
		if (!queries.has('sort')) {
			setQueries((q) => {
				q.set('sort', 'latest');
				return q;
			});
		}
	}, []);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				setLoading(true);
				const list = await productService.getAll(Object.fromEntries(queries.entries()));
				const mapped = list.map((p: any) => ({
					id: p._id ?? p.id,
					name: p.name,
					price: p.price,
					description: p.description,
					image: Array.isArray(p.image) ? p.image : [p.image],
				}));
				if (mounted) setProducts(mapped);
				setError(null);
			} catch (e: any) {
				setError(e?.message ?? 'Failed to fetch products');
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [queries]);

	if (loading) {
		return <div className='container py-5'><div className='alert alert-info mb-0'>Loading products...</div></div>;
	}
	if (error) {
		return <div className='container py-5'><div className='alert alert-danger mb-0'>{error}</div></div>;
	}

	return (
		<div className='d-flex justify-content-center align-items-center flex-wrap gap-3 my-4'>
			<form className='row align-self-end' method='GET'>
				<label className='col-auto col-form-label'>Price</label>
				<div className='col-auto'>
					<input
						type='number' className='form-control' name='priceFrom' placeholder='from price'
						value={priceFrom} onChange={handlePriceFrom}
					/>
				</div>
				<div className='col-auto'>
					<input
						type='number' className='form-control' name='priceTo' placeholder='from price'
						value={priceTo} onChange={handlePriceTo}
					/>
				</div>
				<div className='col-auto'>
					<Select
						isSearchable={false}
						className='react-select__container z-3'
						classNames={reactSelectHelper.classNames}
						options={sortOptions}
						value={sort}
						// @ts-expect-error dont know
						onChange={handleSort}
						name='sort'
					/>
				</div>
				<div className='col-auto'>
					<input type='submit' className='btn btn-primary' value='submit' />
				</div>
			</form>

			<div className='row'>
				{
					products.map((product: ProductType) => (
						<ProductCard
							key={product.id}
							product={product}
						/>
					))
				}
			</div>
		</div>

	);
};

export default PageCustomer;
