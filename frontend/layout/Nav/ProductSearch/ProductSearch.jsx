import { useNavigate, useSearchParams } from 'react-router';
import AsyncSelect from 'react-select/async';

import './ProductSearch.css';

import { reactSelectHelper } from '#/helpers/reactSelect';
import { useTextInput } from '#/hooks/input';
import productService from '#/services/productService';

export const ProductSearch = () => {
	const [searchParams] = useSearchParams();
	const [search, handleSearch] = useTextInput(searchParams.get('search') ?? '');
	const navigate = useNavigate();

	const handleSearchTrigger = async (/** @type {string} */ inputValue) => {
		const res = await productService.searchByName(inputValue);

		if (res.length > 0) {
			return [
				{ value: null, label: `all results for "${inputValue}"`, search: inputValue },
				...res.map(p => ({
					value: p._id,
					label: p.name,
					search: inputValue,
				})),
			];
		}
		return [];
	};

	const handleSelect = (/** @type {any} */ option) => {
		if (option.value == null) {
			navigate(`/customer?search=${option.search}`);
		} else {
			navigate(`/product/${option.value}?search=${option.search}`);
		}
	};

	return (
		<AsyncSelect
			cacheOptions={true}
			loadOptions={handleSearchTrigger}
			placeholder='search for products'
			className='react-select__container z-3 product-search__select'
			classNames={reactSelectHelper.classNames}
			noOptionsMessage={({ inputValue }) => inputValue === '' ? 'enter keyword' : 'No results found'}
			loadingMessage={() => 'searching...'}
			inputValue={search}
			onChange={handleSelect}
			onInputChange={handleSearch}
		/>
	);
};
