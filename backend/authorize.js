

const authorise = (roleArray) => {
    //roleArray contains roles that requires authorization
    return (req, res, next) => {
        let userRole = req.body.role;

        if (roleArray.includes(userRole)) {
            next()
        }
        else {
            res.status(403).send("Not authorised");
        }
    }
}


module.exports = {
    authorise
};