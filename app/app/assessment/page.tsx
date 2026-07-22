import { Suspense } from "react";
import type { Metadata } from "next";
import { AssessmentClient } from "@/components/app/assessment-client";
import { Loading } from "@/components/ui/loading";
export const metadata:Metadata={title:"Assessment"};
export default function AssessmentPage(){return <Suspense fallback={<Loading/>}><AssessmentClient/></Suspense>}
