var app=angular.module("kanji-flash", []);

app.controller('mainCtrl', ['$scope', 'kanjiDump', function($scope, kanjiDump){
	$scope.nextButton=false;
	let q, on, kun, current=0;
	
	$scope.getNextQuestion=function(){
		console.log("Fetching question");
		on=false; kun=false; $scope.nextButton=false;
		$scope.onAnswer=""; $scope.kunAnswer="";
		$scope.showKunyomi=false; $scope.showOnyomi=false; $scope.showMeaning=false;
		if (current===q.length) {
			$scope.question="End.";
		} else {
			console.log(q);
			$scope.question=q[current].kanji;
			$scope.kunReading=q[current].kunyomi.split(',').map(function(item) {return item.trim(); });
			$scope.onReading=q[current].onyomi.split(',').map(function(item) {return item.trim(); });;
			$scope.meaning=q[current].meaning;
			++current;
		}
	}

	$scope.checkKunAnswer=function(){
		console.log("comparing with"+$scope.kunReading);
		if ($scope.kunReading.indexOf($scope.kunAnswer)!=-1) {
			kun=true;
			console.log("correct kunyomi");
			activateNextButton();
		}
	}

	$scope.checkOnAnswer=function(){
		console.log("comparing with"+$scope.onReading);
		if ($scope.onReading.indexOf($scope.onAnswer)!=-1) {
			console.log("correct onyomi");
			on=true;
			activateNextButton();
		}
	}

	var activateNextButton=function(){
		if (kun && on)
			$scope.nextButton=true;
	}

	var init=function(){
		console.log("Initializing.");
		kanjiDump.getData().then(function(res) {
			q=res.kanjiChars;
			$scope.getNextQuestion();
		});
	}

	init();
}]);

app.factory('kanjiList', ['kanjiDump', function(kanjiDump){
	console.log("In factory kanjiList");
	let current=0, kanjiChars=null;

	kanjiList={};

	kanjiList.getData=kanjiDump.getData().then(function(res){
		kanjiChars=res.kanjiChars;

		if (kanjiChars===null) {
			return undefined;
		}

		//console.log(kanjiChars);

		let kanjiList={};

		kanjiList.getNextKanji=function(){
			if (current===kanjiChars.length) return undefined;
			else return kanjiChars[current++];
		};

		return true;
	});
}]);

app.factory('kanjiDump', ['$http', function($http){
	console.log("Fetching kanji characters");

	let o={
		kanjiChars:[]
	};

	let getData=function(){
		return $http.get("http://127.0.0.1:3000/createsession")
		.then(function(res) {
			o.kanjiChars=res.data;
			return o;
		});
	};

	return {
		getData: getData
	};
}]);