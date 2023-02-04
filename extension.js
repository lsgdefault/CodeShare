const firebase = require("firebase/app");
require("firebase/database"); 
const vscode = require('vscode');
let code =''

function generateCode() {

    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return result;
  }
let team_code =  generateCode();

function activate() {

    const firebaseConfig = {"Hidden Due to Privacy"};
    // @ts-ignore
    firebase.initializeApp(firebaseConfig);
    // @ts-ignore
    const database = firebase.database();

    vscode.commands.registerCommand('codeshare.sharecode', function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const text = editor.document.getText();
        code = text;
        vscode.env.clipboard.writeText(team_code);
        console.log("copied")
        database.ref(`teamCode/${team_code}`).set({
            copiedcode: code
        });

        const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        statusBarItem.text = "Team code (CodeShare): "+team_code;
        statusBarItem.tooltip = "Team Code";
        statusBarItem.show();

        vscode.window.showInformationMessage(team_code +" is your CodeShare Team Code which is Already copied in you clipboard")
    });

    vscode.commands.registerCommand('codeshare.receivecode', async function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const res_team_code  = await vscode.window.showInputBox({
            placeHolder: "Enter a Team Code"
          });
          
          if (res_team_code) {
            database.ref(`teamCode/${res_team_code}`).once("value", function(snapshot) {
                const data = snapshot.val();
                const coderes =data.copiedcode;
                editor.edit(function (builder) {
                    builder.insert(editor.selection.start, coderes);
                    console.log("Code Received:", coderes);
                    console.log(res_team_code);

                    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
                    statusBarItem.text = "Team code (CodeShare): "+res_team_code;
                    statusBarItem.tooltip = "Team Code";
                    statusBarItem.show();

                });
            });
          }
    });    

}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
