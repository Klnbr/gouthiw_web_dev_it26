const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

// const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;
const app = express();
const port = 5500;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "-" +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function run() {
//   try {
//     await client.connect();
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     await client.close();
//   }
// }
// run().catch(console.dir);

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

app.listen(port, () => {
  console.log("Server is running on port 5500");
});

const myIngr = require("./models/ingredient");
const myTrivia = require("./models/trivia");
const myMenu = require("./models/menu");
const myNutr = require("./models/nutr");

//signup
app.post("/signup", async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      password,
      license_number,
      tel,
      email,
      image_profile,
      image_background,
      isDeleted,
    } = req.body;
    const nutr = await myNutr.findOne({ email });

    if (nutr) {
      return res.status(409).send("This email is already exist");
    }

    let hashPassword = await bcrypt.hash(password, 10);

    const newNutr = new myNutr({
      firstname,
      lastname,
      password: hashPassword,
      license_number,
      tel,
      email: email.toLowerCase(),
      image_profile,
      image_background,
      menu_owner: [],
      triv_owner: [],
      isDeleted,
    });

    await newNutr.save();

    const token = jwt.sign({ _id: newNutr._id }, "secretkey123", {
      expiresIn: "90d",
    });

    res.status(201).json({
      message: "Signed up successfully",
      token,
    });
  } catch (error) {
    console.error("Sign up Error: ", error);
    res.status(500).json({ message: "Failed to sign up" });
  }
});

//signin
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const nutr = await myNutr.findOne({ email });

    if (!nutr) {
      return res.status(404).send("User not found!");
    }

    const checkPass = await bcrypt.compare(password, nutr.password);
    if (!checkPass) {
      return res.status(401).send("Invalid email or password");
    }

    const token = jwt.sign({ _id: nutr._id }, "secretkey123", {
      expiresIn: "90d",
    });

    res.status(201).json({
      message: "Signed in successfully",
      token,
      nutr,
    });
  } catch (error) {
    console.error("Sign up Error: ", error);
    res.status(500).json({ message: "Failed to sign up" });
  }
});

//ดึงuserมาแสดง
app.get("/users", async (req, res) => {
  try {
    const users = await myNutr.find({ isDeleted: false });
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users data", error);
    res.status(500).json({ message: "Failed to retrieve the users" });
  }
});

//ดึงเมนูมาแสดง
app.get("/menus", async (req, res) => {
  try {
    const menus = await myMenu.find({ isDeleted: false });
    return res.json(menus);
  } catch (error) {
    console.error("Error fetching menus data", error);
    res.status(500).json({ message: "Failed to retrieve the menus" });
  }
});

//ดึงเมนูมาแสดง (Auth)
app.get("/menus/auth/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userMenu = await myNutr.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $unwind: "$menu_owner",
      },
      {
        $lookup: {
          from: "menus",
          localField: "menu_owner.menu_id",
          foreignField: "_id",
          as: "menuDetails",
        },
      },
      {
        $unwind: "$menuDetails",
      },
      {
        $match: { "menuDetails.isDeleted": false }
      },
      {
        $project: {
          _id: "$menuDetails._id",
          menuName: "$menuDetails.menuName",
          category: "$menuDetails.category",
          ingredients: "$menuDetails.ingredients",
          method: "$menuDetails.method",
          purine: "$menuDetails.purine",
          uric: "$menuDetails.uric",
          image: "$menuDetails.image"
        },
      },
    ]);
    return res.json(userMenu);
  } catch (error) {
    console.error("Error fetching menus data", error);
    res.status(500).json({ message: "Failed to retrieve the menus" });
  }
});

//เพิ่มเมนู
app.post("/menus", async (req, res) => {
  try {
    const {
      menuName,
      category,
      ingredients,
      method,
      purine,
      uric,
      image,
      isDeleted,
    } = req.body;

    const newMenu = new myMenu({
      menuName,
      category,
      ingredients,
      method,
      purine,
      uric,
      image,
      isDeleted,
    });

    await newMenu.save();

    res
      .status(201)
      .json({ message: "Ingredient saved successfully", menu: newMenu });
  } catch (error) {
    console.log("Error creating menu", error);
    res.status(500).json({ message: "Failed to add an menu" });
  }
});

