import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import * as gotoTest from "../../extension";

suite("fileNameWithoutExtension", () => {
  test("returns uri file without its extension", () => {
    const uri = vscode.Uri.file("./src/extension.ts");

    const result = gotoTest.fileNameWithoutExtension(uri, "ts");

    assert.strictEqual(result, "extension");
  });
});

suite("getTestFileName", () => {
  test("returns ts test file", () => {
    const uri = vscode.Uri.file("./src/extension.ts");

    const result = gotoTest.getTestFileName(uri);

    assert.strictEqual(result, "extension.test.ts");
  });
});

suite("getFilePath", () => {
  test("returns null for invalid source file URI scheme", () => {
    const sourceFile = vscode.Uri.parse("http://www.msft.com/some/path");

    const testFile = gotoTest.getFilePath(sourceFile, gotoTest.getTestFileName);

    assert.strictEqual(testFile, null);
  });
});

suite("getSourceFileName", () => {
  test("returns ts source file", () => {
    const uri = vscode.Uri.file("./src/test/extension.test.ts");

    const result = gotoTest.getSourceFileName(uri);

    assert.strictEqual(result, "extension.ts");
  });
});

suite("defaultTestFilePattern", () => {
  test("contains source file pattern", () => {
    const ending = "exs";

    const result = gotoTest.defaultTestFilePattern(ending);

    assert.strictEqual(result.includes("%source_file%"), true);
  });
});
