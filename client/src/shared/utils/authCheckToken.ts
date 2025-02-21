import { jwtDecode } from "jwt-decode";

export const checkTokenExpiration = (token: string): Promise<string> => {
  return new Promise((resolve) => {
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      const expirationTime = decoded?.exp * 1000; // conversión a milisegundos
      const now = Date.now() + 2000;

      const timer = setTimeout(() => resolve("expired"), expirationTime - now);
      if (expirationTime <= now) clearTimeout(timer);
    } catch (error) {
      console.log("Error in verification of token expiration, details: ", error);
      resolve("expired");
    }
  });
};
