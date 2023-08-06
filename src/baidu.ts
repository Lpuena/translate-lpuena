import axios from 'axios';
const md5 = require('md5');
import * as vscode from 'vscode';
interface Dst {
  dst: string
}
interface BaiDu {
  trans_result: Array<Dst>
  error_code?: string
}

const config = vscode.workspace.getConfiguration('translate-lpuena');
const appid = config.get('appid');
const secret = config.get('secret');
console.log(config);




// 请求百度接口
export const baiDuApi = async (q: string, to: string) => {

  const salt = Math.random();
  const { data }: { data: BaiDu } = await axios({
    method: "get",
    url: "https://fanyi-api.baidu.com/api/trans/vip/translate",
    params: {
      from: 'auto',
      to,
      appid,
      q,
      salt,
      sign: md5(appid + q + salt + secret)
    }
  });
  if (data.error_code === "54003") {
    vscode.window.showErrorMessage("请求过于频繁，请控制在1s请求一次");
    return "";
  }
  console.log('数据baidu', data.trans_result[0]);
  return data.trans_result[0].dst;
};