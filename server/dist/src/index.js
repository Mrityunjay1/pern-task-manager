"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const auth_1 = __importDefault(require("./routes/auth"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent cross-origin
}));
// Routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/auth", auth_1.default);
app.use("/projects", projectRoutes_1.default);
app.use("/tasks", taskRoutes_1.default);
app.use("/search", searchRoutes_1.default);
app.listen(8000, () => {
    console.log("Server started on port 3000");
});
