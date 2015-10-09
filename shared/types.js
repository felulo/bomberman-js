Types = {
	Map: {
		Ground: 1,
		Block: 10,
		Wall: 20
	},

	existMap: function(value) {
		achou = null;

		$.each(Types.Map, function(el, i) {
			if (i === value) {
				achou = i;
				return false;
			}
		});

		return achou;
	}
}