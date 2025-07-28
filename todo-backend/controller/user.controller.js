const User = require("../model/User");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const userController = {};

userController.createUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      throw new Error("You have already signed up!");
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({ email, name, password: hash });
    await newUser.save();
    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(400).json({ status: "error" });
  }
};

userController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }, "-createdAt -updatedAt -__v");
    if (user) {
      const isMatch = bcrypt.compareSync(password, user.password);
      if (isMatch) {
        const token = user.generateToken();
        return res.status(200).json({ status: "ok", user, token });
      }
    }
    throw new Error("ID or password not correct");
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

module.exports = userController;
