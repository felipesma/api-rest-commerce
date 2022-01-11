const boom = require('@hapi/boom');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const {config} = require('../config/config');
const UserService = require('./user.service');
const service = new UserService();

class AuthService{

    async getUser(email, password){
        const user = await service.findByEmail(email);
        if (!user) { 
            throw boom.unauthorized();
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            throw boom.unauthorized();
        }
        delete user.dataValues.password;
        return user;
    }

    async signToken(user) {
      const payload = {
        sub: user.id, // La forma en la que se identificará al usuario
        role: user.role
      }
      const token = jwt.sign(payload, config.jwtSecret);
      return {
        user, 
        token
      };
    };

    async sendRecovery(email) {
        const user = await service.findByEmail(email);
        if (!user) { 
            throw boom.unauthorized();
        };
        const payload = { sub: user.id };
        const token = jwt.sign(payload, config.jwtSecret, {expiresIn: '15min'});
        const link = `http://myfrontend.com/recovery?token=${token}`;
        await service.update(user.id, { recoveryToken: token })
        const mail = {
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: `${user.email}`, // list of receivers
            subject: "Email para recuperar contraseña", // Subject line
            html: `<b>Ingresa a este link para recuperar contraseña => ${link} </b>`, // html body
        };
        const response = await this.sendMail(mail);
        return response;
    }

    async sendMail(infoMail) {
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            secure: false, // true for 465, false for other ports
            port: 587,
            auth: {
                user: 'agipamuyquze3vxx@ethereal.email',
                pass: 'T8cQKFSZ83EN1XdWXM'
            }
        });
        await transporter.sendMail(infoMail);
        return { message: 'mail sent' };
    }
    
    async changePassword(token, newPassword) {
        try {
            const payload = jwt.verify(token, config.jwtSecret);
            const user = await service.findOne(payload.sub);
            if (user.recoveryToken !== token) {
                throw boom.unauthorized();
            };
            const hash = await bcryptjs.hash(newPassword, 10);
            await service.update(user.id, {
                recoveryToken: null,
                password: hash
            });
            return { message: 'password changed' }
        } catch (error) {
            throw boom.unauthorized();
        }
    }

}

module.exports = AuthService;