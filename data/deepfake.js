const collection = require('./collections');
const uuid = require('uuid/v4');

module.exports = {
    description: "Final Project Markov Chain Methods",
    add: async(screenname, tweets) => {
        if(screenname == null || (typeof screenname === 'string' && screenname.length === 0)){
            throw new Error("name parameter does not exist");
        }
        if(typeof screenname != 'string'){
            throw new Error("name parameter is not a string");
        }
        if(!tweets || !Array.isArray(tweets) || tweets.length === 0){
            throw new Error("no tweets given");
        }
        const models = await collection.models();
        const model = await models.findOne({screenname: screenname});
        if(model === null){
            let newModel = {
                _id: uuid(),
                screenname: screenname,
                tweets: tweets
            };
            const insertInfo = await models.insertOne(newModel);
            if(insertInfo.insertedCount === 0){
                throw new Error("could not add model");
            }
        }else{
            var newtweets = model.tweets;
            for(var i = 0; i < tweets.length; i++){
                if(!newtweets.includes(tweets[i]))
                    newtweets.push(tweets[i]);
            }
            let updatedModel = {
                _id: model._id,
                screenname: screenname,
                tweets: newtweets
            };

            const updatedInfo = await models.replaceOne({screenname: screenname}, updatedModel);

            if(updatedInfo.modifiedCount === 0){
                throw new Error("could not update model");
            }
        }

        const returnmodel = await module.exports.get(screenname);
        return returnmodel;
    },
    get: async(screenname) => {
        if(screenname == null || (typeof screenname === 'string' && screenname.length === 0)){
            throw new Error("name parameter does not exist");
        }
        if(typeof screenname != 'string'){
            throw new Error("name parameter is not a string");
        }
        const models = await collection.models();
        const model = await models.findOne({screenname: screenname});

        if(model === null){
            throw new Error("No such user found");
        }

        return model;
    }
}