//************ Variables ***************


var cities=["Bern","Luzern", "Genf","Chur","Lugano", "St.Gallen"];
//var cities=["Chur", "Luzern"];
var chosenCity;
var loc;
var map = {};
//var defaultLayers = {}
var ui = {}
var populatedPlacesList = []
var forecastList = []
var forecastForSelectedDate = null;
var noForecast= true;
var interestingPlaceList = []
var activityList = [];

var rangeInput = '5000';
var windInput = {min: 0, max: 10};
var temperatureInput = {min: -30, max: 50}
var rainFallExcluded = false
var SnowFallExcluded = false
var markerGroup = null;
var filterConditionViolatedArray= []
var dateOfTodayString = ''




//************* Init *********************


$(document).ready(function(){
	cityLoop();


	let testForm = document.getElementById('userFormular');
	dateOfTodayString = String(new Date().toDateInputValue())

	testForm.addEventListener("submit", handleSubmit);
    $('#date').val(new Date().toDateInputValue());

	
	$("[data-toggle=popover]").popover({
    html: true,
	content: function() {
          return $('#popover-content').html();
        }
	});


	//set currentCenterCoordinates to Zürich
	currentCenterCoordinates = { lat: 47.3769 , lng: 8.5417 }; 

	//create map with ui and centerCoordinates and fill it into container 
	getMap(currentCenterCoordinates);
	
	// MapEvents enables the event system
	// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
	var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

	// add a resize listener to make sure that the map occupies the whole container
	window.addEventListener('resize', () => map.getViewPort().resize());


	//createCard();
	//getWeatherJSON();
});


function cityLoop(){
	for (i in cities){
		chosenCity=cities[i];
		getWeatherJSONForCityLoop(chosenCity);
	}
	loc={};
};








//********** dealing with userInput of form element **************

function handleSubmit(e){
	if(e.preventDefault()){
		e.preventDefault()
		return false
	}

	
	
	windInput = {min: 0, max: 10};
	temperatureInput = {min: -30, max: 50};
	rainFallExcluded = false;
	SnowFallExcluded = false;
	noForecast=true;
	 

	let userCityInputString = document.getElementById('userCityInput').value;
	let userDateInputString = document.getElementById('userDateInput').value;
	let userActivityInputString = document.getElementById('userActivityInput').value;

	if(document.getElementById('userRangeInput') != null){

		rangeInput = document.getElementById('userRangeInput').value;

		if(document.getElementById('minWind').value != undefined){

			windInput["min"] = document.getElementById('minWind').value;
		}
	
		if(document.getElementById('maxWind').value != undefined){
	
			
			windInput["max"] = document.getElementById('maxWind').value;
		}
	
		if(document.getElementById('minTemp').value != undefined){
	
			let userMinTemperatureInputString 
			temperatureInput['min']= document.getElementById('minTemp').value;
		}
	
		if(document.getElementById('maxTemp').value != undefined){
	 
			temperatureInput['max']= document.getElementById('maxTemp').value;
		}
	
		if(document.getElementById('rainFallInput') != null){
			
			rainFallExcluded = document.getElementById('rainFallInput').checked;
		}
	
		if(document.getElementById('SnowFallExcluded') != null){
			SnowFallExcluded = document.getElementById('SnowFallInput').ckecked;
		}
	}

	
	
	//console.log('windMin: ', windInput.min)
	//console.log('windMax: ', windInput.max)
	//console.log('windInput: ', windInput)
	//console.log('temeratureMin: ', temperatureInput.min)
	//console.log('temeratureMax: ', temperatureInput.max)
	//console.log('temperatureInput: ', temperatureInput)
	//console.log('rainFallExcluded: ', rainFallExcluded)
	//console.log('SnowFallExcluded: ', SnowFallExcluded)


/*
	console.log('place Input: ', userCityInputString);
	console.log('date Input: ', userDateInputString);
	console.log('newDate.value: ', new Date().toDateInputValue())
	console.log('activity Input: ', userActivityInputString);
	console.log('range Input: ', rangeInput);
*/	
	//console.log('place Input: ', userCityInputString);
	

	//getOverpassSpecifiedCity(userCityInputString, userRangeInput, userActivityInputString)
	//getOverpassTransformedActivityList(userCityInputString, userRangeInput, userActivityInputString)
	if((String(userDateInputString).includes(dateOfTodayString)){
		getWeatherObservationJSON(userCityInputString);
	}

	else{
		getWeather7DayForecastJSON(userCityInputString);
	}

	
		
}

//calculate distance of 2 Points

function getDistance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		let radlat1 = Math.PI * lat1/180;
		let radlat2 = Math.PI * lat2/180;
		let theta = lon1-lon2;
		let radtheta = Math.PI * theta/180;
		let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		if (unit=="M") { dist = dist * 1609.344 }
		return dist;
	}
}


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

			let userActivityInputString = document.getElementById('userActivityInput').value;
			if(rangeInput != '5000'){
				rangeInput = document.getElementById('userRangeInput').value;
			}
			



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

