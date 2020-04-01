require('dotenv').config();

const webpack = require('webpack');

const apiKey = JSON.stringify(process.env.SHOPIFY_API_KEY);
const shopOrigin = JSON.stringify(process.env.SHOP_ORIGIN);

module.exports = {
    webpack: (config) => {
        const env = { API_KEY: apiKey, SHOP_ORIGIN: shopOrigin };
        config.plugins.push(new webpack.DefinePlugin(env));
        return config;
    }
};