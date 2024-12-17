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
const myTopic = require("./models/topic");
const myUser = require("./models/user");


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

    if (!firstname || !lastname || !password || !email) {
      return res.status(400).json({ message: "กรุณาใส่ข้อมูลให้ครบถ้วน" });
    }

    const existingNutr = await myNutr.findOne({ email: email.toLowerCase() });
    if (existingNutr) {
      return res.status(409).json({ message: "อีเมลนี้ถูกใช้ไปแล้ว" });
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
      ingr_owner: [],
      isDeleted,
    });

    await newNutr.save();

    const token = jwt.sign({ _id: newNutr._id }, "secretkey123", {
      expiresIn: "90d",
    });

    res.status(201).json({
      message: "ลงทะเบียนสำเร็จ",
      token,
    });
  } catch (error) {
    console.error("Sign up Error: ", error);
    res.status(500).json({ message: "ลงทะเบียนไม่สำเร็จ" });
  }
});

//signin
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "จำเป็นต้องมีอีเมลและรหัสผ่าน" });
    }

    const nutr = await myNutr.findOne({ email: email.toLowerCase() });

    if (!nutr) {
      return res.status(404).send("ไม่พบผู้ใช้");
    }

    const checkPass = await bcrypt.compare(password, nutr.password);
    if (!checkPass) {
      return res.status(401).send("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }

    const token = jwt.sign({ _id: nutr._id }, "secretkey123", {
      expiresIn: "90d",
    });

    res.status(201).json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      nutr,
    });
  } catch (error) {
    console.error("Sign up Error: ", error);
    res.status(500).json({ message: "เข้าสู่ระบบไม่สำเร็จ" });
  }
});

//ดึง users มาแสดง
app.get("/users", async (req, res) => {
  try {
    const users = await myUser.find({ isDeleted: false });
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users data", error);
    res.status(500).json({ message: "Failed to retrieve the users" });
  }
});

//ดึง nutrs มาแสดง
app.get("/nutrs", async (req, res) => {
  try {
    const users = await myNutr.find({ isDeleted: false });
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users data", error);
    res.status(500).json({ message: "Failed to retrieve the users" });
  }
});

//ดึง id มา 1 id
app.get("/admin/:role/:id", async (req, res) => {
  try {
    const { id, role } = req.params;

    let res_info = null
    if (role == 0) {
      res_info = await myUser.findById(id);
    } else if (role == 1) {
      res_info = await myNutr.findById(id);
    }
    
    if (!res_info) {
      return res.status(404).json({ message: "ไม่พบข้อมูล" });
    }

    res.status(200).json(res_info);
  } catch (error) {
    console.log("ไม่พบข้อมูลของผู้ใช้ id ดังกล่าว", error);
    res.status(500).json({ message: "ไม่พบข้อมูลของผู้ใช้ id ดังกล่าว" });
  }
});

app.get("/user/:userId", (req,res)=>{
  try{
    const loggedInuser = req.param.userId;

    myUser.findOne({_id:loggedInuser})
    .then((user) => {
      if (!user){
        return res.status(404).json({message:"User not found"});
      }
      res.status(200).json(user);
    })
  }catch (error){
    res.status(500).json({messagge:"Error getting user"})
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

//เพิ่มเมนู (Auth)
app.post("/menus/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      menuName,
      category,
      ingredients,
      method,
      purine_total,
      uric_total,
      image,
      isDeleted,
    } = req.body;

    if (!menuName || !category || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: "Invalid data. Please provide all required fields." });
    }

    const formattedPurine = !isNaN(parseFloat(purine_total)) ? parseFloat(purine_total).toFixed(2) : 0;
    const formattedUric = !isNaN(parseFloat(uric_total)) ? parseFloat(uric_total).toFixed(2) : 0;

    const newMenu = new myMenu({
      menuName,
      category,
      ingredients,
      method,
      purine_total: formattedPurine,
      uric_total: formattedUric,
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

      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid topic ID" });
      }
    
      const objectId = new mongoose.Types.ObjectId(id);

      const menus = await myMenu.aggregate([
          {
              $match: { _id: objectId }
          },
          {
              $lookup: {
                  from: "ingrs",
                  localField: "ingredients.ingr_id",
                  foreignField: "_id",
                  as: "ingrDetails"
              }
          },
          {
              $project: {
                  menuName: 1,
                  category: 1,
                  method: 1,
                  purine_total: 1,
                  uric_total: 1,
                  image: 1,
                  createdAt: 1,
                  "ingrDetails.name": 1,
                  "ingrDetails.purine": 1,
                  "ingrDetails.uric": 1,
                  "ingrDetails.ingr_type": 1,
                  "ingredients.ingr_id": 1,
                  "ingredients.qty": 1,
                  "ingredients.unit": 1
              }
          }
      ]);
      
      res.status(200).json(menus[0]);
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
    const ingrs = await myIngr.aggregate([
      { 
        $match: { isDeleted: false }  // Filter out deleted ingredients
      },
      {
        $lookup: {
          from: 'nutrs',              // Collection name for nutritionists
          localField: '_id',          // Ingredient's ID
          foreignField: 'ingr_owner.ingr_id', // Field in nutritionist collection that references ingredient ID
          as: 'owners'
        }
      },
      {
        $unwind: '$owners'             // Unwind to get individual nutritionist-owner details
      },
      {
        $project: {
          name: 1,                     // Ingredient name
          purine: 1,                   // Purine level
          uric: 1,                     // Uric level
          ingr_type: 1,                // Ingredient type
          "owner_name": { 
            $concat: ['$owners.firstname', ' ', '$owners.lastname']  // Concatenate first and last names
          }
        }
      }
    ])
    res.status(200).json(ingrs);
  } catch (error) {
    console.error("Error fetching ingrs data", error);
    res.status(500).json({ message: "Failed to retrieve the ingrs" });
  }
});

