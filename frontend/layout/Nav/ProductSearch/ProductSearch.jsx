/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
import { startTransition, useActionState, useEffect, useState } from 'react';
import { MdSearch } from 'react-icons/md';
import { useNavigate, useSearchParams } from 'react-router';
import Select, { components } from 'react-select';

import './ProductSearch.css';

import { reactSelectHelper } from '#/helpers/reactSelect';
import productService from '#/services/productService';

const DropdownIndicator = (/** @type {any} */props) => {
	return (
		<components.DropdownIndicator {...props}>
			<div className='px-1'>
				<MdSearch size={24} />
			</div>
		</components.DropdownIndicator>
	);
};

export const ProductSearch = () => {
	const [searchParams] = useSearchParams();
	const [search, setSearch] = useState(searchParams.get('search') ?? '');
	const navigate = useNavigate();
	const [options, getOptions, isSearching] = useActionState(searchByName, []);
	const [currentOption, setCurrentOption] = useState(null);

	const searchKeyword = searchParams.get('search') ?? '';
	useEffect(() => {
		if (searchKeyword === '') {
			setCurrentOption(null);
			setSearch('');
		}
	}, [searchKeyword]);

	useEffect(() => {
		startTransition(() => getOptions(search));
	}, [search]);

	const handleInputChange = (/** @type {string} */ inputValue, /** @type {any} */ action) => {
		if (action.action === 'input-change') {
			setSearch(inputValue);
		}
	};

	const handleSelect = (/** @type {any} */ option, action) => {
		setCurrentOption(option);
		if (action.action === 'select-option') {
			if (option.value == null) {
				navigate(`/customer?search=${option.search}`);
			} else {
				navigate(`/product/${option.value}?search=${option.search}`);
			}
		}
	};

	return (
		<Select
			placeholder='products'
			className='react-select__container z-3 product-search__select'
			classNames={reactSelectHelper.classNames}

			noOptionsMessage={({ inputValue }) => inputValue === '' ? 'enter keyword' : 'No results found'}

			isLoading={isSearching}
			loadingMessage={() => 'searching...'}

			options={options}
			value={currentOption}
			onChange={handleSelect}

			onInputChange={handleInputChange}

			components={{ DropdownIndicator }}
		/>
	);
};

/**
 * @typedef {{ value: string | null, label: string, search: string }} Option
 */

/**
 * @param {Option[]} list
 * @param {string} keyword
 */
async function searchByName(list, keyword) {
	try {
		if (keyword === '' && list.length === 0) {
			return [];
		}

		const res = await productService.searchByName(keyword);

		if (res.length > 0) {
			return [
				{ value: null, label: `all results for "${keyword}"`, search: keyword },
				...res.map(p => ({
					value: p._id,
					label: p.name,
					search: keyword,
				})),
			];
		} else {
			return [];
		}
	} catch (error) {
		console.error('[Searching product name Error]', error);
		return list;
	}
}
