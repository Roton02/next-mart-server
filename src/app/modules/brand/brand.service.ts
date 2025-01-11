import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/appError";
import { IImageFile } from "../../interface/IImageFile";
import { IJwtPayload } from "../auth/auth.interface";
import { IBrand } from "./brand.interface";
import { Brand } from "./brand.model";
import { UserRole } from "../user/user.interface";


const createBrand = async (
  brandData: Partial<IBrand>,
  logo: IImageFile,
  authUser: IJwtPayload
) => {

  if (logo && logo.path) {
    brandData.logo = logo.path
  }

  const brand = new Brand({
    ...brandData,
    createdBy: authUser.userId
  });

  const result = await brand.save();

  return result;
};

const getAllBrand = async (query: Record<string, unknown>) => {
  const brandQuery = new QueryBuilder(
    Brand.find(),
    query,
  )
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await brandQuery.modelQuery;
  const meta = await brandQuery.countTotal();


  return {
    meta,
    result
  };
};

const updateBrandIntoDB = async (
  id: string,
  payload: Partial<IBrand>,
  file: IImageFile,
  authUser: IJwtPayload
) => {
  const isBrandExist = await Brand.findById(id);
  if (!isBrandExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Brand not found!")
  }

  if ((authUser.role === UserRole.VENDOR) && (isBrandExist.createdBy.toString() !== authUser.userId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "You are not able to edit the category!")
  }

  if (file && file.path) {
    payload.logo = file.path
  }

  const result = await Brand.findByIdAndUpdate(
    id,
    payload,
    { new: true }
  );

  return result;
};


export const BrandService = {
  createBrand,
  getAllBrand,
  updateBrandIntoDB
}
