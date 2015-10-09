(function() {
	var cls = require('./lib/class');

	module.exports = Bomb = cls.Class.extend({
		init: function () {
			this.id = 0;
			this.pai = 0;

			this.x = 0;
			this.y = 0;

			this.poderExplosao = 1;
			this.forcaBomba = 1;
			this.tempoExplosao = 2;
		},

		explode: function (func) {
			var self = this;

			setTimeout(function() {
				if (func)
					func(self);
			}, bomba.tempoExplosao * 1000);
		}
	});
})();