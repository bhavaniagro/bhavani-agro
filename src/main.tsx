import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { testFirestoreConnection } from "./config/firebaseTest";

testFirestoreConnection().catch((error) => {
    console.error("Firestore connection failed:", error);
});

createRoot(document.getElementById("root")!).render(<App />);