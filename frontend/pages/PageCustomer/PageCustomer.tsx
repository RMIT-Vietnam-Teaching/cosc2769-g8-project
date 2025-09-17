/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Đoàn Đắc Nguyên, Trần Phan Anh Khoa
# ID: s4131473, s4136776
*/
import { useEffect, useMemo, useState } from 'react';
import { FaFilter, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router';
import Select from 'react-select';

import ProductCard from './ProductCard';

import './PageCustomer.css';

import { reactSelectHelper } from '#/helpers/reactSelect';
import { useNumberInput, useSelect } from '#/hooks/input';
import { productsActions } from '#/redux/slices/productSlice';
import cartSocket from '#/services/cartSocket';
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
	const dispatch = useDispatch();
	const [products, setProducts] = useState<ProductType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [queries, setQueries] = useSearchParams();

	const priceFilter = useMemo(() => {
		const fromStr = (queries.get('priceFrom') ?? '').trim();
		const toStr = (queries.get('priceTo') ?? '').trim();
		const from = fromStr === '' ? 0 : Number(fromStr);
		const to = toStr === '' ? 100000 : Number(toStr);
		return {
			from: isNaN(from) ? 0 : from,
			to: isNaN(to) ? 100000 : to,
		};
	}, [queries]);

	const [priceFrom, _setPriceFrom, handlePriceFrom] = useNumberInput(priceFilter.from);
	const [priceTo, _setPriceTo, handlePriceTo] = useNumberInput(priceFilter.to);
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

	useEffect(() => {
		cartSocket.connect();
		const onUpdated = (evt: any) => {
			if (evt?.type === 'add' && evt.item) {
				const item = { ...evt.item, image: Array.isArray(evt.item.image) ? evt.item.image : [evt.item.image] };
				dispatch(productsActions.addToCard(item));
			} else if (evt?.type === 'remove' && evt.itemId) {
				dispatch(productsActions.removeToCard(evt.itemId));
			} else if (evt?.type === 'clear') {
				dispatch(productsActions.clearCard());
			}
		};
		cartSocket.on('cart:updated', onUpdated);
		return () => {
			cartSocket.off('cart:updated', onUpdated);
		};
	}, [dispatch]);

	if (loading) {
		return <div className='container py-5'><div className='alert alert-info mb-0'>Loading products...</div></div>;
	}
	if (error) {
		return <div className='container py-5'><div className='alert alert-danger mb-0'>{error}</div></div>;
	}

	return (
		<div className='container-fluid my-4 d-flex flex-column gap-4'>

			<form className='row align-self-end g-2' method='GET'>
				<div className='col-12 col-sm-6 col-md-4 col-xl-auto'>
					<div className='input-group'>
						<span className='input-group-text'>Min $</span>
						<input
							type='number' className='form-control customer-product__price-input' name='priceFrom' placeholder='min price'
							value={priceFrom} onChange={handlePriceFrom}
						/>
					</div>
				</div>
				<div className='col-12 col-sm-6 col-md-4 col-xl-auto'>
					<div className='input-group'>
						<span className='input-group-text'>Max $</span>
						<input
							type='number' className='form-control customer-product__price-input' name='priceTo' placeholder='max price'
							value={priceTo} onChange={handlePriceTo}
						/>
					</div>
				</div>
				<div className='col-12 col-md-3 col-xl-auto'>
					<Select
						isSearchable={false}
						className='react-select__container'
						classNames={reactSelectHelper.classNames}
						options={sortOptions}
						value={sort}
						// @ts-expect-error dont know
						onChange={handleSort}
						name='sort'
					/>
				</div>
				<div className='col-12 col-md-1 col-xl-auto'>
					<button type='submit' className='btn btn-primary w-100' value='submit'>
						<span className='d-none d-md-inline-block d-xl-none'>
							<FaFilter />
						</span>
						<span className='d-inline-block d-md-none d-xl-inline-block'>
							Submit
						</span>
					</button>
				</div>
			</form>

			<div className='row g-4'>
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
