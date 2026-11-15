/**
 * 数据库种子脚本 —— 恢复初始目的地、景点、美食、住宿数据
 *
 * 用法：npx tsx prisma/seed.ts
 */
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import "dotenv/config";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:../dev.db",
});
const prisma = new PrismaClient({ adapter });

// ============= 管理员账号 =============
const adminUser = {
  id: "admin_user_001",
  name: "管理员",
  email: "admin@travel.com",
  passwordHash: "$2a$10$dummyhashplaceholderwillnotworkbutrecordwillbeinserted",
  role: "ADMIN" as const,
};

// ============= 目的地数据 =============
const destinations = [
  {
    id: "dest_suzhou",
    nameZh: "苏州",
    nameEn: "Suzhou",
    province: "江苏省",
    description: "上有天堂，下有苏杭。苏州以其精美的古典园林、水乡古镇和丝绸文化闻名于世，是中国最具江南韵味的城市之一。",
    latitude: 31.299,
    longitude: 120.585,
    country: "中国",
  },
  {
    id: "dest_kunming",
    nameZh: "昆明",
    nameEn: "Kunming",
    province: "云南省",
    description: "春城昆明，四季如春。这里有石林、滇池等自然奇观，也是体验云南多民族文化和美食的绝佳起点。",
    latitude: 25.039,
    longitude: 102.718,
    country: "中国",
  },
  {
    id: "dest_chongqing",
    nameZh: "重庆",
    nameEn: "Chongqing",
    province: "重庆市",
    description: "山城重庆，火锅之都。8D魔幻城市的立体交通、洪崖洞的璀璨夜景和无辣不欢的美食文化令人流连忘返。",
    latitude: 29.4316,
    longitude: 106.9123,
    country: "中国",
  },
  {
    id: "dest_hangzhou",
    nameZh: "杭州",
    nameEn: "Hangzhou",
    province: "浙江省",
    description: "人间天堂杭州，西湖美景天下绝。从雷峰塔到灵隐寺，从龙井茶园到钱塘江潮，处处皆诗意。",
    latitude: 30.2741,
    longitude: 120.1551,
    country: "中国",
  },
  {
    id: "dest_chengdu",
    nameZh: "成都",
    nameEn: "Chengdu",
    province: "四川省",
    description: "天府之国成都，熊猫的故乡。悠闲的茶馆文化、地道的川菜美食和丰富的历史遗迹让这座城市充满魅力。",
    latitude: 30.5728,
    longitude: 104.0668,
    country: "中国",
  },
];

// ============= 苏州景点 =============
const suzhouAttractions = [
  {
    id: "attr_suzhou_001", destinationId: "dest_suzhou",
    nameZh: "拙政园", nameEn: "Humble Administrator's Garden",
    description: "中国四大名园之一，以水为中心，山水相映，是苏州园林的代表作品。始建于明代，占地78亩。",
    address: "苏州市姑苏区东北街178号", latitude: 31.3255, longitude: 120.6301,
    ticketPrice: 70, openingHours: "7:30-17:30", phone: "0512-67510286",
  },
  {
    id: "attr_suzhou_002", destinationId: "dest_suzhou",
    nameZh: "虎丘", nameEn: "Tiger Hill",
    description: "吴中第一名胜，有2500多年历史。虎丘塔是中国斜塔，云岩寺塔举世闻名。",
    address: "苏州市姑苏区虎丘山门内8号", latitude: 31.3134, longitude: 120.5715,
    ticketPrice: 60, openingHours: "7:30-17:30", phone: "0512-65323488",
  },
  {
    id: "attr_suzhou_003", destinationId: "dest_suzhou",
    nameZh: "平江路", nameEn: "Pingjiang Road",
    description: "苏州最有代表性的历史街区，沿河小桥流水，保留了宋代以来的路河并行格局。",
    address: "苏州市姑苏区平江路", latitude: 31.3192, longitude: 120.6440,
    ticketPrice: 0, openingHours: "全天开放",
  },
  {
    id: "attr_suzhou_004", destinationId: "dest_suzhou",
    nameZh: "狮子林", nameEn: "Lion Grove Garden",
    description: "苏州四大名园之一，以假山著称，假山群峰起伏，形态各异。",
    address: "苏州市姑苏区园林路23号", latitude: 31.3244, longitude: 120.6320,
    ticketPrice: 40, openingHours: "7:30-17:00",
  },
  {
    id: "attr_suzhou_005", destinationId: "dest_suzhou",
    nameZh: "周庄古镇", nameEn: "Zhouzhuang Ancient Town",
    description: "中国第一水乡，900余年历史。双桥、沈厅、张厅等景点展现了江南水乡的独特风貌。",
    address: "苏州市昆山市周庄镇", latitude: 31.1377, longitude: 120.8478,
    ticketPrice: 100, openingHours: "8:00-21:00",
  },
];

