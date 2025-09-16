const asyncHandler = (requesHandler) => (req, res, next) =>
  Promise.resolve(requesHandler(req, res, next)).catch((err) => next(err));

export { asyncHandler };

// const asyncHandler = () => {};
// const asyncHandler = (fn) => () => {};
// const asyncHandler = (fn) => async () => {};

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {

//     } catch (error) {

//     }
// };
