const data = require('../data');
const userData = data.users;
const express = require('express');
const router = express.Router();


router.get("/", async (req, res) => {
    if(req.session.authenticated === true){
        await userData.updateSession(req.session.userinfo._id, "");
        req.session.destroy(function(err){    
            res.render('pages/logout', {title: "Logged Out"});
        });
    }else{
        res.redirect("/login");
    }
});
router.use("*", (req, res) => {
    res.sendStatus(404);
});


module.exports = router;