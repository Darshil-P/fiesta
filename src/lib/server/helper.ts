export function jsonResponse(data: string, status?: number, statusText?: string): Response {
	return new Response(data, {
		headers: {
			'Content-Type': 'application/json'
		},
		status: status ?? 200,
		statusText: statusText ?? 'OK'
	});
}
