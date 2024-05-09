module.exports = async (waw) => {
	waw.crud("tag", {
		create: {
			ensure: waw.role("admin owner"),
		},
		unique: {
			name: 'url',
			ensure: waw.role("admin owner"),
			query: (req) => {
				return req.user.is.admin
					? {}
					: {
						$or: [
							{
								global: true,
								_id: req.body._id
							},
							{
								author: req.user._id,
								_id: req.body._id
							},
						],
					};
			}
		},
		get: {
			ensure: waw.role("admin owner"),
			query: (req) => {
				return req.user.is.admin
					? {}
					: {
							$or: [
								{
									global: true,
								},
								{
									author: req.user._id,
								},
							],
					  };
			},
		},
		update: {
			ensure: waw.role("admin owner"),
			query: (req) => {
				return req.user.is.admin
					? {
							_id: req.body._id,
					  }
					: {
							_id: req.body._id,
							author: req.user._id,
					  };
			},
		},
		delete: {
			ensure: waw.role("admin owner"),
			query: (req) => {
				return req.user.is.admin
					? {
							_id: req.body._id,
					  }
					: {
							_id: req.body._id,
							author: req.user._id,
					  };
			},
		},
	});
	waw.on("tag_create", async (tag) => {
		const ids = [tag.id];
		while (tag.parent) {
			tag = await waw.Tag.findById(tag.parent);
			tag.children = tag.children || [];
			tag.children = tag.children.concat(ids);
			tag.children = tag.children
				.map((i) => i.toString())
				.filter((value, index, self) => {
					return self.indexOf(value) === index;
				});
			await tag.save();
			ids.push(tag.id);
		}
	});
	const deleteChildren = async (id, ids) => {
		const tags = await waw.Tag.find({
			parent: id,
		});
		for (const tag of tags) {
			ids.push(tag.id);
			await deleteChildren(tag.id, ids);
			await waw.Tag.deleteOne({
				_id: tag.id,
			});
		}
	};
	waw.on("tag_delete", async (tag) => {
		const ids = [tag.id];
		await deleteChildren(tag.id, ids);
		while (tag.parent) {
			tag = await waw.Tag.findById(tag.parent);
			tag.children = tag.children || [];
			tag.children = tag.children.filter((t) => !ids.includes(t.toString()));
			await tag.save();
		}
	});

	const reloads = {};
	waw.addJson(
		"storePrepareTags",
		async (store, fillJson, req) => {
			reloads[store._id] = reloads[store._id] || [];
			const fillAllTags = async () => {
				fillJson.allTags = await waw.Tag.find({
					stores: store.id,
					enabled: true
				}).sort({
					order: 1
				}).lean();

				for (const tag of fillJson.allTags) {
					tag.children = (tag.children || []).map(id => id.toString());
					tag.parent = tag.parent && tag.parent.toString() || '';
					tag._id = tag._id.toString();
					tag.id = tag._id.toString();
				}
				fillJson.tags = fillJson.allTags.filter((t) => {
					return !t.parent;
				});
				fillJson.tagsIds = fillJson.allTags.reduce(
					(accumulator, currentDocument) => {
						return accumulator
							.concat(currentDocument.children)
							.concat([currentDocument._id]);
					},
					[]
				);
				// fillJson.tagsIds = []; // temp lock
			};
			fillAllTags();
			reloads[store._id].push(fillAllTags);
		},
		"Prepare updatable documents of tags"
	);
	const tagsUpdate = async (tag) => {
		for (const storeId of (tag.stores || [])) {
			for (const reload of (reloads[storeId] || [])) {
				reload();
			}
		}
	};
	waw.on("tag_create", tagsUpdate);
	waw.on("tag_update", tagsUpdate);
	waw.on("tag_delete", tagsUpdate);
};
