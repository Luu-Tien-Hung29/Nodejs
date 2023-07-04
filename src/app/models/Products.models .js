const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Products = new Schema({

	phoneNumber: { type: String, maxLength: 255 },
	password: { type: String, maxLength: 255 },
	fullName: { type: String, maxLength: 255 },
	name: { type: String, maxLength: 255 },
	savePassword:{type:Boolean},
	refreshToken: { type: String, maxLength: 255 },
	createdAt: { type: Date, default: Date.now },
	updateddAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Products', Products);

