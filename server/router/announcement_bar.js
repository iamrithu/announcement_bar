import express from "express";

import AnnouncementBar from "../model/annouceMentBar.js";

const router = express.Router();

router.get("/isactivate/:id", async (req, res) => {
  try {
    var data = await AnnouncementBar.find({
      shopName: req.params.id,
      isActive: true,
    });
    res.send(data);
  } catch (error) {
    console.log(`get:${error}`);
  }
});

router.patch("/update/:id", async (req, res) => {
  try {
    var data = await AnnouncementBar.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    ).then((data) => {
      res.send(data);
    });

    console.log(data);
    console.log(req.body);
    console.log(req.params.id);
  } catch (error) {
    console.log(`update:${error}`);
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    await AnnouncementBar.findByIdAndRemove({ _id: req.params.id }).then(
      (data) => {
        res.send(data);
      }
    );
  } catch (error) {
    console.log(`delete:${error}`);
  }
});

export default router;
