// User created posts
const express = require("express");
// Now rather than saying app.get, it's router.get
const router = express.Router();

// Don't need to include "/api/posts" because we already did it in server.js (see Use Routes Comment in server.js)
// res.json outputs json format
//// @route     GET api/posts/test
//// Tests      posts Route
//// @access    Public
router.get("/test", (req, res) => res.json({ msg: "Posts Route Works" }));

// We need to export the router for the server to pick it up
module.exports = router;
