/*

VSCO UNLOCK

Loon & QuantumultX & Surge

[MITM]
hostname = vsco.co

Loon
http-response ^https?:\/\/vsco\.co\/api\/subscriptions\/2\.1\/user-subscriptions\/ script-path=https://raw.githubusercontent.com/cyubuchen/scripts/unlock/vsco.js, requires-body=true, timeout=10

Quantumult X 商店版
[rewrite_local]
^https?:\/\/vsco\.co\/api\/subscriptions\/2\.1\/user-subscriptions\/ url script-response-body vsco.js

Quantumult X Testflight
^https?:\/\/vsco\.co\/api\/subscriptions\/2\.1\/user-subscriptions\/ url script-response-body https://raw.githubusercontent.com/cyubuchen/scripts/unlock/vsco.js

Surge
[Script]
^https?:\/\/vsco\.co\/api\/subscriptions\/2\.1\/user-subscriptions\/ requires-body=1, max-size=0, script-path=https://raw.githubusercontent.com/cyubuchen/scripts/unlock/vsco.js

*/


var obj = JSON.parse($response.body);
obj = {
    user_subscription_code: "VSCOANNUAL",
    user_subscription: {
        user_id: 201590696,
        subscription_code: "VSCOANNUAL",
        sku: "VSCOANNUAL",
        expired: false,
        starts_on_sec: 1596255376,
        expires_on_sec: 1911772890,
        last_verified_sec: 1596251123,
        canceled_at_sec: null,
        source: 1,
        payment_type: 2,
        invalid_reason: null,
        is_trial_period: false,
        is_intro_period: false,
        intro_offer_consumed: true,
        is_active: true,
        auto_renew: true,
        is_in_grace_period: false
    },
    created_at: "2020-03-10T10:36:12.501612071Z"
};

$done({body: JSON.stringify(obj)});