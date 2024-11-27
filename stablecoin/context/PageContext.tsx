import { Pages } from "@/pages/enums/pages";
import { createContext, useContext, useState, ReactNode } from "react";

type PageContextType = {
  page: Pages;
  setPage: (page: Pages) => void;
};

const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider = ({ children }: { children: ReactNode }) => {
  const [page, setPage] = useState(Pages.Oracle);
  return (
    <PageContext.Provider value={{ page, setPage }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePage = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePage must be used inside Page Provider");
  }
  return context;
};
