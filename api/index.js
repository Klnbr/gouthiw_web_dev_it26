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
const myReport = require("./models/report");
const myNoti = require("./models/noti");

const sendNotification = require("../src/notification");
const { title } = require("process");
const { notification } = require("antd");

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
      role: '0',
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
      // uric_total,
      image,
      isDeleted,
    } = req.body;

    if (!menuName || !category || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: "Invalid data. Please provide all required fields." });
    }

    const formattedPurine = !isNaN(parseFloat(purine_total)) ? parseFloat(purine_total).toFixed(2) : 0;
    // const formattedUric = !isNaN(parseFloat(uric_total)) ? parseFloat(uric_total).toFixed(2) : 0;

    const newMenu = new myMenu({
      menuName,
      category,
      ingredients,
      method,
      purine_total: formattedPurine,
      // uric_total: formattedUric,
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
      { $match: { 
        _id: new mongoose.Types.ObjectId(id),
          isDeleted: false
        } 
      },
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
      isDeleted: false,
      isVisible: true
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid trivia ID" });
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const trivias = await myTrivia.aggregate([
      {
        $match: { _id: objectId  }
      },
      {
        $lookup: {
          from: "nutrs",  // ชื่อ collection ที่เก็บข้อมูลผู้ใช้ (ควรเป็นชื่อใน MongoDB)
          localField: "_id",  // ฟิลด์ใน collection trivias ที่เชื่อมโยงกับ nutrs
          foreignField: "triv_owner.triv_id",  // ฟิลด์ใน collection users ที่เป็น _id
          as: "creatorDetails"  // ชื่อฟิลด์ที่จะเก็บข้อมูลผู้ใช้ที่เชื่อมโยง
        }
      },
      {
        $unwind: {
          path: "$creatorDetails", // แปลง array เป็น object เดี่ยว
          preserveNullAndEmptyArrays: false // ไม่เอา trivia ที่ไม่มี creator
        }
      },
      {
        $project: {
          _id: 1, // ดึงไอดีของ trivia
          head: 1, // หัวข้อเกร็ดความรู้
          image: 1, // รูปภาพ
          content: 1, // เนื้อหา
          trivia_type: 1, // ประเภทของ trivia
          createdAt: 1, // วันที่สร้าง
          updatedAt: 1, // วันที่อัปเดต
          edit_deadline: 1,
          creator: {
            _id: "$creatorDetails._id", // ไอดีของผู้สร้าง
            firstname: "$creatorDetails.firstname", // ชื่อผู้สร้าง
            lastname: "$creatorDetails.lastname", // นามสกุลผู้สร้าง
            email: "$creatorDetails.email", // อีเมลผู้สร้าง
            tel: "$creatorDetails.tel" // เบอร์โทรผู้สร้าง
          }
        }
      }
    ]);

    // ตรวจสอบว่าพบข้อมูลหรือไม่
    if (trivias.length === 0) {
      return res.status(404).json({ message: "Trivia not found" });
    }
    console.log(trivias);
    res.status(200).json(trivias[0]);
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
          localField: "user_id",  // ฟิลด์ใน collection topics ที่เชื่อมโยงกับ user
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
      console.log("Received Topic ID:", id);

      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid topic ID" });
      }

      const objectId = new mongoose.Types.ObjectId(id);

      const topics = await myTopic.aggregate([
          { $match: { _id: objectId } },
          {
              $lookup: {
                  from: "users",
                  localField: "user_id",
                  foreignField: "_id",
                  as: "userDetails"
              }
          },
          { $unwind: "$userDetails" },
          {
              $unwind: {
                  path: "$answer",
                  preserveNullAndEmptyArrays: true
              }
          },
          {
              $lookup: {
                  from: "nutrs",
                  localField: "answer.nutr_id",
                  foreignField: "_id",
                  as: "nutrDetails"
              }
          },
          {
              $unwind: {
                  path: "$nutrDetails",
                  preserveNullAndEmptyArrays: true
              }
          },
          {
            
              $group: {
                  _id: "$_id",
                  title: { $first: "$title" },
                  detail: { $first: "$detail" },
                  createdAt: { $first: "$createdAt" },
                  image: { $first: "$image" }, // กรณีที่ image เป็น String ธรรมดา
                  allImages: { $push: "$image" }, // ดึงรูปทั้งหมด
                  answer: {
                      $push: {
                          nutrDetails: {
                              firstname: "$nutrDetails.firstname",
                              lastname: "$nutrDetails.lastname",
                              image_profile: "$nutrDetails.image_profile"
                          },
                          answer_detail: "$answer.answer_detail",
                          answer_image: "$answer.answer_image"
                      }
                  },
                  userDetails: { 
                      $first: {
                          name: "$userDetails.name",
                          image_profile: "$userDetails.image_profile"
                      }
                  }
              
          }
        
          }
      ]);

      if (topics.length === 0) {
          return res.status(404).json({ message: "Topic not found" });
      }

      console.log("Fetched Topics:", topics);
      return res.json(topics[0]);
  } catch (error) {
      console.log("Error fetching the topic:", error);
      res.status(500).json({ message: "Error fetching the topic", error: error.message });
  }
});

