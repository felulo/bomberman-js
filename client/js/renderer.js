define(['../../shared/maps', '../../shared/types'], function() {
	var Renderer = Class.extend({
		init: function(jogo) {
			this.background = $('#cvBackground')[0];
			this.main = $('#cvMain')[0];

			this.jogo = jogo;

			this.tileSize = 24;

			this.ctxBackground = this.background.getContext('2d');
			this.ctxMain = this.main.getContext('2d');
		},

		clearCanvas: function(canvas) {
			canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
		},

		drawTile: function(context, img, sx, sy, x, y, offsetX, offsetY, width, height) {
			context.drawImage(img, sx, sy, width, height, x * this.tileSize + offsetX, y * this.tileSize + offsetY, width, height);
		},

		drawMap: function() {
			var mapa = require('Configuration').getTypes().Mapas[this.jogo.mapaEscolhido];

			if (mapa)
				for (i = 0; i < mapa.length; i++)
					for (j = 0; j < mapa[i].length; j++) {
						var config, imageObj;

						if (g = Types.existMap(mapa[i][j])) {
							config = require('Configuration').getConfigurationByType('Tile', g);
						} else {
							config = require('Configuration').getConfigurationByType('Tile', 1);
						}

						$.each(require('Configuration').getImages(), function(i, val) {
							$.each(val, function(index, value) {
								if(config.name.toUpperCase() == index.substr(0, index.length - 4).toUpperCase()) {
									imageObj = value;

									return false;
								}
							});
						});

						this.drawTile(this.ctxBackground, imageObj, 0, 0, j, i,
									config.animations[config.currentAnimation][0].offsetX,
									config.animations[config.currentAnimation][0].offsetY,
									config.animations[config.currentAnimation][0].width,
									config.animations[config.currentAnimation][0].height);
					}
		},

		drawPlayer: function(player, x, y) {
			config = require('Configuration').getConfigurationByType('Tile', player);

			$.each(require('Configuration').getImages(), function(i, val) {
				$.each(val, function(index, value) {
					if(config.name.toUpperCase() == index.substr(0, index.length - 4).toUpperCase()) {
						imageObj = value;

						return false;
					}
				});
			});

			this.drawTile(this.ctxMain, imageObj,
						config.animations[config.currentAnimation][0].x,
						config.animations[config.currentAnimation][0].y,
						x, y,
						config.animations[config.currentAnimation][0].offsetX,
						config.animations[config.currentAnimation][0].offsetY,
						config.animations[config.currentAnimation][0].width,
						config.animations[config.currentAnimation][0].height);
		},

		drawFire: function(x, y, tipo) {
			config = require('Configuration').getConfigurationByType('Tile', tipo);

			$.each(require('Configuration').getImages(), function(i, val) {
				$.each(val, function(index, value) {
					if(config.name.toUpperCase() == index.substr(0, index.length - 4).toUpperCase()) {
						imageObj = value;

						return false;
					}
				});
			});

			this.drawTile(this.ctxMain, imageObj,
						config.animations[config.currentAnimation][0].x,
						config.animations[config.currentAnimation][0].y,
						x, y,
						config.animations[config.currentAnimation][0].offsetX,
						config.animations[config.currentAnimation][0].offsetY,
						config.animations[config.currentAnimation][0].width,
						config.animations[config.currentAnimation][0].height);
		},

		drawBomb: function(x, y) {
			config = require('Configuration').getConfigurationByType('Tile', 50);

			$.each(require('Configuration').getImages(), function(i, val) {
				$.each(val, function(index, value) {
					if(config.name.toUpperCase() == index.substr(0, index.length - 4).toUpperCase()) {
						imageObj = value;

						return false;
					}
				});
			});

			this.drawTile(this.ctxMain, imageObj,
						config.animations[config.currentAnimation][0].x,
						config.animations[config.currentAnimation][0].y,
						x, y,
						config.animations[config.currentAnimation][0].offsetX,
						config.animations[config.currentAnimation][0].offsetY,
						config.animations[config.currentAnimation][0].width,
						config.animations[config.currentAnimation][0].height);
		},

		drawBackground: function() {
			this.clearCanvas(this.background);

			this.drawMap();
		},

		drawAnimated: function() {
			this.clearCanvas(this.main);

			for (var i = 0; i < this.jogo.players.length; i++) {
				if (this.jogo.players[i]) {
					this.drawPlayer(this.jogo.players[i].id, this.jogo.players[i].x, this.jogo.players[i].y);

					for (var j = 0; j < this.jogo.players[i].bombas.length; j++) {
						if (this.jogo.players[i].bombas[j]) {
							this.drawBomb(this.jogo.players[i].bombas[j].x, this.jogo.players[i].bombas[j].y);

							for (var k = 0; k < this.jogo.players[i].bombas[j].fire.length; k++)
								this.drawFire(this.jogo.players[i].bombas[j].fire[k].x, this.jogo.players[i].bombas[j].fire[k].y, this.jogo.players[i].bombas[j].fire[k].tipo);
						}
					}
				}
			}
		},

		render: function() {
			this.drawBackground();
			this.drawAnimated();
		}
	});

	return Renderer;
});