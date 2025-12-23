export const SendResponse = (
  res,
  statusCode = 200,
  flag = true,
  message = "",
  data = {}
) => {
  try {
    return res.status(statusCode).json({
      code: statusCode,
      success: flag,
      message,
      data,
    });
  } catch (error) {
    console.error(error);
  }
};
