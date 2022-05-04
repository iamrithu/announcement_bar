import express from "express";

import ShopDetail from '../model/shopDetails.js'

const router = express.router();


router.get("/shop-details", async (req, res) => {
    var data = await ShopDetail.find();
    res.send(data);
});

