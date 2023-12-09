module.exports = async (waw) => {
	const load = async () => {
		waw.allTags = await waw.Tag.find({});

		waw.allCategories = await waw.Category.find({});
	};

	waw.getTag = (id) => {
		return id ? waw.allTags.find((t) => t.id === id.toString()) : null;
	};

	waw.getCategory = (id) => {
		return id ? waw.allCategories.find((c) => c.id === id.toString()) : null;
	};

	load();

	waw.on("tag_create", load);
	waw.on("tag_update", load);
	waw.on("tag_delete", load);

	waw.on("category_create", load);
	waw.on("category_update", load);
	waw.on("category_delete", load);

	waw.storeTags = async (store, fillJson) => {
		if (Array.isArray(store.headerTags) && store.headerTags.length) {
			fillJson.tags = store.headerTags.map(t_id => waw.getTag(t_id));
		}
	};
};
