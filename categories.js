module.exports = async (waw) => {
	waw.categories = async (group = '', lean = true) => {
		if (group) {
		//	return waw.cache("category" + group, async () => {
				const q = waw.Category.find({ group }).sort('group');
				if (lean) {
					q.lean();
				}
				return await q;
		//	});
		} else {
		//	return waw.cache("categories", async () => {
				const q = waw.Category.find({}).sort('group');
				if (lean) {
					q.lean();
				}
				return await q;
		//	});
		}
	};
	
	waw.crud('category', {
		create: {
			ensure: waw.role('admin')
		},
		get: {
			ensure: waw.next,
			query: () => {
				return {};
			}
		},
		update: {
			ensure: waw.role('admin'),
			query: (req) => {
				return {
					_id: req.body._id
				};
			}
		},
		delete: {
			ensure: waw.role('admin'),
			query: (req) => {
				return {
					_id: req.body._id
				};
			}
		}
	})
	const clean = (category) => {
		waw.clearCache("category" + category.group);
		waw.clearCache("categories");
	}
	waw.on('category_create', clean);
	waw.on('category_update', clean);
	waw.on('category_delete', clean);
};
