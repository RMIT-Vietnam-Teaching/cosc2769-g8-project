/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
import { UIMatch } from 'react-router';
import Bootstrap from 'bootstrap';

declare global {
	namespace app {
		type Response<TData = undefined, TError extends { [key: string]: string[] | undefined } | undefined = undefined>
			= TData extends undefined ? (
				{ success: true }
				| (TError extends undefined
					? { success: false, error: { __global: string[] } }
					: { success: false, error: TError }
				)
			) : (
				{ success: true, data: TData }
				| (TError extends undefined
					? { success: false, error: { __global: string[] } }
					: { success: false, error: TError }
				)
			);

		type UserRole = 'Vendor' | 'Shipper' | 'Customer';

		type AppUIMatch = UIMatch & {
			handle?: {
				requireAuth: boolean;
				/** roles == null => accept all role */
				roles?: UserRole[];
			};
		};

		type AppLayoutUIMatch = UIMatch & {
			handle: {
				defaultRouteForRole: {
					[key in UserRole]: string
				};
			};
		};

		interface User {
			id: number;
			name: string;
			role: UserRole;
			img?: string | null;
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
