/*
v5.6
不要用第三方账号.

^https:\/\/api\.quizlet\.com\/3\.5\/users\/\d+\?perPage=\d+

[MITM]
hostname = api.quizlet.com

Surge
[Script]
quizletPlus =type=http-response,pattern=^https:\/\/api\.quizlet\.com\/3\.5\/users\/\d+\?perPage=\d+,requires-body=1,max-size=0,script-path=quizletPlus.js

Loon
[Script]
http-response ^https:\/\/api\.quizlet\.com\/3\.5\/users\/\d+\?perPage=\d+ script-path=https://raw.githubusercontent.com/cyubuchen/scripts/unlock/quizletPlus.js, requires-body=true, timeout=10

Quantumult X 商店版
[rewrite_local]
^https:\/\/api\.quizlet\.com\/3\.5\/users\/\d+\?perPage=\d+ url script-resposne-body quizletPlus.js

Quantumult X Testflight
^https:\/\/api\.quizlet\.com\/3\.5\/users\/\d+\?perPage=\d+ url script-response-body https://raw.githubusercontent.com/cyubuchen/scripts/unlock/quizletPlus.js

*/

var obj = JSON.parse($response.body);
obj.responses[0].models.user[0].type = 1;
$done({body: JSON.stringify(obj)});