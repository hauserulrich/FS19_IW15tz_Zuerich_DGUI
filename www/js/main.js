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
	if((String(userDateInputString).includes(dateOfTodayString))){
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



			//Display Results in ListView on Page
			renderlist(interestingPlaceList);
			
			//Check if the activity-conditions are satisfied and the filters fit
			checkConditionsForActivity(interestingPlaceList)

			


		},

		error: function (errorThrown){
			window.alert(errorThrown)
		}

	});


};



// checks if conditions for activities are satisfied,
// creates content for get_recommendation_card(recommendation, cardTitle, cardDescription) and calls it
// and calls addInfoBubbleForOSM(interestingPlacesList)
//includes call for checkIfFiltersNotViolated
function checkConditionsForActivity(interestingPlaceList){
				//************// Determine if the conditions for activity are stisfied
	let recommendation = '';
	let cardTitle = '';
	let cardDescription = '';
	let tempString = ''		
	if(noForecast === false){
		let filtersNotViolated = checkIfFiltersNotViolated()
		//console.log('checkIfFiltersNotViolated(): ', checkIfFiltersNotViolated())
		if ((forecastForSelectedDate != undefined) && (forecastForSelectedDate.comfort != undefined) && (forecastForSelectedDate.comfort != '*')){
			tempString= 'Die gefühlte Temperatur beträgt: ' + String(forecastForSelectedDate.comfort) + '°C'
			
		}
		if(filtersNotViolated){
			switch (activityList[0].activityId) {
				case 'swimming':
					if(forecastForSelectedDate.comfort >= 20){
						recommendation = 'yes';
						cardTitle = 'Yes, you can go swimming!';
					}
					else{
						recommendation = 'no';
						cardTitle = "No you can't go swimming...";							
					}
					if(interestingPlaceList.length >0){
						recommendation = 'yes';
						cardTitle = 'Yes, you can go swimming!';							
					}
					else{
						recommendation = 'no';
						cardTitle = "No you can't go swimming...";
												}
					cardDescription = 	tempString +
										'</br> die Windgeschwindigkeit liegt bei: '+ String(forecastForSelectedDate.beaufortScale) + ' beaufort'+
										'</br> und es wurden ' + String(interestingPlaceList.length) + ' mögliche Orte gefunden.'
				break;
			case 'jogging':
				if(forecastForSelectedDate.comfort >= 10){
						recommendation = 'yes';
						cardTitle = 'Yes, you can go jogging!';
					}
					else{
						recommendation = 'no';
						cardTitle = "No you can't go jogging...";							
					}
					if(interestingPlaceList.length >0){
						recommendation = 'yes';
						cardTitle = 'Yes, you can go jogging!';							
					}
					else{
						recommendation = 'no';
						cardTitle = "No you can't go jogging...";
												}
					cardDescription = 	tempString +
										'</br> die Windgeschwindigkeit liegt bei: '+ String(forecastForSelectedDate.beaufortScale) + ' beaufort' +
										'</br> und es wurden ' + String(interestingPlaceList.length) + ' mögliche Orte gefunden.'
				break;
			case 'hiking':
					
					if(forecastForSelectedDate.comfort >= 15){
						recommendation = 'yes';
						cardTitle = 'Yes, you can go hiking!';
					}
					else{
						recommendation = 'no';
						cardTitle = "No you can't go hiking...";							
					}
					if(interestingPlaceList.length >0){
						recommendation = 'yes';
						cardTitle = 'Yes, you can go hiking!';							
					}
					else{
						recommendation = 'no';
						cardTitle = "No you can't go hiking...";
												}
					cardDescription = 	tempString +
										'</br> die Windgeschwindigkeit liegt bei: '+ String(forecastForSelectedDate.beaufortScale) + ' beaufort' +
										'</br> und es wurden ' + String(interestingPlaceList.length) + ' mögliche Orte gefunden.'
				break;
			case 'surfing':
				
				if(forecastForSelectedDate.beaufortScale >=2){
						recommendation = 'yes';
						cardTitle = 'Yes, you can go surfing!';
					}
					else{
						recommendation = 'no';
						cardTitle = "No you can't go surfing...";							
					}
					if(interestingPlaceList.length >0){
						recommendation = 'yes';
						cardTitle = 'Yes, you can go surfing!';							
					}
					else{
						recommendation = 'no';
						cardTitle = "No you can't go surfing...";
												}
					cardDescription = 	tempString +
										'</br> die Windgeschwindigkeit liegt bei: '+ String(forecastForSelectedDate.beaufortScale) + ' beaufort' +
										'</br> und es wurden ' + String(interestingPlaceList.length) + ' mögliche Orte gefunden.'
				break;
			case 'foodAndDrink':
				break;
			default:
				// statements_def
				console.log('activityInputString does not match!')
				break;
			}
			get_recommendation_card(recommendation, cardTitle, cardDescription)
			addInfoBubbleForOSM(interestingPlaceList)
		}
		
	}
	else{
				
		addInfoBubbleForOSM(interestingPlaceList)
		recommendation = 'noData';
		cardTitle = "We don't know yet...";
		cardDescription = 	'The forecast for this day is not available yet. </br> '+
							' (Forecast is usually available for today and the next 7 days) </br>' +
							'But ' + String(interestingPlaceList.length) + ' places have been found.' ;
		get_recommendation_card(recommendation, cardTitle, cardDescription)
	}
}


