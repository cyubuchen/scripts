/*

StarVpn UNLOCK

^https?:\/\/.*\.cloudfront.net\/api\/(clients|purchases)\/(info|validate)

[MITM]
hostname = *.cloudfront.net

Loon
http-response ^https?:\/\/.*\.cloudfront.net\/api\/(clients|purchases)\/(info|validate) script-path=https://raw.githubusercontent.com/cyubuchen/scripts/unlock/StarVpn.js, requires-body=true, timeout=10

Quantumult X 商店版
[rewrite_local]
^https?:\/\/.*\.cloudfront.net\/api\/(clients|purchases)\/(info|validate) url script-response-body StarVpn.js

Quantumult X Testflight
^https?:\/\/.*\.cloudfront.net\/api\/(clients|purchases)\/(info|validate) url script-response-body https://raw.githubusercontent.com/cyubuchen/scripts/unlock/StarVpn.js

Surge
[Script]
^https?:\/\/.*\.cloudfront.net\/api\/(clients|purchases)\/(info|validate) requires-body=1, max-size=0, script-path=https://raw.githubusercontent.com/cyubuchen/scripts/unlock/StarVpn.js

*/


var obj = JSON.parse($response.body);
obj["expiration_time"] = 1911820136;

$done({body: JSON.stringify(obj)});