// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

const fileExtensionRegex = new RegExp(/(?:\.([^.]+))?$/);

export const fileNameWithoutExtension = (
  uri: vscode.Uri,
  extension: string
) => {
  return (
    uri.fsPath
      .split("\\")
      .pop()
      ?.split("/")
      .pop()
      ?.replace(`.${extension}`, "") || "BLA"
  );
};

export const defaultTestFilePattern = (fileExtension: string) =>
  `%source_file%_test.${fileExtension}`;

export const getTestFileName = (sourceFileUri: vscode.Uri): string => {
  const fileEnding = fileExtensionRegex.exec(sourceFileUri.fsPath)![1];
  const defaultPattern = defaultTestFilePattern(fileEnding);
  const pattern: string =
    vscode.workspace
      .getConfiguration("goto-test.testFilePatterns")
      .get(fileEnding) || defaultPattern;
  const sourceFileName = fileNameWithoutExtension(sourceFileUri, fileEnding);
  const testFileName = pattern.replace("%source_file%", sourceFileName);
  return testFileName;
};

export const getSourceFileName = (testFileUri: vscode.Uri): string => {
  const fileEnding = fileExtensionRegex.exec(testFileUri.fsPath)![1];
  const testFileName = fileNameWithoutExtension(testFileUri, fileEnding);
  const defaultPattern = `%source_file%.${fileEnding}`;
  let pattern: string = defaultPattern;
  const config = vscode.workspace.getConfiguration("goto-test.testFilePatterns");
  Object.keys(config)
    .forEach(key => {
      const value: string = config.get(key) || "";
      if(value.endsWith(`.${fileEnding}`)) {
        pattern = `%source_file%.${key}`;
      }
    });
  const sourceFileName = pattern.replace("%source_file%", testFileName.replace(/[\W_]test/i, ""));
  return sourceFileName;
};

export const getFilePath = (sourceFileUri: vscode.Uri, fileNameFn: (fileUri: vscode.Uri) => string) => {
  if (sourceFileUri.scheme !== "file") {
    return null;
  }
  const testFileName = fileNameFn(sourceFileUri); //  getTestFileName(sourceFileUri);

  return testFileName;
};

const fileQuickPicks = (uris: vscode.Uri[]) =>
  uris.map((uri) => {
    return { uri: uri, label: uri.fsPath };
  });

const openFile = (testFileName: string) => {
  vscode.window.setStatusBarMessage(
    `Finding and switching to ${testFileName}`,
    vscode.workspace
      .findFiles(`**/${testFileName}`, undefined, 10)
      .then((uris) => {
        if (uris.length < 1) {
          vscode.window.showErrorMessage(
            `Couldn't find file: ${testFileName}`
          );
          return null;
        } else if (uris.length === 1) {
          return vscode.workspace.openTextDocument(uris[0]);
        } else {
          const quickPicks = fileQuickPicks(uris);
          return vscode.window
            .showQuickPick(quickPicks, {
              title: "More than one file candidate matches, pick one",
            })
            .then((quickPick) => {
              if (quickPick) {
                return vscode.workspace.openTextDocument(quickPick.uri);
              } else {
                return null;
              }
            });
        }
      })
      .then(
        (doc) => {
          if (doc) {
            vscode.window.showTextDocument(doc);
          }
        },
        (error) => vscode.window.showErrorMessage(error)
      )
  );
};

const openTestFileFromActiveSourceFile = () => {
  const activeFileUri = vscode.window.activeTextEditor?.document.uri;
  if (activeFileUri) {
    const testFileName = getFilePath(activeFileUri, getTestFileName);
    if (testFileName) {
      openFile(testFileName);
    }
  }
};

const openSourceFileFromActiveTestFile = () => {
  const activeFileUri = vscode.window.activeTextEditor?.document.uri;
  if (activeFileUri) {
    const sourceFileName = getFilePath(activeFileUri, getSourceFileName);
    if (sourceFileName) {
      openFile(sourceFileName);
    }
  }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension "goto-test" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let goToTestFile = vscode.commands.registerCommand(
    "goto-test.gotoTestFile",
    openTestFileFromActiveSourceFile
  );

  let goToSourceFile = vscode.commands.registerCommand(
    "goto-test.gotoSourceFile",
    openSourceFileFromActiveTestFile
  )

  context.subscriptions.push(goToTestFile);
  context.subscriptions.push(goToSourceFile);
}

// this method is called when your extension is deactivated
export function deactivate() {}
