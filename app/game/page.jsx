import React from "react";
import Engine from "@/components/engine";

const gamePage = () => {
  return (
    <section className="flex flex-col h-screen items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">GojiRun Game Page</h1>
      <div className="container">
        <Engine />
      </div>
    </section>
  );
};

export default gamePage;
