/*

Multitasking Split Screen UNLOCK

[MITM]
hostname = buy.itunes.apple.com

Loon
http-response ^https?:\/\/buy\.itunes\.apple\.com\/verifyReceipt script-path=https://raw.githubusercontent.com/cyubuchen/scripts/unlock/multiscreen.js, requires-body=true, timeout=10

Quantumult X 商店版
[rewrite_local]
^https?:\/\/buy\.itunes\.apple\.com\/verifyReceipt url script-response-body multiscreen.js

Quantumult X Testflight
^https?:\/\/buy\.itunes\.apple\.com\/verifyReceipt url script-response-body https://raw.githubusercontent.com/cyubuchen/scripts/unlock/multiscreen.js

Surge
[Script]
^https?:\/\/buy\.itunes\.apple\.com\/verifyReceipt requires-body=1, max-size=0, script-path=https://raw.githubusercontent.com/cyubuchen/scripts/unlock/multiscreen.js

*/


let obj = JSON.parse($response.body);
let bundle_id = obj.receipt.bundle_id;

if (bundle_id == "com.toolstyle.MultitaskingSplitScreen") {
    obj.receipt.in_app[0] = {
        "quantity": "1",
        "purchase_date_ms": "1598857165000",
        "expires_date": "2030-08-01 10:16:29Etc/GMT",
        "expires_date_pst": "2030-07-31 19:16:29America/Los_Angeles",
        "is_in_intro_offer_period": "false",
        "transaction_id": "220000802162800",
        "is_trial_period": "false",
        "original_transaction_id": "220000802162800",
        "purchase_date": "2020-08-31 06:59:25 Etc/GMT",
        "product_id": "com.toolstyle.MultitaskingSplitScreen.automonth2",
        "original_purchase_date_pst": "2020-08-30 23:59:25 America/Los_Angeles",
        "original_purchase_date_ms": "1598857165000",
        "web_order_line_item_id": "220000308000727",
        "expires_date_ms": "1911780989000",
        "purchase_date_pst": "2020-08-30 23:59:25 America/Los_Angeles",
        "original_purchase_date": "2020-08-31 06:59:25 Etc/GMT"
    };

    obj.latest_receipt_info = [{
        "quantity": "1",
        "purchase_date_ms": "1598857165000",
        "expires_date": "2030-08-01 10:16:29Etc/GMT",
        "expires_date_pst": "2030-07-31 19:16:29America/Los_Angeles",
        "is_in_intro_offer_period": "false",
        "transaction_id": "220000802162800",
        "is_trial_period": "false",
        "original_transaction_id": "220000802162800",
        "purchase_date": "2020-08-31 06:59:25 Etc/GMT",
        "product_id": "com.toolstyle.MultitaskingSplitScreen.automonth2",
        "original_purchase_date_pst": "2020-08-30 23:59:25 America/Los_Angeles",
        "original_purchase_date_ms": "1598857165000",
        "web_order_line_item_id": "220000308000727",
        "expires_date_ms": "1911780989000",
        "purchase_date_pst": "2020-08-30 23:59:25 America/Los_Angeles",
        "original_purchase_date": "2020-08-31 06:59:25 Etc/GMT"
    }];
    obj.latest_receipt = "";
};

$done({body: JSON.stringify(obj)});