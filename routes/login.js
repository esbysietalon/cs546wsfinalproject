const bcrypt = require('bcrypt');
const data = require('../data');
const userData = data.users;
const express = require('express');
const router = express.Router();
const uuid = require('uuid/v4');

async function matchUser(user, pass){
    const users = await userData.getAll();
    for(var i = 0; i < users.length; i++){
        if(user === users[i].username){
            if(bcrypt.compareSync(pass, users[i].hashedPassword)){
                return i;
            }else{
                return -1;
            }
        }
    }
    return -1;
}

router.get("/", (req, res) => {
    if(req.session.authenticated === true){
        res.redirect('/posts');
    }else{
        res.render('pages/login', {title: "Login", autherr: false});
    }
});
router.post("/", async (req, res) => {
    const loginData = req.body;
    var authuser = await matchUser(loginData.username, loginData.password);
    if(authuser < 0){
        res.status(401).render('pages/login', {title: "Login", autherr: true});
    }else{
        const users = await userData.getAll();
        req.session.userinfo = JSON.parse(JSON.stringify(users[authuser]));
        delete req.session.userinfo.hashedPassword;
        req.session._id = uuid();
        await userData.updateSession(users[authuser]._id, req.session._id);
        req.session.authenticated = true;
        res.redirect('/posts');
    }
});
router.use("*", (req, res) => {
    res.sendStatus(404);
});


module.exports = router;