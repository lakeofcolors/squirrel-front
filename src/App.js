import { Routes, Route } from "react-router-dom";
import SquirrelLoginForm from "./SquirrelLoginForm";
import SquirrelGameTable from "./Game";
import GameSearch from "./SearchGame";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SquirrelLoginForm />} />
        <Route path="/find" element={<GameSearch />} />
        <Route path="/game" element={<SquirrelGameTable />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
