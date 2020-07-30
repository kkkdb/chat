let express = require("express");
let router = express.Router();
let search = require("../server/search");

router.post("/querySearchResult", (req, res) => search.querySearchResult(req, res));

module.exports = router;
