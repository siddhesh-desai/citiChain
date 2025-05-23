import { User } from "../models/user.model.js";
import { mockAadhaarDB } from "../db/mockAadhaarDB.js";
import { mockPanDB } from "../db/mockPanDB.js";

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  return age;
};

const verifyAadhaar = (aadhaar_number, user__dob, fullname, pan_number) => {
  const aadhaarRecord = mockAadhaarDB.find(
    (record) =>
      record.aadhaar_number === aadhaar_number &&
      record.fullname === fullname &&
      record.dob === user__dob &&
      record.linked_pan === pan_number
  );

  if (aadhaarRecord) {
    return { verified: true, message: "Aadhaar verified successfully" };
  } else {
    return { verified: false, message: "Aadhaar verificaton failed" };
  }
};

const verifyPan = (pan_number, fullname, user_dob) => {
  const panRecord = mockPanDB.find(
    (record) =>
      record.pan_number === pan_number &&
      record.fullname === fullname &&
      record.dob === user_dob
  );

  if (panRecord) {
    return { verified: true, message: "Pan verified successfully" };
  } else {
    return { verified: false, message: "Pan verification failed" };
  }
};

export const registerUser = async (req, res) => {
  // get user details from frontend
  // validation- not empty
  // check if user already exists- email, username
  //check the the user eligible to use banking service
  // verify adhar and pan card
  // generate passport number
  // create user object
  // check for user creation
  // send response

  const {
    fullname,
    email,
    password,
    username,
    user_dob,
    phone_number,
    aadhaar_number,
    pan_number,
    user_type,
  } = req.body;

  // validation

  if (
    [
      fullname,
      email,
      password,
      username,
      user_dob,
      phone_number,
      aadhaar_number,
      pan_number,
      user_type,
    ].some((field) => !field || field.trim() === "")
  ) {
    throw new Error("All fields are required");
  }

  // check if user already exists
  const existedUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existedUser) {
    throw new Error("User already exists");
  }

  // check the user eligible to use banking service
  const user_age = calculateAge(user_dob);

  if (user_age < 18) {
    throw new Error("User must be 18 years old to use banking service");
  }

  // verify adhar and pan card

  const aadhaar_verification = verifyAadhaar(
    aadhaar_number,
    user_dob,
    fullname,
    pan_number
  );

  if (!aadhaar_verification.verified) {
    throw new Error(aadhaar_verification.message);
  }

  const pan_verification = verifyPan(pan_number, fullname, user_dob);
  if (!pan_verification.verified) {
    throw new Error(pan_verification.message);
  }

  // generate a passport number

  // create user object

  const user = await User.create({
    fullname,
    email,
    password,
    username: username.toLowerCase(),
    user_dob,
    phone_number,
    goverment_ids: {
      aadhaar_number,
      pan_number,
    },
    user_type,
  });

  const createdUser = await User.findById(user._id).select("-password");

  return res.status(201).json(createdUser);
};

export const getUserByID = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return res.status(200).json(user);
};
