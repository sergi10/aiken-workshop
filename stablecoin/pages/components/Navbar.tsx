import { CardanoWallet } from "@meshsdk/react";
import { Pages } from "../enums/pages";
import { usePage } from "@/context/PageContext";

export const Navbar = () => {
  const { setPage } = usePage();

  return (
    <nav className="bg-customBackground p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-customFonts font-light text-3xl">IOG Euro Stablecoin </span>
          <img src="/Euro.png" alt="Coin Icon" className="w-8 h-8" />
        </div>
        <ul className="flex space-x-6">
          <li>
            <a
              href="#"
              onClick={() => setPage(Pages.Oracle)}
              className="text-customFonts hover:text-white text-xl font-light"
            >
              Oracle
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => setPage(Pages.Owner)}
              className="text-customFonts hover:text-white text-xl font-light"
            >
              Owner
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => setPage(Pages.User)}
              className="text-customFonts hover:text-white text-xl font-light"
            >
              User
            </a>
          </li>
        </ul>
        <div className="text-customFonts text-xl font-light">
          <CardanoWallet isDark={true} />
        </div>
      </div>
    </nav>
  );
};
