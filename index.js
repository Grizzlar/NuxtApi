var express = require('express')
var app = express()
var db = require('./db.js')
var path = require('path')

const ignoreCookies = ['/api', '/_loading', '/_nuxt']
const requireLogin = ['/profile']

function startsWithAny(str, arr){
	for(let i=0;i<arr.length;i++){
		if(str.startsWith(arr[i]))
			return true
	}
	return false
}

function routerPath(router){
	return path.join(__dirname, 'router/')+router
}

function middlewarePath(middleware){
	return path.join(__dirname, 'middleware/')+middleware
}

//Router import
var authRouter = require(routerPath('auth.js'))
//Middleware import
var authMiddleware = require(middlewarePath('auth.js'))
var inputMiddleware = require(middlewarePath('input.js'))

//Middlewares
app.use(express.json())
app.use(inputMiddleware)
app.use(authMiddleware)

//Routers
app.use('/api/auth', authRouter)

app.use('/api/test', (req, res) => {
	res.json({success: true})
})

app.use('/', async (req, res, next) => {
	let loggedIn = false

	if(startsWithAny(req.originalUrl, ignoreCookies)){
		next()
		return
	}

	if(req.headers.cookie){
		const cookieString = req.headers.cookie.split('; ')
		const cookies = {}

		cookieString.forEach(cookie => {
			let c = cookie.split(/=(.*)/)
			c.splice(2)
			cookies[c[0]] = c[1]
		});

		if(cookies.usr && cookies.tkn){
			let user = await db.verifyToken(cookies.usr, cookies.tkn)
			if(!user){
				res.cookie('usr', '', { maxAge: 900000 })
				res.cookie('tkn', '', { maxAge: 900000 })
				loggedIn = false
			}else{
				loggedIn = true
			}
		}
	}

	if(!loggedIn && startsWithAny(req.originalUrl, requireLogin))
		res.redirect('/login')
	else
		next()
})

module.exports = app