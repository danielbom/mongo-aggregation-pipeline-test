const mongoose = require("mongoose");

const Contact = mongoose.Schema({
  phone: String,
  email: String,
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Contact", Contact);