// ============= 苏州美食 =============
const suzhouRestaurants = [
  {
    id: "rest_suzhou_001", destinationId: "dest_suzhou",
    nameZh: "松鹤楼", nameEn: "Songhe Lou",
    description: "始创于清乾隆二年（1737年），苏州最著名的百年老店，以松鼠桂鱼闻名。",
    address: "苏州市姑苏区观前街141号", cuisineType: "苏帮菜", priceRange: "¥150-300",
    openingHours: "11:00-13:30, 17:00-20:30", phone: "0512-65233890",
  },
  {
    id: "rest_suzhou_002", destinationId: "dest_suzhou",
    nameZh: "得月楼", nameEn: "Deyue Lou",
    description: "苏州传统名店，始于明嘉靖年间，招牌菜有响油鳝糊、清炒河虾仁等。",
    address: "苏州市姑苏区太监弄18号", cuisineType: "苏帮菜", priceRange: "¥120-250",
    openingHours: "11:00-13:30, 17:00-20:30",
  },
  {
    id: "rest_suzhou_003", destinationId: "dest_suzhou",
    nameZh: "哑巴生煎", nameEn: "Yaba Shengjian",
    description: "苏州人气爆棚的小吃店，生煎包底脆汁多，是苏州人的早餐首选。",
    address: "苏州市姑苏区临顿路198号", cuisineType: "小吃", priceRange: "¥20-50",
    openingHours: "6:00-13:00",
  },
  {
    id: "rest_suzhou_004", destinationId: "dest_suzhou",
    nameZh: "同得兴", nameEn: "Tongdexing",
    description: "苏州面馆代表，枫镇大面是其招牌，面条细滑，汤头鲜美。",
    address: "苏州市姑苏区十全街624号", cuisineType: "面馆", priceRange: "¥20-60",
    openingHours: "6:30-13:30",
  },
];

// ============= 苏州住宿 =============
const suzhouAccommodations = [
  {
    id: "acc_suzhou_001", destinationId: "dest_suzhou",
    nameZh: "苏州平江府酒店", nameEn: "Pingjiangfu Hotel Suzhou",
    description: "位于平江路历史街区的精品酒店，白墙黛瓦，推窗即见小桥流水。",
    address: "苏州市姑苏区平江路88号", accommodationType: "精品酒店",
    priceRange: "¥500-1200", starRating: 5, phone: "0512-65236666",
  },
  {
    id: "acc_suzhou_002", destinationId: "dest_suzhou",
    nameZh: "苏州文旅花间堂", nameEn: "Blossom Hill Suzhou",
    description: "位于历史建筑中的精品民宿，融合苏式园林风格与现代设计。",
    address: "苏州市姑苏区悬桥巷58号", accommodationType: "民宿",
    priceRange: "¥400-800", starRating: 4,
  },
];

// ============= 昆明景点 =============
const kunmingAttractions = [
  {
    id: "attr_kunming_001", destinationId: "dest_kunming",
    nameZh: "石林风景区", nameEn: "Stone Forest",
    description: "世界自然遗产，中国四大自然奇观之一。2.7亿年前的海底石灰岩经过漫长的地质变化形成了壮观的石林。",
    address: "昆明市石林彝族自治县", latitude: 24.7993, longitude: 103.2883,
    ticketPrice: 130, openingHours: "8:00-18:00", phone: "0871-67711434",
  },
  {
    id: "attr_kunming_002", destinationId: "dest_kunming",
    nameZh: "滇池", nameEn: "Dianchi Lake",
    description: "云南最大的淡水湖，高原明珠。冬季可观赏红嘴鸥，西山龙门是俯瞰滇池的最佳地点。",
    address: "昆明市西山区", latitude: 24.9069, longitude: 102.6671,
    ticketPrice: 0, openingHours: "全天开放",
  },
  {
    id: "attr_kunming_003", destinationId: "dest_kunming",
    nameZh: "翠湖公园", nameEn: "Green Lake Park",
    description: "昆明城中的一颗绿宝石，湖水碧绿如翡翠，冬季红嘴鸥成群，是市民休闲的好去处。",
    address: "昆明市五华区翠湖南路67号", latitude: 25.0424, longitude: 102.6834,
    ticketPrice: 0, openingHours: "全天开放",
  },
  {
    id: "attr_kunming_004", destinationId: "dest_kunming",
    nameZh: "云南民族村", nameEn: "Yunnan Nationalities Village",
    description: "集中展示云南26个民族的文化、建筑、服饰和风俗，是了解云南多元文化的窗口。",
    address: "昆明市西山区滇池路1308号", latitude: 24.9584, longitude: 102.6521,
    ticketPrice: 90, openingHours: "9:00-18:00",
  },
];

