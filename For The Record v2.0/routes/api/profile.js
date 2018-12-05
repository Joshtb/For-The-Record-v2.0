// Location, Bio, Education, Social Network Links, etc.
const express = require("express");
// Now rather than saying app.get, it's router.get
const router = express.Router();

// Don't need to include "/api/profile" because we already did it in server.js (see Use Routes Comment in server.js)
// res.json outputs json format
//// @route     GET api/profile/test
//// Tests      profile Route
//// @access    Public
router.get("/test", (req, res) => res.json({ msg: "Profile Route Works" }));

// We need to export the router for the server to pick it up
module.exports = router;
