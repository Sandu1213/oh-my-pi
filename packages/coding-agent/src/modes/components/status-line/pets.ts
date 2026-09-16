import { theme } from "../../theme/theme";

const BUCKET_MS = 120_000;
const FRESH_MS = 120_000;
const OVERLOAD_PERCENT = 85;

// Preserve Code Cat's faces, Chinese messages, and session-stable rotation.
const POOLS = {
	thinking: {
		face: "(=^-.-^=)c(_)",
		lines: [
			"本喵正在深度思考",
			"CPU 正在喵喵作响！",
			"别吵，脑回路在高速运转喵",
			"让本喵想想...鱼干放哪了？哦不，是这段逻辑",
			"思考中...这是喵生三大难题之一",
			"正在遍历九条命的解法空间",
			"递归太深，本喵先绕个毛线球出来",
			"嘘--灵感之鱼快上钩了",
			"正在编译喵思维...进度 99%",
			"深潜代码海沟，请勿打扰喵",
			"爪子搭在下巴上，进入贤者模式",
			"本喵掐指一算：这个方案能行！",
		],
	},
	idle: {
		face: "(=^.w.^=)",
		lines: [
			"本喵盯着你，放心写！",
			"主人，今天写的代码真漂亮~",
			"这行代码，本喵批准了！",
			"喵？这个变量名起得不错嘛",
			"摸鱼要适度，撸猫不限量",
			"本喵在此坐镇，bug 不敢造次",
			"键盘是你的，膝盖是本喵的",
			"写累了就看看本喵回回血",
			"今天也要优雅地 shipping 喵~",
			"记得喝水，别学本喵只舔爪子",
			"陪你 debug 到天荒地老喵",
			"尾巴测风仪显示：今日宜提交",
		],
	},
	fresh: {
		face: "(=^-.-^=)zZ",
		lines: [
			"喵呜~刚睡醒，准备好大干一场了吗？",
			"新会话开张！今天想造点什么喵？",
			"伸个懒腰...好，开工！",
			"本喵已就位，请下达指令！",
			"今日宜写码，忌摸鱼（本喵除外）",
			"魔法猫咪上线，说出你的愿望喵",
			"先定个小目标：0 error 0 warning",
			"铲屎官早！哦不，工程师早！",
			"爪子已热好，键盘已擦亮",
			"一杯咖啡一只猫，代码写到笑哈哈",
		],
	},
	overload: {
		face: "(=;x.x;=);;",
		lines: [
			"脑容量要爆炸了喵！",
			"上下文塞满小鱼干了，快 /compact 喵！",
			"记忆快溢出了，本喵开始忘事了...",
			"装不下了装不下了，清理一下喵？",
			"本喵的九条命已用掉八条半！",
			"context 高压警报，喵头顶在冒烟",
			"再不压缩，本喵就要吐毛球了",
			"内存告急！建议先保存进度喵",
		],
	},
};

export function renderPetStatus(
	sessionId: string,
	createdAt: string | undefined,
	contextPercent: number,
	isStreaming: boolean,
	now = Date.now(),
): string {
	const age = createdAt ? now - Date.parse(createdAt) : Number.POSITIVE_INFINITY;
	const state =
		contextPercent >= OVERLOAD_PERCENT ? "overload" : age < FRESH_MS ? "fresh" : isStreaming ? "thinking" : "idle";
	const pool = POOLS[state];
	let seed = 0x811c9dc5;
	for (let i = 0; i < sessionId.length; i++) {
		seed = Math.imul(seed ^ sessionId.charCodeAt(i), 0x01000193) >>> 0;
	}
	const line = pool.lines[(seed + Math.floor(now / BUCKET_MS)) % pool.lines.length];
	return `${theme.fg("warning", pool.face)} 「${line}」`;
}