// ============= 昆明美食 =============
const kunmingRestaurants = [
  {
    id: "rest_kunming_001", destinationId: "dest_kunming",
    nameZh: "福照楼", nameEn: "Fuzhao Lou",
    description: "昆明老字号，以汽锅鸡闻名，选用文山三七和武定壮鸡，原汁原味。",
    address: "昆明市五华区护国路2号", cuisineType: "滇菜", priceRange: "¥80-150",
    openingHours: "11:00-21:00",
  },
  {
    id: "rest_kunming_002", destinationId: "dest_kunming",
    nameZh: "一颗印老宅院", nameEn: "Yikeyin Old Courtyard",
    description: "百年老宅改造的餐厅，传统云南菜，环境古色古香。",
    address: "昆明市五华区翠湖南路41号", cuisineType: "滇菜", priceRange: "¥60-120",
    openingHours: "10:00-22:00",
  },
  {
    id: "rest_kunming_003", destinationId: "dest_kunming",
    nameZh: "桥香园", nameEn: "Qiaoxiangyuan",
    description: "过桥米线老字号，汤鲜料足，是体验正宗过桥米线的必去之地。",
    address: "昆明市五华区护国路27号", cuisineType: "过桥米线", priceRange: "¥30-80",
    openingHours: "8:00-22:00",
  },
];

// ============= 昆明住宿 =============
const kunmingAccommodations = [
  {
    id: "acc_kunming_001", destinationId: "dest_kunming",
    nameZh: "昆明洲际酒店", nameEn: "InterContinental Kunming",
    description: "滇池畔的豪华酒店，拥有无敌湖景和完善的休闲设施。",
    address: "昆明市西山区滇池国家旅游度假区", accommodationType: "五星级酒店",
    priceRange: "¥600-1500", starRating: 5, phone: "0871-63188888",
  },
  {
    id: "acc_kunming_002", destinationId: "dest_kunming",
    nameZh: "翠湖边精品民宿", nameEn: "Green Lake Boutique B&B",
    description: "紧邻翠湖的特色民宿，推窗可见翠湖和红嘴鸥。",
    address: "昆明市五华区翠湖西路", accommodationType: "民宿",
    priceRange: "¥200-500", starRating: 4,
  },
];

// ============= 重庆景点 =============
const chongqingAttractions = [
  {
    id: "attr_chongqing_001", destinationId: "dest_chongqing",
    nameZh: "洪崖洞", nameEn: "Hongya Cave",
    description: "重庆地标性景点，依山而建的吊脚楼群，夜晚灯火辉煌，宛如《千与千寻》中的汤屋。",
    address: "重庆市渝中区嘉陵江滨江路88号", latitude: 29.5615, longitude: 106.5744,
    ticketPrice: 0, openingHours: "全天开放",
  },
  {
    id: "attr_chongqing_002", destinationId: "dest_chongqing",
    nameZh: "长江索道", nameEn: "Yangtze River Cableway",
    description: "万里长江第一条空中走廊，乘坐索道可俯瞰两江交汇的壮丽景色。",
    address: "重庆市渝中区新华路", latitude: 29.5673, longitude: 106.5790,
    ticketPrice: 20, openingHours: "7:30-22:30",
  },
  {
    id: "attr_chongqing_003", destinationId: "dest_chongqing",
    nameZh: "磁器口古镇", nameEn: "Ciqikou Ancient Town",
    description: "千年古镇，嘉陵江畔的小重庆。石板路、老茶馆、陈麻花，满满的市井烟火气。",
    address: "重庆市沙坪坝区磁器口", latitude: 29.5753, longitude: 106.4408,
    ticketPrice: 0, openingHours: "全天开放",
  },
  {
    id: "attr_chongqing_004", destinationId: "dest_chongqing",
    nameZh: "解放碑步行街", nameEn: "Jiefangbei Pedestrian Street",
    description: "重庆最繁华的商圈，中国西部第一街。是重庆的商业中心和城市名片。",
    address: "重庆市渝中区解放碑", latitude: 29.5630, longitude: 106.5754,
    ticketPrice: 0, openingHours: "全天开放",
  },
  {
    id: "attr_chongqing_005", destinationId: "dest_chongqing",
    nameZh: "武隆天生三桥", nameEn: "Wulong Natural Three Bridges",
    description: "世界自然遗产，电影《满城尽带黄金甲》和《变形金刚4》的取景地。",
    address: "重庆市武隆区仙女山镇", latitude: 29.3886, longitude: 107.7647,
    ticketPrice: 125, openingHours: "8:30-17:00",
  },
];

