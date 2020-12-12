const db = require('./../db.js')
module.exports = async (req, res, next) => {
	if(!req.originalUrl.startsWith('/api/auth') && req.originalUrl.startsWith('/api')){
		if(!(['email', 'token']).every(e => req.input.includes(e))){
			res.send({error: 'AUTH FAILED'})
			return
		}
		let user = await db.verifyToken(req.body.email, req.body.token)
		if(user){
			req.user = user
			next()
			return
		}
		res.send({error: 'AUTH FAILED'})
		return
	}
	next()
}