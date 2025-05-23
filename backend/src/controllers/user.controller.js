import { User } from "../models/user.model.js";
import { mockAadharDB } from "../mockAadhaarDB.js";
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
  const aadhaarRecord = mockAadharDB.find(
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

const registeruser = async (req, res) => {
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
    aadhaar_number,
    pan_number,
  });

  const createdUser = await User.findById(user._id).select("-password");

  return res.status(201).json(createdUser);
};

export default registeruser;
