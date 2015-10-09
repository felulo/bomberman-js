define(['jquery'], function ($) {
	var Loading = {};

	Loading.responseLoader = undefined;

	Loading.load = function (URL) {
		$.ajax({
			url: URL,
			async: false,
			success: function (response) {
				Loading.responseLoader = response;
			}
		});
	};

	Loading.loadFile = function (url) {
		Loading.load(url);
	};

	return Loading;
});