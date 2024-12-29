export default function idGenerator() {
	const subset = "123456789qwertyuiopasdfghjklzxcvbnm";
	const length = 11;
	var id = "";
	for (let i = 0; i < length; i++) {
		id += subset[Math.floor(Math.random() * subset.length)];
	}
	return id;
};