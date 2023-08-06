import * as vscode from 'vscode';
import { translate } from '@vitalets/google-translate-api';
import { Language } from './enum';
import { Api } from './Api';

// TODO:优化翻译接口，两个交替请求
export class Translator {
  private apiName = 'google';
  private googleError = 'error';
  // 获取要翻译的内容
  public async getContent(language: Language, input?: string) {
    // 获取当前编辑器
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    // 获取选中的文本范围
    const selection = editor.selection;
    let selectedText = editor.document.getText(selection);

    // 是否有input
    if (input) {
      selectedText = input;
    }

    if (!selectedText) {
      vscode.window.showInformationMessage('Please select some text to translate.');
      return;
    }

    this.translateLoading(language, selectedText, input);
  }
  // 加载 翻译
  private async translateLoading(language: Language, selectedText: string, input?: string) {
    // 显示加载提示
    const progressOptions: vscode.ProgressOptions = {
      location: vscode.ProgressLocation.Notification,
      title: 'Translating...',
      cancellable: true,
    };
    await vscode.window.withProgress(progressOptions, async (progress) => {
      try {
        // 执行谷歌翻译
        // const translatedText = await this.googleApi(selectedText, language);
        const api = new Api();
        console.log('name', this.apiName);

        let translatedText: string;

        if (this.apiName === 'google') {
          this.apiName = 'baidu';
          translatedText = await this.googleApi(selectedText, language);
          // 报错的话下面的语句就不执行了
          this.googleError = 'normal';
        } else {
          translatedText = await api.baiduApi(selectedText, language);
          if (this.googleError === 'normal') {
            this.apiName = 'google';
          }

        }



        const result = this.isFormat(translatedText, input);

        this.showTranslationResult(result);

      } catch (error: any) {
        console.error('Translation error:', error);
        if (error.name === 'TooManyRequestsError') {
          vscode.window.showErrorMessage(error.message);
        } else {
          vscode.window.showErrorMessage('Translation failed. Please try again later.');
        }
      }
    });
  }
  private isFormat(translatedText: string, input?: string) {
    let result: string;
    if (!input) {
      // 选中就格式化小驼峰
      result = this.format(translatedText);
    } else {
      result = translatedText;
    }
    return result;
  }
  // 谷歌翻译
  private async googleApi(selectedText: string, language: string) {
    const translation = await translate(selectedText, { to: language });
    const translatedText = translation.text;
    const raw = translation.raw;
    console.log('原始数据', raw);

    return translatedText;
  }

  // 格式化函数
  private format(content: string) {
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
  public async inputTranslation() {
    // 检测语言
    const input = await vscode.window.showInputBox({
      placeHolder: 'Enter Chinese or English to translate'
    });
    if (!input) {
      return;
    }

    let chCount = 0;
    let enCount = 0;
    for (let char of input) {
      if (/[\u4e00-\u9fa5]/.test(char)) {
        chCount++; 
      } else if (/[a-zA-Z]/.test(char)) {
        enCount++;
      }
    }
    console.log(chCount,enCount);
    
    if (chCount > enCount) {
      this.getContent(Language.english, input);
      console.log('翻译成英文');
    } else {
       // 翻译到中文
       this.getContent(Language.chinese, input);
       console.log('翻译成中文');
    }

    // // 检测输入是否包含中文
    // const hasChinese = /[\u4e00-\u9fa5]/.test(input);
    // if (hasChinese) {
    //   // 包含中文,翻译到英文
    //   this.getContent(Language.english, input);
    //   console.log('翻译成英文');
    // } else {
    //   // 不包含中文,翻译到中文
    //   this.getContent(Language.chinese, input);
    //   console.log('翻译成中文');
    // }
  }
  // 展示结果
  private async showTranslationResult(result: string) {
    const message = `Translated: ${result}`;
    vscode.window.showInformationMessage(message, '复制').then(selection => {
      console.log('selection', selection);
      if (selection === '复制') {
        vscode.env.clipboard.writeText(result);
      }
    });
  }

}