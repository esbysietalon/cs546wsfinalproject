const data = require('../data');
const postData = data.posts;
const express = require('express');
const router = express.Router();
const userData = data.users;
var page = 0;

router.get("/", (req, res, next) =>{
    if(req.session.authenticated === true)
        next();
    else
        res.redirect('/login');
},
async (req, res) => {
    console.log("page = " + page);
    //console.log("reached here");
    try{
        //console.log("reached here");
        postarr = await postData.getAll();
        var autharr = [];
        for(var i = 0; i < postarr.length; i++){
            //console.log("reaching " + i + " out of " + (postarr.length - 1));
            try{
                //console.log("author is " + postarr[i].author);
                var user = await userData.get(postarr[i].author);
                autharr.push({name: user.fname + " " + user.lname, id: postarr[i].author});
            }catch(e){
                console.log(e.message);
            }
            //console.log("finishing " + i + " out of " + (postarr.length - 1));
        }
        //console.log("reached here");
        //autharr.reverse();
        //postarr.reverse();
        var maxpages = Math.ceil(autharr.length / 10);
        var back = false;
        var next = false;
        if(page < maxpages - 1){
            next = true;
        }
        if(page > 0){
            back = true;
        }
        var dataarr = [];
        var lbound = page * 10;
            var ubound = (page + 1) * 10;
            for(var i = lbound; i < ubound; i++){
                if(i < 0 || i >= autharr.length)
                    continue;
                dataarr[i] = {
                    auth: autharr[i],
                    post: postarr[i]
                };
            }
        try{
            req.session.userinfo = await userData.get(req.session.userinfo._id);
            delete req.session.userinfo.hashedPassword;
        }catch(e){
            console.log(e.message);
        }
        //console.log("reached here");
        res.render('pages/feed', {title: "Welcome " + req.session.userinfo.fname, dataarr: dataarr, posterr: false, userfavs: req.session.userinfo.favorites, userposts: req.session.userinfo.posts, postlogic:true, maxpages: maxpages, back: back, next: next});
    }catch(e){
        console.log(e.message);
    }
});
router.get("/edit-post", async(req, res) =>{
    if(req.session.authenticated != true)
        res.redirect('/login');
    const reqinfo = req.query;
    const postid = reqinfo.postid;
    try{    
        const post = await postData.get(postid);
    }catch(e){
        res.redirect("/posts");
    }
    try{

    
        postarr = await postData.getAll();
        
        var autharr = [];
        for(var i = 0; i < postarr.length; i++){
            try{
                var user = await userData.get(postarr[i].author);
                autharr.push({name: user.fname + " " + user.lname, id: postarr[i].author});
            }catch(e){
                console.log(e.message);
            }
        }
        //autharr.reverse();
        //postarr.reverse();
        var maxpages = Math.ceil(autharr.length / 10);
        var back = false;
        var next = false;
        if(page < maxpages - 1){
            next = true;
        }
        if(page > 0){
            back = true;
        }
        var dataarr = [];
        var lbound = page * 10;
            var ubound = (page + 1) * 10;
            for(var i = lbound; i < ubound; i++){
                if(i < 0 || i >= autharr.length)
                    continue;
                dataarr[i] = {
                    auth: autharr[i],
                    post: postarr[i]
                };
            }
        res.render('pages/feed', {title: "Welcome " + req.session.userinfo.fname, dataarr: dataarr, posterr: false, userfavs: req.session.userinfo.favorites, userposts: req.session.userinfo.posts, editpost: postid, postlogic:true, maxpages: maxpages, back: back, next: next});
    }catch(e){
        console.log(e.message);
    }
});
router.get("/delete-post", async(req, res) =>{
    if(req.session.authenticated != true)
        res.redirect('/login');
    const reqinfo = req.query;
    const postid = reqinfo.postid;
    try{    
        const deleted = await postData.delete(postid);
    }catch(e){
        console.log(e.message);
    }
    res.redirect("/posts");
});
router.post("/", async (req, res, next) =>{
    if(req.session.authenticated != true)
        res.redirect('/login');
    const reqinfo = req.body;
    if(reqinfo.next === "true"){
        page++;
    }
    if(reqinfo.back === "true"){
        page--;
    }
    if(reqinfo.page != null){
        page = reqinfo.page;
    }
    console.log("page = " + page);
    if(reqinfo.topost === "true"){
        const pdata = req.body;
        const title = pdata.title;
        const type = pdata.type;
        const content = pdata.content;
        const url = pdata.url;
        try{
            await postData.create(title, req.session.userinfo._id, type, content, url);
            req.session.userinfo = await userData.get(req.session.userinfo._id);
            delete req.session.userinfo.hashedPassword;
            res.redirect("/posts");
        }catch(e){
            postarr = await postData.getAll();
            var autharr = [];
            for(var i = 0; i < postarr.length; i++){
                try{
                    var user = await userData.get(postarr[i].author);
                    autharr.push({name: user.fname + " " + user.lname, id: postarr[i].author});
                }catch(e){
                    console.log(e.message);
                }
            }
            //autharr.reverse();
            //postarr.reverse();
            var maxpages = Math.ceil(autharr.length / 10); 
            if(page < 0){
                page = 0;
            }
            if(page >= maxpages){
                page = maxpages - 1;
            }
            var back = false;
            var next = false;
            if(page < maxpages - 1){
                next = true;
            }
            if(page > 0){
                back = true;
            }
            var dataarr = [];
            var lbound = page * 10;
            var ubound = (page + 1) * 10;
            for(var i = lbound; i < ubound; i++){
                if(i < 0 || i >= autharr.length)
                    continue;
                dataarr[i] = {
                    auth: autharr[i],
                    post: postarr[i]
                };
            }
            res.render('pages/feed', {title: "Welcome " + req.session.userinfo.fname, dataarr: dataarr, posterr: true, userfavs: req.session.userinfo.favorites, userposts: req.session.userinfo.posts, postlogic:true, maxpages: maxpages, back: back, next: next});
        }
    }else if(reqinfo.toedit != null){
        const pdata = req.body;
        const title = pdata.title_edit;
        const type = pdata.type_edit;
        const content = pdata.content_edit;
        const url = pdata.url_edit;
        try{
            await postData.update(reqinfo.toedit, title, type, content, url);
            req.session.userinfo = await userData.get(req.session.userinfo._id);
            delete req.session.userinfo.hashedPassword;
            res.redirect("/posts");
        }catch(e){
            alert(e.message);
            postarr = await postData.getAll();
            var autharr = [];
            for(var i = 0; i < postarr.length; i++){
                try{
                    var user = await userData.get(postarr[i].author);
                    autharr.push({name: user.fname + " " + user.lname, id: postarr[i].author});
                }catch(e){
                    console.log(e.message);
                }
            }
            //autharr.reverse();
            //postarr.reverse();
            var maxpages = Math.ceil(autharr.length / 10);
            var back = false;
            var next = false;
            if(page < maxpages - 1){
                next = true;
            }
            if(page > 0){
                back = true;
            }
            var dataarr = [];
            var lbound = page * 10;
            var ubound = (page + 1) * 10;
            for(var i = lbound; i < ubound; i++){
                if(i < 0 || i >= autharr.length)
                    continue;
                dataarr[i] = {
                    auth: autharr[i],
                    post: postarr[i]
                };
            }
            res.render('pages/feed', {title: "Welcome " + req.session.userinfo.fname, dataarr: dataarr, posterr: true, userfavs: req.session.userinfo.favorites, userposts: req.session.userinfo.posts, postlogic:true, maxpages: maxpages, back: back, next: next});
        }
    }else if(reqinfo.tosearch === "true"){
        const pdata = req.body;
        const searchterm = req.body.searchbox.toLowerCase();
        try{
            const rawarr = await postData.getAll();
            var postarr = [];
            if(searchterm == null || typeof searchterm != 'string' || searchterm.length === 0){
                postarr = rawarr;
            }else{
                for(var i = 0; i < rawarr.length; i++){
                    if(rawarr[i].title.toLowerCase().includes(searchterm) || rawarr[i].content.toLowerCase().includes(searchterm)){
                        postarr.push(rawarr[i]);
                    }
                }
            }
            var autharr = [];
            for(var i = 0; i < postarr.length; i++){
                try{
                    var user = await userData.get(postarr[i].author);
                    autharr.push({name: user.fname + " " + user.lname, id: postarr[i].author});
                }catch(e){
                    console.log(e.message);
                }
            }
            //autharr.reverse();
            //postarr.reverse();
            var maxpages = Math.ceil(autharr.length / 10);
            var back = false;
            var next = false;
            if(page < maxpages - 1){
                next = true;
            }
            if(page > 0){
                back = true;
            }
            var dataarr = [];
            var lbound = page * 10;
            var ubound = (page + 1) * 10;
            for(var i = lbound; i < ubound; i++){
                if(i < 0 || i >= autharr.length)
                    continue;
                dataarr[i] = {
                    auth: autharr[i],
                    post: postarr[i]
                };
            }
            res.render('pages/feed', {title: "Welcome " + req.session.userinfo.fname, dataarr: dataarr, posterr: false, userfavs: req.session.userinfo.favorites, userposts: req.session.userinfo.posts, postlogic:true, maxpages: maxpages, back: back, next: next});
        }catch(e){
            res.redirect('/posts');
            alert(e.message);
        }
    }else{
        const pid = reqinfo.postid;
        
        //console.log(pid);
        try{
            user = await userData.get(req.session.userinfo._id);
            if(user.favorites.includes(pid))
                await userData.unfavorite(req.session.userinfo._id, pid);
            else
                await userData.favorite(req.session.userinfo._id, pid);
                
                
            req.session.userinfo = await userData.get(req.session.userinfo._id);
            delete req.session.userinfo.hashedPassword;
        }catch(e){
            console.log(e.message);
        }
        res.redirect('/posts');
    }

});
router.use("*", (req, res) => {
    res.sendStatus(404);
});


module.exports = router;