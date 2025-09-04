import Bootstrap from 'bootstrap';

export {};

declare global {
	namespace app {
		type Response<TData = undefined, TError extends {[key: string]: string[] | undefined} | undefined = undefined> = 
			TData extends undefined ? (
				{ success: true } |
				(TError extends undefined ?
					{ success: false, error: { __global: string[] }} :
					{ success: false, error: TError }
				)
			) : (
				{ success: true, data: TData } |
				(TError extends undefined ?
					{ success: false, error: { __global: string[] }} :
					{ success: false, error: TError }
				)
			);

		interface User {
			id: number;
			email: string;
			name: string;
			role: string;
		}

		interface Genre {
			genre_id: number;
			name: string;
		}

		interface SelectOption<T> {
			value: T;
			label: string;
		}

		interface Book {
			book_id: number;
			title: string;
			description: string;
			publication_date: string;
			is_online: boolean;
			allow_borrow: boolean;
			copy_count: number;
			borrow_count: number;
			publisher: {
				id: number;
				name: string;
			};
			authors: {
				id: number;
				name: string;
			}[];
			genres: {
				id: number;
				name: string;
			}[];
		}
	}

	declare const bootstrap = Bootstrap;
}
