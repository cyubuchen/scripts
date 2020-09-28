/*
感谢 @chavyleung

####################
[免责声明]
1、此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2、由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3、请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4、此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5、本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6、如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7、所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。
####################

功能:
京东金融白条每日提额

如何获取京东金融Cookie
1. 打开京东金融App -> 我的 -> 白条额度
2. Cookie获取成功的通知将自动弹出
3. 注意: 进入[白条]页面以自动获取Cookie, 有小鸭子的白条页面

[MITM]
hostname=*.jr.jd.com

####################
# Loon
[Script]
http-request ^https:\/\/ms\.jr\.jd\.com\/gw\/generic\/bt\/h5\/m\/firstScreenNew script-path=https://raw.githubusercontent.com/cyubuchen/scripts/master/cookie/jdBaiTiao.js, timeout=10, tag=京东白条Cookie
cron "20 15 * * *" script-path=https://raw.githubusercontent.com/cyubuchen/scripts/master/task/jdBaiTiao.js,tag=京东白条提额
####################

####################
# Surge
[Script]
# 京东白条提额
京东白条Cookie = type=http-request,pattern=^https:\/\/ms\.jr\.jd\.com\/gw\/generic\/bt\/h5\/m\/firstScreenNew,script-path=https://raw.githubusercontent.com/cyubuchen/scripts/master/cookie/jdBaiTiao.js
京东白条提额 = type=cron,cronexp="20 15 * * *",script-path=https://raw.githubusercontent.com/cyubuchen/scripts/master/task/jdBaiTiao.js
####################

####################
# Quantumult X 商店版
# 复制一份本脚本至本地, 文件名设为jdBaiTiao
[rewrite_local]
;京东白条Cookie
^https:\/\/ms\.jr\.jd\.com\/gw\/generic\/bt\/h5\/m\/firstScreenNew url script-request-header jdBaiTiao.js
[task_local]
20 15 * * * jdBaiTiao.js, enabled=true
####################
*/

const $ = Env("💰京东白条");

$.opts = {
    'open-url': 'https://m.jr.jd.com/udownload/index.html',
    'media-url': 'https://is5-ssl.mzstatic.com/image/thumb/Purple124/v4/62/19/79/6219790f-e31e-c348-0e8e-a70d9f9748e3/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-85-220.png/460x0w.png'
};

if (typeof $request != "undefined") {
    get_cookie();
    $.done();
} else {
    var cookies = [];
    cookies.push($.getdata('cookie_jdjr'));
    cookies.push($.getdata('cookie_jdjr_'));
    !(async () => {
        if (cookies[0] == null && cookies[1] == null) {
            $.msg($.name, '⚠️当前缺少Cookie', '👉请打开[京东金融App]的白条页面, 以自动获取Cookie.', $.opts);
        } else {
            for (let i = 0; i < cookies.length; i++) {
                cookie = cookies[i];
                if (cookie != null) {
                    console.log("👉当前账号 " + cookie.match(/pwdt_id=[^;]+/)[0].replace("pwdt_id=", ""));
                    var unq = await get_unq(cookie);
                    await riseBT(unq, cookie);
                } else {
                    continue;
                }
            }
        }
    })()
    .catch((e) => $.logErr(e))
        .finally(() => $.done());
}

