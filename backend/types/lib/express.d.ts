/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
import "express";

declare global {
    namespace Express {
        interface Response {
			jsonOk: () => void;
			jsonData: (data: any) => void;
			jsonRedirect: (url: string) => void;
			jsonError: (error: {[k: string]: string[]}) => void;
			jsonErrorMsg: (errorMsgs: string[]) => void;
			jsonInternalErrorMsg: (errorMsgs: string[]) => void;
		}
	}
}