//เพิ่มเมนู (Auth)
app.post("/menus/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      menuName,
      category,
      ingredients,
      method,
      purine,
      uric,
      image,
      isDeleted,
    } = req.body;

    const formattedPurine = parseFloat(purine).toFixed(2);
    const formattedUric = parseFloat(uric).toFixed(2);

    const newMenu = new myMenu({
      menuName,
      category,
      ingredients,
      method,
      purine: formattedPurine,
      uric: formattedUric,
      image,
      isDeleted,
    });

    await newMenu.save();

    await myNutr.findByIdAndUpdate(id, {
      $push: { menu_owner: { menu_id: newMenu._id } },
    });

    res.status(201).json({ message: "Menu saved successfully", menu: newMenu });
  } catch (error) {
    console.log("Error creating menu", error);
    res.status(500).json({ message: "Failed to add an menu" });
  }
});

//ดึงเมนูมา 1 เมนู
app.get("/menu/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const menus = await myMenu.findById(id);
    console.log(menus);
    res.status(200).json(menus);
  } catch (error) {
    console.log("error fetching all the menus", error);
    res.status(500).json({ message: "Error fetching all the menus" });
  }
});

//แก้ไขเมนู
app.put("/menu/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { menuName, category, ingredients, method, purine, uric, image } = req.body;

    const formattedPurine = parseFloat(purine).toFixed(2);
    const formattedUric = parseFloat(uric).toFixed(2);

    await myMenu.findByIdAndUpdate(id, {
      menuName,
      category,
      ingredients,
      method,
      purine: formattedPurine,
      uric: formattedUric,
      image,
    });

    res.status(200).json({ message: "Update Menu successfully" });
  } catch (error) {
    console.log("Error update Menu", error);
    res.status(500).json({ message: "Error update Menu" });
  }
});

//ลบเมนู
app.delete("/menu/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const softDeletedMenu = await myMenu.findByIdAndUpdate(id, {
      isDeleted: true,
    });
    if (!softDeletedMenu) {
      return res.status(404).json({ message: "Menu not found" });
    }
    res.status(200).json({ message: "Menu soft deleted successfully" });
  } catch (error) {
    console.log("Error delete menu", error);
    res.status(500).json({ message: "Error delete menu" });
  }
});

//ดึงวัตถุดิบมาแสดง
app.get("/ingrs", async (req, res) => {
  try {
    const ingrs = await myIngr.find({ isDeleted: false });
    res.status(200).json(ingrs);
  } catch (error) {
    console.error("Error fetching ingrs data", error);
    res.status(500).json({ message: "Failed to retrieve the ingrs" });
  }
});

//เพิ่มวัตถุดิบ
app.post("/addIngr", async (req, res) => {
  try {
    const { name, purine, uric, isDeleted } = req.body;

    const newIngre = new myIngr({
      name,
      purine,
      uric,
      isDeleted,
    });

    await newIngre.save();

    res
      .status(201)
      .json({ message: "Ingredient saved successfully", ingr: newIngre });
  } catch (error) {
    console.log("Error creating ingre", error);
    res.status(500).json({ message: "Failed to add an ingre" });
  }
});

//ดึงวัตถุดิบมา 1 วัตถุดิบ
app.get("/ingr/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const ingrs = await myIngr.findById(id);
    console.log(ingrs);
    res.status(200).json(ingrs);
  } catch (error) {
    console.log("error fetching all the ingrs", error);
    res.status(500).json({ message: "Error fetching all the ingrs" });
  }
});

//แก้ไขวัตถุดิบ
app.put("/ingr/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, purine, uric } = req.body;

    await myIngr.findByIdAndUpdate(id, { name, purine, uric });

    res.status(200).json({ message: "Update ingr successfully" });
  } catch (error) {
    console.log("Error update ingr", error);
    res.status(500).json({ message: "Error update ingr" });
  }
});

//ลบวัตถุดิบ
app.delete("/ingr/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const softDeletedIngredient = await myIngr.findByIdAndUpdate(id, {
      isDeleted: true,
    });

    if (!softDeletedIngredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    res.status(200).json({ message: "Ingredient soft deleted successfully" });
  } catch (error) {
    console.log("Error delete ingr", error);
    res.status(500).json({ message: "Error delete ingr" });
  }
});