function get_cookie() {
    try {
        var CookieKey = "cookie_jdjr";
        var CookieKey_ = "cookie_jdjr_";
        var CookieValue = $request.headers['Cookie'];
        var uaKey = "ua_jdjr";
        var uaValue = $request.headers['User-Agent'];
        if (uaValue.indexOf("jdPayClientName") != -1) {
            $.setdata(uaValue, uaKey);
        } else {
            console.log($.name + "❗️User-Agent获取失败, 已使用备用UA");
            $.setdata("Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148/application=JDJR-App&deviceId=&clientType=ios&iosType=iphone&clientVersion=6.0.20&HiClVersion=6.0.20&isUpdate=0&osVersion=14.0&osName=iOS&platform=iPhone 7 (A1660/A1779/A1780)&screen=667*375&src=App Store&ip=192.168.1.6&mac=&netWork=1&netWorkType=1&CpayJS=UnionPay/1.0 JDJR&stockSDK=stocksdk-iphone_3.3.3&sPoint=&jdPay=(*#@jdPaySDK*#@jdPayChannel=jdfinance&jdPayChannelVersion=6.0.20&jdPaySdkVersion=3.00.15.00&jdPayClientName=iOS*#@jdPaySDK*#@)", uaKey)
        }
        var cookieM = CookieValue.match(/pwdt_id=[^;]+/)[0].replace("pwdt_id=", "");
        if (!cookieM) {
            console.log($.name + " 🍪Cookie获取失败 ❌ " + "CookieValue:\n" + CookieValue);
            $.msg($.name, "🍪Cookie获取失败 ❌", "", $.opts)
        } else {
            if ($.getdata(CookieKey) != null) {
                if ($.getdata(CookieKey).indexOf(cookieM) != -1) {
                    $.setdata(CookieValue, CookieKey);
                } else {
                    $.setdata(CookieValue, CookieKey_);
                }
            } else {
                $.setdata(CookieValue, CookieKey);
            }
            console.log($.name + " 🍪Cookie写入成功 🎉 " + cookieM);
            $.msg($.name, "🍪Cookie写入成功 🎉", "", $.opts);
        }
    } catch (error) {
        console.log($.name + " " + error);
        $.msg($.name, "❓写入Cookie失败", error, $.opts)
    }
}

function get_unq(cookie) {
    return new Promise((resolve, reject) => {
        const bt_jdjr = {
            url: 'https://ms.jr.jd.com/gw/generic/bt/h5/m/getRiseLimitItems',
            method: "POST",
            headers: {
                "Host": "ms.jr.jd.com",
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Origin": "https://mbt.jd.com",
                "Accept-Encoding": "gzip, deflate, br",
                "Cookie": cookie,
                "Connection": "keep-alive",
                "Accept": "*/*",
                "User-Agent": $.getdata("ua_jdjr"),
                "Referer": "https://mbt.jd.com/process/quota/manage/pages/home.html?channelName=00004&jrcontainer=h5&jrcloseweb=false",
                "Accept-Language": "zh-cn",
            },
            "body": "reqData=%7B%22clientType%22:%22ios%22,%22clientVersion%22:%2214.0%22,%22eid%22:%22%22,%22fp%22:%22%22,%22riskDeviceInfo%22:%7B%22macAddress%22:%22%22,%22channelInfo%22:%22appstore%22,%22IPAddress1%22:%22%22,%22OpenUDID%22:%22%22,%22clientVersion%22:%226.0.20%22,%22terminalType%22:%2202%22,%22osVersion%22:%2214.0%22,%22appId%22:%22com.jd.jinrong%22,%22deviceType%22:%22iPhone9,1%22,%22networkType%22:%22WIFI%22,%22startNo%22:0,%22UUID%22:%22%22,%22IPAddress%22:%22%22,%22deviceId%22:%22%22,%22IDFA%22:%22%22,%22resolution%22:%22750*1334%22,%22osPlatform%22:%22iOS%22%7D%7D"
        };

        $.post(bt_jdjr, (error, resp, data) => {
            try {
                if (resp.status == 200) {
                    var data = JSON.parse(data);
                    if (data.resultCode == 0) {
                        var uniqueCode = data.resultData.raiseItemList[1].uniqueCode;
                        var btDesc = data.resultData.raiseItemList[1].raiseDesc;
                        if (btDesc != "今日福利额度" && btDesc != "\u4eca\u65e5\u798f\u5229\u989d\u5ea6") {
                            console.log($.name + " 🌀今日已提额, 重复请求无意义");
                            $.msg($.name, "🌀今日已提额", "重复请求无意义", $.opts);
                        }
                    } else if (data.resultCode == 3) {
                        console.log($.name + " ❌出错啦 " + data.resultMsg);
                        $.msg($.name, "❌出错啦", "❗请进入[京东金融App]白条页面, 获取Cookie.", $.opts);
                    } else {
                        console.log($.name + " ❌未知错误 " + data.resultMsg);
                        $.msg($.name, "❌未知错误", data.resultMsg, $.opts);
                    }
                } else {
                    console.log($.name + " ❌访问失败, 请稍后再试. " + resp.status);
                    $.msg($.name, "❌访问失败, 请稍后再试", "", $.opts);
                }
            } catch (error) {
                console.log($.name + " ❌访问失败! " + data.resultData.error_msg + "\n" + error);
                $.msg($.name, "❌访问失败.", data.resultData.error_msg, $.opts);
            }
            resolve(uniqueCode);
        })
    })
}

