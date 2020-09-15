/*

Vue Vlog (China/US) UNLOCK

Loon & QuantumultX & Surge

[MITM]
hostname = *.vuevideo.net

Loon
http-response ^https:\/\/(api|sub)\.vuevideo\.net\/api\/(v1|sub|)\/(subtitle\/prepare|users\/.*\/profile|subscription\/apple\/verify|get|verify) script-path=https://raw.githubusercontent.com/cyubuchen/scripts/unlock/vueGlobal.js, requires-body=true, timeout=10

Quantumult X 商店版
[rewrite_local]
;VUE Vlog
^https:\/\/(api|sub)\.vuevideo\.net\/api\/(v1|sub|)\/(subtitle\/prepare|users\/.*\/profile|subscription\/apple\/verify|get|verify) url script-response-body vueGlobal.js

Quantumult X Testflight版
^https:\/\/(api|sub)\.vuevideo\.net\/api\/(v1|sub|)\/(subtitle\/prepare|users\/.*\/profile|subscription\/apple\/verify|get|verify) url script-response-body https://raw.githubusercontent.com/cyubuchen/scripts/unlock/vueGlobal.js

Surge
[Script]
^https:\/\/(api|sub)\.vuevideo\.net\/api\/(v1|sub|)\/(subtitle\/prepare|users\/.*\/profile|subscription\/apple\/verify|get|verify) requires-body=1, max-size=0, script-path=https://raw.githubusercontent.com/cyubuchen/scripts/unlock/vueGlobal.js

*/


const path1 = "/api/sub/get";
const path2 = "/api/sub/verify";
const path_cn = "/api/v1/subtitle/prepare"
const pathCN = "/api/v1/subscription/apple/verify"
const pathZh = "/profile?country"
const url = $request.url;

if (url.indexOf(path1) != -1 || url.indexOf(path2) != -1) {
    var obj = JSON.parse($response.body);
    obj = {
        "id": 45507,
        "uid": null,
        "deviceId": 2686660101126723139,
        "productId": 1,
        "appId": "video.vue.global",
        "since": "2020-08-01T13:30:08.000+0000",
        "to": "2030-08-01T13:30:08.000+0000",
        "appleTransactionId": "310000633290672",
        "appleTransactionValid": true,
        "renewTime": "2030-08-01T13:30:08.000+0000",
        "createTime": "2020-08-01T13:30:08.000+0000",
        "valid": true,
        "trialPeriod": false,
        "sandbox": false
    }
    $done({body: JSON.stringify(obj)});
}
else if (url.indexOf(path_cn) != -1 || url.indexOf(pathCN) != -1 || url.indexOf(pathZh) != -1) {
    body = $response.body.replace(/\"premiumExpireTime\":\d+/, "\"premiumExpireTime\":1911781820000").replace(/\"isPremium\":false/, "\"isPremium\":true").replace(/\"valid\":false/, "\"valid\":true")
    $done({body});
}