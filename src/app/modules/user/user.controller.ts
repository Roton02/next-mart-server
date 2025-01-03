import { Request, Response } from 'express';
import { UserServices } from './user.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { IImageFile } from '../../interface/IImageFile';

const registerUser = catchAsync(async (req: Request, res: Response) => {

  const result = await UserServices.registerUser(
    req.body
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User created succesfully',
    data: result,
  });
});

const registerVendor = catchAsync(async (req: Request, res: Response) => {

  const result = await UserServices.registerVendor(
    req.body,
    req.file as IImageFile
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Vendor created succesfully',
    data: result,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUser(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Users are retrieved succesfully',
    meta: result.meta,
    data: result.result,
  });
});

export const UserController = {
  registerUser,
  getAllUser,
  registerVendor
}