import * as vscode from 'vscode';
import { translate } from '@vitalets/google-translate-api';

export function activate(context: vscode.ExtensionContext) {

	async function translation(language: string) {
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

		await vscode.window.withProgress(progressOptions, async (progress) => {
			try {
				// 执行谷歌翻译
				const translation = await translate(selectedText, { to: language });
				const translatedText = translation.text;
				const raw = translation.raw;
				console.log('原始数据', raw);

				// 格式数据，替换空格为下划线
				let text = translatedText.replace(/ /g, '_');
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
				// 拼接返回
				const result = formattedWords.join('');

				console.log(result);

				let copiedSign;
				try {
					// 将结果放到剪贴板
					await vscode.env.clipboard.writeText(result);
					copiedSign = ' ✔';
				} catch {
					copiedSign = '';
				}


				// 显示翻译结果（小驼峰）
				// vscode.window.showInformationMessage(`Translated: ${translatedText}`);
				const message = `Translated: ${result}${copiedSign}`;
				vscode.window.showInformationMessage(message);



			} catch (error) {
				console.error('Translation error:', error);
				vscode.window.showErrorMessage('Translation failed. Please try again later.');
			}
		});


	}


	let disposable = vscode.commands.registerCommand('translate-lpuena.toChinese', () => {
		translation('zh');

	});
	let toEnglish = vscode.commands.registerCommand('translate-lpuena.toEnglish', () => {
		translation('en');
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(toEnglish);
}

// This method is called when your extension is deactivated
export function deactivate() { }
