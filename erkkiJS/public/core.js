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
			if( etaisyydet[b] == null)
				etaisyydet[b] = {};
			etaisyydet[a][b] = dist;
			etaisyydet[b][a] = dist;
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


 	/*
 	DJIKSTRA luokat


	DIJKSTRA NIINKUIN MINÄ SEN YMMÄRRÄN

	hae taulukkoon kaikki mahdolliset kohteet
	
	valitse lähtöpiste ja loppupiste

	hae lähtöpisteeseen yhteydessä olevat pisteet ja niiden etäisyydet

	hae yhteydessä olevista pisteistä yhteydessä olevat pisteet ja niiden etäisyydet

	hylkää pitkät reitit

 	*/
 	var dijkstraAlgoritmi = function(start, stop)
 	{
 		
 		// lasketaan lyhin reitti JOKAISEEN pisteeseen
 		
 		
 		var kaupungit = [];
 		var lasketut = 0;
 		var kohdeLista = [];

 		for( var i in etaisyydet) // haetaan kaikki mahdollisetKohteet[kaupunki]
		{
			if( i == start)
				continue;

			console.log(i+" "+JSON.stringify(etaisyydet[i]));
			
			
			kaupungit.push( new Kaupunki(i, etaisyydet[i], start) );
			
		}

 		//haetaan lähtökylästä seuraavat kaupungit
 		for( var i in etaisyydet[start])
 		{
 			//console.log(i + " "+etaisyydet[start][i]);
 			for( var j in kaupungit)
 				if( kaupungit[j].Name() == i)
 				{
 					//console.log( "löydettiin "+kaupungit[j].Name());
 					kohdeLista.push(kaupungit[j]);

 				}
 				
 			
 		}
 		
 		
 		while( kohdeLista.length > 0 )
 		{
 			var tmpLista = [];
 			for( var i in kohdeLista)
 			{

 				var tmp = kohdeLista[i].checkPath(kaupungit);
 			}

 			kohdeLista = [];
 		}
		
		
 		console.log("START "+kohdeLista.length);
 		
 	}

 	//tarkastuslista -> käy läpi syöttäen aiempien laskujen pituudet -> palauta ne kohteet, joihin matka oli lyhyempi
 	



 	var Kaupunki = function(name, connections, start)
 	{
 		var self = this;
 		var nimi = name;
 		var yhteydet = connections;
 		var lyhinPathFromStart = [];
 		var lyhinMittaFromStart = 99999999999999;
 		var kaupunki_oliot = [];
 		this.laskettu = false;

 		console.log("luotiin " + nimi);

 		if( yhteydet[start] != null)
 		{

 			lyhinPathFromStart.push(start);
 			lyhinMittaFromStart = yhteydet[start];
 			console.log(nimi + " oli "+ start + " lähellä");
 		}


 		this.checkPath = function(towns)
 		{
 			// syötteenä kaikki kaupunkioliot. verrataan niitä tämän hetkiseen lyhimpään reittiin
 			if( kaupunki_oliot.length == 0) // otetaan ensin lähimpien kaupunkien oliot ylös. poislukien start
	 			for( var i in connections)	 			
	 				for(var j in towns)
	 					if( towns[j].Name() == i && i != start)
	 						kaupunki_oliot.push(towns[j]);
	 		
	 		console.log("ko length "+kaupunki_oliot.length);	
	 		for( var k in kaupunki_oliot)
	 			kaupunki_oliot[k].calcPath(self);
	 		
	 		
 		};

 		this.Name = function()
 		{
 			//console.log("kysyttiin nimi " + nimi);
 			return nimi;
 		};
 		this.getPath = function()
 		{
 			console.log(lyhinPathFromStart.length);
 			var tmp = [];
 			tmp = lyhinPathFromStart;
 			tmp.push(nimi);
 			return tmp;
 		};

 		this.getPathLength = function()
 		{
 			return lyhinMittaFromStart;
 		};

 		this.calcPath = function(town)
 		{
 			// syötteenä tulee kaupunki
 			/*	kaupungilta kysytään sen tämän hetkinen lyhin reitti ja etäisyys
				palautetaan true if lyhyempi kuin aiempi reitti
 			 */
 			if( lyhinPathFromStart.length == 0)
 			{
 				lyhinPathFromStart = town.getPath();

 				
 			}
 			else
 				console.log("Path ei ollut tyhjä");


 			console.log("Calcpath at "+nimi+" - syöte tulee from "+town.Name());
 			console.log(JSON.stringify(lyhinPathFromStart));

 		};
 	};


























 	 	var checkCity = function(e)
 	{ // tarkistaa mitä kaupunkia klikattiin
 		
 		for( var i in kohteet )
 		{
 			if( kohteet[i]["lat"] == e.latlng.lat && kohteet[i]["lng"] == e.latlng.lng)
 				return kohteet[i]["a"];
 		}

 		return "ei_valittu";
 	}
 	var valitseKaupunki = function(e)
 	{ // hoitaa kaupunkien clickaukset
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
