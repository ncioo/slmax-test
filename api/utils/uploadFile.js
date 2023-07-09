const fileType = require('file-type');
const { writeFileSync } = require('fs');
const randomString = require('./randomString');

module.exports = async function (file, username) {
	const fileInfo = await fileType.fromBuffer(file);
	let ext = fileInfo.ext,
		filename = `${username}-${Date.now()}-${randomString(8)}.${ext}`,
		dir = `./public/uploads/${filename}`,
		url = `/static/uploads/${filename}`;

	await writeFileSync(dir, file);

	return url;
};
