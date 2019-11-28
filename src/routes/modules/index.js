/*
 * @Author: 焦质晔
 * @Date: 2019-11-25 10:18:16
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-25 10:19:20
 */
const files = require.context('.', true, /\.js$/);

let configRouters = [];
files.keys().forEach(key => {
  if (key !== './index.js') {
    // 读取出文件中的 default 模块
    configRouters = configRouters.concat(files(key).default);
    return configRouters;
  }
});

export default configRouters;
