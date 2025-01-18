"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const healthcheck_1 = __importDefault(require("./handlers/healthcheck"));
class App {
    /**
     * @constructs App
     */
    constructor() {
        this._instance = (0, express_1.default)();
        this._instance.use(express_1.default.json());
        this.registerRouters();
    }
    /**
     * @get instance
     */
    get instance() {
        return this._instance;
    }
    /**
     * registerRouters
     * @inner
     */
    registerRouters() {
        this._instance.use('/api/v1/healthcheck', healthcheck_1.default);
    }
}
exports.default = new App();
//# sourceMappingURL=App.js.map