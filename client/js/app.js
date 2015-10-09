define(['Configuration', 'Client', 'Renderer', 'Player', 'Bomb', 'Fire'], function(Configuration, Client, Renderer, Player, Bomb, Fire) {
	var Jogo = {};

	Jogo.renderer = null;
	Jogo.mapaEscolhido = null;
	Jogo.tilesMapa = null;
	Jogo.playerId = null;
	Jogo.players = [];

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

	function EncontrarPlayer(playerId) {
		var player = null;

		$.each(Jogo.players, function(i, el) {
			if (el.id == playerId) {
				player = el;
				return false;
			}
		});

		return player;
	}

	function MontarMapa(mapa) {
		Jogo.tilesMapa = [];

		var linha;

		for (var i = 0; i < mapa.length; i++) {
			linha = [];

			for (var j = 0; j < mapa[i].length; j++)
				linha.push(mapa[i][j]);

			Jogo.tilesMapa.push(linha);
		}
	};

	function HabilitarControles() {
		$(window).keydown(function(e) {
			var player, direcao;

			player = Jogo.playerId;

			if ((e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode == 32) {
				switch (e.keyCode) {
					case 37: // Esquerda
						direcao = 4

						break;
					case 39: // Direita
						direcao = 2

						break;
					case 38: // Cima
						direcao = 1

						break;
					case 40: // Baixo
						direcao = 3

						break;
					case 32: // Espaco
						break;
				}

				if (e.keyCode != 32)
					Client.socket.send('50|' + player + '|' + direcao);
				else
					Client.socket.send('51|' + player);
			}
		});
	}

	function LogicaJogo(mensagem) {
		var mapa;

		if (mensagem.indexOf('|') == -1) {
			var mapa = $.parseJSON(mensagem);
			var linha;

			$('#matrix').html('');

			for (var i = 0; i < mapa.mapa.length ; i++) {
				linha = $('<p>').css({
					'display': 'block',
					'float': 'left',
					'clear': 'both',
					'margin': '0px'
				}).appendTo($('#matrix'));

				for (var j = 0; j < mapa.mapa[i].length; j++)
					$('<span>').css({
						'display': 'block',
						'float': 'left',
						'width': '25px',
						'height': '15px'
					}).html(mapa.mapa[i][j]).appendTo(linha);
			}
		} else {
			var str = mensagem.split('|');

			switch(str[0]) {
				case '10':
					if (Jogo.playerId == null) {
						Jogo.mapaEscolhido = str[1];
						Jogo.playerId = str[2];

						MontarMapa(Configuration.getTypes().Mapas[Jogo.mapaEscolhido]);

						HabilitarControles();

						mainLoop();
					}

					p = new Player();
					p.id = str[2];
					p.x  = parseInt(str[4]);
					p.y  =  parseInt(str[3]);

					Jogo.players.push(p);

					break;
				case '15':
					if (str[1] != Jogo.playerId) {
						p = new Player();
						p.id = str[1];
						p.x  = parseInt(str[3]);
						p.y  = parseInt(str[2]);

						Jogo.players.push(p);
					}

					break;
				case '50':
					p = EncontrarPlayer(str[1]);

					if (p) {
						p.direcao = str[2];
						p.x = str[4];
						p.y = str[3];
					}

					break;
				case '51':
					p = EncontrarPlayer(str[1]);

					if (p) {
						b = new Bomb();
						b.id = parseInt(str[2]);
						b.pai = p.id;
						b.x = str[4];
						b.y = str[3];

						p.bombas[b.id] = b;
					}

					break;
				case '53':
					p = EncontrarPlayer(str[1]);

					if (p) {
						$(window).unbind('keydown');
						
						config = Configuration.getConfigurationByType('Tile', parseInt(str[1]));
						config.currentAnimation = 'die';

						setTimeout(function() {
							delete Jogo.players[parseInt(str[1]) - 101];
						}, 1000);
					}

					break;
				case '75':
					p = EncontrarPlayer(str[1]);

					if (p) {
						f = new Fire(p.bombas[parseInt(str[2])], str[4], str[3], str[5], str[6]);

						p.bombas[parseInt(str[2])].fire.push(f);
					}

					break;
				case '76':
					p = EncontrarPlayer(str[1]);

					if (p) {
						b1 = parseInt(str[2]);
						
						setTimeout(function() {
							delete p.bombas[b1];
						}, parseInt(str[3]))
					}

					break;
			}
		}
	};

	$('#btnCriarJogo').click(function() {
		Configuration._ip = 'localhost';
		Jogo.renderer = new Renderer(Jogo);

		Comecar();
	});

	$('#btnEntrarJogo').click(function() {
		Configuration._ip = $('#txtIP').val();
		Jogo.renderer = new Renderer(Jogo);

		Comecar();
	});

	function mainLoop(){
		requestAnimFrame(function() {
			mainLoop()
		});

		Jogo.renderer.render();
	};

	function Comecar() {
		Configuration.load('client/config/config.xml', function() {
			console.log('Carregado Configuracoes');

			Client.createConn(Configuration._ip, function(e) {
				LogicaJogo(e);
			});
		});
	}
});