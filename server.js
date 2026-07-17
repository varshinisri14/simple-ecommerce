const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/User");
const Product = require("./models/Product");
const Cart = require("./models/Cart");

const app = express();
const PORT = 3000;
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/ecommerceDB")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Login Page
app.get("/login.html", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
});

// Register Page
app.get("/register.html", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "register.html"));
});

// Product Page
app.get("/product", async (req, res) => {
    try {
        const products = await Product.find();
        res.render("product", { products });
    } catch (err) {
        res.send(err.message);
    }
});

// Cart Page
app.get("/cart", async (req, res) => {
    try {
        const cartItems = await Cart.find();
        res.render("cart", { cartItems });
    } catch (err) {
        res.send(err.message);
    }
});

// Register User
app.post("/register", async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        await user.save();

        res.send("User Registered Successfully!");
    } catch (err) {
        res.send("Error: " + err.message);
    }
});
app.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
            password: req.body.password
        });

        if (user) {
            res.send("Login Successful!");
        } else {
            res.send("Invalid Email or Password!");
        }
    } catch (err) {
        res.send("Error: " + err.message);
    }
});
app.get("/add-products", async (req, res) => {
    try {
        await Product.insertMany([
            {
                name: "Headphones",
                price: 999,
                image: "headphones.jpg"
            },
            {
                name: "Smart Watch",
                price: 1999,
                image: "watch.jpg"
            },
            {
                name: "Shoes",
                price: 1499,
                image: "shoes.jpg"
            }
        ]);

        res.send("Products Added Successfully!");
    } catch (err) {
        res.send(err.message);
    }
});
app.post("/add-to-cart", async (req, res) => {
    try {
        const cartItem = new Cart({
            name: req.body.name,
            price: req.body.price
        });

        await cartItem.save();

        res.send("Product Added to Cart Successfully!");
    } catch (err) {
        res.send(err.message);
    }
});
app.post("/remove-cart/:id", async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.redirect("/cart");
    } catch (err) {
        res.send(err.message);
    }
});
// Checkout Page
app.get("/checkout", (req, res) => {
    res.render("checkout");
});

// Place Order
app.post("/checkout", async (req, res) => {
    try {
        await Cart.deleteMany({});

        res.send("🎉 Order Placed Successfully!");
    } catch (err) {
        res.send(err.message);
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});