//Get Weatherforecast for the next 7 days
function getWeather7DayForecastJSON(chosenCity){
	//console.log(chosenCity);
	$.ajax({
		url: 'https://weather.api.here.com/weather/1.0/report.json',
		type: 'GET',
		dataType: 'jsonp',
		jsonp: 'jsonpcallback',
		data: {
			product: 'forecast_7days_simple',
			name: chosenCity,
			//name: 'Luzern',
			app_id: '7BkdLe9FTsphGjGexs6b',
			app_code: 'AWPhH77dKMHnL0twDz3p4w'
		},
		success: function (data) {

			//console.log('getWeather7DayForecastJSON:')
			//console.log(data);
			//createCard();

			forecastForSelectedDate= undefined; //clear forecastForSelectedDate Variable
			forecastList=[];

			for (i in data.dailyForecasts.forecastLocation) {
				  if (data.dailyForecasts.forecastLocation.distance==0){
				  loc=data.dailyForecasts.forecastLocation;
				  };
				};

			$.each(data.dailyForecasts.forecastLocation.forecast, (i, dailyForecast)=>{
				forecastList.push(dailyForecast);
				//console.log(dailyForecast)
			});
			//console.log('loc: ',loc)
			//createCard(chosenCity);
			coordinatesForActivities = {lat: loc.latitude, lng: loc.longitude};

			
			map.setCenter(coordinatesForActivities);

			
			let userActivityInputString = document.getElementById('userActivityInput').value;
			if(rangeInput != '5000'){
				rangeInput = document.getElementById('userRangeInput').value;
			}
			
			let userDateInput = document.getElementById('userDateInput').value;
			
			//console.log('date: ', userDateInput)

			$.each(forecastList, (i, forecast)=>{
				if(String(forecast.utcTime).includes(String(userDateInput))){
					forecastForSelectedDate = forecast;
					noForecast = false;
				}
			})

			//console.log('forecastForSelectedDate: ', forecastForSelectedDate);
			
			//console.log('rangeValue: ', userRangeInput)

			//getActivityLocationList(coordinatesForActivities, userRangeInput, userActivityInputString)
			setTimeout(() => {
			  getOverpassTransformedActivityList(coordinatesForActivities, rangeInput, userActivityInputString);
			}, 30)
			
		},
		error: function (err){
			window.alert(err)
		}
	});
};


//Overpass Ajax Calls

//Transform the userInput into the categories for the Overpass Ajax Call
function getOverpassTransformedActivityList(coordinates, rangeInput, activityInputString){

	chosenCityCoordinates = coordinates;
	transformedActivityList = [];
	activityList =[];
			

			switch (activityInputString) {
				case 'swimming':
					transformedActivityList = [

									{	activityId:'swimming',
										categoryID: 'water',
										categoryName: 'lake'},

									{	activityId:'swimming',
										categoryID: 'water',
										categoryName: 'pond'},

									{	activityId:'swimming',
										categoryID: 'water',
										categoryName: 'stream_pool'},

									];
					break;
				case 'jogging':
					transformedActivityList = [
									{	activityId:'jogging',
										categoryID: 'natural',
										categoryName: 'wood'},

									{	activityId:'jogging',
										categoryID: 'landuse',
										categoryName: 'forest'},

									];
					break;
				case 'hiking':
					transformedActivityList = [
									{	activityId:'hiking',
										categoryID: 'natural',
										categoryName: 'hill'},

									{	activityId:'hiking',
										categoryID: 'natural',
										categoryName: 'peak'},

									{	activityId:'hiking',
										categoryID: 'natural',
										categoryName: 'ridge'},
									];
					break;
				case 'surfing':
			transformedActivityList = [

								{	activityId:'surfing',
									categoryID: 'water',
									categoryName: 'lake'},

								{	activityId:'surfing',
									categoryID: 'water',
									categoryName: 'pond'},

								{	activityId:'surfing',
									categoryID: 'water',
									categoryName: 'stream_pool'},

								];
					break;
/*				case 'foodAndDrink':
					transformedActivityList = [
								{	activityId:'foodAndDrink',
									categoryID: 'amenity',
									categoryName: 'bar'},

								{	activityId:'foodAndDrink',
									categoryID: 'amenity',
									categoryName: 'bbq'},

								{	activityId:'foodAndDrink',
									categoryID: 'amenity',
									categoryName: 'biergarten'},

								{	activityId:'foodAndDrink',
									categoryID: 'amenity',
									categoryName: 'cafe'},

								{	activityId:'foodAndDrink',
									categoryID: 'amenity',
									categoryName: 'fast_food'},

								{	activityId:'foodAndDrink',
									categoryID: 'amenity',
									categoryName: 'food_court'},	

								{	activityId:'foodAndDrink',
									categoryID: 'amenity',
									categoryName: 'ice_cream'},	

								{	activityId:'foodAndDrink',
									categoryID: 'amenity',
									categoryName: 'pub'},	

								{	activityId:'foodAndDrink',
									categoryID: 'amenity',
									categoryName: 'restaurant'},	

								];
					break;
*/				default:
					// statements_def
					console.log('activityInputString does not match!');
					break;
			}
			
			//console.log('chosenCityCoordinates: ', chosenCityCoordinates)
			activityList = transformedActivityList;

			//console.log('transformedActivityList: ', activityList)

			map.setCenter(chosenCityCoordinates);

			setTimeout(() => {
			  getOverpassInterestingNodesAround(chosenCityCoordinates, rangeInput);
			}, 30)
			


}




