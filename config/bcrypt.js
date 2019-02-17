const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports.bcryptHashSync = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
};

module.exports.bcryptCheck = async (password, hash) => {
    bcrypt.compare(password, hash, (err, res) => res);
};