// ============= 重庆美食 =============
const chongqingRestaurants = [
  {
    id: "rest_chongqing_001", destinationId: "dest_chongqing",
    nameZh: "珮姐老火锅", nameEn: "Peijie Hotpot",
    description: "重庆网红火锅，九宫格牛油锅底麻辣鲜香，排队两小时也值得。",
    address: "重庆市渝中区较场口", cuisineType: "火锅", priceRange: "¥80-150",
    openingHours: "11:00-次日02:00",
  },
  {
    id: "rest_chongqing_002", destinationId: "dest_chongqing",
    nameZh: "花市豌杂面", nameEn: "Huashi Wanza Noodles",
    description: "重庆小面代表，豌豆软糯、杂酱浓郁，是重庆人的早餐灵魂。",
    address: "重庆市渝中区民生路", cuisineType: "面馆", priceRange: "¥15-30",
    openingHours: "6:30-14:00",
  },
  {
    id: "rest_chongqing_003", destinationId: "dest_chongqing",
    nameZh: "厨神酸辣粉", nameEn: "Chushen Hot & Sour Noodles",
    description: "重庆酸辣粉名店，粉条劲道，酸辣开胃，配上酥脆的花生碎绝了。",
    address: "重庆市渝中区八一路好吃街", cuisineType: "小吃", priceRange: "¥10-25",
    openingHours: "9:00-22:00",
  },
];

// ============= 重庆住宿 =============
const chongqingAccommodations = [
  {
    id: "acc_chongqing_001", destinationId: "dest_chongqing",
    nameZh: "重庆丽晶酒店", nameEn: "Regent Chongqing",
    description: "位于江北嘴CBD，坐拥两江交汇美景，奢华舒适。",
    address: "重庆市江北区江北城大道", accommodationType: "五星级酒店",
    priceRange: "¥700-1800", starRating: 5, phone: "023-89088888",
  },
  {
    id: "acc_chongqing_002", destinationId: "dest_chongqing",
    nameZh: "洪崖洞江景民宿", nameEn: "Hongyadong River View B&B",
    description: "紧邻洪崖洞，窗外即是嘉陵江夜景，沉浸式体验重庆8D魔幻。",
    address: "重庆市渝中区嘉陵江滨江路", accommodationType: "民宿",
    priceRange: "¥300-600", starRating: 4,
  },
];

// ============= 杭州景点 =============
const hangzhouAttractions = [
  {
    id: "attr_hangzhou_001", destinationId: "dest_hangzhou",
    nameZh: "西湖", nameEn: "West Lake",
    description: "世界文化遗产，人间天堂的核心。苏堤春晓、断桥残雪、三潭印月，每一处都是诗画。",
    address: "杭州市西湖区", latitude: 30.2426, longitude: 120.1486,
    ticketPrice: 0, openingHours: "全天开放",
  },
  {
    id: "attr_hangzhou_002", destinationId: "dest_hangzhou",
    nameZh: "灵隐寺", nameEn: "Lingyin Temple",
    description: "江南名刹，始建于东晋咸和元年（326年），飞来峰石窟造像珍贵无比。",
    address: "杭州市西湖区灵隐路法云弄1号", latitude: 30.2413, longitude: 120.0996,
    ticketPrice: 75, openingHours: "7:30-18:15",
  },
  {
    id: "attr_hangzhou_003", destinationId: "dest_hangzhou",
    nameZh: "千岛湖", nameEn: "Qiandao Lake",
    description: "天下第一秀水，1078个岛屿星罗棋布，湖水清澈见底，是度假胜地。",
    address: "杭州市淳安县", latitude: 29.6047, longitude: 119.0134,
    ticketPrice: 150, openingHours: "8:00-16:30",
  },
  {
    id: "attr_hangzhou_004", destinationId: "dest_hangzhou",
    nameZh: "龙井村", nameEn: "Longjing Village",
    description: "中国十大名茶龙井的产地，茶园梯田层叠，是品茶踏青的好去处。",
    address: "杭州市西湖区龙井路", latitude: 30.2075, longitude: 120.1280,
    ticketPrice: 0, openingHours: "全天开放",
  },
];

