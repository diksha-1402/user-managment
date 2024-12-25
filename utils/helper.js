import constants from "./constants.js";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import moment from "moment";
import jwt from "jsonwebtoken";

const passwordCompare = async (password, savedPassword) => {
  return await bcrypt.compare(password, savedPassword);
};

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(constants.CONST_GEN_SALT);
  password = await bcrypt.hash(password, salt);
  return password;
};

const getAdminDetails = async () => {
  return await userModel.findOne({ role: constants.CONST_ROLE_ADMIN });
};

const removeBackSlashes = (value) => {
  return value.replace(/\//g, "");
};

const returnTrueResponse = async (
  req,
  res,
  statusCode,
  message,
  arr,
  totalCounts,
  unreadCount
) => {
  return res.status(statusCode).json({
    version: {
      current_version: constants.CONST_APP_VERSION,
      major_update: 0,
      minor_update: 0,
      message: "App is Up to date",
    },
    success: 1,
    message: message,
    data: arr,
    totalCounts: totalCounts,
    unreadCount: unreadCount,
  });
};

const returnFalseResponse = (
  req,
  res,
  statusCode,
  message,
  arr,
  error_code
) => {
  return res.status(statusCode).json({
    version: {
      current_version: constants.CONST_APP_VERSION,
      major_update: 0,
      minor_update: 0,
      message: "App is Up to date",
    },
    success: 0,
    message: message,
    data: arr,
    error_code: error_code,
  });
};

const validationErrorConverter = (logs) => {
  let error;
  for (let i = 0; i <= Object.values(logs.errors).length; i++) {
    error = Object.values(logs.errors)[0].message;
    break;
  }
  return error;
};

const joiValidationErrorConvertor = async (errors) => {
  let error_message = "";
  errors.forEach((element, index) => {
    error_message = element.message;
    return true;
  });
  error_message = error_message.replaceAll("/", " ");
  error_message = error_message.replaceAll("_", " ");
  return error_message;
};

const jwtToken = async (userData) => {
  const secretKey = process.env.JWT_TOKEN_KEY;
  const user = {
    id: userData._id,
    email: userData.email,
    role: userData.role,
  };
  const token = jwt.sign(user, secretKey);
  return token;
};

const generatePassword = async (firstName, lastName, mobileNumber) => {
  const part1 = firstName.slice(0, 3).toUpperCase();
  const part2 = lastName.slice(0, 2).toLowerCase();
  const part3 = mobileNumber.slice(-3);
  const random = String(Math.floor(10 + Math.random() * 90));
  // Combine the parts and return the result
  const password = part1 + part2 + part3 + random;
  return password;
};

let helper = {
  passwordCompare: passwordCompare,
  encryptPassword: encryptPassword,
  removeBackSlashes: removeBackSlashes,
  returnTrueResponse: returnTrueResponse,
  returnFalseResponse: returnFalseResponse,
  validationErrorConverter: validationErrorConverter,
  joiValidationErrorConvertor: joiValidationErrorConvertor,
  jwtToken: jwtToken,
  getAdminDetails: getAdminDetails,
  generatePassword: generatePassword,
};

export default helper;
