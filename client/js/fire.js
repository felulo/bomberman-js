define(function() {
	var Fire = Class.extend({
		init: function(bomba, x, y, tipo, delay) {
			var self = this;

			this.bomb = bomba;

			this.x = x;
			this.y = y;

			this.tipo = tipo;

			setTimeout(function() {
				self.bomb.fire.splice(self.bomb.fire.indexOf(self), 1);
			}, delay);
		}
	});

	return Fire;
});