// Imports
const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const port = 5000;

// Static Files
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/images", express.static(__dirname + "public/images"));

// Set Templating Engine
app.use(expressLayouts);
app.set("layout", "./layouts/full-width");
app.set("view engine", "ejs");

// Routes
app.get("", (req, res) => {
    res.render("index", { title: "Home Page" });
});

app.get("/about", (req, res) => {
    res.render("about", { title: "About Page", layout: "./layouts/sidebar" });
});

app.get("/marketplace", (req, res) => {
    res.render("marketplace", { title: "Marketplace" });
});

app.get("/login-signup", (req, res) => {
    res.render("login-signup", { title: "Login or signup" });
});

app.get("/contact", (req, res) => {
    res.render("contact", { title: "Contact us" });
});

app.get("/checkout", (req, res) => {
    res.render("checkout", { title: "Checkout" });
});

// Listen on Port 5000
app.listen(port, () => console.info(`App listening on port ${port}`));