// checks if conditions for filters are not violated,
// creates content for get_recommendation_card(recommendation, cardTitle, cardDescription) and calls it
// gets called by checkConditionsForActivity(interestingPlaceList)
function checkIfFiltersNotViolated(){

	//console.log('ReachedFilters')

	let recommendation = '';
	let cardTitle = '';
	let cardDescription = '';
	let tempString=''
	let windString=''
	filterConditionViolatedArray = [];

	//console.log('forecastForSelectedDate.beaufortScale: ', forecastForSelectedDate.beaufortScale)
	if ((forecastForSelectedDate != undefined) && (forecastForSelectedDate.comfort != undefined) && (forecastForSelectedDate.comfort != '*')){
		tempString= 'Die gefühlte Temperatur beträgt: ' + String(forecastForSelectedDate.comfort) + '°C';
	}
	else {
		forecastForSelectedDate.comfort = 0;
	}

	if ((forecastForSelectedDate != undefined) && (forecastForSelectedDate.beaufortScale != undefined) && (forecastForSelectedDate.beaufortScale != '*')){
		windString= '</br> die Windgeschwindigkeit wird mit: '+ String(forecastForSelectedDate.beaufortScale) + ' beaufort angegeben.'
	}
	else {
		forecastForSelectedDate.beaufortScale = 0;
	}


	if((Number(temperatureInput.min) <= Number(forecastForSelectedDate.comfort)) && (Number(forecastForSelectedDate.comfort) <= Number(temperatureInput.max))){

	}

	else{
		filterConditionViolatedArray.push('temperatureViolation');
	}
	

	if((Number(windInput.min) <= Number(forecastForSelectedDate.beaufortScale)) && (Number(forecastForSelectedDate.beaufortScale) <= Number(windInput.max))){
	
	}

	else{
		filterConditionViolatedArray.push('windViolation');
	}

	if(rainFallExcluded){

		if(forecastForSelectedDate.rainFall === "*"){
				filterConditionViolatedArray.push('rainUncertain')						
			}
		
		else{
				filterConditionViolatedArray.push('rainViolation')
			}
		
	}

	if(SnowFallExcluded){
	
		if(forecastForSelectedDate.snowFall === "*"){
				filterConditionViolatedArray.push('snowUncertain')
			}
		
		else{
				filterConditionViolatedArray.push('snowViolation')
			}

		
	}

	if (filterConditionViolatedArray.length > 0){
		$.each(filterConditionViolatedArray, (i, violationString)=>{

			//console.log('violationString: ', violationString)

			switch (violationString) {
				case "temperatureViolation":
					recommendation = 'no';
					cardTitle = "Dein Filterkriterium: Temperatur (min: "+ temperatureInput.min + " °C, max: "+ temperatureInput.max + " °C) ist nicht erfüllt.";
														
	
					cardDescription = 	tempString +
										windString +
										'</br> und es wurden ' + String(interestingPlaceList.length) + ' mögliche Orte gefunden.'
	
					get_recommendation_card(recommendation, cardTitle, cardDescription)
					break;

				case "windViolation":
					recommendation = 'no';
					cardTitle = "Dein Filterkriterium: Windgeschwindigkeit (min: "+ windInput.min + " , max: "+ windInput.max+ ") ist nicht erfüllt.";
														
	
					cardDescription = 	tempString +
										windString +
										'</br> und es wurden ' + String(interestingPlaceList.length) + ' mögliche Orte gefunden.'
	
					get_recommendation_card(recommendation, cardTitle, cardDescription)
					break;


				case "rainViolation":
					recommendation = 'no';
					cardTitle = "Es wird wahrscheinlich leider regnen...";
														
	
					cardDescription = 	tempString +
										windString +
										'</br> und es wurden ' + String(interestingPlaceList.length) + ' mögliche Orte gefunden.'
			
					get_recommendation_card(recommendation, cardTitle, cardDescription)
					break;

				case "rainUncertain":
					recommendation = 'no';
					cardTitle = "Es konnte nicht festgestellt werden ob es regnen wird...";
														
	
					cardDescription = 	tempString +
										windString +
										'</br> und es wurden ' + String(interestingPlaceList.length) + ' mögliche Orte gefunden.'
			
					get_recommendation_card(recommendation, cardTitle, cardDescription)
					break;




				case "snowViolation":
					recommendation = 'no';
					cardTitle = "Es wird wahrscheinlich leider schneien...";
														
	
					cardDescription = 	tempString +
										windString +
										'</br> und es wurden ' + String(interestingPlaceList.length) + ' mögliche Orte gefunden.'
			
					get_recommendation_card(recommendation, cardTitle, cardDescription)

					break;

				case "snowUncertain":
					recommendation = 'no';
					cardTitle = "Es konnte nicht festgestellt werden ob es schneien wird...";
														
	
					cardDescription = 	tempString +
										windString +
										'</br> und es wurden ' + String(interestingPlaceList.length) + ' mögliche Orte gefunden.'
			
					get_recommendation_card(recommendation, cardTitle, cardDescription)

					break;

				default:
					 console.log('something went wrong in the filterConditionEvaluation')
					break;
			}

		})
	return false;
	}

	else{
		return true;
	}
	


}


