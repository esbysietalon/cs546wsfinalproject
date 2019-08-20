const collection = require('./collections');
const uuid = require('uuid/v4');

module.exports = {
    description: "Posts methods for Final Project",
    create: async(title, author, type, content, url) => {
        
        if(typeof title != 'string'){
            throw new Error("title parameter is not a string");
        }
        if(title == null || title.length === 0){
            throw new Error("title parameter does not exist");
        }
        
        if(author == null){
            throw new Error("author parameter does not exist");
        }
        if(typeof author != 'string' && typeof author != 'object'){
            throw new Error("author parameter is not a string or object id");
        }
        const users = await collection.users();
        const user = await users.findOne({_id: author});

        if(user === null){
            throw new Error("author is not known user");
        }
        
        if(typeof type != 'string'){
            throw new Error("type parameter is not a string");
        }
        if(type == null || type.length === 0){
            throw new Error("type parameter does not exist");
        }
        
        if(typeof content != 'string'){
            throw new Error("content parameter is not a string");
        }
        if(content == null || content.length === 0){
            throw new Error("content parameter does not exist");
        }
        if(type === "Video" || type === "Image"){
            if(typeof url != 'string' || url.length === 0){
                throw new Error("url parameter does not exist");
            }
        }else{
            url = "";
        }
        var d = new Date();
        var time = d.getTime();
        let newPost = {
            _id: uuid(),
            title: title,
            type: type,
            author: author,
            content: content,
            url: url,
            timestamp: time
        };
        const posts = await collection.posts();
        
        const insertInfo = await posts.insertOne(newPost);
        if(insertInfo.insertedCount === 0){
            throw new Error("could not add post");
        }
        
        var usercopy = user;
        usercopy.posts.push(newPost._id);
        
        const updatedInfo = await users.replaceOne({_id: usercopy._id}, usercopy);

        if(updatedInfo.modifiedCount === 0){
            throw new Error("could not update user of id " + usercopy._id);
        }

        const post = await module.exports.get(newPost._id);
        
        return post;
    },
    getAll: async() => {
        const postscollection = await collection.posts();

        const postsarr = await postscollection.find({}).sort([['timestamp', -1]]).toArray();
        
        return postsarr;
    },
    get: async(id) => {
        if(id == null){
            throw new Error("id parameter does not exist");
        }
        if(typeof id != 'string' && typeof id != 'object'){
            throw new Error("id parameter is not of valid type");
        }

        const posts = await collection.posts();
        
        const post = await posts.findOne({_id: id});

        if(post === null){
            throw new Error("No such post found");
        }
        return post;
    },
    delete: async(id) => {
        if(id == null){
            throw new Error("id parameter does not exist");
        }
        if(typeof id != 'string' && typeof id != 'object'){
            throw new Error("id parameter is not of valid type");
        }

        const posts = await collection.posts();
        const users = await collection.users();
        const removedPost = await module.exports.get(id);
        
        const usersarr = await (await collection.users()).find({}).toArray();
        for(var i = 0; i < usersarr.length; i++){
            if(usersarr[i]._id === removedPost.author){
                var usercopy = usersarr[i];
                usercopy.posts.splice(usercopy.posts.indexOf(removedPost._id), 1);
                const updatedInfo = await users.replaceOne({_id: usercopy._id}, usercopy);

                if(updatedInfo.modifiedCount === 0){
                    throw new Error("could not update user of id " + id);
                }
            }
            if(usersarr[i].favorites.includes(id)){
                var usercopy = usersarr[i];
                usercopy.favorites.splice(usercopy.favorites.indexOf(removedPost._id), 1);
                const updatedInfo = await users.replaceOne({_id: usercopy._id}, usercopy);

                if(updatedInfo.modifiedCount === 0){
                    throw new Error("could not update user of id " + id);
                }
            }
        }       

        const deletionInfo = await posts.removeOne({_id: id});

        if(deletionInfo.deletedCount === 0){
            throw new Error("could not delete post with that id");
        }

        return removedPost;
    },
    update: async(id, newtitle, newtype, newcontent, newurl) => {
        if(id == null){
            throw new Error("id parameter does not exist");
        }
        if(typeof id != 'string' && typeof id != 'object'){
            throw new Error("id parameter is not of valid type");
        }

        const posts = await collection.posts();
        const postToUpdate = await module.exports.get(id);

        if((newtype == null || typeof newtype != 'string' || newtype.length === 0) && (newtitle == null || typeof newtitle != 'string' || newtitle.length === 0) && (newcontent == null || typeof newcontent != 'string' || newcontent.length === 0) && (newurl == null || typeof newurl != 'string' || newurl.length === 0)){
            throw new Error("no new valid information given");
        }

        if(newtitle == null || typeof newtitle != 'string' || newtitle.length === 0){
            newtitle = postToUpdate.title;
        }
        if(newcontent == null || typeof newcontent != 'string' || newcontent.length === 0){
            newcontent = postToUpdate.content;
        }
        if(newtype == null || typeof newtype != 'string' || newtype.length === 0){
            newtype = postToUpdate.type;
        }
        if(newurl == null || typeof newurl != 'string' || newurl.length === 0){
            newurl = postToUpdate.url;
        }
        if(newtype === "Text"){
            newurl = "";
        }
        var ptuAuthorId = postToUpdate.author;
        let updatedPost = {
            _id: id,
            title: newtitle,
            type: newtype,
            content: newcontent,
            author: ptuAuthorId,
            url: newurl,
            timestamp: postToUpdate.timestamp
        }

        if(newtype === postToUpdate.type && newcontent === postToUpdate.content && newtitle === postToUpdate.title)
            return;
        

        const updatedInfo = await posts.replaceOne({_id: id}, updatedPost);
        if(updatedInfo.modifiedCount === 0){
            throw new Error("could not update post with that id");
        }

        return updatedPost;
    }
}