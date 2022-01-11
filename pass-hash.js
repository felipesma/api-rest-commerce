const bcryptjs = require('bcryptjs');

const hashPassword = async() => {
    const mypassword = 'admin123.18717';
    const hash = await bcryptjs.hash(mypassword, 10);
    console.log(hash);
};

hashPassword();

const verifyPassword = async() => {
    const mypassword = 'admin123.18717';
    const hash = '$2a$10$B8l.rzAD6IKazPDTcfgmz.ZDIyss1BVI4AAL7DGEZBWRk18rskrNy';
    const isMatch = await bcryptjs.compare(mypassword, hash);
    console.log(isMatch);
};

verifyPassword();