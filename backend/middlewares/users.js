const allowLogged = (req, res, next) => {
    try{
        if(req.session && req.session.user) {
            console.log("va bene");
            next();
        } else {
            return res.status(401).send({
                message: "There is no session or user on!",
                type: "error"
            })
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
            req.session.user.level == "admin") {
            next();
        } else {
            return res.status(401).send({
                message: "There is no session or user on!",
                type: "error"
            })
        }

    } catch (error) {
        return res.status(500).send({
            message: "User not allowed!",
            type: "error"
        })
    }
}

module.exports = {allowLogged, allowAdmin};