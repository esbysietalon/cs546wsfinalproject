const collection = require('./collections');
const uuid = require('uuid/v4');
const bcrypt = require("bcrypt");

module.exports = {
    description: "Final Project User Methods",
    create: async(fname, lname, username, password) => {
        if(fname == null || (typeof fname === 'string' && fname.length === 0)){
            throw new Error("name parameter does not exist");
        }
        if(typeof fname != 'string'){
            throw new Error("name parameter is not a string");
        }
        if(lname == null || (typeof lname === 'string' && lname.length === 0)){
            throw new Error("name parameter does not exist");
        }
        if(typeof lname != 'string'){
            throw new Error("name parameter is not a string");
        }
        if(username == null || (typeof username === 'string' && username.length === 0)){
            throw new Error("name parameter does not exist");
        }
        if(typeof username != 'string'){
            throw new Error("name parameter is not a string");
        }
        if(password == null || (typeof password === 'string' && password.length === 0)){
            throw new Error("name parameter does not exist");
        }
        if(typeof password != 'string'){
            throw new Error("name parameter is not a string");
        }

        let newUser = {
            _id: uuid(),
            fname: fname,
            lname: lname,
            username: username,
            hashedPassword: bcrypt.hashSync(password, 16),
            bio: "",
            sessionId: undefined,
            favorites: [],
            posts: []
        };
        const users = await collection.users();

        const insertInfo = await users.insertOne(newUser);
        if(insertInfo.insertedCount === 0){
            throw new Error("could not add user");
        }

        
        const user = await module.exports.get(newUser._id);
        return user;
    },
    getAll: async() => {
        const userscollection = await collection.users();
        
        const usersarr = await userscollection.find({}).toArray();

        return usersarr;
    },
    get: async(id) => {
        if(id == null){
            throw new Error("id parameter does not exist");
            
        }
        if(typeof id != 'string' && typeof id != 'object'){
            throw new Error("id parameter is not of valid type");
        }
        const users = await collection.users();
        const user = await users.findOne({_id: id});

        if(user === null){
            throw new Error("No such user found");
        }

        return user;
    },
    remove: async(id) => {
        if(id == null){
            throw new Error("id parameter does not exist");
        }
        if(typeof id != 'string' && typeof id != 'object'){
            throw new Error("id parameter is not of valid type");
        }

        const users = await collection.users();
        const removeduser = await module.exports.get(id);

        const deletionInfo = await users.removeOne({_id: id});

        if(deletionInfo.deletedCount === 0){
            throw new Error('could not delete that user');
        }
        
        return removeduser;
    },
    update: async(id, newFName, newLName, newBio) => {
        if(id == null){
            throw new Error("id parameter does not exist");
        }
        if(typeof id != 'string' && typeof id != 'object'){
            throw new Error("id parameter is not of valid type");
        }

        const users = await collection.users();
        const userToRename = await module.exports.get(id);

        if((newFName == null || typeof newFName != 'string' || newFName.length === 0) && (newLName == null || typeof newLName != 'string' || newLName.length === 0) && (newBio == null || typeof newBio != 'string')){
            throw new Error("no new valid information given");
        }

        if(newFName == null || typeof newFName != 'string' || newFName.length === 0){
            newFName = userToRename.fname;
        }
        if(newLName == null || typeof newLName != 'string' || newLName.length === 0){
            newLName = userToRename.lname;
        }
        if(newBio == null || typeof newBio != 'string'){
            newBio = userToRename.bio;
        }
        if(newBio === userToRename.bio && newLName === userToRename.lname && newFName === userToRename.fname)
            return;

        let renameduser = {
            _id: userToRename._id,
            fname: newFName,
            lname: newLName,
            bio: newBio,
            sessionId: userToRename.sessionId,
            username: userToRename.username,
            hashedPassword: userToRename.hashedPassword,
            favorites: userToRename.favorites,
            posts: userToRename.posts
        };

        const updatedInfo = await users.replaceOne({_id: id}, renameduser);

        if(updatedInfo.modifiedCount === 0){
            throw new Error("could not update user of id " + id);
        }

        const returnuser = await module.exports.get(id);
        return returnuser;
    },
    favorite: async(id, postId) => {
        if(id == null){
            throw new Error("id parameter does not exist");
        }
        if(typeof id != 'string' && typeof id != 'object'){
            throw new Error("id parameter is not of valid type");
        }
        if(postId == null){
            throw new Error("postid parameter does not exist");
        }
        if(typeof postId != 'string' && typeof postId != 'object'){
            throw new Error("postid parameter is not of valid type");
        }
        const posts = await collection.posts();
        const post = await posts.findOne({_id: postId});

        if(post === null){
            throw new Error("No such post found");
        }

        var usercopy = await module.exports.get(id);
        
        if(usercopy.favorites.includes(postId))
            return post;
        
        usercopy.favorites.push(postId);

        const users = await collection.users();
        const updatedInfo = await users.replaceOne({_id: id}, usercopy);

        if(updatedInfo.modifiedCount === 0){
            throw new Error("could not update user of id " + id);
        }

        return post;
    },
    unfavorite: async(id, postId) => {
        if(id == null){
            throw new Error("id parameter does not exist");
        }
        if(typeof id != 'string' && typeof id != 'object'){
            throw new Error("id parameter is not of valid type");
        }if(postId == null){
            throw new Error("postid parameter does not exist");
        }
        if(typeof postId != 'string' && typeof postId != 'object'){
            throw new Error("postid parameter is not of valid type");
        }
        const posts = await collection.posts();
        const post = await posts.findOne({_id: postId});

        if(post === null){
            throw new Error("No such post found");
        }

        var usercopy = await module.exports.get(id);
        
        if(!usercopy.favorites.includes(postId))
            return post;
        
        usercopy.favorites.splice(usercopy.favorites.indexOf(postId),1);

        const users = await collection.users();
        const updatedInfo = await users.replaceOne({_id: id}, usercopy);

        if(updatedInfo.modifiedCount === 0){
            throw new Error("could not update user of id " + id);
        }

        return post;
    },
    updateSession: async (id, session) =>{
        if(id == null){
            throw new Error("id parameter does not exist");
        }
        if(typeof id != 'string' && typeof id != 'object'){
            throw new Error("id parameter is not of valid type");
        }
        if(session == null){
            throw new Error("session parameter does not exist");
        }
        if(typeof session != 'string' && typeof session != 'object'){
            throw new Error("session parameter is not of valid type");
        }
        var usercopy = await module.exports.get(id);
        usercopy.sessionId = session;
        const users = await collection.users();
        const updatedInfo = await users.replaceOne({_id: id}, usercopy);

        if(updatedInfo.modifiedCount === 0){
            throw new Error("could not update user of id " + id);
        }

        return session;
    }
}