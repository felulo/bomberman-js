define(['definition', 'loading', '../../shared/maps'], function(Definition, Loading) {
	var Configuration = {
		_definitions: undefined,
		_types: undefined,
		_contentFile: undefined,
		_images: undefined,
		_isReady: undefined,
		_ip: undefined,

		loadStructDefinitions: function() {
			var self = this;

			this._definitions = [];
			this._types = {};

			// Definitions
			$(this._contentFile).find('definitions').find('config').each(function (index, value) {
				self._definitions.push(Definition.createDefinition(value));

				self._types[self._definitions[index].getName()] = [];
			});
		},

		loadContentDefinitions: function() {
			var self = this;

			$(this._definitions).each(function (index, value) {
				var data;

				Loading.loadFile('http://' + self._ip + ':8888/contentFolder?folder=' + self._definitions[index].getFolders().content);
				//Loading.loadFile('server/contentFolder.php?folder=' + self._definitions[index].getFolders().content);

				data = Loading.responseLoader;
				//data = $.parseJSON(Loading.responseLoader);

				if (data.content.length > 0)
					$(data.content).each(function (i, val) {
						var content, arrayType;

						Loading.loadFile('client/content/' + self._definitions[index].getFolders().content + '/' + val);
						
						content = Loading.responseLoader;
						content = $.parseJSON(content);

						arrayType = self._types[self._definitions[index].getName()];
						arrayType.push(content);
					});
			});
		},

		loadSpriteSheets: function(callback) {
			var self = this,
				images = [];

			Loading.loadFile('http://' + this._ip + ':8888/contentImages');
			//Loading.loadFile('server/contentImages.php');

			images = Loading.responseLoader.content;
			//images = $.parseJSON(Loading.responseLoader).content;

			loadImages(images, function(imgs) {
				self._images = imgs;
				self._isReady = true;
				
				if ( callback )	callback();
			});

		},

		getDefinitions: function() {
			return this._definitions;
		},

		getTypes: function() {
			return this._types;
		},

		getContentFile: function() {
			return this._contentFile;
		},

		getImages: function() {
			return this._images;
		},

		getConfigurationByType: function(config, type) {
			var i, arrayType;

			arrayType = this.getTypes()[config];

			if (arrayType == undefined)
				return null;

			$.each(arrayType, function(index, val) {
				if (val['type'] == type) {
					i = index;

					return false;
				}
			});

			return arrayType[i];
		},

		getConfigurationByField: function(config, name, field) {
			var i, arrayType;

			arrayType = this.getTypes()[config];

			if (arrayType == undefined)
				return null;

			$.each(arrayType, function(index, val) {
				if (val['name'] == name && val[field] != undefined) {
					i = index;

					return false;
				}
			});

			return arrayType[i][field];
		},

		isReady: function() {
			return this._isReady;
		},

		load: function(url, callback) {
			this._isReady = false;

			Loading.loadFile(url);

			this._contentFile = Loading.responseLoader;

			this.loadStructDefinitions();
			this.loadContentDefinitions();

			this._types.Mapas = Mapas;

			this.loadSpriteSheets( callback );
		}
	};

	return Configuration;
});