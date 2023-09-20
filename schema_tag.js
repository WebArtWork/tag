module.exports = async function (waw) {
	const core = waw.Service('core');
        await core.wait();
	
	const Schema = waw.mongoose.Schema({
		category: { type: waw.mongoose.Schema.Types.ObjectId, ref: 'Category' },
		name: String,
		description: String
	});

	Schema.methods.create = function (obj, user, sd) {
		this.category = obj.category;
		this.name = obj.name;
		this.description = obj.description;
	}

	return waw.Tag = waw.mongoose.model('Tag', Schema);
}
