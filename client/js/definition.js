define(function() {
	var Definition = Class.extend({
		_name: undefined,
		_definition: undefined,
		_folders: undefined,

		init: function (name, definition, folders) {
			this.setName(name);
			this.setDefinitions(definition);
			this.setFolders(folders);
		},

		getName: function () {
			return this._name;
		},
		getDefinitions: function () {
			return this._definition;
		},
		getFolders: function () {
			return this._folders;
		},
		
		setName: function (value) {
			this._name = value;
		},
		setDefinitions: function (value) {
			this._definition = value;
		},
		setFolders: function (value) {
			this._folders = value;
		}
	});

	Definition.createDefinition = function (config) {
		var name   	   = $(config).find('name').text(),
			definition = $(config).find('definition').text().split('\|'),
			folders = {};

		$(config).find('folders').children().each(function (index, value) {
			folders[value.nodeName] = $(value).text();
		});

		return new Definition(name, definition, folders);
	};

	return Definition;
}); 