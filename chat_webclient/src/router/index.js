import { BrowserRouter } from "react-router-dom";
import AppPages from "./route";

function RouterApp() {
  return (
    <BrowserRouter>
      <AppPages />
    </BrowserRouter>
  );
}
export default RouterApp;