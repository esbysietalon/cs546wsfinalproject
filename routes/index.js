const postRoutes = require("./posts");
const userRoutes = require("./users");
const loginRoutes = require("./login");
const logoutRoute = require("./logout");
const registerRoutes = require("./register");
const homeRoute = require("./home");

const constructorMethod = app => {
    app.get("/test", (req, res, next) => {
        res.status(200).json({hello: "world"});
        next();
    });
    app.get("/", (req, res) => {
        if(req.session.authenticated === true)
            res.redirect("/posts");
        else
            res.redirect("/login");
    });
    
    app.use("/register", registerRoutes);
    app.use("/login", loginRoutes);
    app.use("/logout", logoutRoute);
    app.use("/posts", (req, res, next) => {
        if(req.session.authenticated === true)
            next();
        else
            res.redirect("/login");
    },  homeRoute);
    app.use("/profile", (req, res, next) => {
        if(req.session.authenticated === true)
            next();
        else
            res.redirect("/login");
    }, userRoutes);
    
    app.use("/posts", (req, res, next) => {
        if(req.session.authenticated === true)
            next();
        else
            res.redirect("/login");
    }, postRoutes);
    app.use("*", (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;