// ตอบกลับกระทู้
app.put("/topic/answer/:id", upload.array("answer_image", 5), async (req, res) => {
  try {
    const { id } = req.params;
    const { nutr_id, answer_detail } = req.body;

    // เช็คว่าไฟล์ถูกส่งมาหรือไม่
    const answer_images = req.files ? req.files.map(file => file.path) : []; // รับ URL ของไฟล์ที่อัปโหลด

    console.log("รับค่าจาก Frontend:", { id, nutr_id, answer_detail, answer_images });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid Topic ID:", id);
      return res.status(400).json({ message: "Invalid topic ID" });
    }

    if (!nutr_id || !answer_detail) {
      console.log("Missing nutr_id or answer_detail");
      return res.status(400).json({ message: "nutr_id and answer_detail are required" });
    }

    console.log("✅ answer_images before saving:", answer_images);

    const updatedTopic = await myTopic.findByIdAndUpdate(
      id,
      { 
        $push: {
          answer: {
            nutr_id,
            answer_detail,
            answer_image: answer_images, // เก็บ URL ของภาพที่อัปโหลด
            parentId: id,
          },
        },
      },
      { new: true }
    );

    if (!updatedTopic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.status(200).json({ message: "Reply added successfully", topic: updatedTopic });
  } catch (error) {
    console.log("❌ Error adding reply to topic", error);
    res.status(500).json({ message: "Error adding reply to topic" });
  }
});

// ดึงการรายงานมาแสดง
app.get("/report/trivias", async (req, res) => {
  try {
    const reportstv = await myReport.aggregate([
      {
        $match: { isDeleted: false }  // ดึงเฉพาะกระทู้ที่ไม่ถูกลบ
      },
      {
        $lookup: { // โฟกัสที่ nutr_id เพื่อไปดึงข้อมูลจาก nutr มา join
          from: "nutrs", // เปิดประตู nutrs
          localField: "nutr_id", // ส่งตัวแทนจากฝั่ง reports ไปเทียบ
          foreignField: "_id", // ตัวรับเทียบใน nutrs
          as: "nutrDetails", // nutrs ส่งข้อมูลก้อนกลับมา
        },
      },
      {
        $unwind: "$nutrDetails", // แตกก้อน nutrs
      },
      {
        $lookup: { // โฟกัสที่ triv_id เพื่อไปดึงข้อมูลจาก trivias มา join
          from: "trivias", // เปิดประตู trivias
          localField: "triv_id", // ส่งตัวแทนจากฝั่ง reports ไปเทียบ
          foreignField: "_id", // ตัวรับเทียบใน trivias
          as: "triviaDetails", // trivias ส่งข้อมูลก้อนกลับมา
        },
      },
      {
        $unwind: "$triviaDetails", // แตกก้อน trivias
      },
      {
        $project: { // เปิดการมองเห็นข้อมูลใน reports ทั้งหมดรวมถึงข้อมูลที่ join มา
          _id: 1,
          triv_id: 1,
          nutr_id: 1,
          note: 1,
          status: 1,
          notification: 1,
          createdAt: 1,
          updatedAt: 1,
          "nutrDetails.firstname": 1,
          "nutrDetails.lastname": 1,
          "nutrDetails.email": 1,
          "nutrDetails.image_profile": 1,
          "triviaDetails.head": 1,
          "triviaDetails.image": 1,
          "triviaDetails.content": 1,
          "triviaDetails.trivia_type": 1,
        },
      },
    ]);
    return res.json(reportstv);
  } catch (error) {
    console.log("error fetching all the reports", error);
    res.status(500).json({ message: "Error fetching all the reports" });
  }
});

