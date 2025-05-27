import mongoose from "mongoose";

const bankUserSchema = mongoose.Schema(
  {
    // Reference to the main user
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // KYC passport number (from User model)
    oneKYC_user_passport: {
      type: String,
      required: true,
      unique: true,
    },

    // Bank account specific details
    account_number: {
      type: String,
      required: true,
      unique: true,
    },

    account_type: {
      type: String,
      enum: ["savings", "current", "salary"],
      default: "savings",
    },

    branch_code: {
      type: String,
      required: true,
    },

    ifsc_code: {
      type: String,
      required: true,
    },

    // Additional bank account opening details
    initial_deposit: {
      type: Number,
      required: true,
      min: 1000, // Minimum deposit requirement
    },

    monthly_income: {
      type: Number,
      required: true,
    },

    employment_type: {
      type: String,
      enum: ["salaried", "self_employed", "business", "retired", "student"],
      required: true,
    },

    employer_name: {
      type: String,
      required: function () {
        return this.employment_type === "salaried";
      },
    },

    // Address details (separate from KYC)
    current_address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: "India" },
    },

    // Account status
    account_status: {
      type: String,
      enum: ["pending", "active", "suspended", "closed"],
      default: "pending",
    },

    // Balance
    current_balance: {
      type: Number,
      default: 0,
    },

    // Account opening date
    account_opened_date: {
      type: Date,
    },

    // Terms acceptance
    terms_accepted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export const BankUser = mongoose.model("BankUser", bankUserSchema);
