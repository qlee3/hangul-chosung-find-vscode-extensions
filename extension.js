// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "초성으로 찾기" is now active!');

  const 초성추출 = (str) => {
    const cho = [
      "ㄱ",
      "ㄲ",
      "ㄴ",
      "ㄷ",
      "ㄸ",
      "ㄹ",
      "ㅁ",
      "ㅂ",
      "ㅃ",
      "ㅅ",
      "ㅆ",
      "ㅇ",
      "ㅈ",
      "ㅉ",
      "ㅊ",
      "ㅋ",
      "ㅌ",
      "ㅍ",
      "ㅎ",
    ];
    let 초성 = "";

    Array.from({ length: str.length }).forEach((_, index) => {
      let code = str.charCodeAt(index) - 44032;
      if (code > -1 && code < 11172) {
        초성 += cho[Math.floor(code / 588)];
      }
    });
    return 초성;
  };

  const 만들기_줄로나눈_배열 = (document) => {
    return document.split("\n");
  };

  const 제거_문자열타입 = (문장배열) => {
    return 문장배열.map((문장) =>
      문장
        .replace(/".*?"/g, "")
        .replace(/`.*?`/g, "")
        .replace(/'.*?'/g, "")
        .replace(/\(/g, " ") // 특수문자를 취급 안하기 위해 추가
        .replace(/\)/g, " ")
        .replace(/\{/g, " ")
        .replace(/\{/g, " ")
        .replace(/\[/g, " ")
        .replace(/\]/g, " ")
        .replace(/</g, " ")
        .replace(/>/g, " ")
        .replace(/,/g, " ")
        .replace(/\?/g, " ")
        .replace(/;/g, " ")
        .replace(/!/g, " ")
        .replace(/:/g, " ")
        .trim()
    );
  };

  const 추출_한글 = (문장배열) => {
    const 한글셋 = 문장배열.map((문장) => {
      const 단어배열 = 문장.split(" ");
      const 한글단어배열 = 단어배열.filter((단어) => {
        const 한국어 = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
        const 점있는거 = /\./;
        return 한국어.test(단어) && !점있는거.test(단어);
      });
      return 한글단어배열;
    });
    return 한글셋.flat();
  };

  const 제거_중복단어 = (배열) => {
    return Array.from(new Set(배열));
  };

  const 만들기_초성변수세트 = (단어배열) => {
    return 단어배열.map((단어) => {
      // 변수 만들기
      return {
        label: 단어,
        kind: vscode.CompletionItemKind.Variable,
        filterText: 초성추출(단어),
      };
    });
  };

  const 초성으로찾은변수들 = vscode.languages.registerCompletionItemProvider(
    [
      { scheme: "file", language: "typescript" },
      { scheme: "file", language: "javascript" },
    ],
    {
      provideCompletionItems(doc) {
        const documentText = doc.getText();
        const 줄로나눈배열 = 만들기_줄로나눈_배열(documentText);
        const 문자열제거배열 = 제거_문자열타입(줄로나눈배열);
        const 추출된한글단어배열 = 추출_한글(문자열제거배열);
        const 중복_제거된_단어 = 제거_중복단어(추출된한글단어배열);
        const 초성변수세트 = 만들기_초성변수세트(중복_제거된_단어);
        return 초성변수세트;
      },
    }
  );

  context.subscriptions.push(초성으로찾은변수들);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
