const mongoose = require("mongoose");
async function connect() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/first_DB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connect sucessfully!!!!");
  } catch (error) {
    console.log("connect error !!! ", error);
  }
}
module.exports = { connect };
