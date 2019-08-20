const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const hbs = require('express-handlebars');
const app = express();
const path = require("path");
const configRoutes = require("./routes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/public")));
app.use(session({
    name: 'AuthCookie',
    secret: 'fhcuwGe2Eo3Ccr$',
    resave: false,
    saveUninitialized: true
}));
configRoutes(app);
app.engine("handlebars", hbs({defaultLayout: "main", extname: '.handlebars', helpers: require("./helpers/").helpers, layoutsDir: path.join(__dirname, 'views/layouts')}));
app.set("view engine", "handlebars");



app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});



