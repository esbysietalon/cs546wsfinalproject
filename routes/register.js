const data = require('../data');
const userData = data.users;
const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    if(req.session.authenticated === true)
        res.redirect("/login");
    else
        res.render("pages/register", {title: "Create a new account", usernametaken: false, registered: false});
});
router.post("/", async (req, res) => {
    const loginData = req.body;
    const fname = loginData.fname;
    const lname = loginData.lname;
    const username = loginData.username;
    const password = loginData.password;
    try{    
        const users = await userData.getAll();
        for(var i = 0; i < users.length; i++){
            if(users[i].username === username){
                res.render("pages/register", {title: "Create a new account", usernametaken: true, registered: false, username: username});
                return;
            }
        }
        await userData.create(fname, lname, username, password);
        res.render("pages/register", {title: "Account created successfully", registered: true});
    }catch(e){
        console.log(e.message);
        res.render("pages/register", {title: "Create a new account", inputerr: true, registered: false, username: username});
    }
});

router.use("*", (req, res) => {
    res.sendStatus(404);
});


module.exports = router;