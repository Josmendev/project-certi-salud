import { User } from "../../users/entities/user.entity";

export const formatUserResponseForLogin = (user: User) => ({
  username: user.username,
  password: user.password
});