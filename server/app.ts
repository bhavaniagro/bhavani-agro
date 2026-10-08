import express from "express";
import cors from "cors";

import leadRoutes from "./routes/lead.routes";
import customerRoutes from "./routes/customer.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Bhavani Agro API is running",
    });
});

app.use("/api/leads", leadRoutes);
app.use("/api/customers", customerRoutes);

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`);
});