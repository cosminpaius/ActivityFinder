const express = require("express");
const bodyParser = require("body-parser");
const request = require("express");
const https = require("https");
const app = express();

app.use(express.static(__dirname));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.listen(5000, function () {
    console.log("Server is running on port 5000.");
});

// f7089c3805

// 68ab984e05b6d579caf8cabbd6a4fca3-us11