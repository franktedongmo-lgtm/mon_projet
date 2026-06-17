"use client";
import { useEffect } from "react";

export default function VisitTracker() {
  useEffect(() => {
    let sessionId = localStorage.getItem("aroyal_session");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("aroyal_session", sessionId);
    }
    fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    }).catch(() => {});
  }, []);
  return null;
}
