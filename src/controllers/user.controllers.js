import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinery } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerUser = asyncHandler(async (req, res) => {
  // get user details form frontend
  //validation - not empty
  // check if user already exists: username and email
  // check for images, cjeck for avatar
  //upload tem to cloudinery, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullName, username, email, password } = req.body;
  // if (fullName === "") {
  //   throw new ApiError(400, "Full Name is Required");
  // }
  if (
    [fullName, username, email, password].some((field) => field?.trim() == "")
  ) {
    throw new ApiError(400, "all field are required!");
  }

  const existeduser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existeduser) {
    throw new ApiError(409, "User already exists with email or username!");
  }

  const avatarLocalPath = req.files?.avatar[0].path;
  const coverImageLocalPath = req.files?.coverImage[0].path;

  if (!avatarLocalPath) throw new ApiError(404, "avatar image is required!");

  const avatar = await uploadOnCloudinery(avatarLocalPath);
  const coverImage = await uploadOnCloudinery(coverImageLocalPath);

  if (!avatar) throw new ApiError(404, "avatar image is required!");

  const createdUser = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.trim().toLowerCase(),
  });
  const isCreated = await User.findById(createdUser._id).select(
    "-password -refreshToken"
  );

  if (!isCreated) {
    throw new ApiError(500, "Something went wrong while creating a user!");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User Created Successfully."));
});
