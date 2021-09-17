const router = require("express").Router();
const Message = require("../models/message-model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

router.post("/", async (req, res) => {
  try {
    const cryptMessage = jwt.sign(
      {
        data: req.body.text,
      },
      process.env.SECRET,
      { expiresIn: "60000" }
    );

    const newMessage = new Message({
      conversationId: req.body.conversationId,
      senderId: req.body.senderId,
      text: cryptMessage,
    });

    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete messages from conversation
router.delete("/delete/:conversationId", async (req, res) => {
  try {
    const deleteAll = await Message.deleteMany({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(deleteAll);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
