const fileType = require('file-type');
const { writeFileSync } = require('fs');
const randomString = require('./randomString');

/**
 * Сохраняет файл на сервере в папку `./public/uploads/` и возвращает публичный URL
 * @param {Buffer} file - Файл в виде буфера
 * @param {string} username - Имя автора сообщения. Нужно для добавления в новое название файла
 */
module.exports = async function (file, username) {
	const fileInfo = await fileType.fromBuffer(file);

	//	Получаем расширения файла
	let ext = fileInfo.ext,
		//	Формируем имя файла из имени пользователя,
		//	временной метки и случайной строки
		filename = `${username}-${Date.now()}-${randomString(8)}.${ext}`,
		//	Путь, куда сохранится файл
		dir = `./public/uploads/${filename}`,
		//	Публичный URL файла
		url = `/static/uploads/${filename}`;

	//	Сохраняем файл
	await writeFileSync(dir, file);

	//	Возвращаем публичный URL сохраненного файла
	return url;
};
