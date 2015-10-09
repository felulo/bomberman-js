define(function() {
	var Bomb = Class.extend({
		init: function() {
			this.pai = 0;

			this.x = 0;
			this.y = 0;

			this.fire = [];
		}
	});

	return Bomb;
});