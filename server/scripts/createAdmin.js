const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    const email = "admin@skillbridge.com";
    const password = "Admin@12345";

    const existingAdmin = await User.findOne({
      email,
    });

    if (existingAdmin) {
      if (existingAdmin.role === "admin") {
        console.log(
          "Admin account already exists."
        );
      } else {
        console.log(
          "A user with this email already exists."
        );
        console.log(
          "Please use a different admin email."
        );
      }

      await mongoose.connection.close();
      return;
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: "SkillBridge Admin",
      email,
      password: hashedPassword,
      role: "admin",
      college: "",
      branch: "",
      cgpa: 0,
      skills: [],
      linkedin: "",
      github: "",
      leetcode: "",
    });

    console.log(
      "\n================================"
    );

    console.log(
      "Admin account created successfully!"
    );

    console.log(
      "================================"
    );

    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${password}`);
    console.log(`Role: ${admin.role}`);

    console.log(
      "================================\n"
    );

    await mongoose.connection.close();
  } catch (error) {
    console.error(
      "Create Admin Error:",
      error.message
    );

    process.exit(1);
  }
};

createAdmin();