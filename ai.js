/**
 * 迎屿 · Yoni · AI 情绪解析与运势引擎 (ai.js)
 * 全自动智能陪伴：浅紫色小考拉 盈盈 (金黄色小皇冠 + 粉色小蝴蝶结 + 浅色小圆鼻)
 * 开箱即用，无需用户手动配置任何 API 密钥
 */

const CozyAI = {
  // 1. 星座计算函数
  getZodiacSign(month, day) {
    const dates = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 22, 22];
    const signs = [
      { name: "水瓶座", icon: "♒" },
      { name: "双鱼座", icon: "♓" },
      { name: "白羊座", icon: "♈" },
      { name: "金牛座", icon: "♉" },
      { name: "双子座", icon: "♊" },
      { name: "巨蟹座", icon: "♋" },
      { name: "狮子座", icon: "♌" },
      { name: "处女座", icon: "♍" },
      { name: "天秤座", icon: "♎" },
      { name: "天蝎座", icon: "♏" },
      { name: "射手座", icon: "♐" },
      { name: "摩羯座", icon: "♑" }
    ];
    let index = month - 1;
    if (day < dates[index]) {
      index = (index + 11) % 12;
    }
    return signs[index];
  },

  // 2. 根据星座与日期生成今日运势与幸运物
  generateDailyHoroscope(sign, dateStr) {
    const luckyColors = [
      { name: "奶油淡杏", hex: "#FDEED9" },
      { name: "鼠尾草绿", hex: "#E2F0D9" },
      { name: "雾霾淡蓝", hex: "#E1F0F5" },
      { name: "浅薰衣草", hex: "#EDE4F5" },
      { name: "樱花淡粉", hex: "#FCE1E4" },
      { name: "焦糖暖黄", hex: "#FFF2D7" }
    ];

    const affirmations = [
      "微风正柔，今天特别适合深呼吸，慢慢完成手头的一件小事。",
      "无论外面节奏多快，迎屿小天地始终温暖。保持自己的节奏，你很棒。",
      "今天会有意想不到的小确幸在拐角等你，记得多留意身边的温柔细节。",
      "如果感到累了就给花浇点水，允许自己今天只做一朵安静舒展的云。",
      "专注的时光会在暗中积累力量，今天的小小努力，盈盈都悄悄看见了。"
    ];

    const seed = (dateStr + sign.name).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const color = luckyColors[seed % luckyColors.length];
    const number = (seed % 9) + 1;
    const quote = affirmations[seed % affirmations.length];

    return {
      signName: sign.name,
      signIcon: sign.icon,
      luckyColor: color.name,
      luckyColorHex: color.hex,
      luckyNumber: number,
      affirmation: quote
    };
  },

  // 3. 核心：情绪日记分析与暖心生成 (全自动运行，无需配置)
  async analyzeJournalEntry(userText) {
    // 模拟微小的智能思考延时感 (0.5秒)
    await new Promise(resolve => setTimeout(resolve, 500));
    return this._localSmartAnalyze(userText);
  },

  // 本地智能情感分析引擎 (细腻情绪感知与贴心闺蜜级回话)
  _localSmartAnalyze(text) {
    const patterns = [
      {
        keys: ["累", "疲惫", "头疼", "熬夜", "烦", "好难", "压力", "焦虑", "迷茫", "无聊", "卡住", "做不完", "差劲", "难过", "哭", "委屈"],
        moodLabel: "💜 疲惫释怀",
        moodColor: "#EDE4F5",
        weather: "🌧️ 柔雨渐歇",
        replies: [
          "辛苦你啦！今天一定扛了好多不容易吧。难做的事情今天就先告一段落，抱抱疲惫的自己，你已经很了不起了。今晚喝杯温水，钻进被窝好好睡个长觉吧。",
          "深呼吸一口气～事情永远做不完，但你的身心比任何计划都珍贵。今天即使只完成了 1%，也是实实在在的前进。盈盈扶好头顶的小皇冠，给你递一朵盛开的小花，今晚不许苛责自己哦。"
        ]
      },
      {
        keys: ["开心", "哈哈", "成功", "做好了", "搞定", "吃到了", "买到", "超棒", "喜欢", "赞", "充实", "幸运", "快乐", "棒", "好耶"],
        moodLabel: "💛 温暖元气",
        moodColor: "#FFF2D7",
        weather: "☀️ 晴空万里",
        replies: [
          "太棒啦！隔着屏幕都能感受到你今天满满的元气和好心情！这种雀跃的小快乐值得被好好记在心底，盈盈摇晃着大耳朵在为你鼓掌呢，继续灿烂下去吧！",
          "哇，真是超级充实而闪闪发光的一天！生活正是由这一个接一个的小确幸串起来的。今晚带着这份好心情入梦，明天也一定会元气满满！"
        ]
      },
      {
        keys: ["奶茶", "甜品", "蛋糕", "猫", "狗", "朋友", "散步", "夕阳", "微风", "电影", "咖啡", "治愈", "浪漫", "花"],
        moodLabel: "🌸 焦糖甜梦",
        moodColor: "#FCE1E4",
        weather: "🌤️ 柔光微甜",
        replies: [
          "生活里的浪漫往往就藏在这些甜甜的细节里。能够捕捉到这些温柔瞬间的你，本身就拥有一颗很柔软细腻的心。今天是一百分的温柔日常！",
          "好治愈的小日常呀！有时候一杯合心意的饮品、一段慢悠悠的散步，就能抵御一整天的琐碎。盈盈摆了摆脖子上的粉色小蝴蝶结，祝这份小确幸在心头停留得再久一点。"
        ]
      },
      {
        keys: ["平静", "日常", "看书", "写代码", "自习", "听歌", "发呆", "整理", "普通", "一个人", "学习"],
        moodLabel: "🌱 宁静舒展",
        moodColor: "#E2F0D9",
        weather: "⛅ 舒适微风",
        replies: [
          "平淡而宁静的日子，其实是生命中最珍贵的蓄力期。在迎屿这个小角落里静静陪着花朵抽芽，生活正以它最舒适的节奏缓缓前行，这样就很好。",
          "安宁的一天～在属于自己的节奏里有条不紊，也是一种很棒的幸福。盈盈趴在窗台静静陪着你，祝你有宁静香甜的夜晚。"
        ]
      }
    ];

    for (const p of patterns) {
      if (p.keys.some(k => text.includes(k))) {
        const reply = p.replies[Math.floor(Math.random() * p.replies.length)];
        return {
          moodLabel: p.moodLabel,
          moodColor: p.moodColor,
          weather: p.weather,
          summaryReply: reply
        };
      }
    }

    return {
      moodLabel: "✨ 温润日常",
      moodColor: "#E1F0F5",
      weather: "🌤️ 晴转微风",
      summaryReply: "谢谢你把这一刻的心情托付给迎屿。无论是波澜壮阔还是柴米油盐，真诚记录下来的每一天都独一无二。今天也好好爱自己，明天见！"
    };
  },

  // 4. 核心：智能日程意图解析引擎 (自然语言解析：日期、时间、事件地点)
  parseScheduleIntent(text) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    const currentDayOfWeek = now.getDay(); // 0 是周日, 1-6 是周一到周六

    const weekNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

    let targetDate = new Date(now);
    let dateStr = "";
    let dayOfWeekStr = "";

    // 1) 解析星期/周：如 "下周二", "下星期三", "这周五", "明天", "后天"
    const weekMap = {
      "一": 1, "1": 1,
      "二": 2, "2": 2,
      "三": 3, "3": 3,
      "四": 4, "4": 4,
      "五": 5, "5": 5,
      "六": 6, "6": 6,
      "天": 0, "日": 0, "7": 0
    };

    if (text.includes("大后天")) {
      targetDate.setDate(now.getDate() + 3);
    } else if (text.includes("后天")) {
      targetDate.setDate(now.getDate() + 2);
    } else if (text.includes("明天")) {
      targetDate.setDate(now.getDate() + 1);
    } else if (text.includes("今天")) {
      targetDate = new Date(now);
    } else {
      // 检查 "下周X", "下星期X", "下个礼拜X"
      const nextWeekMatch = text.match(/(?:下周|下星期|下个礼拜)([一二三四五六天日1-7])/);
      const thisWeekMatch = text.match(/(?:这周|本周|这个星期|这星期|这礼拜)([一二三四五六天日1-7])/);
      const anyWeekMatch = text.match(/(?:周|星期|礼拜)([一二三四五六天日1-7])/);

      if (nextWeekMatch) {
        const targetWeekday = weekMap[nextWeekMatch[1]];
        let daysToAdd = (targetWeekday - currentDayOfWeek + 7) % 7;
        if (daysToAdd === 0) daysToAdd = 7;
        daysToAdd += 7; // 下周
        targetDate.setDate(now.getDate() + daysToAdd);
      } else if (thisWeekMatch) {
        const targetWeekday = weekMap[thisWeekMatch[1]];
        let daysToAdd = (targetWeekday - currentDayOfWeek + 7) % 7;
        targetDate.setDate(now.getDate() + daysToAdd);
      } else if (anyWeekMatch) {
        const targetWeekday = weekMap[anyWeekMatch[1]];
        let daysToAdd = (targetWeekday - currentDayOfWeek + 7) % 7;
        if (daysToAdd === 0) daysToAdd = 7;
        targetDate.setDate(now.getDate() + daysToAdd);
      }
    }

    // 格式化日期
    const y = targetDate.getFullYear();
    const m = String(targetDate.getMonth() + 1).padStart(2, '0');
    const d = String(targetDate.getDate()).padStart(2, '0');
    dayOfWeekStr = weekNames[targetDate.getDay()];
    dateStr = `${y}-${m}-${d} (${dayOfWeekStr})`;

    // 2) 解析时间段：如 "下午6点 到晚上8点", "下午6:00-20:00", "上午9点半", "晚上8点"
    let timeStr = "全天待办";
    
    // 解析具体小时数字与修饰词
    const parseHour = (part) => {
      let isPM = /下午|晚上|傍晚|夜里|夜间/.test(part);
      let isAM = /上午|早上|早晨|清晨/.test(part);
      let matchNum = part.match(/(\d{1,2})(?:[:：点点钟](\d{1,2}))?/);
      if (!matchNum) {
        // 中文数字
        const cnNums = { "一": 1, "二": 2, "两": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9, "十": 10, "十一": 11, "十二": 12 };
        const cnMatch = part.match(/([一二两三四五六七八九十]+)点/);
        if (cnMatch && cnNums[cnMatch[1]]) {
          let h = cnNums[cnMatch[1]];
          if (isPM && h < 12) h += 12;
          return `${String(h).padStart(2, '0')}:00`;
        }
        return null;
      }
      let h = parseInt(matchNum[1], 10);
      let min = matchNum[2] ? parseInt(matchNum[2], 10) : 0;
      if (part.includes("半")) min = 30;
      if (isPM && h < 12) h += 12;
      return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
    };

    // 匹配类似 "下午6点 到晚上8点" 或 "18:00至20:00"
    const rangeMatch = text.match(/(.*?[上下]?[午|晚|早]?[晨]?[0-9一二两三四五六七八九十]{1,2}(?:点半|点钟|点|:|\s)?(?:\d{2})?)\s*(?:到|至|-|~)\s*(.*?[上下]?[午|晚|早]?[晨]?[0-9一二两三四五六七八九十]{1,2}(?:点半|点钟|点|:|\s)?(?:\d{2})?)/);
    if (rangeMatch) {
      const startT = parseHour(rangeMatch[1]);
      const endT = parseHour(rangeMatch[2]);
      if (startT && endT) {
        timeStr = `${startT} - ${endT}`;
      } else if (startT) {
        timeStr = `${startT}`;
      }
    } else {
      // 单一时间点
      const singleTimeMatch = text.match(/([上下]?[午|晚|早]?[晨]?[0-9一二两三四五六七八九十]{1,2}(?:点半|点钟|点|:\d{2}))/);
      if (singleTimeMatch) {
        const parsed = parseHour(singleTimeMatch[1]);
        if (parsed) timeStr = parsed;
      }
    }

    // 3) 解析事件/事项名称：去除时间词、连词、动词
    let cleanedEvent = text;
    const removeKeywords = [
      /我(?:觉得|打算|想|要|下)?/,
      /下周[一二三四五六天日1-7]/g,
      /这周[一二三四五六天日1-7]/g,
      /周[一二三四五六天日1-7]/g,
      /星期[一二三四五六天日1-7]/g,
      /礼拜[一二三四五六天日1-7]/g,
      /今天|明天|后天|大后天/g,
      /[上下]?[午|晚|早]?[晨]?[0-9一二两三四五六七八九十]{1,2}(?:点半|点钟|点|\d{2})?/g,
      /\d{1,2}:\d{2}/g,
      /到|至|-|~/g,
      /有个|有场|准备去|打算去|要去|一个/g,
      /帮我记|加进日历|提醒我|加进todo/g
    ];

    removeKeywords.forEach(regex => {
      cleanedEvent = cleanedEvent.replace(regex, " ");
    });

    cleanedEvent = cleanedEvent.replace(/\s+/g, " ").trim();
    if (!cleanedEvent || cleanedEvent.length < 2) {
      cleanedEvent = "重要专属行程";
    }

    // 美化事件文本 (如果提到了考试，学校等，更自然)
    let formattedEvent = cleanedEvent;
    if (text.includes("考试") && text.includes("学校")) {
      formattedEvent = "学校考场 · 期末/专业考试 ✍️";
    } else if (text.includes("考试")) {
      formattedEvent = `${cleanedEvent} ✍️`;
    } else if (text.includes("开会") || text.includes("会议") || text.includes("meeting")) {
      formattedEvent = `${cleanedEvent} 💼`;
    } else if (text.includes("聚会") || text.includes("吃饭") || text.includes("玩")) {
      formattedEvent = `${cleanedEvent} 🍰`;
    } else if (text.includes("打卡") || text.includes("自习")) {
      formattedEvent = `${cleanedEvent} 📖`;
    }

    return {
      rawText: text,
      dateFormatted: dateStr,
      timeRange: timeStr,
      eventTitle: formattedEvent
    };
  }
};

