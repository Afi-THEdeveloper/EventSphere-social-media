require('dotenv').config()
const jwt = require('jsonwebtoken')



module.exports = async (req, res, next) => {
 
    try {
        const admintoken = req.headers['authorization']
        console.log(admintoken, process.env.JWT_SECRET)

        jwt.verify(admintoken, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                console.log(err);
                return res.status(401).send({
                    message: "Auth failed",
                    success: false
                })
            }else {
                console.log(decode)
                req.adminId = decode.id
                next()
            }
        })
    }
    catch (error) {
        return res.status(500).send({ message: "internal server error", success: false });
    }
}
