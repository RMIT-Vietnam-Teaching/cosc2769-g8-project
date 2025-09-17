/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
import { Request, Response, NextFunction } from "express";

declare global {
	namespace app {
		type ExpressRequest = Request;
		type ExpressResponse = Response;

		type RequestHandler = (req: Request, res: Response) => void;
		type AsyncRequestHandler = (req: Request, res: Response) => Promise<void>;
		type Middleware = (req: Request, res: Response, next: NextFunction) => void;
		type AsyncMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<void>;
		type ErrorMiddleware = (
			err: any,
			req: Request,
			res: Response,
			next: NextFunction,
		) => void | Promise<void>;

		type UserRole = 'Vendor' | 'Shipper' | 'Customer';

		type SessionUser = {
			id: string;
			name: string;
			role: UserRole;
			img?: string | null;
		};
	}
}
