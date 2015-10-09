(function() {
	var cls = require('./lib/class');

	module.exports = Player = cls.Class.extend({
		init: function () {
			this.id = 0;

			this.direcaoAtual = 3;
			this.x = 0;
			this.y = 0;

			this.bombas = [];

			this.velocidade = 1;
			this.forcaBomba = 1;
			this.qtdeMaxBombas = 3;

			for (var i = 0; i < this.qtdeMaxBombas; i++)
				this.bombas.push(undefined);
		}
	});
})();