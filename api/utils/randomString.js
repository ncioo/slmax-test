const CHARS = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890';

function randomString(length) {
	const arr = Array.from(
		{ length: length },
		(v, k) => CHARS[Math.floor(Math.random() * CHARS.length)]
	);

	return arr.join('');
}

module.exports = randomString;
