import * as vscode from 'vscode';
import { translate } from '@vitalets/google-translate-api';

enum Language {
  chinese = 'zh',
  english = 'en',
}
export class Translator {


  // 翻译函数
  public static async translate(language: Language, input?: string) {
    // 实现翻译逻辑
  }

  // 格式化函数
  private static format(content: string) {
    // 实现格式化逻辑 
    // 格式数据，替换空格为下划线
    let text = content.replace(/ /g, '_');
    // 转小写
    text = text.toLowerCase();
    // 分割为数组
    const words = text.split('_');
    // 格式化每个单词  
    const formattedWords = words.map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      else {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
    });
    // 拼接返回 （小驼峰）
    const result = formattedWords.join('');

    console.log(result);
    return result;
  }

  // input输入翻译函数
  public static async inputTranslation() {
    // 检测语言
  }
  // 展示结果
  public static async showTranslationResult(result:string){
    const message = `Translated: ${result}`;
    vscode.window.showInformationMessage(message, '复制').then(selection => {
      console.log('selection', selection);
      if (selection === '复制') {
        vscode.env.clipboard.writeText(result);
      }
    });
  }

}