function riseBT(uniqueCode, cookie) {
    return new Promise((resolve, reject) => {
        const bt_jdjr = {
            url: 'https://ms.jr.jd.com/gw/generic/bt/h5/m/receiveDailyQuotaPackage',
            method: "POST",
            headers: {
                "Host": "ms.jr.jd.com",
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Origin": "https://mbt.jd.com",
                "Accept-Encoding": "gzip, deflate, br",
                "Cookie": cookie,
                "Connection": "keep-alive",
                "Accept": "*/*",
                "User-Agent": $.getdata("ua_jdjr"),
                "Referer": "https://mbt.jd.com/process/quota/manage/pages/home.html?channelName=00004&jrcontainer=h5&jrcloseweb=false",
                "Accept-Language": "zh-cn",
            },
            "body": `reqData=%7B%22clientType%22%3A%22ios%22%2C%22clientVersion%22%3A%2214.0%22%2C%22packageId%22%3A%22${uniqueCode}%22%7D`
        };

        $.post(bt_jdjr, (error, resp, data) => {
            try {
                if (resp.status == 200) {
                    var data = JSON.parse(data);
                    if (data.resultCode == 0) {
                        console.log(data);
                        var changeBalanceAmount = data.resultData.changeBalanceAmount;
                        var totalBalanceAmount = data.resultData.totalBalanceAmount;
                        if (changeBalanceAmount == "") {
                            var mesg = "当前总额度: " + totalBalanceAmount;
                            if (!totalBalanceAmount) {
                                console.log($.name + " ⚠️抱歉，您还没有开通白条 " + mesg);
                                $.msg($.name, "⚠️抱歉，您还没有开通白条", "", $.opts);
                            } else {
                                console.log($.name + " 🎉提额成功 " + mesg);
                                $.msg($.name, "🎉提额成功", mesg, $.opts);
                            }
                        } else {
                            var SumBalanceAmount = parseInt(changeBalanceAmount) + totalBalanceAmount;
                            var mesg = "当前总额度: " + SumBalanceAmount + "\n今日提升额度: " + changeBalanceAmount;
                            console.log($.name + " 🎉提额成功 " + mesg);
                            $.msg($.name, "🎉提额成功", mesg, $.opts);
                        }
                    } else if (data.resultCode == 3) {
                        console.log($.name + " ❌出错啦 " + data.resultMsg);
                        $.msg($.name, "❌出错啦", "❗请进入[京东金融App]白条页面, 获取Cookie.", $.opts);
                    } else {
                        console.log($.name + " ❌出错啦 " + data.resultMsg);
                        $.msg($.name, "❌出错啦", data.resultMsg, $.opts);
                    }
                } else {
                    console.log($.name + " ❌访问失败, 请稍后再试 " + resp.status);
                    $.msg($.name, "❌访问失败, 请稍后再试", "", $.opts);
                }
            } catch (error) {
                console.log($.name + " ❌提额失败. " + error);
                $.msg($.name, "❗请进入[京东金融App]白条页面, 获取Cookie.", error, $.opts);
            }
            resolve();
        })
    })
}

