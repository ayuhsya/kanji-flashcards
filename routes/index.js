var express = require('express');
var router = express.Router();
var poisson = require('poisson-process');
var Kanji = require('../models/model').Kanji;
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/kanjidb', {useMongoClient: true});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/createsession', function(req, res, next) {
	console.log("Creating session.");
	Kanji.find({}).where('next_access_not_before').lt(new Date()).exec(function(err, kanji) {
		if (err) throw err;
		res.end(JSON.stringify(kanji));
	});

	/*Kanji.find({}, function(err, kanji) {
		if (err) throw err;
		res.end(JSON.stringify(kanji));
	})*/
});

router.get('/correct', function(req, res, next) {
	Kanji.find({kanji: req.query.kanji}, function(err, kanji) {
		if (err) throw err;

		kanji.lambda=kanji.lambda*2;

		var curr_date=new Date();
		kanji.last_access=curr_date;
		kanji.next_access_not_before=curr_date.setTime(curr_date.getTime()+int(poisson.sample(kanji.lambda*60*60*1000)));

		kanji.save(function(err) {
			if (err) throw err;
			console.log("lambda doubled for" + kanji.kanji);
			res.end("Lambda doubled");
		});
	});
});

router.get('/incorrect', function(req, res, next) {
	Kanji.find({kanji: req.query.kanji}, function(err, kanji) {
		if (err) throw err;

		kanji.lambda=kanji.lambda/2;
		if (kanji.lambda===0) kanji.lambda=1;

		var curr_date=new Date();
		kanji.last_access=curr_date;
		kanji.next_access_not_before=curr_date.setTime(curr_date.getTime()+int(poisson.sample(kanji.lambda*60*60*1000)));

		kanji.save(function(err) {
			if (err) throw err;
			console.log("lambda halved for" + kanji.kanji);
			res.end("Lambda halved");
		});
	});
});

router.get('/addkanji', function(req, res, next) {
	console.log("request body: " + req.query.kanji + " " + req.query.onyomi);
	let kanjiobj=new Kanji({
		kanji: req.query.kanji,
		onyomi: req.query.onyomi,
		kunyomi: req.query.kunyomi,
		meaning: req.query.meaning,
		last_access: new Date(),
		next_access_not_before: new Date(),
		lambda: 1
	});

	kanjiobj.save(function(err) {
		if (err) throw err;
		console.log("added new kanji to db");
	});

	res.end("Kanji added");
});

module.exports = router;
