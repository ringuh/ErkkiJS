var mongoose = require('mongoose');

module.exports = mongoose.model('distance', {
	a : String,
	b : String,
	dist: Number,
	done : Boolean
});