var mongoose = require('mongoose');

module.exports = mongoose.model('city', {
	a : String,
	lat : Number,
	lng : Number,
	dist: Number,
	done : Boolean
});


