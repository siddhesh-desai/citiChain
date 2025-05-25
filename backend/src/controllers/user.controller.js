import { User } from "../models/user.model.js";
import { mockAadhaarDB } from "../db/mockAadhaarDB.js";
import { mockPanDB } from "../db/mockPanDB.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userID) => {
  try {
    const user = await User.findById(userID);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

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

const registerUser = async (req, res) => {
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

const loginUser = asyncHandler(async (req, res) => {
  //req body = data
  //set username or email
  ///check if the username or email is present
  //check if password is correct
  //generate access token and refresh token
  //set refresh token in cookie

  const { email, password } = req.body;

  if (!email && !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = { httpOnly: true, secure: true }; // for sending cookie and making it modifiable only by server

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { loggedInUser, accessToken, refreshToken }, // not sending refresh token in response everytime, but in case if user want to save these then he can save it in local storage or can be usefull in case of building mobile app
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //clear cookies
  //clear refresh token from database
  //return response
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },

    {
      new: true,
    }
  );

  const options = { httpOnly: true, secure: true };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  //get refresh token from cookie
  //verify refresh token
  //generate new access token
  //return response

  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || reqbody.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(
        401,
        "unauthorized request - Refresh token is required"
      );
    }
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "unauthorized request - Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(
        401,
        "unauthorized request - refresh token expired or used "
      );
    }
    const options = { httpOnly: true, secure: true };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("newRefreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message, "invalid refresh token");
  }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
