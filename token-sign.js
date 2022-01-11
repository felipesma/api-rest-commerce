const jwt = require('jsonwebtoken');

const secret = 'myCat'; //Esto siempre debería estar en las variables de entorno
const payload = {
    sub: 1, // La forma en la que se identificará al usuario
    role: 'customer'
}

const signToken = (payload, secret) => jwt.sign(payload, secret);

const token = signToken(payload, secret);

console.log(token);