export const NAME_REGEX = /^[a-zA-Z ,.'-]{2,64}$/;
export const PHONE_REGEX = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
export const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const PASSWORD_REGEX =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
