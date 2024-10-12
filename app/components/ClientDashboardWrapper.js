'use client'

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

export default function ClientDashboardWrapper({ children, serverSession }) {
  const { data: clientSession, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("Client-side session:", clientSession);
    console.log("Server-side session:", serverSession);

    if (status === "unauthenticated" && !serverSession) {
      console.log("No session found, redirecting to login");
      router.push("/login");
    }
  }, [status, clientSession, serverSession, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const session = clientSession || serverSession;

  if (!session) {
    return <div>Access Denied</div>;
  }

  return <DashboardLayout session={session}>{children}</DashboardLayout>;
}