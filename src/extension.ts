// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const fileExtensionRegex = new RegExp(/(?:\.([^.]+))?$/);

const getTestFileName = (sourceFileUri: vscode.Uri): string => {
	const fileEnding = fileExtensionRegex.exec(sourceFileUri.fsPath)![1];
	const defaultPattern = `%source_file%_test.${fileEnding}`;
	const pattern: string = vscode.workspace.getConfiguration('goto-test.testFilePatterns').get(fileEnding) || defaultPattern;
	const sourceFileName = sourceFileUri.fsPath.split('\\').pop()?.split('/').pop()?.replace(`.${fileEnding}`, "") || "BLA";
	const testFileName = pattern.replace("%source_file%", sourceFileName);
	return testFileName;
};

export const getTestFilePath = (sourceFileUri: vscode.Uri) => {
	if(sourceFileUri.scheme !== "file") {
		return null;
	}
  const testFileName = getTestFileName(sourceFileUri);

	return testFileName;
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "goto-test" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('goto-test.gotoTestFile', () => {
		const activeFileUri = vscode.window.activeTextEditor?.document.uri;
		if(activeFileUri) {
			const testFileName = getTestFilePath(activeFileUri);
			if(testFileName) {
				vscode.window.setStatusBarMessage(`Finding and switching to ${testFileName}`,
				vscode.workspace.findFiles(`**/${testFileName}`, undefined, 1)
				.then((uris) => {
					if(uris.length < 1) {
						vscode.window.showErrorMessage(`Couldn't find test file counterpart: ${testFileName}`);
						return null;
					} else {
						// vscode.window.showInformationMessage(`Switching to ${testFileName}`);
						return vscode.workspace.openTextDocument(uris[0]);
					}
				}).then((doc) => {
					if(doc) {
						vscode.window.showTextDocument(doc);
					}
				}, (error) => vscode.window.showErrorMessage(error)));
			}
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
