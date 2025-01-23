import { User } from "../entities/user.entity";

export const formatUserResponseWithLogin = (user: User) => ({
  username: user.username,
  password: user.password
});