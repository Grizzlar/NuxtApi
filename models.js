const mongoose = require('mongoose')

const { Schema } = mongoose
const models = {}
models.vars = {}

const userSchema = new Schema({
	username: {
		type: String,
		index: true,
		unique: true
	},
	email: {
		type: String,
		index: true,
		unique: true
	},
	password: String,
	salt: String,
	token: String,
	texpire: Date,
})

models.User = mongoose.model('User', userSchema)

//Custom model variable declarations

//

module.exports = models