const express = require("express");
const router = express.Router();

const Url = require("../model/Url");

router.get("/:code", async (req, res) => {
  const code = req.params.code;
  try {
    const url = await Url.findOne({ urlCode: code });

    if (url) {
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json("Url not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Server error");
  }
});

module.exports = router;
