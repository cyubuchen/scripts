// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: rss-square;
/*
 * Author: cyubuchen
 * Github: https://github.com/cyubuchen
 * 本脚本使用了@Gideon_Senku的Env.scriptable，感谢！
 */

const goupdate = true; //默认自动更新
const $ = importModule("Env");
var num = 6; //自定义显示数量
var rancolor = true; //true为开启随机颜色
var whichChannel = 0; // 0代表最新, 1代表推荐, 2代表创投, 3代表Markets, 4代表汽车, 5代表科技, 6代表企服, 7金融, 8生活, 9创新, 10房产, 11职场, 12会员, 13其他

try {
    var {
        Kr_num,
        Kr_rancolor
    } = importModule("Config");
    num = Kr_num();
    rancolor = Kr_rancolor();
    console.log("将使用配置文件Config.js的36Kr配置");
} catch (e) {
    console.log("将使用本脚本内的36Kr配置");
}

if (whichChannel == 0) {
    var whichChannel_ = "web_news/latest";
} else if (whichChannel == 1) {
    var whichChannel_ = "web_recommend";
} else if (whichChannel == 2) {
    var whichChannel_ = "contact";
} else if (whichChannel == 3) {
    var whichChannel_ = "ccs";
} else if (whichChannel == 4) {
    var whichChannel_ = "travel"
} else if (whichChannel == 5) {
    var whichChannel_ = "technology"
} else if (whichChannel == 6) {
    var whichChannel_ = "enterpriseservice"
} else if (whichChannel == 7) {
    var whichChannel_ = "banking"
} else if (whichChannel == 8) {
    var whichChannel_ = "happy_life"
} else if (whichChannel == 9) {
    var whichChannel_ = "innovate"
} else if (whichChannel == 10) {
    var whichChannel_ = "real_estate"
} else if (whichChannel == 11) {
    var whichChannel_ = "web_zhichang"
} else if (whichChannel == 12) {
    var whichChannel_ = "member"
} else if (whichChannel == 13) {
    var whichChannel_ = "web_news"
} else {
    console.log("❌请填写要访问的36Kr频道对应的数字! (第14行的whichChannel的值)\n当前错误: whichChannel填写不正确!");
}

const res = await get36Kr();

let widget = createWidget(res);
Script.setWidget(widget);
Script.complete();

async function get36Kr() {
    const Kr = {
        url: `https://36kr.com/information/${whichChannel_}/`,
        headers: {
            "User-Agent": "com.apple.WebKit.Networking/8610.1.28.0.5 CFNetwork/1197 Darwin/20.0.0"
        }
    };
    const res = await $.getStr(Kr);
    let newsList = new Array();
    let newsPart = res.match(/page_flow">.*?</g);
    for (var i = 0; i < newsPart.length;) {
        if (newsPart[i] != '"page_flow\"><"') {
            var rn = newsPart[i].replace("page_flow\">", "").replace("<", "");
            if (rn.length != 0) {
                newsList.push(rn)
            }
        }
        i++;
    }
    var newsList_ = new Array();
    if (whichChannel == 0 || whichChannel == 13) {
        for (var i = 0; i < newsList.length;) {
            newsList_.push(newsList[i]);
            i = i + 3;
        }
    } else if (whichChannel >= 1 && whichChannel <= 12) {
        for (var i = 0; i < newsList.length;) {
            newsList_.push(newsList[i]);
            i = i + 2;
        }
    }
    return newsList_;
}

function createWidget(res) {
    var group = res;
    items = [];
    for (var i = 0; i < num; i++) {
        var item = group[i];
        items.push(item);
    }

    const w = new ListWidget();
    const bgColor = new LinearGradient();
    bgColor.colors = [new Color("#090113"), new Color("#252a55")];
    bgColor.locations = [0.0, 1.0];
    w.backgroundGradient = bgColor;
    w.addSpacer();
    w.spacing = 5;

    // const firstLine = w.addText(`🌈36Kr`);
    // firstLine.textSize = 7;
    // firstLine.textColor = Color.white();
    // firstLine.textOpacity = 0.7;

    for (var i = 0; i < items.length; i++) {
        addTextToListWidget(`36Kr|${items[i]}`, w);
    }

    w.addSpacer();
    w.spacing = 3;
    w.presentSmall();
    return w;
}

function addTextToListWidget(text, listWidget) {
    let item = listWidget.addText(text);
    if (rancolor == true) {
        item.textColor = new Color(color16());
    } else {
        item.textColor = Color.white();
    }
    item.textSize = 7;
}

function color16() {
    var r = Math.floor(Math.random() * 256);
    if (r + 50 < 255) {
        r = r + 50;
    }
    if (r > 230 && r < 255) {
        r = r - 50;
    }
    var g = Math.floor(Math.random() * 256);
    if (g + 50 < 255) {
        g = g + 50;
    }
    if (g > 230 && g < 255) {
        g = g - 50;
    }
    var b = Math.floor(Math.random() * 256);
    if (b + 50 < 255) {
        b = b + 50;
    }
    if (b > 230 && b < 255) {
        b = b - 50;
    }
    var color = "#" + r.toString(16) + g.toString(16) + b.toString(16);
    return color;
}

//更新代码
function update() {
    log("🔔更新脚本开始!");
    scripts.forEach(async (script) => {
        await $.getFile(script);
    });
    log("🔔更新脚本结束!");
}

const scripts = [{
    moduleName: "Get36Kr",
    url: "https://raw.githubusercontent.com/cyubuchen/scripts/scriptable/Get36Kr.js",
}, ];
if (goupdate == true) update();