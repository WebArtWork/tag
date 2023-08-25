module.exports = async function (waw) {
	const Schema = waw.mongoose.Schema({
		name: String,
		group: String,
		description: String
	});

	Schema.methods.create = function (obj) {
		this.name = obj.name;
		this.group = obj.group;
		this.description = obj.description;
	}

	return waw.Category = waw.mongoose.model('Category', Schema);
}
