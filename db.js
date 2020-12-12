const mongoose = require('mongoose')
const fetch = require('node-fetch')
const crypto = require('crypto')
const models = require('./models.js')

const DB_URL = ''
const serverkey = ''

mongoose.connect(DB_URL, { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true })

var db = {}

db.models = models

db.login = async (email, pass) => {
	let grres = await fetch('https://www.google.com/recaptcha/api/siteverify', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: `secret=${serverkey}&response=${captcha}`
	})
	let grresp = await grres.json()
	if(!grresp.success){
		return {token: undefined, captcha: true}
	}
	let user = await db.models.User.findOne({email: email})
	if(user){
		if(crypto.createHash('sha512').update(pass+user.salt).digest('hex') === user.password){
			user.token = crypto.randomBytes(12).toString('base64')
			user.texpire = new Date(new Date().getTime()+7200000) //30mins
			await user.save()
			u = {}
			Object.assign(u, user._doc)
			delete u.password
			delete u.salt
			return u
		}
	}
	return {token: undefined}
}

db.register = (username, email, pass, phone) => {
	const salt = crypto.randomBytes(9).toString('base64')
	let user = new db.models.User({
		username: username,
		email: email,
		password: crypto.createHash('sha512').update(pass+salt).digest('hex'),
		salt: salt,
	})
	return user.save()
}

db.verifyToken = async (email, token) => {
	if(typeof email !== 'undefined' && typeof token !== 'undefined'){
		let user = await db.models.User.findOne({email: email, token: token})
		if(user){
			if(user.texpire.getTime() > new Date().getTime()){
				return user
			}else
				return false
		}
	}
	return false
}

db.renewToken = async (email, token) => {
	let user = await db.verifyToken(email, token)
	if(user){
		user.token = crypto.randomBytes(12).toString('base64')
		user.texpire = new Date(new Date().getTime()+7200000) //30mins
		await user.save()
		u = {}
		Object.assign(u, user._doc)
		delete u.password
		delete u.salt
		return u
	}else{
		return {token: undefined}
	}
}

module.exports = db