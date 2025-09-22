import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens!");
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  //! get user details form frontend
  if (!req.body) throw new ApiError(400, "all field are required!");
  const { fullName, username, email, password } = req.body;

  //! validation - not empty
  if (
    [fullName, username, email, password].some((field) => field?.trim() == "")
  ) {
    throw new ApiError(400, "all field are required!");
  }

  //! check if user already exists: username and email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists with email or username!");
  }

  //! check for images, check for avatar
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0].path;

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    coverImageLocalPath = req.files?.coverImage[0].path;
  }

  if (!avatarLocalPath) throw new ApiError(404, "avatar image is required!");

  //! upload them to cloudinary, avatar and coverImage
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) throw new ApiError(404, "avatar image is required!");

  //! create user object - create entry in db
  const createdUser = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  //! remove password and refresh token field from response
  const isCreated = await User.findById(createdUser._id).select(
    "-password -refreshToken"
  );

  //! check for user creation
  if (!isCreated) {
    throw new ApiError(500, "Something went wrong while creating a user!");
  }

  //! return res
  return res
    .status(201)
    .json(new ApiResponse(201, isCreated, "User Created Successfully."));
});

export const loginUser = asyncHandler(async (req, res) => {
  //! get user credentials form frontend
  const { username, email, password } = req.body;

  //! validate - empty
  if (!(username || email || password))
    throw new ApiError(404, "All fields are required!");

  //! check user in exists or not
  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (!user) throw new ApiError(404, "User does not Exits!");

  //! check password is correct or not
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid)
    throw new ApiError(401, "username or email or password is invalid!");

  //! generateAccessToken and generateRefreshToken
  const { accessToken, refreshToken } = await generateTokens(user._id);
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //! send into secure cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user loggedIn successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out."));
});

export const refreshAccessToken = async (req, res) => {
  const frontendRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!frontendRefreshToken) {
    return res
      .status(401)
      .json({ message: "No refresh token found. Please login again." });
  }

  let decodedData;
  try {
    decodedData = jwt.verify(
      frontendRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired refresh token. Please login again.",
    });
  }

  const user = await User.findById(decodedData._id);
  if (!user || !user._id) {
    return res
      .status(401)
      .json({ message: "User not found. Invalid refresh token." });
  }

  if (frontendRefreshToken !== user.refreshToken) {
    return (
      res.status(401).js *
      on({
        message: "Refresh token expired or already used. Please login again.",
      })
    );
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
    user._id
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json({
      status: 200,
      message: "Tokens successfully refreshed.",
      data: { accessToken, refreshToken: newRefreshToken },
    });
};

export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!(oldPassword || newPassword)) {
    throw new ApiError(400, "all field are required!");
  }

  const user = await User.findById(req?.user?._id);
  const isCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isCorrect) {
    throw new ApiError(400, "Invalid old password!");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully."));
});

export const getCurrentUser = asyncHandler(async (req, res) =>
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully."))
);

export const updateUserDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!(fullName || email)) throw new ApiError(400, "All fields are required!");

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { fullName, email },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User details updated successfully."));
});

export const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarPath = req.file?.path;
  if (!avatarPath) throw new ApiError(400, "Avatar file is required!");

  const uploadedFile = await uploadOnCloudinary(avatarPath);
  if (!uploadedFile.url)
    throw new ApiError(400, "Error while uploading on cloudinary!");

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: uploadedFile.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res.status(200, user, "Avatar image updated successfully.");
});

export const updateUserCoverImage = asyncHandler(async (req, res) => {
  const thumbnailPath = req.file?.path;
  if (!thumbnailPath) throw new ApiError(400, "Cover image file is required!");

  const uploadedFile = await uploadOnCloudinary(thumbnailPath);
  if (!uploadedFile.url)
    throw new ApiError(400, "Error while uploading on cloudinary!");

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: uploadedFile.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res.status(200, user, "Cover image updated successfully.");
});
