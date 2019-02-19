require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports.jwtEncode = (data) => {
    return jwt.sign({data: data}, process.env.JWT_SECRET);
}

module.exports.jwtDecode = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
    catch {
        return false;
    }
}