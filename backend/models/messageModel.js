const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
    content: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);


const MessageModel = mongoose.model("message", messageSchema);
module.exports = MessageModel;