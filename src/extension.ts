import * as vscode from 'vscode';
import { translate } from '@vitalets/google-translate-api';

function format(content: string) {
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
export function activate(context: vscode.ExtensionContext) {

	async function translation(language: string, input?: string) {
		// 获取当前编辑器
		const editor = vscode.window.activeTextEditor;
		if (!editor) {translation
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
		// 显示加载提示
		const progressOptions: vscode.ProgressOptions = {
			location: vscode.ProgressLocation.Notification,
			title: 'Translating...',
			cancellable: true,
		};

		await vscode.window.withProgress(progressOptions, async (progress) => {
			try {
				// 执行谷歌翻译
				const translation = await translate(selectedText, { to: language });
				const translatedText = translation.text;
				const raw = translation.raw;
				console.log('原始数据', raw);

				let result: string;
				if (!input) {
					result = format(translatedText);

				} else {
					result = translatedText;
				}

				let copiedSign;
				// try {
				// 	// 将结果放到剪贴板
				// 	await vscode.env.clipboard.writeText(result);
				// 	copiedSign = ' ✔';
				// } catch {
				// 	copiedSign = '';
				// }




				// 显示翻译结果
				// vscode.window.showInformationMessage(`Translated: ${translatedText}`);
				// const message = `Translated: ${result}${copiedSign}`;
				const message = `Translated: ${result}`;
				
				vscode.window.showInformationMessage(message, '复制').then(selection => {
					console.log('selection', selection);
					if (selection === '复制') {
						vscode.env.clipboard.writeText(result);
					}

				});

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

	async function inputTranslation() {
		const input = await vscode.window.showInputBox({
			placeHolder: 'Enter Chinese text to translate'
		});
		if (!input) {
			return;
		}

		// 检测输入是否包含中文
		const hasChinese = /[\u4e00-\u9fa5]/.test(input);

		if (hasChinese) {
			// 包含中文,翻译到英文
			translation('en', input);
			console.log('翻译成英文');


		} else {
			// 不包含中文,翻译到中文
			translation('zh', input);
			console.log('翻译成中文');
		}


	}
	let inputContent = vscode.commands.registerCommand('translate.inputTranslation', () => {
		inputTranslation();
	});


	context.subscriptions.push(disposable);
	context.subscriptions.push(toEnglish);
	context.subscriptions.push(inputContent);
}

// This method is called when your extension is deactivated
export function deactivate() { }
