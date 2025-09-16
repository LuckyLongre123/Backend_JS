import { asyncHandler } from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  console.log(req.url);
  return res.status(200).json({
    message: "OK",
  });
});
