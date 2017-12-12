var mongoose=require('mongoose');
var schema=mongoose.Schema;

var kanjiSchema=new schema({
	kanji: String,
	onyomi: String,
	kunyomi: String,
	meaning: String,
	last_access: Date,
	next_access_not_before: Date,
	lambda: Number
});

var Kanji=mongoose.model('Kanji', kanjiSchema);

module.exports={
	Kanji: Kanji
};