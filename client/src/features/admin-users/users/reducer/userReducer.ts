import { UserAction } from "./userActions";
import { USER_TYPES } from "./userReducerTypes";
import { initialStateUser } from "./userStates";

export const userReducer = (state = initialStateUser, action: UserAction) => {
  switch (action.type) {
    case USER_TYPES.listOfUsers:
      // Retorno el nuevo estado
      return action.payload && "data" in action.payload ? [...action.payload.data] : state;

    case USER_TYPES.editUser:
      // Actualizo el usuario
      if (action.payload && "userId" in action.payload) {
        const { userId, ...rest } = action.payload;
        return state.map((user) => (user.userId === userId ? { ...user, ...rest } : user));
      }
      return state;

    default:
      return state;
  }
};
