const jwt = require('jsonwebtoken');

const secret = 'myCat'; //Esto siempre debería estar en las variables de entorno
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTY0MTMxOTAzMn0.s4QolT8cVyEDIVYif1HTg3xXmivwPt0t3rsEKkbiU1Y'

const verifyToken = (token, secret) => jwt.verify(token, secret);

const payload = verifyToken(token, secret);

console.log(payload);