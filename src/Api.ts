import { translate } from '@vitalets/google-translate-api';
import { baiDuApi } from './baidu';

export class Api {
  // 谷歌翻译
  public async googleApi(selectedText: string, language: string) {
    const translation = await translate(selectedText, { to: language });
    const translatedText = translation.text;
    const raw = translation.raw;
    console.log('原始数据', raw);

    return translatedText;
  }

  // 百度翻译
  public async baiduApi(selectedText: string, language: string) {
    return baiDuApi(selectedText, language);
  }
}

