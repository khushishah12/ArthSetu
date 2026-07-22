import type { Metadata } from "next";
import { DashboardClient } from "@/components/app/dashboard-client";
export const metadata:Metadata={title:"Command Centre"};
export default function DashboardPage(){return <DashboardClient/>}
