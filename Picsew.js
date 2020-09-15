/*

Picsew UNLOCK

[MITM]
hostname = buy.itunes.apple.com

Loon
http-response ^https?:\/\/buy\.itunes\.apple\.com\/verifyReceipt script-path=https://raw.githubusercontent.com/cyubuchen/scripts/unlock/Picsew.js, requires-body=true, timeout=10

Quantumult X 商店版
[rewrite_local]
^https?:\/\/buy\.itunes\.apple\.com\/verifyReceipt url script-response-body Picsew.js

Quantumult X Testflight
^https?:\/\/buy\.itunes\.apple\.com\/verifyReceipt url script-response-body https://raw.githubusercontent.com/cyubuchen/scripts/unlock/Picsew.js

Surge
[Script]
^https?:\/\/buy\.itunes\.apple\.com\/verifyReceipt requires-body=1, max-size=0, script-path=https://raw.githubusercontent.com/cyubuchen/scripts/unlock/Picsew.js

*/


var obj = JSON.parse($response.body);
var bundle_id = obj.receipt.bundle_id;

if (bundle_id == "com.sugarmo.ScrollClip") {
      obj.receipt.in_app[0] = {
      "quantity": "1",
      "product_id": "com.sugarmo.ScrollClip.pro",
      "transaction_id": "1000000000000000",
      "original_transaction_id": "1000000000000000",
      "purchase_date": "2020-06-06 00:00:00 Etc/GMT",
      "purchase_date_ms": "1591372800000",
      "purchase_date_pst": "2020-06-06 00:00:00 America/San_Francisco",
      "original_purchase_date": "2020-06-06 00:00:00 Etc/GMT",
      "original_purchase_date_ms": "1591372800000",
      "original_purchase_date_pst": "2020-06-06 00:00:00 America/San_Francisco",
      "is_trial_period": "false"
    }
}

$done({body: JSON.stringify(obj)});