app.get("/ingrs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const ingrs = await myIngr.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $unwind: "$ingr_owner",
      },
      {
        $lookup: {
          from: "ingrs",
          localField: "ingr_owner.ingr_id",
          foreignField: "_id",
          as: "ingrDetails",
        },
      },
      {
        $unwind: "$ingrDetails",
      },
      {
        $project: {
          _id: "$ingrDetails._id",
          name: "$ingrDetails.name",
          purine: "$ingrDetails.purine",
          uric: "$ingrDetails.uric",
          ingr_type: "$ingrDetails.ingr_type"
        },
      },
    ]);
    return res.json(ingrs);
  } catch (error) {
    console.error("Error fetching ingrs data", error);
    res.status(500).json({ message: "Failed to retrieve the ingrs" });
  }
});

//เพิ่มวัตถุดิบ
app.post("/ingr/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, purine, uric, ingr_type, isDeleted } = req.body;

    const newIngre = new myIngr({
      name,
      purine,
      uric,
      ingr_type,
      isDeleted
    });

    await newIngre.save();

    await myNutr.findByIdAndUpdate(id, {
      $push: { ingr_owner: { ingr_id: newIngre._id } },
    });

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
    const { name, purine, uric, ingr_type } = req.body;

    await myIngr.findByIdAndUpdate(id, { name, purine, uric, ingr_type });

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
          trivia_type: "$triviaDetails.trivia_type",
          createdAt: "$triviaDetails.createdAt",
          updatedAt: "$triviaDetails.updatedAt",
        },
      },
    ]);
    return res.json(userTrivia);
  } catch (error) {
    console.log("error fetching all the trivias", error);
    res.status(500).json({ message: "Error fetching all the trivias" });
  }
});

