const express = require("express");
const methodOverride = require("method-override");

const app = express();
const multer = require("multer");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const engine = require("ejs-mate");
const {Project, Skill} = require("./models/project.js");
const User = require("./models/users.js");
const Contact = require("./models/contact.js");
const bcrypt = require("bcrypt");

require("dotenv").config();
const connectDB = require("./config/db");
connectDB();


app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")));
app.use(expressLayouts);
app.set("layout", "./layouts/boilerplate");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

//taking file in storage using multer

// Multer storage config:
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

//File filter (image only):
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};

// Create upload middleware:
const upload = multer({ storage, fileFilter });

//Serve Uploaded Images (VERY IMPORTANT)
app.use("/uploads", express.static("uploads"));

//STEP 3️⃣ Login + Session (How server remembers you) npm install express-session
const session = require("express-session");

app.use(session({
  secret: process.env.SECRET, 
  resave: false,
  saveUninitialized: false
}));

//🛡️ STEP 4️⃣ Authorization Middleware (MOST IMPORTANT)
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") {
    next();
  } else {
    res.status(403).send("Access denied");
  }
}

//Make session available to views
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next();
});

app.get("/home", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    const allskill = await Skill.find({});

    res.render("main/home.ejs", {
      projects,
      allskill,
      user: req.session.user
    });
  } catch (error) {
    console.error(error);
    res.send("Error loading home page");
  }
});

app.get("/login", (req, res) => {
  res.render("./authentications/login.ejs");
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 1. Check inputs
  if (!email || !password) {
    return res.send("Email or password missing");
  }

  // 2. Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.send("User not found");
  }

  // 3. Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.send("Invalid password");
  }

  // 4. Success
   req.session.user = {
    id: user._id,
    role: user.role,
    name: user.name,
  };
  res.redirect("/home");
});


app.post("/contact", async(req, res) => {
  const {name, email, message} = req.body;
  let newContact = await Contact.create({
    name,
    email,
    message
  });

  console.log(newContact);

  res.redirect("/home");

});

app.post("/addSkill", async(req, res) => {
  const {newSkill} = req.body;
  await Skill.create({
    newSkill
  });
  res.redirect("/home");
});

//Logout route
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/home");
  });
});



app.get("/signUp", (req, res) => {
  res.render("./authentications/signUp.ejs");
});

//Step 2: Signup Logic (Very Important Rule)
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    name,
    email,
    password: hashedPassword,
    role: "user" // NEVER admin
  });
  res.redirect("/login");
});



app.get("/addProject", isAdmin, (req, res) => {
  res.render("main/projects.ejs");
});

app.post("/addProject", upload.single("thumbnail"), isAdmin, async (req, res) => {
  try {
    const project = new Project({ ...req.body, thumbnail: req.file.filename, });

    await project.save();
    console.log("Saved project with image:", project);

    res.redirect("/home");
  } catch (error) {
    console.error(error);
    res.send("Error saving project");
  }
});

app.get("/:id/editProjects", isAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Project.findById(id).sort({ createdAt: -1 });
    res.render("main/Edit.ejs", { project });
  } catch (error) {
    console.error(error);
    res.send("Error loading home page");
  }
});

app.put("/:id/addProject", isAdmin, upload.single("thumbnail"), async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id)
    const project = await Project.findByIdAndUpdate(id, { ...req.body, thumbnail: req.file.filename, }, { new: true });
    await project.save();
    console.log(req.file.filename);
    console.log("saved");
    res.redirect("/home");
  } catch (error) {
    console.error(error);
    res.send("Error loading home page");
  }
});


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server is listening!!");
});