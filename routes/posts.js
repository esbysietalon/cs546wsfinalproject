const express = require("express");
const router = express.Router();
const data = require("../data");
const postData = data.posts;

router.get("/", async (req, res) => {
    try{
        const postsList = await postData.getAll();
        res.json(postsList);
    }catch(e){
        res.status(500).json({error: e.message});
    }
});
router.post("/", async (req, res) => {
    const postJson = req.body;
    try{
        const {title, author, content} = postJson;
        if(title == null || author == null || content == null){
            throw new Error("Bad format");
        }
        try{
            const newPost = await postData.create(title, author, content);
        
            res.status(200).json(newPost);
        }catch(e){
            res.status(500).json({error: e.message});
        }
    }catch(e){
        res.status(400).json({error: e.message});
    }
});
router.get("/:id", async(req, res) => {
    try{
        const post = await postData.get(req.params.id);

        res.status(200).json(post);
    }catch(e){
        if(e.message === "No such post found")
            res.status(404).json({error: "No such post found"});
        else
            res.status(500).json({error: e.message});
    }
});
router.put("/:id", async(req, res) => {
    const postJson = req.body;
    try{
        const {newTitle, newContent} = postJson;
        if(newTitle == null && newContent == null){
            throw new Error("Bad format");
        }
        try{
            const post = await postData.update(req.params.id, newTitle, newContent);

            res.status(200).json(post);
        }catch(e){
            if(e.message === "No such post found")
                res.status(404).json({error: "No such post found"});
            else
                res.status(500).json({error: e.message});
        }
    }catch(e){
        res.status(400).json({error: e.message});
    }
});
router.delete("/:id", async(req, res) => {
    try{
        const post = await postData.delete(req.params.id);
        res.status(200).json(post);
    }catch(e){
        if(e.message === "No such post found")
            res.status(404).json({error: "No such post found"});
        else
            res.status(500).json({error: e.message});
    }
   
});


module.exports = router;
