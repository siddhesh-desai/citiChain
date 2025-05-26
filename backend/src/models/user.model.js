import mongoose from "mongoose";
import validateor from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "full name is required"],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate: [validateor.isEmail, "Invalid email address"],
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    phone_number: {
      type: Number,
      required: true,
      unique: true,
    },
    user_dob: {
      type: Date,
      required: true,
      trim: true,
      validate: [validateor.isDate, "Invalid date of birth"],
    },

    user_type: {
      type: String,
      default: "individual",
    },
    accounts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
    ],
    goverment_ids: {
      aadhaar_number: {
        type: String,
        required: [true, "adhar is required"],
        trim: true,
      },
      pan_number: {
        type: String,
        required: [true, "pan is required"],
        trim: true,
      },
    },
    live_photo: {
      type: String,
      required: true,
    },

    signature: {
      type: String,
      required: true,
    },

    kyc_status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    passport_number: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },

    oneKYC_user_passport: {
      type: String,
      unique: true,
      sparse: true,
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
