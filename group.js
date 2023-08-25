module.exports = async function(waw) {
	waw.tag_groups = async (group = '') => {
		const categories = await waw.categories(group);
		const categoryIds = categories.map(c=>c._id);
		const tags = await waw.tags({
			category: {
				$in: categoryIds
			}
		});
		return categories.map(c => {
			c.tags = tags.filter(t => t.category.toString() === c._id.toString());
			return c;
		});
	};

	waw.category_groups = async () => {
		const allCategories = await waw.categories();
		const tags = await waw.tags();
		return waw.config.groups.map(g => {
			categories = allCategories.filter(c=>c.group === g.name).map(c => {
				c.tags = tags.filter(t => t.category.toString() === c._id.toString());
				return c;
			});
			return {
				name: g.name,
				categories
			}
		});
	};
};
