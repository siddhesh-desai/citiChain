import { User } from "../models/user.model.js";
import { BankUser } from "../models/bankuser.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { BANK_USER_ID } from "../constants.js";

// Generate unique account number
const generateAccountNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `ACC${timestamp.slice(-6)}${random}`;
};

// Generate IFSC code (example format)
const generateIFSCCode = (branchCode) => {
  return `CITI0${branchCode}`;
};

const openBankAccount = asyncHandler(async (req, res) => {
  // Step 1: Get passport number from request
  const { oneKYC_user_passport } = req.params;

  if (!oneKYC_user_passport) {
    throw new ApiError(400, "KYC passport number is required");
  }

  // Step 2: Check if user exists with approved KYC and valid passport
  const user = await User.findOne({
    oneKYC_user_passport,
    kyc_status: "approved",
  }).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found or KYC not approved");
  }

  // Step 3: Check if user already has a bank account
  const existingBankAccount = await BankUser.findOne({
    user_id: user._id,
  });

  if (existingBankAccount) {
    throw new ApiError(400, "User already has a bank account");
  }

  // Step 4: Get additional details from request body
  const {
    account_type,
    initial_deposit,
    monthly_income,
    employment_type,
    employer_name,
    current_address,
    branch_code,
    terms_accepted,
  } = req.body;

  // Step 5: Validate required fields
  if (
    !initial_deposit ||
    !monthly_income ||
    !employment_type ||
    !current_address ||
    !branch_code ||
    !terms_accepted
  ) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Step 6: Validate minimum deposit
  if (initial_deposit < 1000) {
    throw new ApiError(400, "Minimum initial deposit is ₹1000");
  }

  // Step 7: Generate account details
  const account_number = generateAccountNumber();
  const ifsc_code = generateIFSCCode(branch_code);

  // Step 8: Create bank account
  const bankAccount = await BankUser.create({
    user_id: user._id,
    oneKYC_user_passport,
    account_number,
    account_type: account_type || "savings",
    branch_code,
    ifsc_code,
    initial_deposit,
    monthly_income,
    employment_type,
    employer_name,
    current_address,
    current_balance: initial_deposit,
    account_status: "active",
    account_opened_date: new Date(),
    terms_accepted,
  });

  // Step 9: Populate user details in response
  const bankAccountWithUser = await BankUser.findById(bankAccount._id).populate(
    "user_id",
    "fullname email  phone_number user_dob goverment_ids"
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        bankAccount: bankAccountWithUser,
        kycDetails: {
          fullname: user.fullname,
          email: user.email,
          phone_number: user.phone_number,
          user_dob: user.user_dob,
          aadhaar_number: user.goverment_ids.aadhaar_number,
          pan_number: user.goverment_ids.pan_number,
        },
      },
      "Bank account opened successfully"
    )
  );
});

//get bank user details

const getBnakUserById = asyncHandler(async (req, res) => {
  const bankUserId = BANK_USER_ID;

  if (!bankUserId) {
    throw new ApiError(400, "Bank user ID is required");
  }
  const bankUser = await BankUser.findById(bankUserId);
  if (!bankUser) {
    throw new ApiError(404, "Bank user not found");
  }
  return res.status(200).json(bankUser);
});

export { openBankAccount, getBnakUserById };
