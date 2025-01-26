import { User } from "../../users/entities/user.entity";

export const formatUserResponseForLogin = (user: User) => ({
  id: user.userId,
  username: user.username,
  password: user.password
});