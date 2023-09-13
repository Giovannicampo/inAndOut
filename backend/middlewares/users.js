const allowLogged = (req, res, next) => {
    try{
        if(req.session && req.session.user) {
            console.log("va bene");
            next();
        } 
    }
    catch (error) {
        return res.status(500).send({
            error: error,
            message: "User not logged!",
            type: "error"
        })
    }
}

const allowAdmin = (req, res, next) => {
    try{
        if(req.session && req.session.user && 
            req.session.level == "admin") {
            next();
        }
    } catch (error) {
        return res.status(500).send({
            message: "User not allowed!"
        })
    }
}

module.exports = {allowLogged, allowAdmin};