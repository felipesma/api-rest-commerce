const boom = require('@hapi/boom');

const { config } = require('../config/config')

function checkApiKey(req, res, next) {
    const apiKey = req.headers['api'];
    apiKey === config.apiKey ? next() : next(boom.unauthorized());
}

function checkAdminRole(req, res, next) {
    const user = req.user;
    user.role === 'admin' ? next() : next(boom.unauthorized());
}

const checkRoles = (...roles) => (req, res, next) => {
    const user = req.user;
    roles.includes(user.role) ? next() : next(boom.unauthorized());
}

module.exports = { checkApiKey, checkAdminRole, checkRoles };
