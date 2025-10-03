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

    // alert("Inside Telegram WebApp. For dev use browser.");

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

    // doAuth();
  }, [navigate, setToken]);


  return (
    <div className="flex flex-col items-center justify-end min-h-screen login-bg p-20">
        <div className="relative flex justify-center mb-4">
          <div className="relative w-48 h-64 rounded-xl shadow-md border-4 border-purple-600 bg-black/70 flex items-center justify-center p-2">
            {/* Углы карты (индексы) */}
            <div className="absolute top-1 left-1 text-xs font-bold
                            text-purple-300 drop-shadow-[0_0_4px_rgba(255,215,0,0.8)] flex flex-col items-center">
              <span>J</span>
              <span>♣️</span>
            </div>
            <div className="absolute bottom-1 right-1 text-xs font-bold
                            text-purple-300 drop-shadow-[0_0_4px_rgba(255,215,0,0.8)] rotate-180 flex flex-col items-center">
              <span>J</span>
              <span>♣️</span>
            </div>
            {/* Белка */}
            <motion.div
              className="relative w-28 h-28 rounded-full border-2 border-orange-500
                        flex justify-center items-center
                        shadow-[0_0_15px_rgba(255,165,0,0.5)]
                        bg-gradient-to-b from-orange-300 to-orange-500"
              animate={{ rotate: (mousePosition.x - window.innerWidth / 2) / 50 }}
            >
              {/* Ушки */}
              <div className="absolute -top-3 -left-4 w-4 h-6 bg-orange-400
                              rounded-t-full rotate-[-20deg] border border-orange-500"></div>
              <div className="absolute -top-3 -right-4 w-4 h-6 bg-orange-400
                              rounded-t-full rotate-[20deg] border border-orange-500"></div>

              {/* Глаза */}
              {!passwordFocused ? (
                <div className="absolute top-7 flex justify-between w-12">
                  <motion.div className="w-2.5 h-2.5 bg-black rounded-full"
                    animate={{ x: (mousePosition.x - window.innerWidth / 2) / 120,
                              y: (mousePosition.y - window.innerHeight / 2) / 120 }}
                  />
                  <motion.div className="w-2.5 h-2.5 bg-black rounded-full"
                    animate={{ x: (mousePosition.x - window.innerWidth / 2) / 120,
                              y: (mousePosition.y - window.innerHeight / 2) / 120 }}
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
    </div>
  );
}
