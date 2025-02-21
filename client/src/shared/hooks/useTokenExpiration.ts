import { useEffect } from "react";
import { checkTokenExpiration } from "../utils/authCheckToken";

const useTokenExpiration = (token: string, cb: () => Promise<void>) => {
  useEffect(() => {
    if (!token) return;

    const checkExpiration = async () => {
      try {
        const expirationStatus = await checkTokenExpiration(token);
        if (expirationStatus === "expired") await cb();
      } catch (error) {
        console.error("Error checking token expiration:", error);
        await cb();
      }
    };

    checkExpiration();
  }, [token, cb]);
};

export default useTokenExpiration;