// ดึงการรายงานกระทู้มาแสดง  ยังทำไม่เสร็จจจจจ
app.get("/report/topics", async (req, res) => {
  try {
    const reportstp = await myReport.aggregate([
      {
        $match: { isDeleted: false }  // ดึงเฉพาะกระทู้ที่ไม่ถูกลบ
      },
      {
        $lookup: { // โฟกัสที่ nutr_id เพื่อไปดึงข้อมูลจาก nutr มา join
          from: "users", // เปิดประตู nutrs
          localField: "user_id", // ส่งตัวแทนจากฝั่ง reports ไปเทียบ
          foreignField: "_id", // ตัวรับเทียบใน nutrs
          as: "userDetails", // nutrs ส่งข้อมูลก้อนกลับมา
        },
      },
      {
        $unwind: "$userDetails", // แตกก้อน nutrs
      },
      {
        $lookup: { // โฟกัสที่ triv_id เพื่อไปดึงข้อมูลจาก trivias มา join
          from: "topics", // เปิดประตู trivias
          localField: "content_id", // ส่งตัวแทนจากฝั่ง reports ไปเทียบ
          foreignField: "_id", // ตัวรับเทียบใน trivias
          as: "topicDetails", // trivias ส่งข้อมูลก้อนกลับมา
        },
      },
      {
        $unwind: "$topicDetails", // แตกก้อน trivias
      },
      {
        $project: { // เปิดการมองเห็นข้อมูลใน reports ทั้งหมดรวมถึงข้อมูลที่ join มา
          _id: 1,
         user_id: 1,
         content_id: 1,
          note: 1,
          status: 1,
          // notification: 1,
          createdAt: 1,
          updatedAt: 1,
          "userDetails.name": 1,
          "userDetails.email": 1,
          // "userDetails.image_profile": 1,
          "topicDetails.head": 1,
          "topicDetails.image": 1,
          "topicDetails.content": 1,
          "topicDetails.title": 1,
          // ไม่แน่จายยย
          "topicDetails.anwer_detail": 1,
          "topicDetails.replies": 1,
        },
      },
    ]);

    return res.json(reportstp);
  } catch (error) {
    console.log("error fetching all the reports", error);
    res.status(500).json({ message: "Error fetching all the reports" });
  }
});

// เพิ่มการรายงาน
app.post("/report", async (req, res) => {
  try {
    const { triv_id, nutr_id, note } = req.body;

    const newReport = new myReport({
      triv_id,
      nutr_id,
      note,
      status: null,
      notification: 0,
      recipientRole: "admin",
    });

    await newReport.save();

    const admin = await myNutr.findOne({ role: "1" });

    const trivia = await myTrivia.findById(triv_id);

    const notiAdmin = new myNoti({
      report_id: newReport._id,
      triv_id,
      recipients: [
        {
          nutr_id: admin._id,
          message: "[เกร็ดความรู้] มีการรายงานใหม่",
          report_role: "admin",
        },
      ],
      title: trivia.head,
      note,
      status_report: null,
    });

    await notiAdmin.save();

    res
      .status(201)
      .json({ message: "Report created successfully", report: newReport });
  } catch (error) {
    console.log("error creating the report", error);
    res.status(500).json({ message: "Error creating the report" });
  }
});