//เพิ่มเกร็ดความรู้ (Auth)
app.post("/trivia/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { head, image, content, trivia_type, isDeleted } = req.body;

    const addTrivia = new myTrivia({
      head,
      image,
      content,
      trivia_type,
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
      
       console.log("Received ID:", id);
     
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
       const updatedUser = await myNutr.findByIdAndUpdate(id, {firstname, lastname, license_number, tel, email, password});
   
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

// ดึงกระทู้มาโชว์
app.get("/topics", async (req, res) => {
  try {
    const topics = await myTopic.aggregate([
      {
        $match: { isDeleted: false }  // ดึงเฉพาะกระทู้ที่ไม่ถูกลบ
      },
      {
        $lookup: {
          from: "users",  // ชื่อ collection ที่เก็บข้อมูลผู้ใช้ (ควรเป็นชื่อใน MongoDB)
          localField: "user",  // ฟิลด์ใน collection topics ที่เชื่อมโยงกับ user
          foreignField: "_id",  // ฟิลด์ใน collection users ที่เป็น _id
          as: "userDetails"  // ชื่อฟิลด์ที่จะเก็บข้อมูลผู้ใช้ที่เชื่อมโยง
        }
      },
      {
        $unwind: "$userDetails"  // ใช้ unwind เพื่อแปลง array เป็น object
      },
      {
        $project: {
          title: 1,              // แสดงฟิลด์ title ของ topic
          image: 1,              // แสดงฟิลด์ image ของ topic
          detail: 1,             // แสดงฟิลด์ detail ของ topic
          answer: 1,
          createdAt: 1,
          "userDetails.name": 1  // แสดงเฉพาะชื่อผู้ใช้จาก userDetails
        }
      }
    ]);

    if (topics.length === 0) {
      return res.status(404).json({ message: "No topics found" });
    }    
    
    return res.json(topics);
  } catch (error) {
    console.error("Error fetching topics data", error);
    res.status(500).json({ message: "Failed to retrieve the topics" });
  }
});

//ดึงกระทู้มา 1 กระทู้
app.get("/topic/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid topic ID" });
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const topics = await myTopic.aggregate([
      {
        $match: { _id: objectId  }
      },
      {
        $lookup: {
          from: "users",  // ชื่อ collection ที่เก็บข้อมูลผู้ใช้ (ควรเป็นชื่อใน MongoDB)
          localField: "user",  // ฟิลด์ใน collection topics ที่เชื่อมโยงกับ user
          foreignField: "_id",  // ฟิลด์ใน collection users ที่เป็น _id
          as: "userDetails"  // ชื่อฟิลด์ที่จะเก็บข้อมูลผู้ใช้ที่เชื่อมโยง
        }
      },
      {
        $unwind: "$userDetails"  // ใช้ unwind เพื่อแปลง array เป็น object
      },
      {
        $unwind: {
            path: "$answer", 
            preserveNullAndEmptyArrays: true // เพื่อหลีกเลี่ยงการสูญเสียกระทู้ที่ไม่มี answer
        }
      },
      {
        $lookup: 
            {
                from: "nutrs",  // ชื่อ collection ที่เก็บข้อมูลผู้ใช้ (ควรเป็นชื่อใน MongoDB)
                localField: "answer.nutr_id",  // ฟิลด์ใน collection topics ที่เชื่อมโยงกับ user
                foreignField: "_id",  // ฟิลด์ใน collection users ที่เป็น _id
                as: "nutrDetails"  // ชื่อฟิลด์ที่จะเก็บข้อมูลผู้ใช้ที่เชื่อมโยง
            },
        
      },
      {
        $unwind: {
            path: "$nutrDetails",
            preserveNullAndEmptyArrays: true  // เพื่อหลีกเลี่ยงการสูญเสียกระทู้ที่ไม่มี nutrDetails
        }            
      },
      {
        $group: {
            _id: "$_id",
            title: { $first: "$title" },
            detail: { $first: "$detail" },
            createdAt: { $first: "$createdAt" },
            answer: { 
                $push: { 
                    nutrDetails: {
                        firstname: "$nutrDetails.firstname",
                        lastname: "$nutrDetails.lastname"
                    }, 
                    answer_detail: "$answer.answer_detail" 
                } 
            },
            userDetails: { $first: "$userDetails" }
        }
      },
      {
        $project: {
            title: 1,              // แสดงฟิลด์ title ของ topic
            detail: 1,             // แสดงฟิลด์ detail ของ topic
            answer: 1,
            createdAt: 1,
            "userDetails.name": 1  // แสดงเฉพาะชื่อผู้ใช้จาก userDetails
        }
      }
    ]);

    // ตรวจสอบว่ากระทู้ถูกพบหรือไม่
    if (topics.length === 0) {
      return res.status(404).json({ message: "Topic not found" });
    }

    console.log("topics:", topics);

    // ส่งกลับข้อมูลกระทู้แรก
    return res.json(topics[0]);
  } catch (error) {
    console.log("error fetching the topic", error);
    res.status(500).json({ message: "Error fetching the topic" });
  }
});

// ตอบกลับกระทู้
app.put("/topic/answer/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nutr_id, answer_detail } = req.body;

    // ตรวจสอบความถูกต้องของ ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid topic ID" });
    }

    // ตรวจสอบค่าที่ส่งมา
    if (!nutr_id || !answer_detail) {
      return res.status(400).json({ message: "nutr_id and answer_detail are required" });
    }

    const updatedTopic = await myTopic.findByIdAndUpdate(id, { 
      $push: {
        answer: {
          nutr_id, 
          answer_detail,
          parentId: id, // เพื่อเชื่อมโยงการตอบกลับกับการตอบกลับของนักโภชนาการ
        }
      }
    }, { new: true });

    // ตรวจสอบว่ามีกระทู้ที่ถูกอัปเดตหรือไม่
    if (!updatedTopic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.status(200).json({ message: "Reply added successfully", topic: updatedTopic });
  } catch (error) {
    console.log("Error adding reply to topic", error);
    res.status(500).json({ message: "Error adding reply to topic" });
  }
});