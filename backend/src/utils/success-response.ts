export function successResponse(message: string, data: any = null) {
	return {
		success: true,
		loading: false,
		message,
		data: data,
	};
}
