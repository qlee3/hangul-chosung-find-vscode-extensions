// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "초성으로 찾기" is now active!')
	
	const 초성추출 = (str) => {
		const cho = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"]
		let 초성 = ""
		
		for(let i=0; i<str.length; i++) {
			let code = str.charCodeAt(i)-44032
			if(code>-1 && code<11172) 초성 += cho[Math.floor(code/588)]
		}
		return 초성
	}
	
	const 변수세트배열 = (document) => {
		const 변수배열 = document
		.split("\n") // 문장 나누기
		.map((문장) => 문장.replace(/^\s+|\s+$/g,''))
		.filter((문장) => { // 문장이 const나 let이나, var로 시작해야함
			if(문장.indexOf("const ") >= 0) return true
			if(문장.indexOf("let ") >= 0) return true
			if(문장.indexOf("var ") >= 0) return true
			return false
		})
		.map((문장) => { // const, let, var 지우기
			if(문장.indexOf("const ") >= 0) return 문장.substring(문장.indexOf("const ")+ 6, 문장.length)
			if(문장.indexOf("let ") >= 0) return 문장.substring(문장.indexOf("let ") + 4, 문장.length)
			if(문장.indexOf("var ") >= 0) return 문장.substring(문장.indexOf("let ") + 4, 문장.length)
			return 문장
		})
		.map((문장) => { // 변수명으로 자르기, 초성 찾기
			const 타입선택자 = 문장.indexOf(":")
			const 값할당자 = 문장.indexOf("=")
			const 땀땀 = 문장.indexOf(";")
			const 자를위치 = Math.min(Math.min(타입선택자 < 0 ? 문장.length : 타입선택자, 값할당자 < 0 ? 문장.length : 값할당자), 땀땀 < 0 ? 문장.length : 땀땀)
			const 변수 = 문장.substring(0, 자를위치).replace(/^\s+|\s+$/g,'')
			return {
				변수,
				초성: 초성추출(변수)
			}
		})
		.filter((변수세트) => { // 한글포함한 변수명만 찾기
			if(변수세트.초성.length === 0) return false
			return true
		})
		.map(변수세트 => { // 변수 만들기
			return {
				label: 변수세트.변수,
				kind: vscode.CompletionItemKind.Variable,
				filterText: 변수세트.초성
			}
		})
		return 변수배열
	}

    const 초성으로찾은변수들 = vscode.languages.registerCompletionItemProvider([
		{ scheme: 'file', language: 'typescript' },
		{ scheme: 'file', language: 'javascript' }
	], {
        provideCompletionItems(doc) {
            const documentText = doc.getText()
            const 힌트세트 = 변수세트배열(documentText)
            return 힌트세트
        }
    })

    context.subscriptions.push(초성으로찾은변수들)
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate
}
