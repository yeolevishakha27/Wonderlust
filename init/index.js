const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
.then(() =>{
  console.log("connected to db");
})
.catch((err) =>{
    console.log("err");
});
async function main(params) {
    await mongoose.connect(MONGO_URL);
}

const initDB = async() =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({
        ...obj, 
        owner:"68ed25c1e3ea7fa3f7abaaad",
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();
