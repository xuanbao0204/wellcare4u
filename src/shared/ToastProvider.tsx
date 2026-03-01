"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar
      closeButton={false}
      toastClassName="!bg-transparent !shadow-none !p-0 !rounded-none"
      className="me-5 z-9999"
    />
  );
}