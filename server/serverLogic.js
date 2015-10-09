(function () {
	module.exports = ServerLogic = {};

	var _ = require('./underscore'),
		Player = require('./player'),
		Bomb = require('./bomb');

	ServerLogic.mapas = require('../shared/maps');
	ServerLogic.qtdePlayers = 0;
	ServerLogic.mapaEscolhido = 0;
	ServerLogic.players = [];
	ServerLogic.maximoPlayers = 0;
	ServerLogic.serverCriado = false;

	Array.prototype.isFull = function() {
		for (var i = 0; i < this.length; i++)
			if (this[i] == undefined)
				return false;

		return true;
	};

	Array.prototype.findPosition = function() {
		if (this.isFull())
			return -1;

		for (var i = 0; i < this.length; i++)
			if (this[i] == undefined)
				return i;
	};

	ServerLogic.enviarDados = function(dado) {};

	ServerLogic.VerificarLimitesMapa = function(y, x) {
		if (x >= 0 && y >= 0 && y < ServerLogic.mapas[ServerLogic.mapaEscolhido].length && x < ServerLogic.mapas[ServerLogic.mapaEscolhido][0].length)
			return true;

		return false;
	}

	ServerLogic.VerificarLocalMapa = function(y, x, comPlayer) {
		var player;

		if (comPlayer != undefined)
			player = comPlayer;
		else
			player = true;

		if (ServerLogic.VerificarLimitesMapa(y, x)) {
			if (player) {
				if (ServerLogic.mapas[ServerLogic.mapaEscolhido][y][x] > 1 && ServerLogic.mapas[ServerLogic.mapaEscolhido][y][x] < 105)
					return false;
			} else {
				if (ServerLogic.mapas[ServerLogic.mapaEscolhido][y][x] > 1 && ServerLogic.mapas[ServerLogic.mapaEscolhido][y][x] < 100)
					return false;
			}
		} else
			return false;

		return true;
	};

	ServerLogic.VerificarMapaRetornaXY = function(valor) {
		var local = [];

		_.each(ServerLogic.mapas[ServerLogic.mapaEscolhido], function(el, index) {
			_.find(ServerLogic.mapas[ServerLogic.mapaEscolhido][index], function(elem, i) {
				if (valor == elem) {
					local = [index, i];

					return true;
				}

				return false
			});
		});

		return local;
	};

	ServerLogic.VerificarPlayerXY = function(y, x) {
		console.log(ServerLogic.VerificarLimitesMapa(y, x), ServerLogic.mapas[ServerLogic.mapaEscolhido][y][x], y, x);
		if (ServerLogic.VerificarLimitesMapa(y, x) && ServerLogic.mapas[ServerLogic.mapaEscolhido][y][x] > 100 && ServerLogic.mapas[ServerLogic.mapaEscolhido][y][x] < 105)
			return ServerLogic.mapas[ServerLogic.mapaEscolhido][y][x];

		return false;
	};

	ServerLogic.RequisicaoPlayer = function() {
		if (ServerLogic.qtdePlayers <= ServerLogic.maximoPlayers) {
			player = new Player();
			player.id = 100 + (++ServerLogic.qtdePlayers);

			local = ServerLogic.VerificarMapaRetornaXY(player.id);

			player.x = local.length > 0 ? local[1] : 0;
			player.y = local.length > 0 ? local[0] : 0;

			ServerLogic.players.push(player);

			return [ServerLogic.mapaEscolhido, player.id, player.y, player.x];
		}
	};

	ServerLogic.Mover = function(player, direcao) {
		var result = [],
			element, x, y;

		element = _.find(ServerLogic.players, function(el) {
			if (el.id == player)
				return true;

			return false;
		});

		x = element.x;
		y = element.y;

		switch (direcao) {
			case 1: // Norte
				if (ServerLogic.VerificarLocalMapa(y - 1, x)) {
					ServerLogic.mapas[ServerLogic.mapaEscolhido][y][x] = 1;

					element.x = x;
					element.y = y - 1;
				}

				break;
			case 2: // Leste
				if (ServerLogic.VerificarLocalMapa(y, x + 1)) {
					ServerLogic.mapas[ServerLogic.mapaEscolhido][y][x] = 1;

					element.x = x + 1;
					element.y = y;
				}

				break;
			case 3: // Sul
				if (ServerLogic.VerificarLocalMapa(y + 1, x)) {
					ServerLogic.mapas[ServerLogic.mapaEscolhido][y][x] = 1;

					element.x = x;
					element.y = y + 1;
				}

				break;
			case 4: // Oeste
				if (ServerLogic.VerificarLocalMapa(y, x - 1)) {
					ServerLogic.mapas[ServerLogic.mapaEscolhido][y][x] = 1;

					element.x = x - 1;
					element.y = y;
				}

				break;
		}

		element.direcaoAtual = direcao;
		ServerLogic.mapas[ServerLogic.mapaEscolhido][element.y][element.x] = element.id;

		result = [element.id, direcao, element.y, element.x];

		return result;
	};

	ServerLogic.ColocarBomba = function(player) {
		var result = [],
			element;

		element = _.find(ServerLogic.players, function(el) {
			if (el.id == player)
				return true;

			return false;
		});

		if (!element.bombas.isFull()) {
			bomba = new Bomb();

			bomba.id = element.bombas.findPosition();
			bomba.pai = element;

			bomba.x = element.x;
			bomba.y = element.y;

			ServerLogic.mapas[ServerLogic.mapaEscolhido][bomba.y][bomba.x] = 150;

			element.bombas[bomba.id] = bomba;
			bomba.explode(ServerLogic.Explode);

			result = [element.id, bomba.id, element.y, element.x];
		}

		return result;
	};

	ServerLogic.Explode = function(b) {
		var podeCima, podeBaixo, podeEsquerda, podeDireita, delay, code;

		podeCima = podeBaixo = podeEsquerda = podeDireita = true;

		delay = 500;

		code = 151;

		ServerLogic.mapas[ServerLogic.mapaEscolhido][b.y][b.x] = code;
		ServerLogic.enviarDados(ServerLogic.LogicaGame([75], [b.pai.id, b.id, b.y, b.x, code, delay]));
		ServerLogic.mapas[ServerLogic.mapaEscolhido][b.y][b.x] = 1;

		for (i = 1; i <= (b.poderExplosao * 2); i++) {
			x = b.x;
			y = b.y;

			if (podeCima && ServerLogic.VerificarLocalMapa(y - i, x, false)) {
				if (player = ServerLogic.VerificarPlayerXY(y - i, x)) {
					ServerLogic.enviarDados(ServerLogic.LogicaGame([53], [player, b.pai.id]));

					podeCima = false;
				}

				if (i == (b.poderExplosao * 2))
					code = 154;
				else
					code = 152;

				ServerLogic.mapas[ServerLogic.mapaEscolhido][b.y - i][b.x] = code;
				ServerLogic.enviarDados(ServerLogic.LogicaGame([75], [b.pai.id, b.id, y - i, x, code, delay]));
				ServerLogic.mapas[ServerLogic.mapaEscolhido][b.y - i][b.x] = 1;
			} else
				podeCima = false;

			if (podeDireita && ServerLogic.VerificarLocalMapa(y, x + i, false)) {
				if (player = ServerLogic.VerificarPlayerXY(y, x + i)) {
					ServerLogic.enviarDados(ServerLogic.LogicaGame([53], [player, b.pai.id]));

					podeDireita = false;
				}

				if (i == (b.poderExplosao * 2))
					code = 155;
				else
					code = 153;

				ServerLogic.mapas[ServerLogic.mapaEscolhido][b.y][b.x + i] = code;
				ServerLogic.enviarDados(ServerLogic.LogicaGame([75], [b.pai.id, b.id, y, x + i, code, delay]));
				ServerLogic.mapas[ServerLogic.mapaEscolhido][b.y][b.x + i] = 1;
			} else
				podeDireita = false;

			if (podeBaixo && ServerLogic.VerificarLocalMapa(y + i, x, false)) {
				if (player = ServerLogic.VerificarPlayerXY(y + i, x)) {
					ServerLogic.enviarDados(ServerLogic.LogicaGame([53], [player, b.pai.id]));

					podeBaixo = false;
				}
				if (i == (b.poderExplosao * 2))
					code = 156;
				else
					code = 152;

				ServerLogic.mapas[ServerLogic.mapaEscolhido][b.y + i][b.x] = code;
				ServerLogic.enviarDados(ServerLogic.LogicaGame([75], [b.pai.id, b.id, y + i, x, code, delay]));
				ServerLogic.mapas[ServerLogic.mapaEscolhido][b.y + i][b.x] = 1;
			} else
				podeBaixo = false;

			if (podeEsquerda && ServerLogic.VerificarLocalMapa(y, x - i, false)) {
				if (player = ServerLogic.VerificarPlayerXY(y, x - i)) {
					ServerLogic.enviarDados(ServerLogic.LogicaGame([53], [player, b.pai.id]));

					podeEsquerda = false;
				}
				
				if (i == (b.poderExplosao * 2))
					code = 157;
				else
					code = 153;

				ServerLogic.mapas[ServerLogic.mapaEscolhido][b.y][b.x - i] = code;
				ServerLogic.enviarDados(ServerLogic.LogicaGame([75], [b.pai.id, b.id, y, x - i, code, delay]));
				ServerLogic.mapas[ServerLogic.mapaEscolhido][b.y][b.x - i] = 1;
			} else
				podeEsquerda = false;
		}

		delete b.pai.bombas[b.id];
		ServerLogic.enviarDados(ServerLogic.LogicaGame([76], [b.pai.id, b.id, delay]));
	};

	ServerLogic.LogicaGame = function(tipo, params) {
		var result = [];

		switch (parseInt(tipo[0])) {
			case 10: // Criar Server
				if (!ServerLogic.serverCriado) {
					maximoPlayers = parseInt(params[0]);
					mapaEscolhido = parseInt(params[1]);

					ServerLogic.players = [];
					ServerLogic.serverCriado = true;
					ServerLogic.maximoPlayers = maximoPlayers;
					ServerLogic.mapaEscolhido = mapaEscolhido;

					result = ServerLogic.RequisicaoPlayer();
				} else {
					for (var i = 0; i < ServerLogic.players.length; i++) {
						player = ServerLogic.players[i];

						ServerLogic.enviarDados(ServerLogic.LogicaGame([15], [player.id, player.y, player.x]));
					}

					result = ServerLogic.RequisicaoPlayer();
				}

				break;
			case 15: // Players Já Conectados
				result = params;

				break;
			case 21: // Conectado
				break;
			case 50: // Mover
				player = parseInt(params[0]);
				direcao = parseInt(params[1]);

				result = ServerLogic.Mover(player, direcao);

				break;
			case 51: // Colocar Bomba
				player = parseInt(params[0]);

				result = ServerLogic.ColocarBomba(player);

				break;
			case 52: // Pegar Item
				player = parseInt(params[0]);
				item = parseInt(params[1]);
				
				result = ServerLogic.PegarItem(player);

				break;
			case 53: // Morrer
				result = params

				break;
			case 76: // Fim bomba
			case 75: // Bomba Explode
				result = params

				break;
		}

		result.unshift(parseInt(tipo[0]));

		return result;
	};
})();