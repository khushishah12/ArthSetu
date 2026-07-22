import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
export const metadata:Metadata={title:{default:"ArthSetu AI",template:"%s · ArthSetu AI"},description:"Explainable alternative-data credit scoring and responsible micro-investment education.",applicationName:"ArthSetu AI"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><SmoothScroll/>{children}</body></html>}
