import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const veryfyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized requst!");
    }

    const decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedData?._id).select(
      "-password -refreshToken"
    );

    if (!user) throw new ApiError(401, "Invalid Access Token!");

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid Access Token");
  }
});
