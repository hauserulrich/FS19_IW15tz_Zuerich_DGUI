var cities=["Bern","Luzern", "Genf","Chur","Lugano", "St.Gallen"];
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

function getWeatherJSONForCityLoop(chosenCity){
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
			//console.log(data);
			//createCard();
			for (i in data.observations.location) {
				  if (data.observations.location[i].distance==0){
				  loc=data.observations.location[i];
				  }
				};
			createCard(chosenCity);

			coordinatesForActivities = {lat: loc.latitude, lng: loc.longitude}


			//let city = loc.state;
			/*$('.card-title:first').text(city);

			let temp = loc.observation[0].temperature;
			$('.card-subtitle:first').text(temp + " C°");
			let description = loc.observation[0].description;
			let icon = loc.observation[0].iconLink;
			$('.description:first').text(description);
			$('.weathericon:first').attr('src', icon);*/
		},

		error: function (err){
			window.alert(err)
		}
	});
};

//Get Weather-Observation for today
function getWeatherObservationJSON(chosenCity){
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
			app_id: '7BkdLe9FTsphGjGexs6b',
			app_code: 'AWPhH77dKMHnL0twDz3p4w'
		},
		success: function (data) {
			console.log('getWeatherObservationJSON')
			console.log(data);
			//createCard();
			for (i in data.observations.location) {
				  if (data.observations.location[i].distance==0){
				  loc=data.observations.location[i];
				  }
				};
			createCard(chosenCity);

			coordinatesForActivities = {lat: loc.latitude, lng: loc.longitude}


			//let city = loc.state;
			/*$('.card-title:first').text(city);

			let temp = loc.observation[0].temperature;
			$('.card-subtitle:first').text(temp + " C°");
			let description = loc.observation[0].description;
			let icon = loc.observation[0].iconLink;
			$('.description:first').text(description);
			$('.weathericon:first').attr('src', icon);*/
			map.setCenter(coordinatesForActivities);

/*			let userActivityInputString = document.getElementById('activity').value;
			if(rangeInput != '5000'){
				rangeInput = document.getElementById('userRangeInput').value;
			}
*/			



			//console.log('rangeValue: ', userRangeInput)
			noForecast = false;
			forecastForSelectedDate = data.observations.location[0].observation[0];
			//console.log('forecastForSelectedDate: ', forecastForSelectedDate);

			setTimeout(() => {
			 getOverpassTransformedActivityList(coordinatesForActivities, rangeInput, userActivityInputString);
			}, 30)
			

		},

		error: function (err){
			window.alert(err)
		}
	});
};

function createCard(chosenCity){

/*<div class="card" style="width: 18rem;">*/
	var x=document.getElementById("localWeather");
	var divcolsm=document.createElement("div");
	x.appendChild(divcolsm);
	divcolsm.className="col-sm";

    var divcard=document.createElement("div");
	divcolsm.appendChild(divcard);
	divcard.className="card";
	divcard.style="height: 20rem;";

	var divcardbody=document.createElement("div");
	divcard.appendChild(divcardbody);
	divcardbody.className="card-body";

	var cityimg=document.createElement("img");
	switch(chosenCity) {
		  case "Bern": 
		  	cityimg.src="../images/Bern.jpeg";
		    break;
		  case "Luzern":
		  	cityimg.src="../images/Luzern.jpeg";
		    break;
		  case "Genf":
		  	cityimg.src="../images/Genf.jpeg";
		  	break;
		  case "Chur":
		  	cityimg.src="../images/Chur.jpeg";
		    break;
		  case "Lugano":
		 	cityimg.src="../images/Lugano.jpeg";
		    break;
		  case "St.Gallen":
		  	cityimg.src="../images/StGallen.jpg";
		  	break;
		  default:
		    cityimg.src="";
		    cityimg.alt="kein Bild vorhanden";
		};
	cityimg.height="120";
	cityimg.style="padding-bottom:1rem;";
	divcardbody.appendChild(cityimg);
	cityimg.className="card-img-top";

	var cardtitle=document.createElement("h4");
	divcardbody.appendChild(cardtitle);
	cardtitle.className="card-title";
	/*if (loc.city==chosenCity){ //da in den Daten manchmal city und state verwechselt ist, z.B. für Chur, wird hier zuerst geschaut, ob die Daten richtig sind. Ggf. wird statt City State angezeigt.
		cardtitle.innerHTML=loc.city;
		}
	else {
		cardtitle.innerHTML=loc.state;
	};*/
	cardtitle.innerHTML=chosenCity;//da in den Daten manchmal city und state verwechselt sind, z.B. fuer Chur, und weil wir den Ort Deutsch anzeigen moechten, wird hier der urspruenglich im Array citites angegebene Ort verwendet.

	var cardsubtitle=document.createElement("h4");
	divcardbody.appendChild(cardsubtitle);
	cardsubtitle.className="card-subtitle mb-2 text-muted";
	let strtemperature = loc.observation[0].temperature;
	let floattemperature=Math.round(parseFloat(strtemperature));//Temperatur wird in float umgewandelt und mathematisch gerundet
	//console.log(Math.round(strtemperature));
	cardsubtitle.innerHTML=floattemperature+" C°";

	var cardicon=document.createElement("img");
	divcardbody.appendChild(cardicon);
	cardicon.className="weathericon";
	cardicon.src=loc.observation[0].iconLink;

	var carddescription=document.createElement("a");
	divcardbody.appendChild(carddescription);
	carddescription.className="description";
	carddescription.innerHTML=loc.observation[0].description;
};
