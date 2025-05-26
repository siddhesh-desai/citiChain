const accountSchema = mongoose.Schema(
  {
    account_number: {
      type: String, // Changed from Number to String for better handling
      required: true,
      unique: true,
    },
    bank_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
      required: true,
    },
    bank_name: {
      type: String,
      required: true,
    },
    account_type: {
      type: String,
      required: true,
      enum: ["savings", "current", "fixed_deposit", "salary"],
    },

    account_status: {
      type: String,
      enum: ["active", "inactive", "frozen", "closed"],
      default: "inactive",
    },
    branch_code: {
      type: String,
      required: true,
    },
    ifsc_code: {
      type: String,
      required: true,
    },
    opened_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model("Account", accountSchema);
