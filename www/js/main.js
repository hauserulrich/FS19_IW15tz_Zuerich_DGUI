
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
			let location = data.observations.location[0];
			let city = location.state;
			$('.card-title:first').text(city);
			let temp = location.observation[0].temperature;
			$('.card-subtitle:first').text(temp + " C°");
			let description = location.observation[0].description;
			let icon = location.observation[0].iconLink;
			$('.description:first').text(description);
			$('.weathericon:first').attr('src', icon);
		}
	});
}