// ดึงการรายงานมาแสดง (Auth)
app.get("/reports/:nutrId", async (req, res) => {
  try {
    const { nutrId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(nutrId)) {
      return res.status(400).json({ message: "Invalid nutr ID" });
    }

    const reports = await myReport.aggregate([
      { 
        $match: { // เป็นการดึงเอา id ที่เราส่งมาพร้อม path มาเทียบกับอะไรสักอย่างใน myReport
          nutr_id: new mongoose.Types.ObjectId(nutrId) 
        } 
      },
      // ขั้นตอนนี้คือได้ก้อน report ทั้งหลายที่มี nutr_id ตรงกันแล้ว
      {
        $lookup: { // โฟกัสที่ nutr_id เพื่อไปดึงข้อมูลจาก nutr มา join
          from: "nutrs", // เปิดประตู nutrs
          localField: "nutr_id", // ส่งตัวแทนจากฝั่ง reports ไปเทียบ
          foreignField: "_id", // ตัวรับเทียบใน nutrs
          as: "nutrDetails", // nutrs ส่งข้อมูลก้อนกลับมา
        },
      },
      {
        $unwind: "$nutrDetails", // แตกก้อน nutrs
      },
      {
        $lookup: { // โฟกัสที่ triv_id เพื่อไปดึงข้อมูลจาก trivias มา join
          from: "trivias", // เปิดประตู trivias
          localField: "triv_id", // ส่งตัวแทนจากฝั่ง reports ไปเทียบ
          foreignField: "_id", // ตัวรับเทียบใน trivias
          as: "triviaDetails", // trivias ส่งข้อมูลก้อนกลับมา
        },
      },
      {
        $unwind: "$triviaDetails", // แตกก้อน trivias
      },
      {
        $project: { // เปิดการมองเห็นข้อมูลใน reports ทั้งหมดรวมถึงข้อมูลที่ join มา
          _id: 1,
          triv_id: 1,
          nutr_id: 1,
          note: 1,
          status: 1,
          notification: 1,
          createdAt: 1,
          updatedAt: 1,
          "nutrDetails.firstname": 1,
          "nutrDetails.lastname": 1,
          "nutrDetails.email": 1,
          "nutrDetails.image_profile": 1,
          "triviaDetails.head": 1,
          "triviaDetails.image": 1,
          "triviaDetails.content": 1,
          "triviaDetails.trivia_type": 1,
        },
      },
    ]);
    return res.json(reports);
  } catch (error) {
    console.error("Error fetching reports data", error);
    res.status(500).json({ message: "Failed to retrieve the reports" });
  }
});

// ดึงการรายงานเกร็ดความรู้มาแสดง 1 การรายงาน (Auth)
app.get("/report-detail/trivia/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid report ID" });
    }

    const reports = await myReport.aggregate([
      { 
        $match: { // เป็นการดึงเอา id ที่เราส่งมาพร้อม path มาเทียบกับอะไรสักอย่างใน myReport
          _id: new mongoose.Types.ObjectId(id) 
        } 
      },
      // ขั้นตอนนี้คือได้ก้อน report 1 ก้อน ที่มี id ตรงกันแล้ว
      {
        $lookup: { // โฟกัสที่ nutr_id เพื่อไปดึงข้อมูลจาก nutr มา join
          from: "nutrs", // เปิดประตู nutrs
          localField: "nutr_id", // ส่งตัวแทนจากฝั่ง reports ไปเทียบ
          foreignField: "_id", // ตัวรับเทียบใน nutrs
          as: "nutrDetails", // nutrs ส่งข้อมูลก้อนกลับมา
        },
      },
      {
        $unwind: "$nutrDetails", // แตกก้อน nutrs
      },
      {
        $lookup: { // โฟกัสที่ triv_id เพื่อไปดึงข้อมูลจาก trivias มา join
          from: "trivias", // เปิดประตู trivias
          localField: "triv_id", // ส่งตัวแทนจากฝั่ง reports ไปเทียบ
          foreignField: "_id", // ตัวรับเทียบใน trivias
          as: "triviaDetails", // trivias ส่งข้อมูลก้อนกลับมา
        },
      },
      {
        $unwind: "$triviaDetails", // แตกก้อน trivias
      },
      {
        $project: { // เปิดการมองเห็นข้อมูลใน reports ทั้งหมดรวมถึงข้อมูลที่ join มา
          _id: 1,
          triv_id: 1,
          nutr_id: 1,
          note: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          reminderDate: 1,
          "nutrDetails.firstname": 1,
          "nutrDetails.lastname": 1,
          "nutrDetails.email": 1,
          "nutrDetails.image_profile": 1,
          "triviaDetails.head": 1,
          "triviaDetails.image": 1,
          "triviaDetails.content": 1,
          "triviaDetails.trivia_type": 1,
        },
      },
    ]);
    return res.json(reports[0]); //กำกับว่าเอามาแค่ก้อนเดียว
  } catch (error) {
    console.error("Error fetching reports data", error);
    res.status(500).json({ message: "Failed to retrieve the reports" });
  }
});

