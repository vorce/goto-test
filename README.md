# goto-test

goto-test is a small extension for VSCode that provides a command to jump/go to the test file for a source file.
Useful when jumping between implementation and tests often.

## Features

Go to Test file -> Try to find and switch to the current file's test file. Uses configuration for each file ending to search. Only works in workspaces.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `goto-test.testFilePatterns`: An object containing file ending => test file pattern. Example:

```json
"goto-test.testFilePatterns": {
  "java": "%source_file%Test.java",
  "ex": "%source_file%_test.exs"
}
```

## Known Issues

Only works in workspaces

## Release Notes

-
