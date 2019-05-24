var cities=["Bern","Luzern", "Genf","Chur","Lugano"];
//var cities=["Chur", "Luzern"];
var chosenCity;
var loc;

$("[data-toggle=popover]").popover({
    html: true, 
	content: function() {
          return $('#popover-content').html();
        }
});

$(document).ready(function(){
	cityLoop();
	//createCard();
	//getWeatherJSON();
});

function cityLoop(){
	for (i in cities){
		chosenCity=cities[i];
		getWeatherJSON(chosenCity);
	}
};

function getWeatherJSON(chosenCity){
	//console.log(chosenCity);
	$.ajax({
		url: 'https://weather.api.here.com/weather/1.0/report.json',
		type: 'GET',
		dataType: 'jsonp',
		jsonp: 'jsonpcallback',
		data: {
			product: 'observation',
			name: chosenCity,
			//name: 'Luzern',
			app_id: 'zvWSTyjcoSOSaHgDd47m',
			app_code: 'JW0IQrm5Unp63DYjintgxg'
		},
		success: function (data) {
			console.log(data);
			//createCard();		
			for (i in data.observations.location) {
				  if (data.observations.location[i].distance==0){
				  loc=data.observations.location[i];
				  }
				};
			createCard(chosenCity);

			
			//let city = loc.state;
			/*$('.card-title:first').text(city);

			let temp = loc.observation[0].temperature;
			$('.card-subtitle:first').text(temp + " C°");
			let description = loc.observation[0].description;
			let icon = loc.observation[0].iconLink;
			$('.description:first').text(description);
			$('.weathericon:first').attr('src', icon);*/
		}
	});
};

function createCard(chosenCity){
	var x=document.getElementById("localWeather");
	var divcolsm=document.createElement("div");
	x.appendChild(divcolsm);
	divcolsm.className="col-sm";

    var divcard=document.createElement("div");
	divcolsm.appendChild(divcard);
	divcard.className="card";

	var divcardbody=document.createElement("div");
	divcard.appendChild(divcardbody);
	divcardbody.className="card-body";

	var cardtitle=document.createElement("h4");
	divcardbody.appendChild(cardtitle);
	cardtitle.className="card-title";
	/*if (loc.city==chosenCity){ //da in den Daten manchmal city und state verwechselt ist, z.B. für Chur, wird hier zuerst geschaut, ob die Daten richtig sind. Ggf. wird statt City State angezeigt.
		cardtitle.innerHTML=loc.city;
		}
	else {
		cardtitle.innerHTML=loc.state;
	};*/
	cardtitle.innerHTML=chosenCity;


	var cardsubtitle=document.createElement("h4");
	divcardbody.appendChild(cardsubtitle);
	cardsubtitle.className="card-subtitle mb-2 text-muted";
	cardsubtitle.innerHTML=loc.observation[0].temperature+" C°";

	var cardicon=document.createElement("img");
	divcardbody.appendChild(cardicon);
	cardicon.className="weathericon";
	cardicon.src=loc.observation[0].iconLink;

	var carddescription=document.createElement("a");
	divcardbody.appendChild(carddescription);
	carddescription.className="description";
	carddescription.innerHTML=loc.observation[0].description;
};
