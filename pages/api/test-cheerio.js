// pages/api/test-cheerio.js

import * as cheerio from "cheerio";

export default function handler(req, res) {
  try {
    console.log("Cheerio:", cheerio);
    if (typeof cheerio.load !== "function") {
      throw new Error("cheerio.load is NOT a function");
    }
    res.status(200).json({ message: "Cheerio loaded successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error with cheerio", error: error.message });
  }
}
