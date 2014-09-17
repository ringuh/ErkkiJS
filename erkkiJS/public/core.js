var scotchTodo = angular.module('scotchTodo', []);

function mainController($scope, $http) {
	$scope.formData = {};
	var kohteet = {};
	var etaisyydet = {};

	// when landing on the page, get all todos and show them
	$http.get('/api/citys')
		.success(function(data) {
			$scope.todos = data;
			kohteet = data;
			console.log(data);
			lisaaKaupungit();
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	$http.get('/api/distances')
		.success(function(data) {
			console.log(JSON.stringify(data));
			kasitteleEtaisyydet(data);
			
			
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	
	// when submitting the add form, send the text to the node API
	$scope.createTodo = function() {
		$http.post('/api/citys', $scope.formData)
			.success(function(data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.todos = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// delete a todo after checking it
	$scope.deleteTodo = function(id) {
		$http.delete('/api/citys/' + id)
			.success(function(data) {
				$scope.todos = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

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
	};

	var map = L.map('map').setView([62.238289, 25.753632], 6);

// add an OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// add a marker in the given location, attach some popup content to it and open the popup
/*
L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS3 popup. <br> Easily customizable.')
    .openPopup();
 */   

 	function lisaaKaupungit()
 	{
 		for(var i in kohteet )
 		{
 			console.log(kohteet[i]);
 			L.marker(kohteet[i]).addTo(map)
 			.bindPopup(kohteet[i]["a"])
 			.openPopup();
 		}
 		
 	};

 	var dijkstraAlgoritmi = function(start, stop, path, matka)
 	{
 		// lasketaan lyhin reitti JOKAISEEN pisteeseen
 		var shortest = 999999999999;
 		var mahdollisetKohteet = {};

 		for( var i in etaisyydet) 
 			if( i != start )
 				mahdollisetKohteet.push(i); // haetaan listaan jokainen muu kaupunki kuin lähtökylä

 		for( var i in mahdollisetKohteet)
 		{
 			
 		}
 	}
}
/*

lähtöpiste loppupiste
käy läpi vaihtoehdot, tiedä aiemman solmun visited?