//ดึงเกร็ดความรู้มาแสดง
app.get("/trivias", async (req, res) => {
  try {
    const trivias = await myTrivia.find({ isDeleted: false });
    return res.json(trivias);
  } catch (error) {
    console.log("error fetching all the trivias", error);
    res.status(500).json({ message: "Error fetching all the trivias" });
  }
});

//ดึงเกร็ดความรู้มาแสดง (Auth)
app.get("/trivias/auth/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userTrivia = await myNutr.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $unwind: "$triv_owner",
      },
      {
        $lookup: {
          from: "trivias",
          localField: "triv_owner.triv_id",
          foreignField: "_id",
          as: "triviaDetails",
        },
      },
      {
        $unwind: "$triviaDetails",
      },
      {
        $project: {
          _id: "$triviaDetails._id",
          head: "$triviaDetails.head",
          image: "$triviaDetails.image",
          content: "$triviaDetails.content",
        },
      },
    ]);
    return res.json(userTrivia);
  } catch (error) {
    console.log("error fetching all the trivias", error);
    res.status(500).json({ message: "Error fetching all the trivias" });
  }
});

//เพิ่มเกร็ดความรู้
app.post("/addTrivia", upload.single("image"), async (req, res) => {
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

//เพิ่มเกร็ดความรู้ (Auth)
app.post("/trivia/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { head, image, content, isDeleted } = req.body;

    const addTrivia = new myTrivia({
      head,
      image,
      content,
      isDeleted,
    });

    await addTrivia.save();

    await myNutr.findByIdAndUpdate(id, {
      $push: { triv_owner: { triv_id: addTrivia._id } },
    });

    res
      .status(201)
      .json({ message: "Trivia created successfully", trivia: addTrivia });
  } catch (error) {
    console.log("error creating the trivia", error);
    res.status(500).json({ message: "Error creating the trivia" });
  }
});

//ดึงเกร็ดความรู้มา 1 เกร็ดความรู้
app.get("/trivia/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const trivias = await myTrivia.findById(id);
    console.log(trivias);
    res.status(200).json(trivias);
  } catch (error) {
    console.log("error fetching all the trivias", error);
    res.status(500).json({ message: "Error fetching all the trivias" });
  }
});

//แก้ไขเกร็ดความรู้
app.put("/trivia/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { head, image, content } = req.body;

    await myTrivia.findByIdAndUpdate(id, { head, image, content });

    res.status(200).json({ message: "Update Trivia successfully" });
  } catch (error) {
    console.log("Error update Trivia", error);
    res.status(500).json({ message: "Error update Trivia" });
  }
});

//ลบเกร็ดความรู้
app.delete("/trivia/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const softDeletedIngredient = await myTrivia.findByIdAndUpdate(id, {
      isDeleted: true,
    });

    if (!softDeletedIngredient) {
      return res.status(404).json({ message: "Trivia not found" });
    }

    res.status(200).json({ message: "Trivia soft deleted successfully" });
  } catch (error) {
    console.log("Error delete ingr", error);
    res.status(500).json({ message: "Error delete ingr" });
  }
});

//แก้ไขโปรไฟล์
app.put("/user/:id", async (req, res) => {
     try {
       const { id } = req.params;
       const { firstname, lastname, license_number, tel, email, password } = req.body;
   
       // ตรวจสอบข้อมูล
       console.log("Update Data:", { firstname, lastname, license_number, tel, email, password });
   
       // สร้างข้อมูลที่จะอัปเดต
       const updateData = {
         firstname,
         lastname,
         license_number,
         tel,
         email,
         ...(password ? { password } : {}),
       };
   
       // อัปเดตข้อมูลในฐานข้อมูล
       const updatedUser = await myUser.findByIdAndUpdate(id, updateData, { new: true });
   
       // ตรวจสอบว่าผู้ใช้ถูกอัปเดต
       if (!updatedUser) {
         return res.status(404).json({ message: "User not found" });
       }
   
       res.status(200).json({ message: "Update User successfully", updatedUser });
     } catch (error) {
       console.log("Error update User", error);
       res.status(500).json({ message: "Error update User" });
     }
});
   