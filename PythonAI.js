/*

PythonAI UNLOCK

[MITM]
hostname = ws.60he.com

Loon
http-response ^https?:\/\/ws\.60he\.com\/(user|book)\.htm script-path=https://raw.githubusercontent.com/cyubuchen/scripts/unlock/PythonAI.js, requires-body=true, timeout=10

Quantumult X 商店版
[rewrite_local]
^https?:\/\/ws\.60he\.com\/(user|book)\.htm url script-response-body PythonAI.js

Quantumult X Testflight
^https?:\/\/ws\.60he\.com\/(user|book)\.htm url script-response-body https://raw.githubusercontent.com/cyubuchen/scripts/unlock/PythonAI.js

Surge
[Script]
^https?:\/\/ws\.60he\.com\/(user|book)\.htm requires-body=1, max-size=0, script-path=https://raw.githubusercontent.com/cyubuchen/scripts/unlock/PythonAI.js

*/


var obj = JSON.parse($response.body);
const path1 = "/user.htm";
const path2 = "/book.htm";
const url = $request.url;

if (url.indexOf(path1) != -1) {
    obj.data.vip = 365;
} else if (url.indexOf(path2) != -1) {
    obj.data[0].isBuy = 1;
}

$done({body: JSON.stringify(obj)})