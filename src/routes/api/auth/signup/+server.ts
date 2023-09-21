import { fileLocation, supportedImageTypes } from '$lib/server/constants';
import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { NAME_REGEX, PASSWORD_REGEX, PHONE_REGEX } from '$lib/server/regex';
import { userCredentialsTable, usersTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { sql, type InferInsertModel } from 'drizzle-orm';
import { writeFile } from 'fs';
import joi from 'joi';
import sharp from 'sharp';
import shortUUID from 'short-uuid';

type NewUser = InferInsertModel<typeof usersTable>;
type NewUserCredential = InferInsertModel<typeof userCredentialsTable>;

const suuid = shortUUID();
const requestSchema = joi.object({
	name: joi.string().regex(NAME_REGEX).required(),
	email: joi.string().email().required(),
	mobile: joi.string().regex(PHONE_REGEX).required(),
	password: joi.string().regex(PASSWORD_REGEX).required()
});

const insertUserCredentials = db
	.insert(userCredentialsTable)
	.values({
		mobile: sql.placeholder('mobile'),
		email: sql.placeholder('email'),
		password: sql.placeholder('password')
	})
	.returning()
	.prepare('insert_user_credentials');

const insertUser = db
	.insert(usersTable)
	.values({
		userId: sql.placeholder('userId'),
		name: sql.placeholder('name'),
		avatarId: sql.placeholder('avatarId')
	})
	.returning()
	.prepare('insert_user');

export const POST = (async ({ request }) => {
	const formData = await request.formData();
	const requestBody = JSON.parse(formData.get('user') as string);
	const avatar = formData.get('avatar') as File;

	if (!requestBody) throw error(400, 'must provide user details');

	const { error: validationError } = requestSchema.validate(requestBody);
	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	if (avatar && !supportedImageTypes.includes(avatar.type)) {
		throw error(415, 'unsupported image format');
	}

	let processedAvatar: Buffer | null = null;
	let avatarId;
	if (avatar) {
		avatarId = suuid.new();
		try {
			const imageData = await avatar.arrayBuffer();
			processedAvatar = await sharp(imageData)
				.resize({ height: 360, width: 360 })
				.webp({ quality: 90 })
				.toBuffer();
		} catch (e) {
			throw error(415, 'unsupported image format');
		}
	}

	const { name, email, mobile, password: passwordText } = requestBody;
	const password = await bcrypt.hash(passwordText, 12);

	const newUserCredential: NewUserCredential = {
		mobile,
		email,
		password
	};
	const userCredentials = await insertUserCredentials.execute(newUserCredential);

	const newUser: NewUser = {
		userId: userCredentials[0].userId,
		name,
		avatarId
	};
	const users = await insertUser.execute(newUser);

	if (avatarId) {
		let writeError;
		processedAvatar &&
			writeFile(
				`${fileLocation.userAvatar}/${avatarId}`,
				processedAvatar,
				(err) => (writeError = err)
			);
		if (writeError) throw error(500, 'unable to save image, try again later');
	}

	return jsonResponse(JSON.stringify(users[0]), 201);
}) satisfies RequestHandler;
