module.exports = async function (waw) {
	const Schema = waw.mongoose.Schema({
		enabled: {
			type: Boolean,
			default: false
		},
		name: String,
		description: String,
		thumb: String,
		global: {
			type: Boolean,
			default: false
		},
		data: {},
		parent: { type: waw.mongoose.Schema.Types.ObjectId, ref: "Tag" },
		author: { type: waw.mongoose.Schema.Types.ObjectId, ref: "User" },
		children: [{ type: waw.mongoose.Schema.Types.ObjectId, ref: "Tag" }],
		stores: [{ type: waw.mongoose.Schema.Types.ObjectId, ref: "Store" }]
	});

	Schema.methods.create = function (obj, user) {
		this.author = user._id;
		this.enabled = obj.enabled;
		this.name = obj.name;
		this.data = obj.data;
		this.description = obj.description;
		this.thumb = obj.thumb;
		this.global = obj.global;
		this.parent = obj.parent;
		this.children = obj.children;
		this.stores = obj.stores;
	};

	return waw.Tag = waw.mongoose.model("Tag", Schema);
};
