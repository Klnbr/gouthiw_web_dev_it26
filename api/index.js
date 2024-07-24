const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const app = express();
const port = 5500;
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/gouthiw", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

app.listen(port, () => {
  console.log("Server is running on port 5500");
});

const myIngr = require("./models/ingredient");
const myTrivia = require("./models/trivia");
const myMenu = require("./models/menu");

//ดึงเมนูมาแสดง
app.get("/menus", async (req, res) => {
     try {
          const menus = await myMenu.find({ isDeleted: false })
          return res.json(menus)
     } catch (error) {
          console.error("Error fetching menus data", error);
          res.status(500).json({ message: "Failed to retrieve the menus" });
     }
});

//ดึงเกร็ดความรู้มาแสดง
app.get("/trivias", async (req, res) => {
     try {
          const trivias = await myTrivia.find({ isDeleted: false });
          return res.json(trivias)
     } catch (error) {
          console.log("error fetching all the trivias", error);
          res.status(500).json({ message: "Error fetching all the trivias" });
     }
});

//เพิ่มเกร็ดความรู้
app.post("/addTrivia", async (req, res) => {
     try {
          const { head, image, content, isDeleted } = req.body;
     
          const addTrivia = new myTrivia({
               head,
               image,
               content,
               isDeleted,
          });
          await addTrivia.save();
     
          res
               .status(201)
               .json({ message: "Trivia created successfully", trivia: addTrivia });
     } catch (error) {
          console.log("error creating the trivia", error);
          res.status(500).json({ message: "Error creating the trivia" });
     }
});