function Env(name, opts) {
    class Http {
        constructor(env) {
            this.env = env
        }

        send(opts, method = 'GET') {
            opts = typeof opts === 'string' ? {
                url: opts
            } : opts
            let sender = this.get
            if (method === 'POST') {
                sender = this.post
            }
            return new Promise((resolve, reject) => {
                sender.call(this, opts, (err, resp, body) => {
                    if (err) reject(err)
                    else resolve(resp)
                })
            })
        }

        get(opts) {
            return this.send.call(this.env, opts)
        }

        post(opts) {
            return this.send.call(this.env, opts, 'POST')
        }
    }

    return new(class {
        constructor(name, opts) {
            this.name = name
            this.http = new Http(this)
            this.data = null
            this.dataFile = 'box.dat'
            this.logs = []
            this.isMute = false
            this.isNeedRewrite = false
            this.logSeparator = '\n'
            this.startTime = new Date().getTime()
            Object.assign(this, opts)
            this.log('', `🔔${this.name}, 开始!`)
        }

        isNode() {
            return 'undefined' !== typeof module && !!module.exports
        }

        isQuanX() {
            return 'undefined' !== typeof $task
        }

        isSurge() {
            return 'undefined' !== typeof $httpClient && 'undefined' === typeof $loon
        }

        isLoon() {
            return 'undefined' !== typeof $loon
        }

        toObj(str, defaultValue = null) {
            try {
                return JSON.parse(str)
            } catch {
                return defaultValue
            }
        }

        toStr(obj, defaultValue = null) {
            try {
                return JSON.stringify(obj)
            } catch {
                return defaultValue
            }
        }

        getjson(key, defaultValue) {
            let json = defaultValue
            const val = this.getdata(key)
            if (val) {
                try {
                    json = JSON.parse(this.getdata(key))
                } catch {}
            }
            return json
        }

        setjson(val, key) {
            try {
                return this.setdata(JSON.stringify(val), key)
            } catch {
                return false
            }
        }

        getScript(url) {
            return new Promise((resolve) => {
                this.get({
                    url
                }, (err, resp, body) => resolve(body))
            })
        }

        runScript(script, runOpts) {
            return new Promise((resolve) => {
                let httpapi = this.getdata('@chavy_boxjs_userCfgs.httpapi')
                httpapi = httpapi ? httpapi.replace(/\n/g, '').trim() : httpapi
                let httpapi_timeout = this.getdata('@chavy_boxjs_userCfgs.httpapi_timeout')
                httpapi_timeout = httpapi_timeout ? httpapi_timeout * 1 : 20
                httpapi_timeout = runOpts && runOpts.timeout ? runOpts.timeout : httpapi_timeout
                const [key, addr] = httpapi.split('@')
                const opts = {
                    url: `http://${addr}/v1/scripting/evaluate`,
                    body: {
                        script_text: script,
                        mock_type: 'cron',
                        timeout: httpapi_timeout
                    },
                    headers: {
                        'X-Key': key,
                        'Accept': '*/*'
                    }
                }
                this.post(opts, (err, resp, body) => resolve(body))
            }).catch((e) => this.logErr(e))
        }

        loaddata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require('fs')
                this.path = this.path ? this.path : require('path')
                const curDirDataFilePath = this.path.resolve(this.dataFile)
                const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile)
                const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
                const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
                if (isCurDirDataFile || isRootDirDataFile) {
                    const datPath = isCurDirDataFile ? curDirDataFilePath : rootDirDataFilePath
                    try {
                        return JSON.parse(this.fs.readFileSync(datPath))
                    } catch (e) {
                        return {}
                    }
                } else return {}
            } else return {}
        }

        writedata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require('fs')
                this.path = this.path ? this.path : require('path')
                const curDirDataFilePath = this.path.resolve(this.dataFile)
                const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile)
                const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
                const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
                const jsondata = JSON.stringify(this.data)
                if (isCurDirDataFile) {
                    this.fs.writeFileSync(curDirDataFilePath, jsondata)
                } else if (isRootDirDataFile) {
                    this.fs.writeFileSync(rootDirDataFilePath, jsondata)
                } else {
                    this.fs.writeFileSync(curDirDataFilePath, jsondata)
                }
            }
        }

        lodash_get(source, path, defaultValue = undefined) {
            const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.')
            let result = source
            for (const p of paths) {
                result = Object(result)[p]
                if (result === undefined) {
                    return defaultValue
                }
            }
            return result
        }

        lodash_set(obj, path, value) {
            if (Object(obj) !== obj) return obj
            if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || []
            path
                .slice(0, -1)
                .reduce((a, c, i) => (Object(a[c]) === a[c] ? a[c] : (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {})), obj)[
                    path[path.length - 1]
                ] = value
            return obj
        }

        getdata(key) {
            let val = this.getval(key)
            // 如果以 @
            if (/^@/.test(key)) {
                const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
                const objval = objkey ? this.getval(objkey) : ''
                if (objval) {
                    try {
                        const objedval = JSON.parse(objval)
                        val = objedval ? this.lodash_get(objedval, paths, '') : val
                    } catch (e) {
                        val = ''
                    }
                }
            }
            return val
        }

        setdata(val, key) {
            let issuc = false
            if (/^@/.test(key)) {
                const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
                const objdat = this.getval(objkey)
                const objval = objkey ? (objdat === 'null' ? null : objdat || '{}') : '{}'
                try {
                    const objedval = JSON.parse(objval)
                    this.lodash_set(objedval, paths, val)
                    issuc = this.setval(JSON.stringify(objedval), objkey)
                } catch (e) {
                    const objedval = {}
                    this.lodash_set(objedval, paths, val)
                    issuc = this.setval(JSON.stringify(objedval), objkey)
                }
            } else {
                issuc = this.setval(val, key)
            }
            return issuc
        }

        getval(key) {
            if (this.isSurge() || this.isLoon()) {
                return $persistentStore.read(key)
            } else if (this.isQuanX()) {
                return $prefs.valueForKey(key)
            } else if (this.isNode()) {
                this.data = this.loaddata()
                return this.data[key]
            } else {
                return (this.data && this.data[key]) || null
            }
        }

        setval(val, key) {
            if (this.isSurge() || this.isLoon()) {
                return $persistentStore.write(val, key)
            } else if (this.isQuanX()) {
                return $prefs.setValueForKey(val, key)
            } else if (this.isNode()) {
                this.data = this.loaddata()
                this.data[key] = val
                this.writedata()
                return true
            } else {
                return (this.data && this.data[key]) || null
            }
        }

        initGotEnv(opts) {
            this.got = this.got ? this.got : require('got')
            this.cktough = this.cktough ? this.cktough : require('tough-cookie')
            this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()
            if (opts) {
                opts.headers = opts.headers ? opts.headers : {}
                if (undefined === opts.headers.Cookie && undefined === opts.cookieJar) {
                    opts.cookieJar = this.ckjar
                }
            }
        }

        get(opts, callback = () => {}) {
            if (opts.headers) {
                delete opts.headers['Content-Type']
                delete opts.headers['Content-Length']
            }
            if (this.isSurge() || this.isLoon()) {
                if (this.isSurge() && this.isNeedRewrite) {
                    opts.headers = opts.headers || {}
                    Object.assign(opts.headers, {
                        'X-Surge-Skip-Scripting': false
                    })
                }
                $httpClient.get(opts, (err, resp, body) => {
                    if (!err && resp) {
                        resp.body = body
                        resp.statusCode = resp.status
                    }
                    callback(err, resp, body)
                })
            } else if (this.isQuanX()) {
                if (this.isNeedRewrite) {
                    opts.opts = opts.opts || {}
                    Object.assign(opts.opts, {
                        hints: false
                    })
                }
                $task.fetch(opts).then(
                    (resp) => {
                        const {
                            statusCode: status,
                            statusCode,
                            headers,
                            body
                        } = resp
                        callback(null, {
                            status,
                            statusCode,
                            headers,
                            body
                        }, body)
                    },
                    (err) => callback(err)
                )
            } else if (this.isNode()) {
                this.initGotEnv(opts)
                this.got(opts)
                    .on('redirect', (resp, nextOpts) => {
                        try {
                            const ck = resp.headers['set-cookie'].map(this.cktough.Cookie.parse).toString()
                            this.ckjar.setCookieSync(ck, null)
                            nextOpts.cookieJar = this.ckjar
                        } catch (e) {
                            this.logErr(e)
                        }
                        // this.ckjar.setCookieSync(resp.headers['set-cookie'].map(Cookie.parse).toString())
                    })
                    .then(
                        (resp) => {
                            const {
                                statusCode: status,
                                statusCode,
                                headers,
                                body
                            } = resp
                            callback(null, {
                                status,
                                statusCode,
                                headers,
                                body
                            }, body)
                        },
                        (err) => {
                            const {
                                message: error,
                                response: resp
                            } = err
                            callback(error, resp, resp && resp.body)
                        }
                    )
            }
        }

        post(opts, callback = () => {}) {
            // 如果指定了请求体, 但没指定`Content-Type`, 则自动生成
            if (opts.body && opts.headers && !opts.headers['Content-Type']) {
                opts.headers['Content-Type'] = 'application/x-www-form-urlencoded'
            }
            if (opts.headers) delete opts.headers['Content-Length']
            if (this.isSurge() || this.isLoon()) {
                if (this.isSurge() && this.isNeedRewrite) {
                    opts.headers = opts.headers || {}
                    Object.assign(opts.headers, {
                        'X-Surge-Skip-Scripting': false
                    })
                }
                $httpClient.post(opts, (err, resp, body) => {
                    if (!err && resp) {
                        resp.body = body
                        resp.statusCode = resp.status
                    }
                    callback(err, resp, body)
                })
            } else if (this.isQuanX()) {
                opts.method = 'POST'
                if (this.isNeedRewrite) {
                    opts.opts = opts.opts || {}
                    Object.assign(opts.opts, {
                        hints: false
                    })
                }
                $task.fetch(opts).then(
                    (resp) => {
                        const {
                            statusCode: status,
                            statusCode,
                            headers,
                            body
                        } = resp
                        callback(null, {
                            status,
                            statusCode,
                            headers,
                            body
                        }, body)
                    },
                    (err) => callback(err)
                )
            } else if (this.isNode()) {
                this.initGotEnv(opts)
                const {
                    url,
                    ..._opts
                } = opts
                this.got.post(url, _opts).then(
                    (resp) => {
                        const {
                            statusCode: status,
                            statusCode,
                            headers,
                            body
                        } = resp
                        callback(null, {
                            status,
                            statusCode,
                            headers,
                            body
                        }, body)
                    },
                    (err) => {
                        const {
                            message: error,
                            response: resp
                        } = err
                        callback(error, resp, resp && resp.body)
                    }
                )
            }
        }
        /**
         *
         * 示例:$.time('yyyy-MM-dd qq HH:mm:ss.S')
         *    :$.time('yyyyMMddHHmmssS')
         *    y:年 M:月 d:日 q:季 H:时 m:分 s:秒 S:毫秒
         *    其中y可选0-4位占位符、S可选0-1位占位符，其余可选0-2位占位符
         * @param {*} fmt 格式化参数
         *
         */
        time(fmt) {
            let o = {
                'M+': new Date().getMonth() + 1,
                'd+': new Date().getDate(),
                'H+': new Date().getHours(),
                'm+': new Date().getMinutes(),
                's+': new Date().getSeconds(),
                'q+': Math.floor((new Date().getMonth() + 3) / 3),
                'S': new Date().getMilliseconds()
            }
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (new Date().getFullYear() + '').substr(4 - RegExp.$1.length))
            for (let k in o)
                if (new RegExp('(' + k + ')').test(fmt))
                    fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
            return fmt
        }

        /**
         * 系统通知
         *
         * > 通知参数: 同时支持 QuanX 和 Loon 两种格式, EnvJs根据运行环境自动转换, Surge 环境不支持多媒体通知
         *
         * 示例:
         * $.msg(title, subt, desc, 'twitter://')
         * $.msg(title, subt, desc, { 'open-url': 'twitter://', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
         * $.msg(title, subt, desc, { 'open-url': 'https://bing.com', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
         *
         * @param {*} title 标题
         * @param {*} subt 副标题
         * @param {*} desc 通知详情
         * @param {*} opts 通知参数
         *
         */
        msg(title = name, subt = '', desc = '', opts) {
            const toEnvOpts = (rawopts) => {
                if (!rawopts) return rawopts
                if (typeof rawopts === 'string') {
                    if (this.isLoon()) return rawopts
                    else if (this.isQuanX()) return {
                        'open-url': rawopts
                    }
                    else if (this.isSurge()) return {
                        url: rawopts
                    }
                    else return undefined
                } else if (typeof rawopts === 'object') {
                    if (this.isLoon()) {
                        let openUrl = rawopts.openUrl || rawopts.url || rawopts['open-url']
                        let mediaUrl = rawopts.mediaUrl || rawopts['media-url']
                        return {
                            openUrl,
                            mediaUrl
                        }
                    } else if (this.isQuanX()) {
                        let openUrl = rawopts['open-url'] || rawopts.url || rawopts.openUrl
                        let mediaUrl = rawopts['media-url'] || rawopts.mediaUrl
                        return {
                            'open-url': openUrl,
                            'media-url': mediaUrl
                        }
                    } else if (this.isSurge()) {
                        let openUrl = rawopts.url || rawopts.openUrl || rawopts['open-url']
                        return {
                            'url': openUrl
                        }
                    }
                } else {
                    return undefined
                }
            }
            if (!this.isMute) {
                if (this.isSurge() || this.isLoon()) {
                    $notification.post(title, subt, desc, toEnvOpts(opts))
                } else if (this.isQuanX()) {
                    $notify(title, subt, desc, toEnvOpts(opts))
                }
            }
            let logs = ['', '==============📣系统通知📣==============']
            logs.push(title)
            subt ? logs.push(subt) : ''
            desc ? logs.push(desc) : ''
            console.log(logs.join('\n'))
            this.logs = this.logs.concat(logs)
        }

        log(...logs) {
            if (logs.length > 0) {
                this.logs = [...this.logs, ...logs]
            }
            console.log(logs.join(this.logSeparator))
        }

        logErr(err, msg) {
            const isPrintSack = !this.isSurge() && !this.isQuanX() && !this.isLoon()
            if (!isPrintSack) {
                this.log('', `❗️${this.name}, 错误!`, err)
            } else {
                this.log('', `❗️${this.name}, 错误!`, err.stack)
            }
        }

        wait(time) {
            return new Promise((resolve) => setTimeout(resolve, time))
        }

        done(val = {}) {
            const endTime = new Date().getTime()
            const costTime = (endTime - this.startTime) / 1000
            this.log('', `🔔${this.name}, 结束! 🕛 ${costTime} 秒`)
            this.log()
            if (this.isSurge() || this.isQuanX() || this.isLoon()) {
                $done(val)
            }
        }
    })(name, opts)
}