const {createWebpackConfig} = require("@epeli/webpack-config");

module.exports = createWebpackConfig(
    {
        template: "examples/index.html.tmpl",
    },
    config => {
        config.entry.main = __dirname + "/examples/example.tsx";
        return config;
    },
);
