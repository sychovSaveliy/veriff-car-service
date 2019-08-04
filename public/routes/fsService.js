const fs = require("fs");

const path = ".";
const actions = {
	merge: getAllItemsInCat
};

function pathConcat(pathname) {
	return path + "/" + pathname;
}

function filereader(path) {
	return new Promise(function (resolve, reject) {
		fs.readFile(path, "utf8", function (e, d) {
			if (e) reject(e);
			else resolve(JSON.parse(d));
		});
	});
}

function getAllItemsInCat(path) {
	let arrayOfItems = [];
	console.log(`return all in ${path}`);

	return new Promise((resolve, reject) => {
		fs.readdir(`dist/api/${path}`, function (err, items) {
			arrayOfItems = items.reduce((prev, item) => {
				if (item.indexOf(".json") != -1) return prev;

				prev.push(filereader(`dist/api${path}/${item}/get.json`)); // TODO: upgrade to methodType
				return prev;
			}, []);

			resolve(arrayOfItems);
		});
	});
}

function actionExecutor(action, path) {
	return actions[action](path);
}

module.exports = {
	pathConcat,
	filereader,
	actionExecutor
};