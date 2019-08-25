const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const postData = data.posts;

router.get("/", async (req, res) => {
    try{
        const user = await userData.get(req.session.userinfo._id);
        delete user["hashedPassword"];
        delete user["_id"];
        delete user["sessionId"];
        const favs = JSON.parse(JSON.stringify(user)).favorites;
        const posts = JSON.parse(JSON.stringify(user)).posts.reverse();
        delete user["favorites"];
        delete user["posts"];
        const shown = {
            "First Name": user.fname,
            "Last Name": user.lname,
            "Username": user.username,
            "Bio": user.bio
        }
        
        var favarr = [];
        for(var i = 0; i < favs.length; i++){
            try{
                var favitem = await postData.get(favs[i]);
                
                var author = await userData.get(favitem.author);
                var item = {
                    post: favitem,
                    auth: {
                        name: author.fname + " " + author.lname,
                        id: favitem.author
                    }
                };
                favarr.push(item);
                
            }catch(e){
                //res.status(500).json({error: e.message});
            }
        }
        var postarr = [];
        for(var i = 0; i < posts.length; i++){
            try{
                var postitem = await postData.get(posts[i]);
                var author = await userData.get(postitem.author);
                var item = {
                    post: postitem,
                    auth: {
                        name: author.fname + " " + author.lname,
                        id: postitem.author
                    }
                };
                postarr.push(item);
                
            }catch(e){
                
                //res.status(500).json({error: e.message});
            }
        }
        res.render("pages/user", {title: user.fname + " " + user.lname + "'s Profile", info: shown, favs: favarr, posts: postarr, notedit: true});
    }catch(e){
        res.status(500).json({error: e.message});
    }
});
router.get("/edit", async (req, res) => {
    try{
        const user = await userData.get(req.session.userinfo._id);
        delete user["hashedPassword"];
        delete user["_id"];
        delete user["sessionId"];
        const favs = JSON.parse(JSON.stringify(user)).favorites;
        const posts = JSON.parse(JSON.stringify(user)).posts.reverse();
        delete user["favorites"];
        delete user["posts"];
        const shown = {"Username": user.username,
            "First Name": user.fname,
            "Last Name": user.lname,
            
            "Bio": user.bio
        }
        
        var favarr = [];
        for(var i = 0; i < favs.length; i++){
            try{
                var favitem = await postData.get(favs[i]);
                
                var author = await userData.get(favitem.author);
                var item = {
                    post: favitem,
                    auth: {
                        name: author.fname + " " + author.lname,
                        id: favitem.author
                    }
                };
                favarr.push(item);
                
            }catch(e){
                //res.status(500).json({error: e.message});
            }
        }
        var postarr = [];
        for(var i = 0; i < posts.length; i++){
            try{
                var postitem = await postData.get(posts[i]);
                var author = await userData.get(postitem.author);
                var item = {
                    post: postitem,
                    auth: {
                        name: author.fname + " " + author.lname,
                        id: postitem.author
                    }
                };
                postarr.push(item);
                
            }catch(e){
                
                //res.status(500).json({error: e.message});
            }
        }
        res.render("pages/user", {title: user.fname + " " + user.lname + "'s Profile", info: shown, favs: favarr, posts: postarr, notedit: false});
    }catch(e){
        res.status(500).json({error: e.message});
    }
});
router.post("/", async(req, res) => {
   const pdata = req.body;
   const fname = pdata["First Name"];
   const lname = pdata["Last Name"];
   const bio = pdata["Bio"];
   await userData.update(req.session.userinfo._id, fname, lname, bio);
   res.redirect("/profile"); 
});
router.get("/:id", async(req, res) => {
    try{
        const user = await userData.get(req.params.id);
        delete user["hashedPassword"];
        delete user["_id"];
        delete user["sessionId"];
        const favs = JSON.parse(JSON.stringify(user)).favorites;
        const posts = JSON.parse(JSON.stringify(user)).posts.reverse();
        delete user["favorites"];
        delete user["posts"];
        const shown = {
            "First Name": user.fname,
            "Last Name": user.lname,
            "Username": user.username,
            "Bio": user.bio
        }
        
        var favarr = [];
        for(var i = 0; i < favs.length; i++){
            try{
                var favitem = await postData.get(favs[i]);
                
                var author = await userData.get(favitem.author);
                var item = {
                    post: favitem,
                    auth: {
                        name: author.fname + " " + author.lname,
                        id: favitem.author
                    }
                };
                favarr.push(item);
                
            }catch(e){
                //res.status(500).json({error: e.message});
            }
        }
        var postarr = [];
        for(var i = 0; i < posts.length; i++){
            try{
                var postitem = await postData.get(posts[i]);
                var author = await userData.get(postitem.author);
                var item = {
                    post: postitem,
                    auth: {
                        name: author.fname + " " + author.lname,
                        id: postitem.author
                    }
                };
                postarr.push(item);
                
            }catch(e){
                //res.status(500).json({error: e.message});
            }
        }
        
        res.render("pages/user", {title: user.fname + " " + user.lname + "'s Profile", info: shown, favs: favarr, posts: postarr, notedit: true, notyours: (req.params.id != req.session.userinfo._id)});
    }catch(e){
        res.status(500).json({error: e.message});
    }
});
module.exports = router;
