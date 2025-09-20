import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinery } from "../utils/cloudinary.js";
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
    throw new ApiError(500, "Something went wrong while gererating tokens!");
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
  const existeduser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existeduser) {
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

  //! upload them to cloudinery, avatar and coverImage
  const avatar = await uploadOnCloudinery(avatarLocalPath);
  const coverImage = await uploadOnCloudinery(coverImageLocalPath);

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
  //! get user credintials form frontend
  const { username, email, password } = req.body;

  //! validate - empty
  if (!(username || email || password))
    throw new ApiError(404, "All fieds are required!");

  //! check user in exists or not
  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (!user) throw new ApiError(404, "User does not Exits!");

  //! check password is correct or not
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid)
    throw new ApiError(401, "username or email or password is invalid!");

  //! generateAcceshToken and generateRefreshToken
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
  if (!user || !user.id) {
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
