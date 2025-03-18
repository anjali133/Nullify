"use client";

import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const Home = () => {
  redirect("/auth");
};

export default Home;
