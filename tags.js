module.exports = async (waw) => {
	waw.tags = async (query = {}) => {
		//	return waw.cache("tags" + JSON.stringify(query), async () => {
		return await waw.Tag.find(query).sort('category');
		//	});
	};
	waw.tagsWithCategories = async (query = {}) => {
		//	return waw.cache("tags" + JSON.stringify(query), async () => {
		return await waw.Tag.find(query).sort('category').populate({
			path: 'category',
			select: 'name group'
		});
		//	 });
	};

	const clean = (tag) => {
		waw.clearCache("tag" + tag.group);
		waw.clearCache("tags");
	}
	waw.on('tag_create', clean);
	waw.on('tag_update', clean);
	waw.on('tag_delete', clean);

	await waw.wait(500);
	const tags = await waw.tags();
	for (const tag of tags) {
		if (typeof tag.category === 'string') {
			await tag.delete();
		}
	}
};
