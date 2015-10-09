define(function() {
	var Player = Class.extend({
		init: function() {
			this.id = 0;

			this.x = 0;
			this.y = 0;

			this.direcao = 3;

			this.bombas = [];

			this.animations = [];

			for (var i = 0; i < 3; i++)
				this.bombas.push(undefined);
		}
	});

	return Player;
})