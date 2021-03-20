import { FC, useContext, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

import { useMountEffect } from "../../functions/hooks";
import AppContext from "../../context/app/AppContext";

import { AppContext as IAppContext } from "context";

const DARK_CLASS = "dark";

const DarkMode: FC = () => {
  const appContext: IAppContext = useContext(AppContext);
  const { darkMode, setDarkMode } = appContext;

  useMountEffect(() => {
    // get dark mode from storage
    const storageDarkMode = localStorage.getItem("darkMode");

    if (storageDarkMode) {
      setDarkMode(storageDarkMode === "false" ? false : true);
      return;
    }

    setDarkMode(systemPrefersDark);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(DARK_CLASS);
    } else {
      document.documentElement.classList.remove(DARK_CLASS);
    }
  }, [darkMode]);

  const systemPrefersDark = useMediaQuery(
    { query: "(prefers-color-scheme: dark)" },
    undefined,
    (prefersDark) => {
      setDarkMode(prefersDark);
    }
  );

  return null;
};

export default DarkMode;
