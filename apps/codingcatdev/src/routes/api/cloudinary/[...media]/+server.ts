import type { RequestHandler } from '../$types';
import { v2 as cloudinary } from 'cloudinary';
import type { Media, MediaListOptions } from 'tinacms';
import path from 'path';
// @ts-ignore
import multer from 'multer';
import { promisify } from 'util';
import { error, json } from '@sveltejs/kit';

import {
	CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET
} from '$env/static/private';

cloudinary.config(
	Object.assign(
		{ secure: true },
		{
			cloud_name: CLOUDINARY_CLOUD_NAME,
			api_key: CLOUDINARY_API_KEY,
			api_secret: CLOUDINARY_API_SECRET
		}
	)
);

const mediaHandlerConfig = {
	api: {
		bodyParser: false
	}
};

export const GET: RequestHandler = async ({ request, url }) => {
	try {
		const { directory = '""', limit = 500, offset } = url.searchParams as MediaListOptions;

		const useRootDirectory = !directory || directory === '/' || directory === '""';

		const query = useRootDirectory ? 'folder=""' : `folder="${directory}"`;

		const response = await cloudinary.search
			.expression(query)
			.max_results(limit)
			.next_cursor(offset as string)
			.execute();

		const files = response.resources.map(getCloudinaryToTinaFunc({ useHttps: true }));

		//@ts-ignore TODO: Open PR to cloudinary-core
		cloudinary.api.folders = (directory: string = '""') => {
			if (useRootDirectory) {
				return cloudinary.api.root_folders();
			} else {
				return cloudinary.api.sub_folders(directory);
			}
		};
		let folders: string[] = [];
		let folderRes = null;

		try {
			// @ts-ignore
			folderRes = await cloudinary.api.folders(directory);
		} catch (e: any) {
			// If the folder doesn't exist, just return an empty array
			if (e.error?.message.startsWith("Can't find folder with path")) {
				// ignore
			} else {
				console.error('Error getting folders');
				console.error(e);
				throw e;
			}
		}

		if (folderRes?.folders) {
			folders = folderRes.folders.map(function (folder: { name: string; path: string }): Media {
				'empty-repo/004';
				return {
					id: folder.path,
					type: 'dir',
					filename: path.basename(folder.path),
					directory: path.dirname(folder.path)
				};
			});
		}

		return json({
			items: [...folders, ...files],
			offset: response.next_cursor
		});
	} catch (e) {
		console.log(e);
		const message = findErrorMessage(e);
		throw error(500, message);
	}
};

export async function POST({ request }) {
	const upload = promisify(
		multer({
			storage: multer.diskStorage({
				// @ts-ignore
				directory: (req, file, cb) => {
					cb(null, '/tmp');
				},
				filename: (req: any, file: { originalname: any }, cb: (arg0: null, arg1: any) => void) => {
					cb(null, file.originalname);
				}
			})
		}).single('file')
	);

	// @ts-ignore
	await upload(req, res);

	// @ts-ignore
	// TODO: fix
	const { directory } = req.body;

	//@ts-ignore
	const result = await cloudinary.uploader.upload(req.file.path, {
		folder: directory.replace(/^\//, ''),
		use_filename: true,
		overwrite: false
	});

	return json(result);
}

export async function DELETE({ url }) {
	const media = url.searchParams.get('media');
	if (!media) {
		throw error(404);
	}
	const [, public_id] = media;

	return await cloudinary.uploader.destroy(public_id as string, {}, (err) => {
		if (err)
			throw error(
				500,
				JSON.stringify({
					err,
					public_id
				})
			);
	});
}

/**
 * we're getting inconsistent errors in this try-catch
 * sometimes we just get a string, sometimes we get the whole response.
 * I suspect this is coming from Cloudinary SDK so let's just try to
 * normalize it into a string here.
 */
const findErrorMessage = (e: any) => {
	if (typeof e == 'string') return e;
	if (e.message) return e.message;
	if (e.error && e.error.message) return e.error.message;
	return 'an error occurred';
};

async function deleteAsset(req: Request, res: Response) {}
function getCloudinaryToTinaFunc(opts: { useHttps?: boolean }) {
	return function cloudinaryToTina(file: any): Media {
		// TODO: I want to use this but it seams we might have to update our webpack config in order to do this in node
		// const useHttps = opts?.useHttps ?? true

		// Default to true
		let useHttps = true;
		if (typeof opts !== 'undefined' && typeof opts.useHttps !== 'undefined') {
			useHttps = opts.useHttps;
		}

		const sel = useHttps ? ('secure_url' as const) : ('url' as const);

		const filename = path.basename(file.public_id);
		const directory = path.dirname(file.public_id);

		return {
			id: file.public_id,
			filename,
			directory,
			src: file[sel],
			thumbnails: {
				'75x75': transformCloudinaryImage(file[sel], 'w_75,h_75,c_fit,q_auto'),
				'400x400': transformCloudinaryImage(file[sel], 'w_400,h_400,c_fit,q_auto'),
				'1000x1000': transformCloudinaryImage(file[sel], 'w_1000,h_1000,c_fit,q_auto')
			},
			type: 'file'
		};
	};
}

function transformCloudinaryImage(url: string, transformations: string): string {
	const parts = url.split('/image/upload/');

	if (parts.length === 2) {
		return parts[0] + '/image/upload/' + transformations + '/' + parts[1];
	}

	return url;
}
