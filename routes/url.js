const express = require("express");
const validURL = require("valid-url");
const config = require("config");
const router = express.Router();
const shortid = require("shortid");

const Url = require("../model/Url");

router.post("/shorten", async (req, res) => {
  const { longUrl } = req.body;

  const baseUrl = config.get("baseUrl");

  if (!validURL.isUri(baseUrl)) {
    return res.status(401).json("Invalid base URL");
  }

  const urlCode = shortid.generate();

  if (validURL.isUri(longUrl)) {
    try {
      let url = await Url.findOne({ longUrl });

      if (url) {
        res.json(url);
      } else {
        const shortUrl = baseUrl + "/" + urlCode;

        url = new Url({
          longUrl,
          shortUrl,
          urlCode,
          date: new Date(),
        });

        await url.save();

        res.json(url);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json("Server error");
    }
  } else {
    res.status(500).json("Invalid long url");
  }
});

module.exports = router;
