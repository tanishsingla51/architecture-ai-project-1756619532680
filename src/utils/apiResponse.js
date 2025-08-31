class ApiResponse {
    constructor(statusCode, data, message = 'Success') {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

class ApiError extends Error {
    constructor(statusCode, message = 'Something went wrong', errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.success = false;
    }
}

module.exports = { ApiResponse, ApiError };