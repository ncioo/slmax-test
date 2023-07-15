class OperationError extends Error {
	constructor(message) {
		super(message);
		this.message = message;
	}
	toJSON() {
		return { type: this.type, message: this.message };
	}
}

class UserNotAllowedError extends OperationError {
	constructor(message) {
		super(message);
		this.type = 'UserNotAllowed';
		this.message = message;
	}
}

class NotFoundError extends OperationError {
	constructor(message) {
		super(message);
		this.type = 'NotFound';
		this.message = message;
	}
}

module.exports = {
	OperationError,
	UserNotAllowedError,
	NotFoundError
};