// ============= 杭州美食 =============
const hangzhouRestaurants = [
  {
    id: "rest_hangzhou_001", destinationId: "dest_hangzhou",
    nameZh: "楼外楼", nameEn: "Louwailou",
    description: "始创于清道光二十八年（1848年），西湖边的百年老店。西湖醋鱼、东坡肉是招牌。",
    address: "杭州市西湖区孤山路30号", cuisineType: "杭帮菜", priceRange: "¥100-250",
    openingHours: "11:00-14:00, 17:00-20:30", phone: "0571-87969681",
  },
  {
    id: "rest_hangzhou_002", destinationId: "dest_hangzhou",
    nameZh: "外婆家", nameEn: "Grandma's Kitchen",
    description: "杭帮菜连锁品牌，性价比极高。茶香鸡、外婆红烧肉是必点菜品。",
    address: "杭州市西湖区龙井路1号", cuisineType: "杭帮菜", priceRange: "¥50-100",
    openingHours: "10:30-21:00",
  },
  {
    id: "rest_hangzhou_003", destinationId: "dest_hangzhou",
    nameZh: "知味观", nameEn: "Zhiweiguan",
    description: "杭州老字号小吃店，小笼包、猫耳朵、片儿川，道道经典。",
    address: "杭州市上城区仁和路83号", cuisineType: "小吃", priceRange: "¥30-80",
    openingHours: "6:30-21:00",
  },
];

// ============= 杭州住宿 =============
const hangzhouAccommodations = [
  {
    id: "acc_hangzhou_001", destinationId: "dest_hangzhou",
    nameZh: "杭州西湖国宾馆", nameEn: "West Lake State Guest House",
    description: "西湖边的国宾馆，坐拥最美湖景，是国宾级的入住体验。",
    address: "杭州市西湖区杨公堤18号", accommodationType: "五星级酒店",
    priceRange: "¥1200-3000", starRating: 5, phone: "0571-87979889",
  },
];

// ============= 成都景点 =============
const chengduAttractions = [
  {
    id: "attr_chengdu_001", destinationId: "dest_chengdu",
    nameZh: "大熊猫繁育研究基地", nameEn: "Chengdu Research Base of Giant Panda Breeding",
    description: "全球最大的大熊猫人工繁育基地，近距离观赏国宝大熊猫的萌态。",
    address: "成都市成华区外北熊猫大道1375号", latitude: 30.7346, longitude: 104.1457,
    ticketPrice: 55, openingHours: "7:30-18:00",
  },
  {
    id: "attr_chengdu_002", destinationId: "dest_chengdu",
    nameZh: "宽窄巷子", nameEn: "Kuanzhai Alley",
    description: "成都名片，由宽巷子、窄巷子、井巷子组成，保留了清朝时期的四合院格局。",
    address: "成都市青羊区长顺街附近", latitude: 30.6723, longitude: 104.0523,
    ticketPrice: 0, openingHours: "全天开放",
  },
  {
    id: "attr_chengdu_003", destinationId: "dest_chengdu",
    nameZh: "锦里古街", nameEn: "Jinli Ancient Street",
    description: "西蜀历史上最古老的商业街之一，浓缩了成都生活的精华：茶馆、酒肆、戏台。",
    address: "成都市武侯区武侯祠大街231号", latitude: 30.6453, longitude: 104.0488,
    ticketPrice: 0, openingHours: "全天开放",
  },
  {
    id: "attr_chengdu_004", destinationId: "dest_chengdu",
    nameZh: "都江堰", nameEn: "Dujiangyan Irrigation System",
    description: "世界文化遗产，2000多年前李冰父子修建的水利工程，至今仍在发挥灌溉作用。",
    address: "成都市都江堰市", latitude: 31.0027, longitude: 103.6115,
    ticketPrice: 80, openingHours: "8:00-18:00",
  },
];

