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

    try{
        postarr = await postData.getAll();
        var autharr = [];
        for(var i = 0; i < postarr.length; i++){
            try{
                var user = await userData.get(postarr[i].author);
                autharr.push({name: user.fname + " " + user.lname, id: postarr[i].author});
            }catch(e){
                
            }
        }
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
            
        }
        res.render('pages/feed', {page: (parseInt(page)+1), title: "Welcome " + req.session.userinfo.fname, dataarr: dataarr, posterr: false, userfavs: req.session.userinfo.favorites, userposts: req.session.userinfo.posts, postlogic:true, maxpages: maxpages, back: back, next: next});
    }catch(e){
        res.render('pages/feed', {page: (parseInt(page)+1), err: true, errmsg: "Sorry, we are experiencing issues displaying the feed right now. We apologize for the inconvenience.", title: "Welcome " + req.session.userinfo.fname, dataarr: dataarr, posterr: false, userfavs: req.session.userinfo.favorites, userposts: req.session.userinfo.posts, postlogic:true, maxpages: maxpages, back: back, next: next});
    }
});
router.get("/edit-post", async(req, res) =>{
    const reqinfo = req.query;
    const postid = reqinfo.postid;
    if(req.body.next === "true"){
        page++;
    }
    if(req.body.back === "true"){
        page--;
    }
    if(req.body.page != null){
        page = req.body.page;
    }
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
                
            }
        }
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
        res.render('pages/feed', {page: (parseInt(page)+1), title: "Welcome " + req.session.userinfo.fname, dataarr: dataarr, posterr: false, userfavs: req.session.userinfo.favorites, userposts: req.session.userinfo.posts, editpost: postid, postlogic:true, maxpages: maxpages, back: back, next: next});
    }catch(e){
        res.render('pages/feed', {page: (parseInt(page)+1), err: true, errmsg: "Something went wrong while trying to edit that post.", title: "Welcome " + req.session.userinfo.fname, dataarr: dataarr, posterr: false, userfavs: req.session.userinfo.favorites, userposts: req.session.userinfo.posts, postlogic:true, maxpages: maxpages, back: back, next: next});
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
        res.render('pages/feed', {page: (parseInt(page)+1), err: true, errmsg: "Something went wrong while trying to delete that post.", title: "Welcome " + req.session.userinfo.fname, dataarr: dataarr, posterr: false, userfavs: req.session.userinfo.favorites, userposts: req.session.userinfo.posts, postlogic:true, maxpages: maxpages, back: back, next: next});
        return;
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
            res.render('pages/feed', {page: (parseInt(page)+1), title: "Welcome " + req.session.userinfo.fname, dataarr: dataarr, posterr: true, userfavs: req.session.userinfo.favorites, userposts: req.session.userinfo.posts, postlogic:true, maxpages: maxpages, back: back, next: next});
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
            postarr = await postData.getAll();
            var autharr = [];
            for(var i = 0; i < postarr.length; i++){
                try{
                    var user = await userData.get(postarr[i].author);
                    autharr.push({name: user.fname + " " + user.lname, id: postarr[i].author});
                }catch(e){
                    
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
            res.render('pages/feed', {page: (parseInt(page)+1), title: "Welcome " + req.session.userinfo.fname, dataarr: dataarr, posterr: true, userfavs: req.session.userinfo.favorites, userposts: req.session.userinfo.posts, postlogic:true, maxpages: maxpages, back: back, next: next});
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
                    
                }
            }
           
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
            res.render('pages/feed', {page: (parseInt(page)+1), title: "Welcome " + req.session.userinfo.fname, dataarr: dataarr, posterr: false, userfavs: req.session.userinfo.favorites, userposts: req.session.userinfo.posts, postlogic:true, maxpages: maxpages, back: back, next: next});
        }catch(e){
            res.render('pages/feed', {page: (parseInt(page)+1), err: true, errmsg: "Something went wrong while trying to searching the posts.", title: "Welcome " + req.session.userinfo.fname, dataarr: dataarr, posterr: false, userfavs: req.session.userinfo.favorites, userposts: req.session.userinfo.posts, postlogic:true, maxpages: maxpages, back: back, next: next});
        }
    }else{
        const pid = reqinfo.postid;
        if(pid){
            try{
                user = await userData.get(req.session.userinfo._id);
                if(user.favorites.includes(pid))
                    await userData.unfavorite(req.session.userinfo._id, pid);
                else
                    await userData.favorite(req.session.userinfo._id, pid);
                    
                    
                req.session.userinfo = await userData.get(req.session.userinfo._id);
                delete req.session.userinfo.hashedPassword;
            }catch(e){
                res.render('pages/feed', {page: (parseInt(page)+1), err: true, errmsg: "Something went wrong while trying to fav/unfav that post.", title: "Welcome " + req.session.userinfo.fname, dataarr: dataarr, posterr: false, userfavs: req.session.userinfo.favorites, userposts: req.session.userinfo.posts, postlogic:true, maxpages: maxpages, back: back, next: next});
                return;
            }
        }
        res.redirect('/posts');
    }

});
router.use("*", (req, res) => {
    res.sendStatus(404);
});


module.exports = router;