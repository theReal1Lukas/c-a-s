const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user-model");

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const hashedPin = await bcrypt.hash(req.body.pin, salt);

    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
      pin: hashedPin,
      profilePicture: req.body.profilePicture,
      friends: req.body.friends,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(404).json("User not found");
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("Wrong password");

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
    process.exit(1);
  }
});

module.exports = router;
