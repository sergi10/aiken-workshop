import type { NextPage } from "next";
import "@meshsdk/react/styles.css";
import { Navbar } from "./components/Navbar";
import Oracle from "./components/Oracle";
import Owner from "./components/Owner";
import User from "./components/User";
import DataTable from "./components/InfoTable";
import { usePage } from "@/context/PageContext";
import { Pages } from "./enums/pages";

const Home: NextPage = () => {
  const { page } = usePage();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <div className="bg-[#0f0f0f] w-1/2 flex flex-col items-center justify-start py-4">
          {page === Pages.Oracle && <Oracle />}
          {page === Pages.Owner && <Owner />}
          {page === Pages.User && <User />}
        </div>
        <div className="bg-[#0f0f0f] w-1/2 p-6 flex flex-col items-center justify-start py-4">
          <DataTable />
        </div>
      </div>
    </div>
  );
};

export default Home;
