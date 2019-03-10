
//处理共用、通用的js
var webpack             = require('webpack');
// npm install extract-text-webpack-plugin@1.0.1 --save-dev 用于css单独打包处理
var ExtractTetPlugin    = require("extract-text-webpack-plugin");
// npm install html-webpack-plugin@1.x --save-dev  对html模块化的处理,要用低版本的,但至少要2.0以上,不然会造成HTML插入失败和html-loader无效
var HtmlWebpackPlugin   = require('html-webpack-plugin');

// 环境变量配置， dev / online
var WEBPACK_ENV         = process.env.WEBPACK_ENV || 'dev';
console.log(WEBPACK_ENV);

// 获取html-webpack-plugin参数的方法
var getHtmlConfig = function(name) {
    return {
        template : './src/view/' + name +'.html', 
        filename : 'view/' + name +'.html',
        inject   : true,
        hash     : true, 
        chunks   : ['common', name]
    };
};
// webpack config 
var config = {
    entry: {
        'common' : ['./src/page/common/index.js'],
        'index'  : ['./src/page/index/index.js'],
        'login'  : ['./src/page/login/index.js'],
    },
    output: {
        path: './dist', // 存放文件用的路径
        publicPath : '/dist', // 访问的路径
        filename: 'js/[name].js'
    },
    externals : {
        'jquery' : 'window.jQuery'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: ExtractTetPlugin.extract("style-loader","css-loader") },
            // css要安装两个loader，需要制定低版本，因为webpack也是低版本：npm install css-loader@0.28.1 --save-dev和npm install style-loader@0.17.0 --save-dev
            { test: /\.(gif|png|jpg|woff|svg|eot|ttfss)\??.*$/, loader: 'url-loader?limit=100&name=resource/[name].[ext]' }
            // npm install url-loader@0.* --save-dev
            // npm install file-loader@0.11 --save-dev

        ]
    },
    plugins: [
        // 独立通用模块到js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            name : 'common',
            filename : 'js/base.js'
        }),
        // 把CSS单独打包到文件里
        new ExtractTetPlugin("css/[name].css"),
        // HTML模板的处理
        new HtmlWebpackPlugin(getHtmlConfig('index')), // index 页面
        new HtmlWebpackPlugin(getHtmlConfig('login')), // html 页面

    ]
};

if('dev' === WEBPACK_ENV) {
    config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
}

module.exports = config;