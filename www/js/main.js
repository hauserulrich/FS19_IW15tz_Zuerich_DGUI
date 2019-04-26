
$("[data-toggle=popover]").popover({
    html: true, 
	content: function() {
          return $('#popover-content').html();
        }
});

$.ajax({
	url: 'https://weather.api.here.com/weather/1.0/report.json',
	type: 'GET',
	dataType: 'jsonp',
	jsonp: 'jsonpcallback',
	data: {
		product: 'alerts',
		name: 'Lucerne',
		app_id: 'zvWSTyjcoSOSaHgDd47m',
		app_code: 'JW0IQrm5Unp63DYjintgxg'
	},
	success: function (data) {
		console.log(JSON.stringify(data));
	}
});