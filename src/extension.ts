import * as vscode from 'vscode';
import { translate } from '@vitalets/google-translate-api';

export function activate(context: vscode.ExtensionContext) {


	let disposable = vscode.commands.registerCommand('translate-lpuena.showTranslate', async () => {
		// 获取当前编辑器
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		// 获取选中的文本范围
		const selection = editor.selection;
		const selectedText = editor.document.getText(selection);

		if (!selectedText) {
			vscode.window.showInformationMessage('Please select some text to translate.');
			return;
		}

		// 显示加载提示
    const progressOptions: vscode.ProgressOptions = {
      location: vscode.ProgressLocation.Notification,
      title: 'Translating...',
      cancellable: false,
    };

		// try {
		// 	const translation = await translate(selectedText, { to: 'zh' });
		// 	const translatedText = translation.text;
		// 	const row = translation.raw;
		// 	console.log('translatedText', translatedText);
		// 	// console.log('row', row);
		// 	// 显示浮窗
		// 	const result = selectedText + '：' + translatedText;
		// 	// vscode.window.showInformationMessage(selectedText);
		// 	vscode.window.showInformationMessage(result);


		// } catch (e: any) {
		// 	console.log('!!!!!!!', e);

		// 	vscode.window.showInformationMessage(e.errno);
		// }

		await vscode.window.withProgress(progressOptions, async (progress) => {
      try {
        // 执行谷歌翻译
        const translation = await translate(selectedText, { to: 'zh' });
        const translatedText = translation.text;

        // 显示翻译结果
        vscode.window.showInformationMessage(`Translated: ${translatedText}`);
      } catch (error) {
        console.error('Translation error:', error);
        vscode.window.showErrorMessage('Translation failed. Please try again later.');
      }
    });
  
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
