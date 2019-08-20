const postData = require("./posts");
const userData = require("./users");
const collections = require("./collections");

module.exports = {
    posts: postData,
    users: userData,
    raw: collections
};