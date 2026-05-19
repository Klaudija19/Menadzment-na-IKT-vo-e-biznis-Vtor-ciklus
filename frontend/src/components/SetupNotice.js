import React, { useEffect, useState } from "react";
import { apiUrl } from "../api";

function SetupNotice() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiUrl("health.php"));
        const data = await res.json();
        if (!cancelled) setStatus(data);
      } catch {
        if (!cancelled) {
          setStatus({
            ok: false,
            message:
              "Cannot reach PHP API. Copy beauty-salon-api to C:\\xampp\\htdocs\\ and start Apache in XAMPP.",
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!status || status.ok) return null;

  return (
    <div className="setup-notice" role="alert">
      <strong>Setup required:</strong> {status.message}
      <span className="setup-notice__hint">
        phpMyAdmin → Import → <code>beauty-salon-api/setup_full.sql</code>
      </span>
    </div>
  );
}

export default SetupNotice;
