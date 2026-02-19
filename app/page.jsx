// "use client";
import { Suspense } from "react";
import Hero from "../components/hero";

export default function Home() {
  return (
    <Suspense>
      <>
        <Hero />
      </>
    </Suspense>
  );
}
