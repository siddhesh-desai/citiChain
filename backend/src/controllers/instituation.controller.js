import { Institution } from "../models/institution.model.js";
import { mockInstitutionDB } from "../db/mockInstitutionDB.js"; // You'll need to create this
import bcrypt from "bcrypt";

const generateInstitutionPassport = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `INST${timestamp}${random}`.toUpperCase();
};

const verifyInstitutionDocuments = (
  registration_number,
  pan_number,
  gstin,
  institution_name
) => {
  // Mock verification for institution documents
  // In real implementation, this would call government APIs
  const institutionRecord = mockInstitutionDB?.find(
    (record) =>
      record.registration_number === registration_number &&
      record.pan_number === pan_number &&
      record.gstin === gstin &&
      record.institution_name === institution_name
  );

  if (institutionRecord) {
    return {
      verified: true,
      message: "Institution documents verified successfully",
    };
  } else {
    return {
      verified: false,
      message: "Institution document verification failed",
    };
  }
};

const verifyAuthorizedRepresentative = (representative) => {
  // Verify representative's Aadhaar and PAN
  // This could use the same mock databases as user verification
  return { verified: true, message: "Representative verified successfully" };
};

// Mock KYC approval
export const registerInstitution = async (req, res) => {
  try {
    const {
      institution_name,
      institution_type,
      email,
      password,
      phone_number,
      registration_details,
      registered_address,
      authorized_representatives,
      annual_turnover,
      employee_count,
    } = req.body;

    // Validation - check required fields
    if (
      [
        institution_name,
        institution_type,
        email,
        password,
        phone_number,
        registration_details?.registration_number,
        registration_details?.pan_number,
        registration_details?.gstin,
        annual_turnover,
        employee_count,
      ].some(
        (field) => !field || (typeof field === "string" && field.trim() === "")
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Check if institution already exists
    const existingInstitution = await Institution.findOne({
      $or: [
        { email },
        {
          "registration_details.registration_number":
            registration_details.registration_number,
        },
        { "registration_details.gstin": registration_details.gstin },
        { "registration_details.pan_number": registration_details.pan_number },
      ],
    });

    if (existingInstitution) {
      return res.status(400).json({
        success: false,
        message:
          "Institution already exists with provided email, registration number, GSTIN, or PAN",
      });
    }

    // Verify institution documents
    const documentVerification = verifyInstitutionDocuments(
      registration_details.registration_number,
      registration_details.pan_number,
      registration_details.gstin,
      institution_name
    );

    if (!documentVerification.verified) {
      return res.status(400).json({
        success: false,
        message: documentVerification.message,
      });
    }

    // Verify authorized representatives
    if (authorized_representatives && authorized_representatives.length > 0) {
      for (const representative of authorized_representatives) {
        const repVerification = verifyAuthorizedRepresentative(representative);
        if (!repVerification.verified) {
          return res.status(400).json({
            success: false,
            message: `Representative verification failed: ${representative.name}`,
          });
        }
      }

      // Ensure at least one primary representative
      const primaryRep = authorized_representatives.find(
        (rep) => rep.is_primary
      );
      if (!primaryRep) {
        authorized_representatives[0].is_primary = true;
      }
    }

    // Generate OneKYC passport for institution
    const onekyc_institution_passport = generateInstitutionPassport();

    // Create institution
    const institution = await Institution.create({
      institution_name,
      institution_type,
      email,
      password,
      phone_number,
      registration_details,
      registered_address,
      authorized_representatives: authorized_representatives || [],
      annual_turnover,
      employee_count,
      kyc_status: "approved", // Auto-approve for demo, change to "pending" for real implementation
      onekyc_institution_passport,
      kyc_approved_date: new Date(),
    });

    const createdInstitution = await Institution.findById(
      institution._id
    ).select("-password -refreshToken");

    return res.status(201).json({
      success: true,
      message: "Institution registered and KYC completed successfully",
      data: {
        onekyc_passport: onekyc_institution_passport,
        institution: createdInstitution,
      },
    });
  } catch (error) {
    console.error("Institution registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during institution registration",
    });
  }
};
// verify institution kyc
export const verifyInstitutionKYC = async (req, res) => {
  try {
    const { onekyc_institution_passport } = req.body;

    if (!onekyc_institution_passport) {
      return res.status(400).json({
        success: false,
        message: "OneKYC institution passport is required",
      });
    }

    const institution = await Institution.findOne({
      onekyc_institution_passport,
      kyc_status: "approved",
    }).select("-password -refreshToken");

    if (!institution) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: "Invalid or unverified institution OneKYC passport",
      });
    }

    return res.status(200).json({
      success: true,
      verified: true,
      data: {
        institution_name: institution.institution_name,
        institution_type: institution.institution_type,
        email: institution.email,
        phone_number: institution.phone_number,
        registration_details: institution.registration_details,
        registered_address: institution.registered_address,
        kyc_status: institution.kyc_status,
        kyc_approved_date: institution.kyc_approved_date,
        onekyc_institution_passport: institution.onekyc_institution_passport,
      },
    });
  } catch (error) {
    console.error("Institution KYC verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during KYC verification",
    });
  }
};

// Get instituatiob by id
export const getInstitutionById = async (req, res) => {
  try {
    const { id } = req.params;

    const institution = await Institution.findById(id).select(
      "-password -refreshToken"
    );

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: "Institution not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: institution,
    });
  } catch (error) {
    console.error("Get institution error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// update KYC status
export const updateInstitutionKYCStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { kyc_status, rejection_reason } = req.body;

    const validStatuses = [
      "pending",
      "under_review",
      "approved",
      "rejected",
      "additional_docs_required",
    ];

    if (!validStatuses.includes(kyc_status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid KYC status",
      });
    }

    const updateData = { kyc_status };

    if (kyc_status === "approved") {
      updateData.kyc_approved_date = new Date();
      // Generate passport if not exists
      const institution = await Institution.findById(id);
      if (!institution.onekyc_institution_passport) {
        updateData.onekyc_institution_passport = generateInstitutionPassport();
      }
    }

    if (kyc_status === "rejected" && rejection_reason) {
      updateData.rejection_reason = rejection_reason;
    }

    const updatedInstitution = await Institution.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select("-password -refreshToken");

    if (!updatedInstitution) {
      return res.status(404).json({
        success: false,
        message: "Institution not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Institution KYC status updated successfully",
      data: updatedInstitution,
    });
  } catch (error) {
    console.error("Update KYC status error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//login institution
export const loginInstitution = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const institution = await Institution.findOne({ email });

    if (!institution) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await institution.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = institution.generateAccessToken();
    const refreshToken = institution.generateRefreshToken();

    institution.refreshToken = refreshToken;
    await institution.save({ validateBeforeSave: false });

    const loggedInInstitution = await Institution.findById(
      institution._id
    ).select("-password -refreshToken");

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "Institution logged in successfully",
        data: {
          institution: loggedInInstitution,
          accessToken,
          refreshToken,
        },
      });
  } catch (error) {
    console.error("Institution login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
};

//logout institution
export const logoutInstituation = asyncHandler(async (req, res) => {
  //clear cookies
  //clear refresh token from database
  //return response
  await Institution.findByIdAndUpdate(
    req.institution._id,
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
    .json(new ApiResponse(200, {}, "Institution logged out successfully"));
});
