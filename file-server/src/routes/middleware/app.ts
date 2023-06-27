import path from "path";
import express from "express";
// import favicon from "serve-favicon";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";

import { app, config } from "../../index";

const rootPath = process.env.NODE_ENV == "development" ? "../../.." : "../../../..";

// Requests
app.use(express.json({}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(cors({ origin: config.mainServer.url, credentials: true }));

// Static content
// app.use(favicon(path.join(__dirname, `${rootPath}/public/favicon.ico`)));

export {};
