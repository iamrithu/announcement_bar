// @ts-check
import { resolve } from "path";
import express from "express";

import cookieParser from "cookie-parser";
import { Shopify, ApiVersion } from "@shopify/shopify-api";

import bar from "./model/annouceMentBar.js";

import "dotenv/config";

import body from "body-parser";

import fs from "fs";

import applyAuthMiddleware from "./middleware/auth.js";
import verifyRequest from "./middleware/verify-request.js";

const USE_ONLINE_TOKENS = true;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

const PORT = parseInt(process.env.PORT || "8081", 10);
const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.April22,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};
Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
  path: "/webhooks",
  // @ts-ignore
  webhookHandler: async (topic, shop, body) => {
    delete ACTIVE_SHOPIFY_SHOPS[shop];
  },
});

  


// export for test use only
export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production"
) {
  const app = express();
  app.set("top-level-oauth-cookie", TOP_LEVEL_OAUTH_COOKIE);
  app.set("active-shopify-shops", ACTIVE_SHOPIFY_SHOPS);
  app.set("use-online-tokens", USE_ONLINE_TOKENS);

  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

  applyAuthMiddleware(app);

  app.use(express.static("public"));

  app.post("/webhooks", async (req, res) => {
    try {
      await Shopify.Webhooks.Registry.process(req, res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
      res.status(500).send(error.message);
    }
  });

  app.use(body.json());
  app.get("/products-count", verifyRequest(app), async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, true);
    const { Product } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );

    const countData = await Product.count({ session });
    res.status(200).send(countData);
  });
  app.post("/bar", async (req, res) => {
    console.log(req.body);
    await bar.create(req.body).then((data) => console.log(data));
  });
  
  app.get("/bar", async (req, res) => {
    var data = await bar.find();

    res.send(data);
  });
  // app.delete("/delete/:id", async (req, res) => {

  //   var data = await bar.findByIdAndDelete({_id:req.params.id});

  //   res.send(data)

  //   });

  app.delete("/delete/:id", (req, res) => {
    bar.findByIdAndRemove({ _id: req.params.id }).then((data) => {
      res.send(data);
    });
  });

  app.post("/graphql", verifyRequest(app), async (req, res) => {
    try {
      const response = await Shopify.Utils.graphqlProxy(req, res);
      res.status(200).send(response.body);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.post("/demo", (req, res) => {
   
  });
  app.post("/script_tag", async (req, res) => {
     var content = req.body;
     console.log(content);
 
    var data=`const announcementBar = document.getElementById("shopify-section-announcement-bar");
     announcementBar.innerHTML ="<div style='height:50px; width:100%; position:relative; '> <div style='  height:100%; width:100%; box-sizing:content-box;display:flex;align-items:center;justify-content:center; background:url(https://s3.amazonaws.com/lastsecondcoupon/img/bar_background/custom_code_background_halloween.jpg); background-position: center;  '><h2 style='color:white;'>${content.shipBar}</h2> </div> </div>"`;    

    fs.writeFile("./public/script.js", data, (err) => {
      if (err)
        console.log(err);
      else {
        console.log("File written successfully\n");
        console.log("The written has the following contents:");
        console.log(fs.readFileSync("./public/script.js", "utf8"));
      }
    });

    res.send(data)
    
   
   
  });

  app.get("/create-script", verifyRequest(app), async (req, res) => {
    console.log("pingged");
  
    const { ScriptTag } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );
    const test_session = await Shopify.Utils.loadCurrentSession(req, res);
    const script_tag = new ScriptTag({ session: test_session });
    script_tag.event = "onload";
    script_tag.src = `${process.env.HOST}/script_tag`;
    await script_tag.save({});
    res.status(200);
  });

  app.use(express.json());

  app.use((req, res, next) => {
    const shop = req.query.shop;
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
      res.setHeader(
        "Content-Security-Policy",
        `frame-ancestors https://${shop} https://admin.shopify.com;`
      );
    } else {
      res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
    }
    next();
  });

  app.use("/*", (req, res, next) => {
    const { shop } = req.query;

    // Detect whether we need to reinstall the app, any request from Shopify will
    // include a shop in the query parameters.
    // @ts-ignore
    if (app.get("active-shopify-shops")[shop] === undefined && shop) {
      // @ts-ignore
      res.redirect(`/auth?${new URLSearchParams(req.query).toString()}`);
    } else {
      next();
    }
  });

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;
  if (!isProd) {
    vite = await import("vite").then(({ createServer }) =>
      createServer({
        root,
        logLevel: isTest ? "error" : "info",
        server: {
          port: PORT,
          hmr: {
            protocol: "ws",
            host: "localhost",
            port: 64999,
            clientPort: 64999,
          },
          middlewareMode: "html",
        },
      })
    );
    app.use(vite.middlewares);
  } else {
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );
    const fs = await import("fs");
    app.use(compression());
    app.use(serveStatic(resolve("dist/client")));
    // @ts-ignore
    app.use("/*", (req, res, next) => {
      // Client-side routing will pick up on the correct route to render, so we always render the index here
      res
        .status(200)
        .set("Content-Type", "text/html")
        .send(fs.readFileSync(`${process.cwd()}/dist/client/index.html`));
    });
  }

  return { app, vite };
}

if (!isTest) {
  createServer().then(({ app }) => app.listen(PORT));
}

//mongoose

import mongoose from "mongoose";

mongoose.connect(process.env.DB, () => {
  console.log("DB connected !!!");
});
mongoose.Promise = global.Promise;
