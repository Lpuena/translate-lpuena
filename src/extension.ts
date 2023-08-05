import * as vscode from 'vscode';
import { Translator } from './Translator';
import { Language } from './enum';

export function activate(context: vscode.ExtensionContext) {
	const translator = new Translator();

	let disposable = vscode.commands.registerCommand('translate.toChinese', () => {
		translator.getContent(Language.chinese);


	});
	let toEnglish = vscode.commands.registerCommand('translate.toEnglish', () => {
		translator.getContent(Language.english);
	});

	let inputContent = vscode.commands.registerCommand('translate.inputTranslation', () => {
		translator.inputTranslation();
	});


	context.subscriptions.push(disposable);
	context.subscriptions.push(toEnglish);
	context.subscriptions.push(inputContent);
}

// This method is called when your extension is deactivated
export function deactivate() { }
