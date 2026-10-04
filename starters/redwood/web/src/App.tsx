import { useEffect } from "react";
import { initAuthdog } from "@authdog/redwood/web";
import { RedwoodProvider } from "@redwoodjs/web";
import Routes from "src/Routes";

const App = () => {
  useEffect(() => {
    initAuthdog();
  }, []);

  return (
    <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
      <Routes />
    </RedwoodProvider>
  );
};

export default App;
