import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as gotoTest from '../../extension';

suite('getTestFilePath', () => {
	test('returns null for invalid source file URI scheme', () => {
		const sourceFile = vscode.Uri.parse('http://www.msft.com/some/path');

		const testFile = gotoTest.getTestFilePath(sourceFile);
		
		assert.strictEqual(testFile, null);
	});
});
