var scotchTodo = angular.module('scotchTodo', []);

function mainController($scope, $http) {
	$scope.formData = {};
	var kohteet = {};
	var etaisyydet = {};

	var first = null;
	var second = null;

	

	// when landing on the page, get all todos and show them
	$http.get('/api/citys')
		.success(function(data) {
			$scope.todos = data;
			kohteet = data;
			console.log(data);
			lisaaKaupungit();

			$http.get('/api/distances')
			.success(function(data2) {
				console.log(JSON.stringify(data2));
				kasitteleEtaisyydet(data2);
				
				
			})
			.error(function(data) {
				console.log('Error: ' + data2);
			});
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	

	


	var kasitteleEtaisyydet = function(data)
	{
		for( var i in data )
		{
			var a = data[i]["a"];
			var b = data[i]["b"];
			var dist = data[i]["dist"];
			if( etaisyydet[a] == null)
				etaisyydet[a] = {};
			etaisyydet[a][b] = dist;
		}
		
		console.log(JSON.stringify(etaisyydet));
		dijkstraAlgoritmi("Helsinki", "Ivalo");
	};

	var map = L.map('map').setView([62.238289, 25.753632], 6);

// add an OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);



 	function lisaaKaupungit()
 	{
 		for(var i in kohteet )
 		{
 			console.log(kohteet[i]);

 			L.marker(kohteet[i]).addTo(map)
 			.bindPopup(kohteet[i]["a"])
 			.openPopup()
 			.on('click', valitseKaupunki);
 			
 			
 		}
 		
 	};

 	var dijkstraAlgoritmi = function(start, stop)
 	{
 		
 		// lasketaan lyhin reitti JOKAISEEN pisteeseen
 		var shortest = 999999999999;
 		var mahdollisetKohteet = {};

 		for( var i in etaisyydet) // haetaan kaikki mahdollisetKohteet[kaupunki]
 			if( i != start )
 			{
 				console.log(i);
 				
 				mahdollisetKohteet[i] = {"polku":[], "distance": shortest}; // haetaan listaan jokainen muu kaupunki kuin lähtökylä
 			}

 		//haetaan lähtökylästä seuraavat kaupungit
 		for( var i in etaisyydet[start])
 		{
 			console.log(i + " "+etaisyydet[start][i]);	
 		}
 		console.log("START");
 		console.log(JSON.stringify(mahdollisetKohteet));
 	}

 	/*
	DIJKSTRA NIINKUIN MINÄ SEN YMMÄRRÄN

	hae taulukkoon kaikki mahdolliset kohteet
	
	valitse lähtöpiste ja loppupiste

	hae lähtöpisteeseen yhteydessä olevat pisteet ja niiden etäisyydet

	hae yhteydessä olevista pisteistä yhteydessä olevat pisteet ja niiden etäisyydet

	hylkää pitkät reitit

 	*/

 	var checkCity = function(e)
 	{
 		
 		for( var i in kohteet )
 		{
 			if( kohteet[i]["lat"] == e.latlng.lat && kohteet[i]["lng"] == e.latlng.lng)
 				return kohteet[i]["a"];
 		}

 		return "ei_valittu";
 	}
 	var valitseKaupunki = function(e)
 	{
 		//console.log(e);
 		var valinta = checkCity(e);
 		if( first == null )
 			first = valinta;
 		else if( first == valinta )
 		{
 			first = null;
 			second = null;
 		}
 		else if( second == null )
 			second = valinta;
 		else if( second == valinta )
 			second = null;

 		

 		alert( first + " " + second);
 	}
}
