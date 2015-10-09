(function () {
	var webSocket = require('./WebSocket-Node').server,
		http = require('http'),
		fs = require('fs'),
		path = require('path'),
		url = require('url'),
		logic = require('./serverLogic'),
		_ = require('./underscore'),
		server, http_server, wsServer, connections;

	connections = [];

	http_server = http.createServer()

	http_server = http.createServer(function(request, response) {
		var uri = url.parse(request.url).pathname,
			filename = path.join(path.resolve(process.cwd(), '..', '..'), uri);  

		console.log(filename);

		/* verifica se o arquivo chamado não é o codigo fonte do servidor */
			/* verifica se o arquivo existe */
		fs.exists(filename, function(exists) {  
			if(!exists) {  
				response.writeHead(404, {"Content-Type": "text/plain"});  
				response.write("404 Not Found\n");  
				response.end('');
				return;  
			}  
			
			/* verifica se o arquivo foi encontrado, transforma em binario e retorna */
			fs.readFile(filename, "binary", function(err, file) {  
				/* esgotou */
				if(err) {  
					response.writeHead(500, {"Content-Type": "text/plain"});  
					response.write(err + "\n");  
					 response.end('');
					return;  
				} 		
				
				response.writeHead(200);  
				response.write(file, "binary");  //retorna o arquivo
				
				response.end(''); 			
			});  
		});
	}).listen(8080);

	server = http.createServer(function (rqt, res) {
		var path = url.parse(rqt.url).path;

		if (path.indexOf("/contentFolder") > -1) {
			///contentFolder?folder=images
			var pasta = path.substr(path.indexOf('=') + 1);
			var files = fs.readdirSync("../client/content/" + pasta);
			
			conteudo = {'content': files};

			res.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"});
			res.end(JSON.stringify(conteudo));
		} else if (path.indexOf("/contentImages") > -1) {
			///contentImages
			var files = fs.readdirSync("../client/images")

			for (var i = 0; i < files.length; i++)
				files[i] = 'client/images/' + files[i];

			conteudo = {'content': files};

			res.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"});
			res.end(JSON.stringify(conteudo));
		} else {
			res.writeHead(404);
			res.end();
		}
	}).listen(8888);

	wsServer = new webSocket({
		httpServer: server,
		autoAcceptConnections: true
	});

	wsServer.on('connect', function(cnn) {
		console.log('Bem-Vindo');

		connections.push(cnn);

		cnn.on('message', function(msg) {
			msg = String(msg.utf8Data);


			console.log('Entrada - ' + msg);

			array = msg.split('|');
			
			tipo = array.splice(0,1);
			params = array;

			resultado = logic.LogicaGame(tipo, params);

			if (resultado.length > 0) {
				resultado = resultado.join('|');

				console.log('Saída - ' + resultado);

				_.each(connections, function(el, i) {
					el.sendUTF(resultado);

					var matriz = {mapa:logic.mapas[logic.mapaEscolhido] }
					el.sendUTF( JSON.stringify(matriz) );
				});
			}
		});

		cnn.on('close', function() {
			console.log('Desconectado');
		});
	});

	logic.enviarDados = function(dado) {
		dado = dado.join('|');

		console.log('Saída - ' + dado);

		_.each(connections, function(el, i) {
			el.sendUTF(dado);

			var matriz = {mapa:logic.mapas[logic.mapaEscolhido] }
			el.sendUTF( JSON.stringify(matriz) );
		});
	};
})();