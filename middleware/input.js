module.exports = async (req, res, next) => {
	req.input = Object.keys(req.body)
	next()
}