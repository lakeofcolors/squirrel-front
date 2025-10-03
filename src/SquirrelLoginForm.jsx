import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useGameStore } from "./store/index";
import { connectWS } from "./ws/client"
import { getUrl } from "./config/settings";
import login_wallpaper from "./assets/login_wallpaper.jpg";

export default function SquirrelLoginForm() {
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const setToken = useGameStore((s) => s.setToken);
  const navigate = useNavigate();


  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (!tg) {
      console.log("Not inside Telegram WebApp");
      alert("Not inside Telegram WebApp. For dev use browser.");
      return;
    }

    tg.ready();
    tg.expand();

    alert("Inside Telegram WebApp. For dev use browser.");

    const doAuth = async () => {
      try {
        const res = await axios.post(getUrl("/auth/login"), {
          initData: tg.initData || null, // <-- Telegram присылает строку initData
        });

        if (res.data.access_token) {
          localStorage.setItem("access_token", res.data.access_token);
          setToken(res.data.access_token);
          connectWS(navigate);
          navigate("/find");
        }
      } catch (err) {
        alert("Ошибка авторизации");
        console.error("Auth error:", err);
      }
    };

    doAuth();
  }, [navigate, setToken]);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen login-bg p-4">
      {/* --- Верхняя карта "Белка" --- */}
      <div className="mb-4 text-center w-full">
        <div className="relative inline-block px-4 py-2 border-4 border-yellow-600 rounded-lg bg-yellow-100 shadow-md w-full max-w-xs">
          <span className="text-3xl font-bold text-black tracking-wide uppercase">Белка</span>
          <div className="absolute top-0 left-0 w-2 h-2 bg-black rounded-full -mt-1 -ml-1"></div>
          <div className="absolute top-0 right-0 w-2 h-2 bg-black rounded-full -mt-1 -mr-1"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-black rounded-full -mb-1 -ml-1"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-black rounded-full -mb-1 -mr-1"></div>
        </div>
      </div>

      {/* --- Карта с белкой и форма --- */}
      <div className="relative w-full max-w-sm p-6 rounded-2xl shadow-lg bg-black/60 border border-purple-500 backdrop-blur-md">
        <div className="relative flex justify-center mb-4">
          <div className="relative w-48 h-64 rounded-xl shadow-md border-4 border-yellow-600 bg-yellow-100 flex items-center justify-center p-2">
            <div className="absolute top-1 left-1 text-xs font-bold text-black flex flex-col items-center">
              <span>J</span>
              <span>♣️</span>
            </div>
            <div className="absolute bottom-1 right-1 text-xs font-bold text-black rotate-180 flex flex-col items-center">
              <span>J</span>
              <span>♣️</span>
            </div>

            {/* Белка */}
            <motion.div
              className="relative w-28 h-28 bg-orange-300 rounded-full border-2 border-orange-500 flex justify-center items-center shadow"
              animate={{ rotate: (mousePosition.x - window.innerWidth / 2) / 50 }}
            >
              {/* Ушки */}
              <div className="absolute -top-3 -left-4 w-4 h-6 bg-orange-400 rounded-t-full rotate-[-20deg] border border-orange-500"></div>
              <div className="absolute -top-3 -right-4 w-4 h-6 bg-orange-400 rounded-t-full rotate-[20deg] border border-orange-500"></div>

              {/* Глаза */}
              {!passwordFocused ? (
                <div className="absolute top-7 flex justify-between w-12">
                  <motion.div className="w-2.5 h-2.5 bg-black rounded-full"
                    animate={{ x: (mousePosition.x - window.innerWidth / 2) / 120, y: (mousePosition.y - window.innerHeight / 2) / 120 }}
                  />
                  <motion.div className="w-2.5 h-2.5 bg-black rounded-full"
                    animate={{ x: (mousePosition.x - window.innerWidth / 2) / 120, y: (mousePosition.y - window.innerHeight / 2) / 120 }}
                  />
                </div>
              ) : (
                <div className="absolute top-7 flex justify-between w-12">
                  <div className="w-3 h-1 bg-black rounded-full"></div>
                  <div className="w-3 h-1 bg-black rounded-full"></div>
                </div>
              )}

              {/* Нос + усы */}
              <div className="absolute bottom-3 w-2 h-2 bg-black rounded-full"></div>
              <div className="absolute bottom-3 left-2 w-5 h-0.5 bg-black rotate-[15deg]"></div>
              <div className="absolute bottom-2.5 left-2 w-5 h-0.5 bg-black rotate-[-15deg]"></div>
              <div className="absolute bottom-3 right-2 w-5 h-0.5 bg-black rotate-[-15deg]"></div>
              <div className="absolute bottom-2.5 right-2 w-5 h-0.5 bg-black rotate-[15deg]"></div>
            </motion.div>
          </div>
        </div>

        {/* --- Форма логина --- */}
        {/* <form onSubmit={handleLogin} className="flex flex-col space-y-3"> */}
        {/*   <input */}
        {/*     type="text" */}
        {/*     placeholder="Username" */}
        {/*     value={username} */}
        {/*     onChange={(e) => setUsername(e.target.value)} */}
        {/*     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-base" */}
        {/*   /> */}
        {/*   <input */}
        {/*     type="password" */}
        {/*     placeholder="Password" */}
        {/*     value={password} */}
        {/*     onFocus={() => setPasswordFocused(true)} */}
        {/*     onBlur={() => setPasswordFocused(false)} */}
        {/*     onChange={(e) => setPassword(e.target.value)} */}
        {/*     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-base" */}
        {/*   /> */}
        {/*   <button */}
        {/*     type="submit" */}
        {/*     className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition text-base" */}
        {/*   > */}
        {/*     Login */}
        {/*   </button> */}
        {/*   <Link */}
        {/*     to="/game" */}
        {/*     className="w-full py-2 bg-orange-500 text-white font-bold rounded-lg text-center block hover:bg-orange-600" */}
        {/*   > */}
        {/*     Preview Game */}
        {/*   </Link> */}
        {/* </form> */}
      </div>
    </div>
  );
}
