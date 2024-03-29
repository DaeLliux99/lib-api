const jwt = require('jsonwebtoken');

const extUsuario = (req, res, next) => {
	const authorization = req.get('authorization');
	let token = ''

	if (authorization && authorization.toLowerCase().startsWith('bearer')) {
		token = authorization.substring(7);
	}

	const decodedToken = jwt.verify(token, 'uwu');
	console.log(decodedToken);

	if (!token || !decodedToken.idUsuario) {
		return res.status(401).json({error: 'Falta token o es invalido'})
	}

	const { idUsuario } = decodedToken;

	req.idUsuario = idUsuario;

	next();
}

module.exports = extUsuario;