function getOverpassInterestingNodesAround(coordinates, range){ 
	//console.log('ReachedAroundFunction!');

	//getInString = ''+ String(cityCoordinates.lat) +','+ String(cityCoordinates.lng) + ';r=' + String(searchRadius);

	let nodeAroundString = 'node(around:'+ String(range) + ','+ String(coordinates.lat) + ','+ String(coordinates.lng) + ')';
	let waysAroundString = 'way(around:'+ String(range) + ','+ String(coordinates.lat) + ','+ String(coordinates.lng) + ')';
	let relAroundString = 'rel(around:'+ String(range) + ','+ String(coordinates.lat) + ','+ String(coordinates.lng) + ')';

	let defaultOutputFormatString = 'out;';
	let outputCenterFormatString = 'out center;';

	let	queryString= '';
	
	

	if (activityList[0].categoryID === 'water'){

		queryString= 'http://overpass.osm.ch/api/interpreter?data=[out:json][timeout:20];';

		$.each(activityList, (i, activity)=>{
			//console.log('activity: ', activity)
			nodeActivityChainString =  nodeAroundString+ '["natural"="water"]["' + activity.categoryID + '"="'+ activity.categoryName+'"];' + defaultOutputFormatString;
			waysActivityChainString =  waysAroundString+ '["natural"="water"]["' + activity.categoryID + '"="'+ activity.categoryName+'"];' + outputCenterFormatString;
			relActivityChainString =  relAroundString+ '["natural"="water"]["' + activity.categoryID + '"="'+ activity.categoryName+'"];' + outputCenterFormatString;

			queryString = queryString + nodeActivityChainString + waysActivityChainString + relActivityChainString;
		})

	}
	
	else{

		queryString= 'http://overpass.osm.ch/api/interpreter?data=[out:json][timeout:20];';

		$.each(activityList, (i, activity)=>{
			//console.log('activity: ', activity)
			nodeActivityChainString =  nodeAroundString+ '["' + activity.categoryID + '"="'+ activity.categoryName+'"];' + defaultOutputFormatString;
			waysActivityChainString =  waysAroundString+ '["' + activity.categoryID + '"="'+ activity.categoryName+'"];' + outputCenterFormatString;
			relActivityChainString =  relAroundString+ '["' + activity.categoryID + '"="'+ activity.categoryName+'"];' + outputCenterFormatString;
		
			queryString = queryString + nodeActivityChainString + waysActivityChainString +	relActivityChainString;
		})	

	}

	
	//console.log('queryString: ', queryString)


	$.ajax({
		url: queryString,
		type: 'GET',
		dataType: 'json',

		success: function (data) {
			//console.log('interestingPlacesAround:')
			//console.log(data);


			interestingPlaceList = []

			$.each(data.elements, function(i, element){
					if(element.tags.name != undefined){
						interestingPlaceList.push(element)
					}
					
				
			});


			//console.log('interestingPlaceList: ', interestingPlaceList)
			//console.log('coordinates: ', coordinates)
			$.each(interestingPlaceList, (i, place) =>{




				//console.log('place: ', place)

				if(place.type ==='node'){
					if(Math.sign(Number(place.lat)) === -1){
 						place.lat = place.lat * -1;
 						}

 					if(Math.sign(Number(place.lon)) === -1){
 					place.lon = place.lon * -1;
 					}
					place['distance'] = getDistance(coordinates.lat, coordinates.lng, place.lat, place.lon, 'M')
				}
				else{

					if(Math.sign(Number(place.center.lat)) === -1){
 						place.center.lat = place.center.lat * -1;
 						}

 					if(Math.sign(Number(place.center.lon)) === -1){
 					place.center.lon = place.center.lon * -1;
 					}
					
					place['distance'] = getDistance(coordinates.lat, coordinates.lng, place.center.lat, place.center.lon, 'M')
				}
				
			})

			interestingPlaceList.sort(function(a, b) {
    			return a.distance - b.distance;
				});

			

			//console.log('interestingPlaceList: ', interestingPlaceList)

			//console.log('TransformedInterestingPlaceList: ', interestingPlaceList)



			//console.log('interestingPlaceList: ', interestingPlaceList)
			renderlist(interestingPlaceList);
	
			checkConditionsForActivity(interestingPlaceList)

			


		},

		error: function (errorThrown){
			window.alert(errorThrown)
		}

	});


};