//Creates a markerGroup if necessary and adds an eventListener to it on "tap" event, which creates the bubble on the map  
//Calls generateMarkers(placesList) to create the individual markers
function addInfoBubbleForOSM(placesList) {

	if (markerGroup != null){
		map.removeObject(markerGroup);
	}
  
 	markerGroup = new H.map.Group();
  	//console.log('markerGroup', markerGroup)
  	

  	map.addObject(markerGroup);

 	// add 'tap' event listener, that opens info bubble, to the group
  	markerGroup.addEventListener('tap', function (evt) {
    // event target is the marker itself, group is a parent event target
    // for all objects that it contains
    var bubble =  new H.ui.InfoBubble(evt.target.getPosition(), {
      	// read custom data
    	content: evt.target.getData()
    });
    // show info bubble
    ui.addBubble(bubble);
  }, false);

  	generateMarkers(placesList)

}





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



//Generates Markers depending on the coordinates of the placeObjects in the placesList and
//Creates html for Marker, which is displayed in the bubble
function generateMarkers(placesList){
 	$.each(placesList, (i, palce) =>{
 		//console.log('palce: ', palce)
 		//console.log('palceType: ', palce.type)


 		let palceName = palce.tags.name;
 		let palceCategory = 'category';
 		let comfortString = ''

 		if(palce.tags.natural != undefined){
 			if(palce.tags.natural === 'water'){
 				palceCategory = palce.tags.water;
 			}
 			else{
 				palceCategory = palce.tags.natural;
 			}
 			
 		}

 		if(palce.tags.landuse != undefined){
 			palceCategory = palce.tags.landuse;
 		}

 		if(palce.tags.amenity != undefined){
 			palceCategory = palce.tags.amenity;
 		}

 		if ((forecastForSelectedDate != undefined) && (forecastForSelectedDate.comfort != undefined) && (forecastForSelectedDate.comfort != '*')){
 			comfortString = ' </br><span> Temperature: ' + String(forecastForSelectedDate.comfort)+' °C</span>'
 		}
 		
 		
 		let palceLat = 0;
 		let palceLon = 0;

 		if(palce.type === 'node'){
 			palceLat = palce.lat;
 			palceLon = palce.lon;
 		}
 		else{
 			palceLat = palce.center.lat;
 			palceLon = palce.center.lon;
 		}

 		htmlForMarker = '<strong>' + String(palceName) + '</strong>' +
 						 '<span> Distance: ' + String(palce.distance.toFixed(0))+ ' m</span>'+
 						 comfortString +
 						 '</br>' + '<span> Category: '  + String(palceCategory) + '</span>';

 		coordinatesForMarker = {lat: palceLat, lng: palceLon}
 		//console.log('palce: ', palce)
			//let coordinates = {lat: item.position[0], lng: item.position[1]}
		addMarkerToGroup(markerGroup, coordinatesForMarker, htmlForMarker);

	});
}



//Creates a new marker and adds it to a group
//group =  The group holding the new marker
//coordinates = The location of the marker
//html = Data associated with the marker
//activityList = global variable for the chosen activity
function addMarkerToGroup(group, coordinate, html) {
	switch(activityList[0].activityId){
		case 'swimming':
			iconSource = new H.map.Icon('../images/water.png');
		break;

		case 'jogging':
			iconSource = new H.map.Icon('../images/forest.png');
		break;

		case 'hiking':
			iconSource = new H.map.Icon('../images/mountains.png');
		break;

		case 'surfing':
			iconSource = new H.map.Icon('../images/water.png');
		break;


/*		case 'foodAndDrink':
			iconSource = new H.map.Icon('../images/restaurant.png');
		break;
*/

		default:

		break

	}
	
  	let marker = new H.map.Marker(coordinate, {icon: iconSource});
  	// add custom data to the marker
  	marker.setData(html);
  	group.addObject(marker);
}




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