// ============= 成都美食 =============
const chengduRestaurants = [
  {
    id: "rest_chengdu_001", destinationId: "dest_chengdu",
    nameZh: "蜀大侠火锅", nameEn: "Shudaxia Hotpot",
    description: "成都人气火锅，牛油红锅翻滚着辣椒和花椒，麻辣鲜香。",
    address: "成都市锦江区东大街", cuisineType: "火锅", priceRange: "¥80-150",
    openingHours: "11:00-次日03:00",
  },
  {
    id: "rest_chengdu_002", destinationId: "dest_chengdu",
    nameZh: "陈麻婆豆腐", nameEn: "Chen Mapo Tofu",
    description: "始创于清同治年间的百年老店，麻婆豆腐的发源地。",
    address: "成都市青羊区西玉龙街197号", cuisineType: "川菜", priceRange: "¥40-80",
    openingHours: "11:00-21:30",
  },
  {
    id: "rest_chengdu_003", destinationId: "dest_chengdu",
    nameZh: "龙抄手", nameEn: "Long Chaoshou",
    description: "成都小吃名店，抄手皮薄馅嫩，红油、清汤、鸡汤多种口味。",
    address: "成都市锦江区春熙路南段6-8号", cuisineType: "小吃", priceRange: "¥20-50",
    openingHours: "9:00-21:30",
  },
];

// ============= 成都住宿 =============
const chengduAccommodations = [
  {
    id: "acc_chengdu_001", destinationId: "dest_chengdu",
    nameZh: "成都博舍酒店", nameEn: "The Temple House Chengdu",
    description: "太古里旁的精品酒店，清朝庭院与现代设计完美融合。",
    address: "成都市锦江区笔贴式街81号", accommodationType: "精品酒店",
    priceRange: "¥800-2000", starRating: 5, phone: "028-66368888",
  },
  {
    id: "acc_chengdu_002", destinationId: "dest_chengdu",
    nameZh: "宽窄巷子四合院民宿", nameEn: "Kuanzhai Courtyard B&B",
    description: "传统四合院改造，青砖灰瓦间感受老成都的慢生活。",
    address: "成都市青羊区宽巷子", accommodationType: "民宿",
    priceRange: "¥300-700", starRating: 4,
  },
];

async function main() {
  console.log("🌱 开始填充数据库...\n");

  // 创建管理员
  try {
    await prisma.user.upsert({
      where: { id: adminUser.id },
      update: {},
      create: adminUser,
    });
    console.log("✅ 管理员账号已创建 (admin@travel.com)");
  } catch {
    console.log("ℹ️  管理员账号已存在，跳过");
  }

  // 创建目的地
  for (const d of destinations) {
    await prisma.destination.upsert({
      where: { id: d.id },
      update: { ...d, status: "APPROVED", isPublished: true },
      create: { ...d, status: "APPROVED", isPublished: true },
    });
  }
  console.log(`✅ ${destinations.length} 个目的地已创建`);

  // 创建景点
  const allAttractions = [
    ...suzhouAttractions,
    ...kunmingAttractions,
    ...chongqingAttractions,
    ...hangzhouAttractions,
    ...chengduAttractions,
  ];
  for (const a of allAttractions) {
    await prisma.attraction.upsert({
      where: { id: a.id },
      update: { ...a, status: "APPROVED", isPublished: true },
      create: { ...a, status: "APPROVED", isPublished: true },
    });
  }
  console.log(`✅ ${allAttractions.length} 个景点已创建`);

  // 创建美食
  const allRestaurants = [
    ...suzhouRestaurants,
    ...kunmingRestaurants,
    ...chongqingRestaurants,
    ...hangzhouRestaurants,
    ...chengduRestaurants,
  ];
  for (const r of allRestaurants) {
    await prisma.restaurant.upsert({
      where: { id: r.id },
      update: { ...r, status: "APPROVED", isPublished: true },
      create: { ...r, status: "APPROVED", isPublished: true },
    });
  }
  console.log(`✅ ${allRestaurants.length} 家美食已创建`);

  // 创建住宿
  const allAccommodations = [
    ...suzhouAccommodations,
    ...kunmingAccommodations,
    ...chongqingAccommodations,
    ...hangzhouAccommodations,
    ...chengduAccommodations,
  ];
  for (const a of allAccommodations) {
    await prisma.accommodation.upsert({
      where: { id: a.id },
      update: { ...a, isPublished: true },
      create: { ...a, isPublished: true },
    });
  }
  console.log(`✅ ${allAccommodations.length} 家住宿已创建`);

  console.log("\n🎉 数据库填充完成！");
  console.log("   目的地:", destinations.length);
  console.log("   景点:", allAttractions.length);
  console.log("   美食:", allRestaurants.length);
  console.log("   住宿:", allAccommodations.length);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ 种子脚本执行失败:", e);
  process.exit(1);
});
