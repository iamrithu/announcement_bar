// @ts-check
import { resolve } from "path";
import express from "express";
import { Liquid } from 'liquidjs'
import cookieParser from "cookie-parser";
import { Shopify, ApiVersion } from "@shopify/shopify-api";

import bar from "./model/annouceMentBar.js";

import announcement_bar from './router/announcement_bar.js'



import "dotenv/config";

import body from "body-parser";

import Shop from './model/shopDetails.js'

import fs from "fs";
// import shop from "./model/shopDetails";

import applyAuthMiddleware from "./middleware/auth.js";
import verifyRequest from "./middleware/verify-request.js";




const USE_ONLINE_TOKENS = true;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

const PORT = parseInt(process.env.PORT)
const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;
const engine = new Liquid()
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

  app.use('/',announcement_bar)

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
    console.log(session);
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
  app.get("/tags", async (req, res) => {
const {ScriptTag} = await import (`@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`)

    const test_session = await Shopify.Utils.loadCurrentSession(req, res);
     const data = await ScriptTag.all({
      session: test_session,
    });
    console.log(test_session.id)
    
  });


  app.delete("/delete/:id", async (req, res) => {

    await bar.findByIdAndRemove({ _id: req.params.id }).then((data) => {
      res.send(data);

      console.log(data);
    });
  });

  app.get('/shop',async(req,res)=>{
    const test_session = await Shopify.Utils.loadCurrentSession(req, res);
    var data =  await Shop.findOne({shopId: test_session.id});
    res.send(data)
    
  })

  app.post("/graphql", verifyRequest(app), async (req, res) => {
    try {
      const response = await Shopify.Utils.graphqlProxy(req, res);
      res.status(200).send(response.body);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });




  app.get("/script_tag", verifyRequest(app),async (req, res) => {
    const test_session = await Shopify.Utils.loadCurrentSession(req, res);
   
    const { ScriptTag } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );
   
    const script_tag = new ScriptTag({ session: test_session });
    script_tag.event = "onload";
    script_tag.src = `${process.env.HOST}/get-script`;
    await script_tag.save({});
    res.status(200);

    console.log("pingged")

 

  });

  app.get("/get-script",  async (req, res) => {


     var data = await bar.find({shopName:req.query.shop ,isActive:true});

     
    // req.shopname
    // 
    const fileString = fs.readFileSync(`./public/script.js`,"utf-8")
    const tpl = await engine.parseAndRender(fileString,{demo:`${ data[0].shipBar}`
      })
    res.type("application/javascript");

    res.send(tpl)

 
    
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
  createServer().then(({ app }) => {
    app.listen(PORT)
    console.log("Listening port" + PORT)
  });
}

//mongoose

import mongoose from "mongoose";


mongoose.connect(process.env.DB, () => {
  console.log("DB connected !!!");


});
mongoose.Promise = global.Promise;
