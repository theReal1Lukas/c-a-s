const router = require("express").Router();

const User = require("../models/user-model");

// get all users

router.get("/", async (req, res) => {
  try {
    const findAllUsers = await User.find();
    res.status(200).json(findAllUsers);
  } catch (err) {
    res.status(500).json(err);
  }
});

///////////

//get user by id

router.get("/:id", async (req, res) => {
  try {
    const findUser = await User.findById(req.params.id);
    res.status(200).json(findUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete user by id

router.delete("/:id", async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json(deleteUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
