// Imports
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mysql = require("mysql");

const app = express();
const port = 5000;

let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "toor",
});

connection.connect();
let carts = {};

// =====================================
// HJÄLPFUNKTIONER
function guid() {
    // Skapar en s.k. GUID-sträng (Globally unique identifier) som vi använder för att identifiera användare
    // Vi slumpar egentligen bara, men man kan göra mycket smartare saker, baka in klockslag, t.ex., för att göra den mer sannolikt unik
    let s4 = () =>
        Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    return (
        s4() +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        s4() +
        s4()
    );
}

function allSupplies(callback) {
    // Tar fram id och namn för alla supplies
    connection.query("SELECT id, name, img_url FROM dbo.products;", callback);
}

function productWithId(id, callback) {
    // Tar fram data för en produkt med ett visst ID
    connection.query(
        "SELECT * FROM dbo.products WHERE id = ?;", [id],
        (error, result) => callback(error, result[0])
    );
}

function productsWithId(ids, callback) {
    // Tar fram data för alla de produkter som har vissa ID:n
    id_joined = ids.join(",");
    let q = `SELECT * FROM dbo.products WHERE id IN (${id_joined});`;
    connection.query(q, callback);
}

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
app.get("/", (req, res) => {
    allSupplies((error, result) => {
        res.render("index", { title: "Home Page", supplies: result });
    });
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

app.get("/product", (req, res) => {
    // Produktsida
    let productid = req.query.id;

    productWithId(productid, (error, result) => {
        let id = result.id;
        let name = result.name;
        let price = result.price;
        let img_url = result.img_url;
        res.render("product", { name, price, id, img_url, title: name });
    });
});

app.get("/cart", (req, res) => {
    // Varukorg
    let cart = carts[req.query.user];
    if (!cart) {
        res.end("Oops?");
        return;
    }

    // Räkna hur många gånger varje produkt förekommer i korgen
    occurances = {};
    for (let i = 0; i < cart.length; ++i) {
        let value = cart[i];
        if (value in occurances === false) occurances[value] = 0;
        ++occurances[value];
    }

    let supplies = productsWithId(cart, (error, result) => {
        // Beräkna totalsumman i korgen
        let totalprice = 0;
        for (let detaljer of result) {
            totalprice += detaljer.price * occurances[detaljer.id];
        }
        res.render("cart", { totalprice });
    });
});

app.get("/checkout", (req, res) => {
    res.render("checkout", { title: "Checkout" });
});

app.get("/newuser", (req, res) => {
    // Ny användare! Skapa en unik GUID
    // Notera att vi inte kontrollerar om det redan finns... men det borde vi
    res.status(200);
    const id = guid();
    carts[id] = [];

    console.log(`New user: ${id}`);
    console.log(carts);

    res.end(id);
});

app.get("/buy", (req, res) => {
    // Köp produkt, specifiera användare och produktid
    let user = req.query.user;
    let id = req.query.id;

    console.log(`User ${user} is buying product ${id}`);

    carts[user].push(parseInt(id));
    res.status(200);
    res.end("Tack!");
});

app.get("/cartnum", (req, res) => {
    // Returnerar antalet produkter i varukorgen
    let user = req.query.user;

    console.log(`User ${user} is requesting cart count`);

    if (user) {
        res.status(200);
        res.end(carts[user].length.toString());
        console.log(user);
    }
});

// Listen on Port 5000
app.listen(port, () => console.info(`App listening on port ${port}`));