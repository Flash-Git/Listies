import React, { FC, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMediaQuery } from "react-responsive";

const DARK_CLASS = "dark";

const DarkToggle: FC = () => {
  const systemPrefersDark = useMediaQuery(
    { query: "(prefers-color-scheme: dark)" },
    undefined,
    prefersDark => {
      setIsDark(prefersDark);
    }
  );

  const [isDark, setIsDark] = useState(systemPrefersDark);

  const toggleDark = () => {
    setIsDark(isDark => !isDark);
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add(DARK_CLASS);
    } else {
      document.documentElement.classList.remove(DARK_CLASS);
    }
  }, [isDark]);

  return (
    <button className={"btn btn-link"} onClick={toggleDark}>
      <FontAwesomeIcon icon={["fas", "moon"]} />
    </button>
  );
};

export default DarkToggle;
