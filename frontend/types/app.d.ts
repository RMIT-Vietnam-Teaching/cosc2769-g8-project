import Bootstrap from 'bootstrap';
import { UIMatch } from 'react-router';

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

		type UserRole = 'Vendor' | 'Shipper' | 'Customer';

		type AppUIMatch = UIMatch & {
			handle?: {
				requireAuth: boolean;
				/** roles == null => accept all role */
				roles?: UserRole[];
			}
		}

		type AppLayoutUIMatch = UIMatch & {
			handle: {
				defaultRouteForRole: {
					[key in UserRole]: string
				},
			}
		}

		interface User {
			id: number;
			name: string;
			role: UserRole;
		}

		interface Hub {
			_id: string;
			name: string;
			address: string;
		}

		interface SelectOption<T> {
			value: T;
			label: string;
		}
	}

	declare const bootstrap = Bootstrap;
}
