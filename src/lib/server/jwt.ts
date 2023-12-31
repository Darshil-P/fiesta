import { JWT_SECRET } from '$env/static/private';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import shortUUID from 'short-uuid';

const suuid = shortUUID();
const tokenStore: Array<string> = [];

export function generateTokens(payload: object) {
	const tokenId = suuid.new();
	const accessToken = jwt.sign(payload, JWT_SECRET, {
		expiresIn: '20m',
		subject: 'access',
		jwtid: tokenId,
		noTimestamp: true
	});

	const refreshToken = jwt.sign({}, JWT_SECRET, {
		expiresIn: '7d',
		subject: 'refresh',
		jwtid: tokenId,
		noTimestamp: true
	});

	tokenStore.push(refreshToken);

	return { accessToken, refreshToken };
}

export function refreshTokens(accessToken: string, refreshToken: string) {
	const oldAccessToken = jwt.verify(accessToken, JWT_SECRET, {
		ignoreExpiration: true
	}) as JwtPayload;
	const oldRefreshToken = jwt.verify(refreshToken, JWT_SECRET) as JwtPayload;

	if (!tokenStore.includes(refreshToken) || oldAccessToken.jti != oldRefreshToken.jti) {
		throw 'invalid token';
	}

	const index = tokenStore.indexOf(refreshToken);
	tokenStore.splice(index, 1);

	return generateTokens({ user: oldAccessToken.user } ?? {});
}

export function verifyAccessToken(accessToken: string) {
	const token = jwt.verify(accessToken, JWT_SECRET) as JwtPayload;
	return token.user;
}
