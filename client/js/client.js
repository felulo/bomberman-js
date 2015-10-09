define(function() {
	var Client = {};

	Client.conectado = false;
	Client.recebeuResposta = undefined;
	Client.resposta = '';

	Client.createConn = function(ip, callback) {
		if (!Client.conectado) {
			Client.socket = new WebSocket('ws://' + ip + ':8888');
			Client.recebeuResposta = callback;

			Client.socket.onmessage = function (e) {
				if (Client.recebeuResposta)
					Client.recebeuResposta(e.data);
			};

			Client.socket.onclose = function (e) {
				console.log('desconectado')
			};

			Client.socket.onopen = function (e) {
				Client.socket.send('10|4|0');
			}
		}
	}

	return Client;
});