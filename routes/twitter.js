const express = require('express');
const router = express.Router();
const Twitter = require('twitter');
const sayjs = require('say');
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET
});

router.get("/", (req, res) => {
    res.render("pages/twitter", {title: "Twitter Time!"});
});
router.post("/", async (req, res) => {
    var terms = req.body.searchbox;
    if(!terms || typeof terms != 'string' || terms.length === 0)
        res.redirect('/twitter');
    client.get('search/tweets', {q: terms, count: 20, result_type: 'mixed'}, function(error, tweets, response){
        if(!error){
            var results = [];
            tweets.statuses.forEach(function(tweet){
                results.push({
                    name: tweet.user.name,
                    text: tweet.text
                });
            });

            res.render("pages/twitter", {title: "Twitter Time!", showtweets: true, resultslen: results.length, havetweets: (results.length > 0), dataarr: results, postlogic: true});
        }else{
            res.render("pages/twitter", {title: "Twitter Time!", err: true, errmsg: "There was a problem in searching for '" + terms + "'."});
        }
    });
});
router.post("/speak", async(req, res)=> {
    var text = req.body.tweet;
    if(!text || typeof text != 'string' || text.length === 0){
        return;
    }              
    if(text.substr(-23, 13) === 'https://t.co/')
        text = text.substr(0, text.length - 23);
   
    sayjs.speak(text);
    res.redirect("/twitter");
});

module.exports = router;