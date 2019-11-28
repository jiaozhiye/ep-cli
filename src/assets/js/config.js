/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-28 18:28:50
 */
const createProductEnv = env => {
  const result = { env, envText: `当前工程环境：${env}`, serverUrl: '/' };
  if (env === 'development') {
    result.serverUrl = '/';
  } else {
    console.log = console.warn = console.info = () => {};
    result.serverUrl = '/';
  }
  return result;
};

export default createProductEnv(process.env.NODE_ENV);
