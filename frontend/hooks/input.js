import { useCallback, useState } from 'react';

/** @param {string} initalText */
export const useTextInput = (initalText = '') => {
	const [value, setValue] = useState(initalText);

	/** @type {import("react").ReactEventHandler<HTMLInputElement | HTMLTextAreaElement>} e */
	const handleChange = useCallback((e) => {
		setValue(e.currentTarget.value);
	}, [setValue]);

	return /** @type {const} */([value, setValue, handleChange]);
};

/** @param {boolean} initialFlag */
export const useCheckInput = (initialFlag = false) => {
	const [value, setValue] = useState(initialFlag);

	/** @type {import("react").ReactEventHandler<HTMLInputElement>} e */
	const handleChange = useCallback((e) => {
		setValue(e.currentTarget.checked);
	}, [setValue]);

	return /** @type {const} */([value, setValue, handleChange]);
};

/** @param {number} initialNumber */
export const useNumberInput = (initialNumber) => {
	const [value, setValue] = useState(initialNumber);

	/** @type {import("react").ReactEventHandler<HTMLInputElement>} e */
	const handleChange = useCallback((e) => {
		const x = Number(e.currentTarget.value);
		if (!isNaN(x)) {
			setValue(x);
		}
	}, [setValue]);

	return /** @type {const} */([value, setValue, handleChange]);
};

/**
 * @template T
 * @param {T} initialValue
 */
export const useSelect = (initialValue) => {
	const [value, setValue] = useState(initialValue);

	const handleChange = useCallback((/** @type {T} */e) => {
		setValue(e);
		return e;
	}, [setValue]);

	return /** @type {const} */([value, setValue, handleChange]);
};

/**
 * @param {boolean} initialValue
 */
export const useToggler = (initialValue) => {
	const [value, setValue] = useState(initialValue);

	const handleChange = useCallback(() => {
		setValue(x => x === true ? false : true);
	}, [setValue]);

	return /** @type {const} */([value, setValue, handleChange]);
};
