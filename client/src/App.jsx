import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import AppRoutes from "./utils/AppRoutes";


function App() {
  
  return (
    <>
      <Router>
        <AppRoutes />
      </Router>
    </>
  );
}

export default App;
