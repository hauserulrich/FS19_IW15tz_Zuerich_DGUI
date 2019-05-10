
$("[data-toggle=popover]").popover({
    html: true, 
	content: function() {
          return $('#popover-content').html();
        }
});

$(document).ready(function(){
	getWeatherJSON();
});

function getWeatherJSON(){
	$.ajax({
		url: 'https://weather.api.here.com/weather/1.0/report.json',
		type: 'GET',
		dataType: 'jsonp',
		jsonp: 'jsonpcallback',
		data: {
			product: 'observation',
			name: 'Bern',
			app_id: 'zvWSTyjcoSOSaHgDd47m',
			app_code: 'JW0IQrm5Unp63DYjintgxg'
		},
		success: function (data) {
			console.log(data);
			let location = data.observations.location[0].state;
			$('.card-title:first').text(location);
			let temp = data.observations.location[0].observation[0].temperature;
			$('.card-subtitle:first').text(temp);
			let description = data.observations.location[0].observation[0].description;
			$('.description:first').text(description);
		}
	});
}