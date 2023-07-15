const CHARS = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890';

/**
 * Создает случайные строки заданной длинны
 * @param {*} length - Длинна строки
 */
function randomString(length) {
	const arr = Array.from(
		{ length: length },
		(v, k) => CHARS[Math.floor(Math.random() * CHARS.length)]
	);

	return arr.join('');
}

module.exports = randomString;
