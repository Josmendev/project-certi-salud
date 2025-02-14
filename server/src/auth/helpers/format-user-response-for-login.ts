import { User } from '../../users/entities/user.entity';

export const formatUserResponseForLogin = (user: User) => ({
  userId: user.userId,
  username: user.username,
  isConfirm: user.isConfirm,
});