// ดึงการรายงานกระทู้มาแสดง 1 การรายงาน (Auth)  ยังไม่เสร็จจจจ
app.get("/report-detail/topic/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received ID:", id);

    // ตรวจสอบความถูกต้องของ ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid report ID" });
    }

    const reports = await myReport.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) } 
      },
      {
        $lookup: {
          from: "users", // เปลี่ยนชื่อ collection ให้ถูกต้อง
          localField: "user_id", // field ที่เชื่อมโยงกับ user_id
          foreignField: "_id", // เชื่อมโยงกับ _id ของ users
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails", // แตกก้อน
      },
      {
        $lookup: {
          from: "topics", // ใช้ชื่อ collection ที่ถูกต้องสำหรับข้อมูลกระทู้
          localField: "content_id", // ใช้ content_id จาก myReport
          foreignField: "_id", // เชื่อมโยงกับ _id ใน topics
          as: "topicDetails",
        },
      },
      {
        $unwind: "$topicDetails", // แตกก้อน
      },
      {
        $project: {
          _id: 1,
          note: 1,
          status: 1,
          createdAt: 1,
          "userDetails.name": 1,
          "userDetails.email": 1,
          "topicDetails.title": 1,
          "topicDetails.image": 1,
          "topicDetails.detail": 1,
          "topicDetails.answer": 1, 
          "userDetails.image_profile": 1
        },
      },
    ]);

    if (reports.length === 0) {
      return res.status(404).json({ message: "ไม่พบรายงานที่มี ID นี้" });
    }

    return res.json(reports[0]);
  } catch (error) {
    console.error("Error fetching reports data", error);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลรายงานได้" });
  }
});

// อัปเดตสถานะของรายงาน, เกร็ดความรู้
app.put("/report/:id/trivia/status", async (req, res) => {
    const { id } = req.params;
    const { triv_id, status, reminderDate  } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ error: "Invalid report ID" });
        }

        let updatedReport;
        let updatedTrivia;

        if (status === 1) { 
            updatedReport = await myReport.findByIdAndUpdate( id, { status, reminderDate }, { new: true });
            updatedTrivia = await myTrivia.findByIdAndUpdate( triv_id, { isVisible: false, edit_deadline: reminderDate }, { new: true });
        } else if (status === 2) {
            updatedReport = await myReport.findByIdAndUpdate( id, { status, isDeleted: true }, { new: true });
        } else if (status === 3) {
            updatedReport = await myReport.findByIdAndUpdate( id, { status }, { new: true });
            updatedTrivia = await myTrivia.findByIdAndUpdate( triv_id, { isVisible: false, isDeleted: true }, { new: true });
        } else {
            console.log("Ststus is 0 or others")
        }

        // if (!updatedReport) {
        //     return res.status(404).send({ error: "Report not found" });
        // }

        // if (!updatedTrivia) {
        //     return res.status(404).send({ error: "Trivia not found" });
        // }
    
        res.status(200).send(updatedReport);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// อัปเดตสถานะของรายงานเป็น 0 (แอดมินรับเรื่อง)
app.put("/report/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status  } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ error: "Invalid report ID" });
        }

        const updatedReport = await myReport.findByIdAndUpdate( id, { status }, { new: true });

        if (!updatedReport) {
            return res.status(404).send({ error: "Report not found" });
        }

        res.status(200).send(updatedReport);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// สร้างการแจ้งเตือน
app.post("/report/trivia/notification", async (req, res) => {
    const { report_id, triv_id, title, note, status, nutr_id, reminderDate  } = req.body;
    
    try {
        const nutr = await myNutr.findOne({ "triv_owner.triv_id": triv_id });
    
        if (!nutr && !status) {
            return res.status(404).json({ message: "Owner of trivia not found" });
        }

        let noti = null;

        if (status === 0) {
            noti = new myNoti({
                report_id,
                triv_id, 
                recipients: [
                    {
                        nutr_id: nutr_id,
                        message: "ได้รับการรายงานของคุณแล้ว",
                        report_role: "reporter"
                    }
                ], 
                title, 
                note,
                status_report: status
            });
        } else if (status === 1) {
            noti = new myNoti({
                report_id,
                triv_id, 
                recipients: [
                    {
                        nutr_id: nutr_id,
                        message: "การรายงานของคุณถูกดำเนินการแล้ว กรุณาตรวจสอบ",
                        report_role: "reporter"
                    },
                    {
                        nutr_id: nutr._id,
                        message: "มีผู้รายงานเกร็ดความรู้ของคุณ กรุณาตรวจสอบ",
                        report_role: "reported"
                    }
                ], 
                title, 
                note, 
                reminderDate,
                status_report: status
            });
        } else if (status === 2) {
            noti = new myNoti({
                report_id,
                triv_id, 
                recipients: [
                    {
                        nutr_id: nutr_id,
                        message: "การรายงานของคุณถูกปฏิเสธ เนื่องด้วยไม่พบการละเมิด",
                        report_role: "reporter"
                    },
                ],
                title, 
                note,
                status_report: status
            });
        } else if (status === 3) {
            noti = new myNoti({
                report_id,
                triv_id, 
                recipients: [
                    {
                        nutr_id: nutr_id,
                        message: "การรายงานของคุณถูกดำเนินการแล้ว กรุณาตรวจสอบ",
                        report_role: "reporter"
                    },
                    {
                        nutr_id: nutr._id,
                        message: "เกร็ดความรู้ของคุณถูกลบ กรุณาตรวจสอบ",
                        report_role: "reported"
                    }
                ],
                title, 
                note,
                status_report: status
            });
        }
        
        if (noti) {
            await noti.save();
            return res.status(201).json({ message: "Notification created successfully" });
        } else {
            return res.status(400).json({ message: "Invalid status value" });
        }
        
    } catch (error) {
        console.log("Error creating notification", error);
        res.status(500).json({ message: "Error creating notification" });
    }
})

