import mongoose from "mongoose";
import validateor from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const institutionSchema = mongoose.Schema(
  {
    // Basic Institution Details
    institution_name: {
      type: String,
      required: [true, "Institution name is required"],
      trim: true,
      index: true,
    },
    institution_type: {
      type: String,
      enum: [
        "private_company",
        "public_company",
        "partnership",
        "proprietorship",
        "trust",
        "society",
        "ngo",
        "government",
      ],
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate: [validateor.isEmail, "Invalid email address"],
    },
    phone_number: {
      type: Number,
      required: true,
      unique: true,
    },

    // Institution Registration Details
    registration_details: {
      registration_number: {
        type: String,
        required: true,
        unique: true,
      },
      registration_date: {
        type: Date,
        required: true,
      },
      registration_authority: {
        type: String,
        required: true,
      },
      cin_number: {
        type: String,
        sparse: true,
      },
      gstin: {
        type: String,
        required: true,
      },
      pan_number: {
        type: String,
        required: true,
        trim: true,
      },
    },

    registered_address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: "India" },
      required: true,
    },

    // Authorized Representatives
    authorized_representatives: [
      {
        name: { type: String, required: true },
        designation: { type: String, required: true },
        aadhaar_number: { type: String, required: true },
        pan_number: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        is_primary: { type: Boolean, default: false },
      },
    ],

    annual_turnover: {
      type: Number,
      required: true,
    },
    employee_count: {
      type: Number,
      required: true,
    },

    kyc_status: {
      type: String,
      enum: [
        "pending",
        "under_review",
        "approved",
        "rejected",
        "additional_docs_required",
      ],
      default: "pending",
    },

    onekyc_institution_passport: {
      type: String,
      unique: true,
      sparse: true,
    },

    kyc_approved_date: {
      type: Date,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

institutionSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

institutionSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

institutionSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      institution_name: this.institution_name,
      type: "institution",
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

institutionSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

export const Institution = mongoose.model("Institution", institutionSchema);
