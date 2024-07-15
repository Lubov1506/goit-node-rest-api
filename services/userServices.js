import { User } from "../db/models/User.js";

export const findUser = filter => User.findOne(filter);
export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);
export const register = data => User.create(data);