//ลบการรายงาน
app.delete("/report-detail/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const softDeletedReport = await myReport.findByIdAndUpdate(id, {
      isDeleted: true, 
    });

    if (!softDeletedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report soft deleted successfully" });
  } catch (error) {
    console.log("Error delete report", error);
    res.status(500).json({ message: "Error delete report" });
  }
});

//การแจ้งเตือนการรายงาน
// app.get("/report/notifications", async (req, res) => {
//   try {
//     const notifications = await myReport.find()
//       .populate("triv_id") 
//       .populate("content_id") 
//       .lean();
//       notifications.forEach((notification) => {
       
//     });
//     res.json(notifications);
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     res.status(500).json({ message: "Error fetching notifications" });
//   }
// });

app.get("/report/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid nutr ID" });
    }

    const notifications = await myNoti.aggregate([
      {
        $match: {
          "recipients.nutr_id": new mongoose.Types.ObjectId(id) ,
          isDeleted: false
        },
      },
      {
        $unwind: "$recipients", // แยก recipients ออกมา
      },
      {
        $match: { 
          "recipients.nutr_id": new mongoose.Types.ObjectId(id) // คัดกรองเฉพาะผู้ที่เกี่ยวข้อง
        }
      },
      {
        $lookup: {
          from: "nutrs",
          localField: "recipients.nutr_id",
          foreignField: "_id",
          as: "recipientNutr",
        },
      },
      {
        $unwind: "$recipientNutr",
      },
      {
        $project: {
          report_id: 1,
          triv_id: 1,
          title: 1,
          note: 1,
          status_report: 1,
          reminderDate: 1,
          role: "$recipients.report_role", // แสดงค่า report_role
          message: "$recipients.message", // แสดงข้อความ
          isRead: "$recipients.isRead",
          createdAt: 1,
          updatedAt: 1,
        }
      }
    ]) 

    if (!notifications.length) {
      return res.status(404).json({ message: "No notifications found for this nutr_id" });
    }

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

// ฟังก์ชันเพื่อตรวจสอบและลบเนื้อหาผู้เขียนที่ไม่มีการอัปเดตภายใน 3 วัน
app.put("/check-and-delete-expired-reports", async (req, res) => {
  try {
    // ดึงรายงานทั้งหมดที่มีการตั้งค่า reminderDate
    const reports = await myReport.find({ reminderDate: { $ne: null }, isDeleted: false });

    const now = new Date();

    for (let report of reports) {
      const reminderDate = new Date(report.reminderDate);

      // ถ้าเวลาผ่านไป 3 วันแล้วและยังไม่มีการอัปเดต updateAt
      if (now - reminderDate >= 3 * 24 * 60 * 60 * 1000) { // 3 วัน = 3 * 24 * 60 * 60 * 1000 ms
        if (!report.updateAt || new Date(report.updateAt).getTime() === reminderDate.getTime()) {
          // ลบรายงานที่ไม่ได้มีการอัปเดตภายใน 3 วัน
          await myReport.findByIdAndUpdate(report._id, { isDeleted: true });
        }
      }
    }

    res.status(200).send({ message: "Expired reports checked and deleted if necessary." });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
  
});
