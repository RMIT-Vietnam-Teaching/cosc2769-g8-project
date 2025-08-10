import './PageIndex.css';

import reactLogo from '#/assets/react.svg';
import { useAppDispatch, useAppSelector } from '#/hooks/redux';
import { increment } from '#/redux/slices/counterSlide';

export const PageIndex = () => {
	const count = useAppSelector(state => state.counter.value);
	const dispatch = useAppDispatch();

	return (
		<>
			<div>
				<a href='https://vite.dev' target='_blank' rel='noreferrer'>
					<img src='/vite.svg' className='logo' alt='Vite logo' />
				</a>
				<a href='https://react.dev' target='_blank' rel='noreferrer'>
					<img src={reactLogo} className='logo react' alt='React logo' />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className='card'>
				<button onClick={() => dispatch(increment())}>
					count is {count}
				</button>
			</div>
		</>
	);
};
