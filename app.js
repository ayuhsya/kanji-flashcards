var app=angular.module("kanji-flash", []);

app.controller('mainCtrl', ['$scope', 'kanjiList', function($scope, kanjiList){
	$scope.nextButton=false;
	var q=kanjiList, on, kun;
	
	$scope.getNextQuestion=function(){
		console.log("Fetching question");
		on=false; kun=false; $scope.nextButton=false;
		$scope.onAnswer="";
		$scope.kunAnswer="";
		let next=q.getNextKanji();
		if (next) {
			$scope.question=next.kanji;
			$scope.kunReading=next.kunReading;
			$scope.onReading=next.onReading;
		} else {
			$scope.question="End.";
		}
	}

	$scope.checkKunAnswer=function(){
		console.log("Checking Answer."+$scope.kunReading);
		if ($scope.kunAnswer===$scope.kunReading) {
			kun=true;
			activateNextButton();
		}
	}

	$scope.checkOnAnswer=function(){
		console.log("Checking Answer."+$scope.onReading);
		if ($scope.onAnswer===$scope.onReading) {
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
		$scope.getNextQuestion();
	}

	init();
}]);

app.factory('kanjiList', ['kanjiDump', function(kanjiDump){
	console.log("In factory kanjiList");
	let current=0, kanjiChars=kanjiDump.kanjiChars;
	let kanjiList={};

	kanjiList.getNextKanji=function(){
		if (current===kanjiChars.length) return undefined;
		else return kanjiChars[current++];
	};

	return kanjiList;
}]);

app.factory('kanjiDump', function(){
	console.log("In factory kanjiDump");
	let o={
		kanjiChars:[
			{kanji: "一", kunReading: "ひと", onReading: "いち"},
			{kanji: "二", kunReading: "ふた", onReading: "に"},
			{kanji: "三", kunReading: "み", onReading: "さん"},
			{kanji: "四", kunReading: "よ", onReading: "よん"},
		]
	};

	return o;
})