// ************ Rendering *******************

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


function getMap(centerCoordinates){
    // Initialize the platform object:
    platform = new H.service.Platform({
        'app_id': '7BkdLe9FTsphGjGexs6b',
        'app_code': 'AWPhH77dKMHnL0twDz3p4w'
    });

    // Obtain the default map types from the platform object
    defaultLayers = platform.createDefaultLayers();

    // Instantiate (and display) a map object:
    map = new H.Map(
        document.getElementById('mapContainer'),
        defaultLayers.normal.map, {
            zoom: 10,
            center: centerCoordinates
        });


  	// Create the default UI:
  	ui = H.ui.UI.createDefault(map, defaultLayers, 'de-DE');



};

// create recommendation Card 
function get_recommendation_card(recommendation, cardtitel, description) {
	$("#recommendationcard").empty(); // Clear all Content of the Recommendation Card
	// Check the recommendation and alter the Image shown.
	switch (recommendation) {
	case "yes":
			picturelink = "../images/Thumbs_UpSmall.png";
			break;
	case "no":
			picturelink = "../images/Thumbs_downSmall.png";
			break;
	case "noData":
			picturelink = "../images/Sorry_no_answerSmall.jpg";
			break;
	default:
			break;
		};
	$('#recommendationcard').append('<div class="card flex-row flex-wrap my-3">'+
										'<div class="card-header border-0">'+
											'<img class="card-img-top"  src=' + picturelink +' alt="Recommendation">'+
										'</div>'+
										'<div class="card-block px-2">'+
											'<h4 class="card-title">' + cardtitel +	'</h4>'+
											'<p class="card-text">' + description +	'</p>'+
										'</div>'+
									'</div>');

}

function renderlist(resultlist){
	$("#resultlist").empty(); // Clear all the Content inside the div "Resultlist"
	//Create Button for Tabellenansicht
	$('#resultlist').append('<br><button class="btn btn-primary my-3" type="button" '+
							'data-toggle="collapse" data-target="#collapselist" '+
							'aria-expanded="false" aria-controls="collapselist">'+
							'Tabellenansicht</button> <div class="collapse" id="collapselist">');
	// Create Header for the Resultlist
	$('#collapselist').append('<div class="row result_row"  style="border: 2px solid darkgrey"> '+
		'						<div class="col-sm-6 result_col_titel">' + 
								'<h3>Title</h3>' + '</div><div class="col-sm-6 result_col_distance">' +
								'<h3>Distanz</h3>' + '<div> </div>');
	$.each(resultlist, function(i, standort){ // Create a Row for each datapoint from the Ajax Recall
		//console.log(standort);
		$('#collapselist').append('<div class="row result_row" style="border: 1px solid darkgrey"> '+
								' <div class="col-sm-6 result_col_titel">' + standort.tags.name +
								'</div><div class="col-sm-6 result_col_distance"> '+
								'<p class="text-right text-sm-left text-md-left">' +
								standort.distance.toFixed(0) + ' m </p><div> </div>');
	});
	// Create Enddiv for Collapsecontainer
	$('#collapseliste').append('</div>');

};