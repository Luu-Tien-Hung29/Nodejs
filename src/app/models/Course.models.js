const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Course = new Schema({

	name: { type: String, minLength: 1 },
	description: { type: String, maxLength: 600 },
	image: { type: String, maxLength: 255 },
	createdAt: { type: Date, default: Date.now },
	updateddAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Course', Course);
