const postData = require("./posts");
const userData = require("./users");
const collections = require("./collections");
const deepfake = require("./deepfake");

module.exports = {
    posts: postData,
    users: userData,
    raw: collections,
    deepfake: deepfake
};