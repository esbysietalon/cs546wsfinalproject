const express = require('express');
const router = express.Router();
const Twitter = require('twitter');
const sayjs = require('say');
const data = require('../data');
const modeldata = data.deepfake;
const markov = require('markov-chains').default;

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET
});

router.get("/", (req, res) => {
    res.render("pages/deepfake", {title: "Deepfakes..", shouldshow: false});
});
router.post("/load", async (req, res) => {
    var terms = req.body.searchbox;
    if(!terms || typeof terms != 'string' || terms.length === 0){
        res.redirect('/deepfake');
        return;
    }
    client.get('statuses/user_timeline', {screen_name: terms, count: 200, include_rts: false}, async (error, tweets, response) => {
        if(!error){
            var results = [];
            tweets.forEach(function(tweet){
                results.push(tweet.text.split(" "));
            });
            try{
                await modeldata.add(terms, results);
            }catch(e){
                console.log(e.message);
            }
            var shown = [];
            for(var i = 0; (shown.length < 20 && i < results.length); i++){
                var tenti = (Math.floor(Math.random() * results.length));
                if(!shown.includes(results[tenti]))
                    shown.push(results[tenti].join(" "));
            }
            res.render("pages/deepfake", {title: "Adding in " + terms + "'s tweets..", screenname: terms, shouldshow: true, load: true, resultslen: results.length, havetweets: (results.length > 0), dataarr: shown, postlogic: true});
        }else{
            res.render("pages/deepfake", {title: "Deepfakes..", shouldshow: false, err:true, errmsg: "There was a problem retrieving that user's tweets. Check the spelling."});
        }
    });
});
router.post("/generate", async (req, res) => {
    var terms = req.body.searchbox;
    if(!terms || typeof terms != 'string' || terms.length === 0){
        res.redirect('/deepfake');
        return;
    }   
    try{
        const model = await modeldata.get(terms);
        const chain = new markov(model.tweets);

        var genarr = [];
        for(var i = 0; i < 20; i++){
            genarr.push((chain.walk()).join(" "));
        }
        res.render("pages/deepfake", {title: "Generated tweet from " + terms, screenname: terms, shouldshow: true, load: false, resultslen: genarr.length, havetweets: (genarr.length > 0), postlogic: true, dataarr: genarr});
    }catch(e){
        res.render("pages/deepfake", {title: "Deepfakes..", shouldshow: false, err:true, errmsg: "There was a problem generating tweets for that user. Check the spelling."});
    }    
});

module.exports = router;