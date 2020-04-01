require('isomorphic-fetch');
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const dotenv = require('dotenv');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const { default: proxy, ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');
const Router = require('koa-router');
const KoaBody = require('koa-body');
dotenv.config();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;

const server = new Koa();
const router = new Router();
let products = [];

router.get('/api/products', async (ctx) => {
    try {
        ctx.body = {
            status: 'success',
            data: products
        };
    } catch (e) {
        console.error(e);
    }
});

router.post('/api/products', KoaBody(), async (ctx) => {
    try {
        const body  = ctx.request.body;
        products.push(body);
        ctx.body = {
            status: "Item added",
            data: products
        };
    } catch (e) {
        console.error(e);
    }
});

router.delete('/api/products', KoaBody(), async (ctx) => {
    try {
        products = [];
        ctx.body = {
            status: "Item deleted",
            data: products
        };
    } catch (e) {
        console.error(e);
    }
});

//Router middleware
server.use(router.allowedMethods());
server.use(router.routes());

app.prepare().then(() => {
    server.use(session({ sameSite: 'none', secure: true }, server));
    server.keys = [SHOPIFY_API_SECRET_KEY];

    server.use(
        createShopifyAuth({
            apiKey: SHOPIFY_API_KEY,
            secret: SHOPIFY_API_SECRET_KEY,
            scopes: [
                'read_products',
                'read_script_tags',
                'write_script_tags',
                'write_products'
            ],
            afterAuth(ctx) {
                const { shop, accessToken } = ctx.session;
                console.log("Received shop origin is ", shop);
                ctx.cookies.set('shopOrigin', shop, { httpOnly: false });
                ctx.redirect('/');
            },
        }),
    );

    server.use(proxy({ version: ApiVersion.October19 }));
    server.use(verifyRequest());

    server.use(async (ctx) => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
        ctx.res.statusCode = 200;

    });

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});
