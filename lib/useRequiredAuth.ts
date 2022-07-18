import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

function useRequireAuth() {
  const { status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    router.push("/login");
  }
}

export default useRequireAuth;
