"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Security
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cors_1 = __importDefault(require("cors"));
const notfound_1 = require("./middlewares/notfound");
const errorhandler_1 = require("./middlewares/errorhandler");
dotenv_1.default.config();
//Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const usersRoute_1 = __importDefault(require("./routes/usersRoute"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const reviewRoute_1 = __importDefault(require("./routes/reviewRoute"));
const orderRoute_1 = __importDefault(require("./routes/orderRoute"));
//
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
require("express-async-errors");
const app = (0, express_1.default)();
//middlewares
app.use((0, morgan_1.default)("tiny"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)(process.env.JWT_SECRET));
app.use(express_1.default.static("./public"));
app.use((0, express_fileupload_1.default)());
//Security
app.set("trust proxy", 1);
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 60,
}));
//Routes
app.use("/api/v1/auth", authRoutes_1.default);
app.use("/api/v1/users", usersRoute_1.default);
app.use("/api/v1/products", productRoutes_1.default);
app.use("/api/v1/reviews", reviewRoute_1.default);
app.use("/api/v1/orders", orderRoute_1.default);
//ErrorsHandler
app.use(notfound_1.notFound);
app.use(errorhandler_1.errorHandlerMiddleware);
const port = process.env.PORT || 4000;
const start = async () => {
    try {
        app.listen(port, () => console.log(`Server is Listing on PORT ${port}`));
    }
    catch (error) {
        console.error(error);
    }
};
start();
