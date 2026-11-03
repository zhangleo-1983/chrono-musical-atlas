import type { Motif, WorkItem } from '../domain/types';

const evocation = (bpm: number, stepsPerBeat: number, voice: Motif['voice'], midi: number[], wet = 0.08): Motif => ({
  bpm, stepsPerBeat, voice, wet,
  events: midi.map((pitch, step) => ({ step, midi: pitch, durSteps: step % 3 === 0 ? 2 : 1, vel: 0.62 })),
});

const theme = (bpm: number, stepsPerBeat: number, voice: Motif['voice'], events: Motif['events'], motifSource: string): WorkItem['motif'] & { motifKind: 'theme'; motifSource: string } => ({
  bpm, stepsPerBeat, voice, wet: 0.22, events, motifKind: 'theme', motifSource,
});

const item = (
  nodeId: string, nodeEn: string, id: string, title: string, subtitle: string, guide: string,
  publicDomain: boolean, pdBasis: string, motif?: WorkItem['motif'], motifKind?: WorkItem['motifKind'], motifSource?: string,
): WorkItem => ({ id, title, subtitle, guide, searchQuery: `${title} ${nodeEn}`, publicDomain, pdBasis, ...(motif ? { motif, motifKind, ...(motifSource ? { motifSource } : {}) } : {}) });

const fifthTheme = theme(108, 2, 'strings', [
  { step: 0, midi: [55, 67], durSteps: 1 }, { step: 1, midi: [55, 67], durSteps: 1 }, { step: 2, midi: [55, 67], durSteps: 1 }, { step: 3, midi: [51, 63], durSteps: 4 },
  { step: 8, midi: [53, 65], durSteps: 1 }, { step: 9, midi: [53, 65], durSteps: 1 }, { step: 10, midi: [53, 65], durSteps: 1 }, { step: 11, midi: [50, 62], durSteps: 6 },
], '贝多芬《第五交响曲》Op.67 第一乐章开头动机');
const moonlightTheme = theme(54, 3, 'piano', [
  { step: 0, midi: [37, 56], durSteps: 1 }, { step: 1, midi: 61, durSteps: 1 }, { step: 2, midi: 64, durSteps: 1 },
  { step: 3, midi: [37, 56], durSteps: 1 }, { step: 4, midi: 61, durSteps: 1 }, { step: 5, midi: 64, durSteps: 1 },
  { step: 6, midi: [37, 56], durSteps: 1 }, { step: 7, midi: 61, durSteps: 1 }, { step: 8, midi: 64, durSteps: 1 },
  { step: 9, midi: [37, 56], durSteps: 1 }, { step: 10, midi: 61, durSteps: 1 }, { step: 11, midi: 64, durSteps: 1 },
], '贝多芬《月光奏鸣曲》Op.27 No.2 第一乐章开头伴奏型');
const bachTheme = theme(72, 4, 'harpsichord', [60, 64, 67, 72, 76, 67, 72, 76, 60, 64, 67, 72, 76, 67, 72, 76].map((midi, step) => ({ step, midi, durSteps: 1 })), '巴赫《平均律键盘曲集》BWV 846 前奏曲第一小节');

export const REPERTOIRE_BY_NODE: Record<string, WorkItem[]> = {
  'vedic-chant': [
    item('vedic-chant', 'Vedic Chant', 'vedic-rigveda', '梨俱吠陀', '经文吟诵导赏', '这条导赏先区分经文篇章与后世音乐作品：梨俱吠陀保存的是祭仪语句，吟诵依靠口传重音、呼吸和师徒校勘延续。这里的示意声线只帮助理解高低轮廓，不声称还原某一次古代演唱。', true, '古代经文传统，无单一作者'),
    item('vedic-chant', 'Vedic Chant', 'vedic-samaveda', '娑摩吠陀', '旋律化吟诵导赏', '娑摩吠陀把经文置于更明确的歌唱框架中，重点不在固定和声而在音节、重音与延展的配合。聆听时可把它当作口传记忆技术的案例，示意乐句仅提示相对音高关系。', true, '古代口传传统，无单一作者', evocation(52, 2, 'drone', [50, 62, 63, 62, 65, 63, 62, 50]), 'evocation'),
  ],
  'zhou-ritual': [
    item('zhou-ritual', 'Zhou Ritual Music', 'zhou-yangchun', '阳春白雪', '琴乐典故导赏', '“阳春白雪”在后世文献中常被用来指代高雅琴曲与少数知音的听赏经验。导赏关注它如何成为文化记忆中的曲名，不把后世流传版本倒推为周代原谱，示意音型只取五声材料。', true, '传统曲名，作者与早期旋律不可确证', evocation(66, 4, 'pluck', [60, 62, 64, 67, 69, 67, 64, 62]), 'evocation'),
    item('zhou-ritual', 'Zhou Ritual Music', 'zhou-gaoshan', '高山流水', '知音故事导赏', '“高山流水”相关故事见于后世文献，重点是琴乐、听者和知音观念的结合。今天能听到的是历代琴家演绎的传统，不应当当作春秋时期唯一原貌；示意乐句仅呈现五声线条。', true, '传统曲名，后世琴曲传承', evocation(64, 4, 'pluck', [60, 67, 69, 67, 64, 62, 60, 62]), 'evocation'),
  ],
  'greek-modes': [
    item('greek-modes', 'Ancient Greek Modes', 'greek-delphi', '德尔斐阿波罗赞歌', '碑刻歌曲导赏', '德尔斐阿波罗赞歌的碑刻材料让后人能够讨论旋律、歌词与公共祭仪的关系，但古代记谱的读法仍需结合学者校释。此处示意按调式音级组织，不宣称是碑刻音高的唯一还原。', true, '古代碑刻材料，现代转写存在差异', evocation(66, 2, 'lyre', [62, 64, 67, 69, 67, 64, 62, 60]), 'evocation'),
    item('greek-modes', 'Ancient Greek Modes', 'greek-dionysus', '古希腊酒神颂', '诗歌与戏剧导赏', '酒神颂把诗歌节律、祭仪动作和公共戏剧联系在一起。可证材料更多呈现文本、调式理论和器物图像，完整旋律并未连续保存；示意段落用于说明短句与节拍如何相互支撑。', true, '古代诗歌与仪式传统，无完整旋律', evocation(70, 2, 'lyre', [64, 67, 69, 72, 69, 67, 64, 62]), 'evocation'),
  ],
  'gagaku': [
    item('gagaku', 'Japanese Gagaku', 'gagaku-e tenraku', '越天乐', '宫廷管弦导赏', '越天乐是雅乐曲目中最常被介绍的作品之一，长音、缓慢散拍和层叠音色共同制造庄重时间感。不同传承与编制会形成差异，示意旋律只借用五声音级，不冒充某个流派的正式谱本。', true, '宫廷雅乐传统，传承版本多样', evocation(58, 2, 'pluck', [60, 62, 67, 69, 67, 64, 62, 60]), 'evocation'),
    item('gagaku', 'Japanese Gagaku', 'gagaku-ranryo', '兰陵王', '舞乐曲目导赏', '兰陵王属于东亚宫廷舞乐共享的题材与曲目记忆，雅乐演出会把舞姿、鼓点和管弦层次结合起来。导赏强调跨地域传播与日本制度化保存，示意音型只表现缓慢循环。', true, '东亚宫廷舞乐传统', evocation(54, 2, 'pluck', [67, 69, 72, 69, 67, 64, 62, 60]), 'evocation'),
  ],
  'baghdad-maqam': [
    item('baghdad-maqam', 'Baghdad Maqam', 'maqam-rast', '木卡姆拉斯特', '调式即兴导赏', '木卡姆拉斯特不是一首固定长度的现代歌曲，而是承载旋律展开、休止和即兴段落的调式框架。导赏把重点放在音级与句法，示意段落只提供听觉入口，不替代具体演奏家的传承版本。', true, '木卡姆传统，非单一作品', evocation(58, 2, 'ud', [62, 64, 67, 69, 70, 69, 67, 64]), 'evocation'),
    item('baghdad-maqam', 'Baghdad Maqam', 'maqam-bayati', '木卡姆贝亚特', '四分音程语境导赏', '贝亚特常被用来说明近东调式中微分音和装饰音的表现力。不同地区、乐派与乐器会改变实际音高，示意片段因此只保留相邻音级的起伏，并明确它不是历史录音或固定谱本。', true, '木卡姆传统，实际音高随传承而异', evocation(60, 2, 'ud', [62, 63, 66, 67, 70, 69, 66, 63]), 'evocation'),
  ],
  'gregorian-chant': [
    item('gregorian-chant', 'Gregorian Chant', 'chant-ordinary', '弥撒常 ordinaries', '礼仪单声部导赏', '弥撒常 ordinaries 汇集礼仪中反复出现的文本段落，旋律以单声部、教会调式和自由节奏组织。不同抄本与地方传统并不完全相同，示意声线只展示无伴奏歌唱的流动感。', true, '中世纪礼仪传统，抄本版本多样', evocation(56, 2, 'drone', [50, 62, 65, 67, 65, 62, 60, 50]), 'evocation'),
    item('gregorian-chant', 'Gregorian Chant', 'chant-maria', '圣母颂歌', '圣母礼仪导赏', '圣母题材的拉丁礼仪歌唱在修道院抄写与演出中长期流传，旋律重点是文本清晰、呼吸和长线条。这里的示意音型避免指向某一份抄本，只帮助理解教会调式的级进轮廓。', true, '中世纪礼仪传统，非单一作者', evocation(52, 2, 'drone', [50, 62, 63, 67, 65, 63, 62, 50]), 'evocation'),
  ],
  'griot-mali': [
    item('griot-mali', 'Malian Griot Tradition', 'griot-kante', '坎泰·曼迪亚', '曼德口述史导赏', '曼德格里奥传统把谱系、历史和赞词交给歌者与科拉琴共同记忆。曲名所指向的是现代传播中的作品与传统语境，示意节奏只借鉴循环与呼应结构，不声称复制某次演出。', true, '曼德传统与现代传承，版本多样', evocation(108, 3, 'djembeLow', [0, 0, 0, 0, 0, 0, 0, 0]), 'evocation'),
    item('griot-mali', 'Malian Griot Tradition', 'griot-new-africa', '新非洲', '科拉琴与舞曲导赏', '科拉琴传统的听赏入口应同时关注固定低音、重复型和歌者叙事。导赏不把一条现代录音等同于所有格里奥传统，本条只提供历史导赏，避免把无固定旋律的鼓乐误写成曲谱。', true, '曼德传统与现代传承，旋律版本不可确定'),
  ],
  'hindustani': [
    item('hindustani', 'Hindustani Classical', 'hindustani-darbari', '拉格·达尔巴里', '拉格气质导赏', '拉格·达尔巴里常以低沉、宽广的旋律气质著称，但具体展开依赖演奏者、时段和师承。示意片段只给出持续低音上的轮廓，不把它写成完整拉格，也不模拟某位大师的即兴。', true, '北印度古典乐传统，演奏版本多样', evocation(52, 2, 'drone', [50, 62, 63, 65, 63, 62, 60, 50]), 'evocation'),
    item('hindustani', 'Hindustani Classical', 'hindustani-yaman', '拉格·亚曼', '夜间旋律导赏', '拉格·亚曼适合用来观察北印度音乐如何把音级、时辰和即兴路径连成整体。演奏不是固定乐谱的逐字执行，示意段落只提示上行、回落与持续音的关系。', true, '北印度古典乐传统，演奏版本多样', evocation(56, 2, 'drone', [50, 62, 64, 67, 69, 67, 64, 62]), 'evocation'),
  ],
  'leipzig-baroque': [
    item('leipzig-baroque', 'Leipzig Baroque', 'bach-wtc', '《平均律键盘曲集》', '前奏曲织体导赏', '这条试听严格采用计划给出的 BWV 846 前奏曲第一小节音高序列，作为主题示意而非完整作品。导赏关注分解和弦、持续运动与调性方向，真实演奏仍应回到巴赫谱本和演奏版本。', true, '巴赫卒于1750年；公版谱本', bachTheme, 'theme', '巴赫《平均律键盘曲集》BWV 846 前奏曲第一小节'),
    item('leipzig-baroque', 'Leipzig Baroque', 'bach-brandenburg', '《勃兰登堡协奏曲》', '协奏曲织体导赏', '勃兰登堡协奏曲把独奏声部、合奏回应和持续低音放进公共演出结构。这里不截取某段未核实的主题，只用巴洛克键盘音型作风格示意，帮助听者注意模仿、层次与节奏推进。', true, '巴赫卒于1750年；公版谱本', evocation(96, 4, 'harpsichord', [60, 64, 67, 72, 76, 72, 67, 64]), 'evocation'),
  ],
  'gamelan': [
    item('gamelan', 'Javanese Gamelan', 'gamelan-ageng', '贡·阿贡', '锣周期导赏', '加美兰的听觉核心不是西方意义上的主旋律，而是锣点、金属琴层和鼓手共同维持的周期。示意片段只呈现稀疏五声轮廓，实际调律因乐团而异，不能由此推定统一音高。', true, '爪哇传统，乐团调律各异', evocation(58, 4, 'pluck', [60, 64, 67, 69, 67, 64, 62, 60]), 'evocation'),
    item('gamelan', 'Javanese Gamelan', 'gamelan-pathet', '帕特·吉诺特', '调式与夜场导赏', '帕特与加美兰演出中的时间、场合和调律密切相关，不能只用一个西方音阶标签概括。导赏把注意力放在循环、留白和群体呼吸，示意旋律保持简洁以免伪装成具体谱本。', true, '爪哇传统，乐团调律各异', evocation(56, 4, 'pluck', [67, 69, 72, 69, 67, 64, 62, 60]), 'evocation'),
  ],
  'vienna-classical': [
    item('vienna-classical', 'Viennese Classical', 'beethoven-fifth', '《第五交响曲》', '动机发展导赏', '这里的主题试听按计划给出的四音动机逐音呈现贝多芬 Op.67 第一乐章开头材料，只截取极短片段。导赏关注动机如何在节奏、力度和配器中被反复塑形，不把示意片段包装成完整录音。', true, '贝多芬卒于1827年；公版谱本', fifthTheme, 'theme', '贝多芬《第五交响曲》Op.67 第一乐章开头动机'),
    item('vienna-classical', 'Viennese Classical', 'beethoven-moonlight', '《月光奏鸣曲》', '伴奏型导赏', '这里的主题试听按计划给出的三连音与低音双音逐音呈现 Op.27 No.2 第一乐章开头伴奏型。它只展示伴奏织体的骨架，听者仍需通过公版总谱和演奏版本理解完整作品。', true, '贝多芬卒于1827年；公版谱本', moonlightTheme, 'theme', '贝多芬《月光奏鸣曲》Op.27 No.2 第一乐章开头伴奏型'),
  ],
  'peking-opera': [
    item('peking-opera', 'Peking Opera', 'opera-guifei', '《贵妃醉酒》', '唱腔与身段导赏', '京剧作品的音乐意义常在唱腔板式、念白、锣鼓和身段的协同中显现。这里的五声示意只模拟声腔轮廓，不代替演员的润腔、行当规范和具体流派传承。', true, '传统剧目，版本与表演流派多样', evocation(72, 4, 'pluck', [60, 62, 64, 67, 69, 67, 64, 62]), 'evocation'),
    item('peking-opera', 'Peking Opera', 'opera-bawang', '《霸王别姬》', '板腔体导赏', '霸王别姬的听赏入口应从板腔体、角色行当与锣鼓点切入，而不是只寻找一条固定旋律。示意乐句借用五声级进，帮助理解唱腔与戏剧动作如何互相牵引。', true, '传统剧目，版本与表演流派多样', evocation(68, 4, 'pluck', [67, 69, 72, 69, 67, 64, 62, 60]), 'evocation'),
  ],
  'russian-national': [
    item('russian-national', 'Russian National School', 'pictures-exhibition', '《图画展览会》', '钢琴组曲导赏', '《图画展览会》以组曲段落和“漫步”连接不同画面，听者可以从主题回返、节拍变化和音色联想进入作品。此处只提供风格示意，不复述任何未核实的段落主题。', true, '穆索尔斯基卒于1881年；公版谱本', evocation(92, 2, 'strings', [60, 62, 67, 69, 67, 65, 62, 60]), 'evocation'),
    item('russian-national', 'Russian National School', 'igor-prince', '《伊戈尔王》', '歌剧与民族色彩导赏', '《伊戈尔王》的音乐把歌剧叙事、合唱和管弦配色结合起来，民族乐派的色彩并非简单复制民歌。示意声线只提示调式与宽广句法，不能当作剧中某段旋律的复原。', true, '鲍罗丁卒于1887年；公版谱本', evocation(84, 2, 'strings', [62, 64, 67, 72, 69, 67, 64, 62]), 'evocation'),
  ],
  'paris-impressionism': [
    item('paris-impressionism', 'Paris Impressionism', 'faun-prelude', '《牧神午后前奏曲》', '音色与悬置导赏', '《牧神午后前奏曲》常被用来说明管弦音色、半音游移与不急于终止的听觉经验。此处示意只借用柔和级进与长音关系，不假称复现德彪西的具体主题。', true, '德彪西卒于1918年；公版谱本', evocation(72, 2, 'strings', [64, 67, 69, 72, 69, 67, 65, 64]), 'evocation'),
    item('paris-impressionism', 'Paris Impressionism', 'la-mer', '《大海》', '管弦色彩导赏', '《大海》把海面、风势与光线转化为管弦织体的连续变化。导赏建议听辨分层、平行和弦和动态呼吸；示意片段保持抽象，不把现代合成音色当作原始管弦配器。', true, '德彪西卒于1918年；公版谱本', evocation(68, 2, 'strings', [60, 65, 69, 72, 77, 72, 69, 65]), 'evocation'),
  ],
  'delta-blues': [
    item('delta-blues', 'Delta Blues', 'cross-road', '《Cross Road Blues》', '蓝调句法导赏', '这首二十世纪歌曲受现代著作权保护，本站不提供合成试听。导赏聚焦十二小节框架、蓝调音和个人叙事如何在吉他伴奏中形成张力，正版检索入口用于继续聆听。', false, '20世纪录音与歌曲，版权状态依地区而异'),
    item('delta-blues', 'Delta Blues', 'sweet-home', '《Sweet Home Chicago》', '迁徙与城市想象导赏', '这首歌曲常被放在三角洲与芝加哥蓝调的迁徙链条中讨论。本站只提供历史语境、曲式线索和正版检索，不复制歌词或录音；听者可比较不同版本的节奏、音色与演唱口吻。', false, '20世纪录音与歌曲，版权状态依地区而异'),
  ],
  'new-orleans-jazz': [
    item('new-orleans-jazz', 'New Orleans Jazz', 'west-end-blues', '《West End Blues》', '即兴与铜管导赏', '这首录音作品受现代著作权保护，本站不生成其旋律试听。导赏关注开场独奏、铜管编制和集体即兴如何把蓝调句法转成爵士语言，并提供正版流媒体检索方向。', false, '20世纪录音与歌曲，版权状态依地区而异'),
    item('new-orleans-jazz', 'New Orleans Jazz', 'wonderful-world', '《What a Wonderful World》', '歌唱与管弦导赏', '这首流行歌曲受现代著作权保护，本站只讨论歌唱、管弦配器和公共传播，不复制歌词。正版入口让听者回到正式录音，再比较它与新奥尔良爵士传统之间的城市记忆联系。', false, '20世纪录音与歌曲，版权状态依地区而异'),
  ],
  'chicago-blues': [
    item('chicago-blues', 'Chicago Blues', 'hoochie-coochie', '《Hoochie Coochie Man》', '电声蓝调导赏', '这首歌曲受现代著作权保护，本站不提供合成试听。导赏观察电吉他、口琴、鼓与贝斯如何把十二小节蓝调推向更大的城市音量，正版检索入口用于延伸聆听。', false, '20世纪录音与歌曲，版权状态依地区而异'),
    item('chicago-blues', 'Chicago Blues', 'mannish-boy', '《Mannish Boy》', '重复句与舞台张力导赏', '这首歌曲受现代著作权保护，本站只拆解重复句、放大器音色和现场呼应的机制，不复制歌词或旋律。通过正版版本比较，可以听到芝加哥电声蓝调如何保留三角洲根系并扩大舞台存在感。', false, '20世纪录音与歌曲，版权状态依地区而异'),
  ],
  'rio-bossa': [
    item('rio-bossa', 'Rio Bossa Nova', 'chega-saudade', '《Chega de Saudade》', '切分吉他导赏', '这首歌曲受现代著作权保护，本站不提供试听。导赏聚焦桑巴切分、低声演唱和爵士和声如何形成“轻而稳”的声场，正版入口用于聆听完整编曲和不同录音版本。', false, '20世纪录音与歌曲，版权状态依地区而异'),
    item('rio-bossa', 'Rio Bossa Nova', 'garota-ipanema', '《Garota de Ipanema》', '旋律与城市声场导赏', '这首歌曲受现代著作权保护，本站只介绍波萨诺瓦的和声、吉他律动与里约城市想象，不复制歌词。继续聆听时可比较不同歌手如何在松弛拍点中保持清晰的和声流动。', false, '20世纪录音与歌曲，版权状态依地区而异'),
  ],
  'london-rock': [
    item('london-rock', 'British Rock', 'sgt-peppers', '《Sgt. Pepper’s》', '录音室专辑导赏', '这张专辑受现代著作权保护，本站不提供旋律试听。导赏关注概念化编排、录音室剪辑和乐队音色如何共同塑造专辑聆听，正版入口用于继续体验完整制作和曲目顺序。', false, '20世纪录音与歌曲，版权状态依地区而异'),
    item('london-rock', 'British Rock', 'abbey-road', '《Abbey Road》', '专辑结构导赏', '这张专辑受现代著作权保护，本站不复制录音或歌词。导赏从四轨制作、和声写作与专辑后段的连续编排切入，帮助听者理解英伦摇滚如何把歌曲、乐队和录音技术组合成整体。', false, '20世纪录音与歌曲，版权状态依地区而异'),
  ],
  'lagos-afrobeat': [
    item('lagos-afrobeat', 'Lagos Afrobeat', 'zombie', '《Zombie》', '长篇舞曲导赏', '这首歌曲受现代著作权保护，本站不提供合成试听。导赏观察约鲁巴节奏、放克低音、铜管反复与政治表达怎样被组织成长篇舞曲，正版检索入口用于继续聆听完整现场能量。', false, '20世纪录音与歌曲，版权状态依地区而异'),
    item('lagos-afrobeat', 'Lagos Afrobeat', 'water-no-enemy', '《Water No Get Enemy》', '循环与公共表达导赏', '这首歌曲受现代著作权保护，本站只介绍循环低音、复合节奏和集体舞动，不复制歌词。正版版本能让听者进一步比较大编制乐队如何在重复中累积层次，并保持清晰的社会语境。', false, '20世纪录音与歌曲，版权状态依地区而异'),
  ],
  'bronx-hiphop': [
    item('bronx-hiphop', 'Bronx Hip-Hop', 'rappers-delight', '《Rapper’s Delight》', '说唱与循环导赏', '这首歌曲受现代著作权保护，本站不提供采样或说唱试听。导赏说明 breakbeat、DJ 循环和 MC 口语节奏如何把街区派对变成可复制的制作方法，正版入口用于继续聆听。', false, '20世纪录音与歌曲，版权状态依地区而异'),
    item('bronx-hiphop', 'Bronx Hip-Hop', 'the-message', '《The Message》', '城市叙事导赏', '这首歌曲受现代著作权保护，本站只讨论鼓机、低音与说唱叙事的关系，不复制歌词。正版版本可帮助听者辨认嘻哈如何从派对循环扩展到城市经验、社会观察和录音室编排。', false, '20世纪录音与歌曲，版权状态依地区而异'),
  ],
  'tokyo-electro': [
    item('tokyo-electro', 'Tokyo Electro Pop', 'chihiro', '《千鹤》', '电子配器导赏', '这首作品受现代著作权保护，本站不提供合成试听。导赏聚焦模拟合成器、鼓机和电影配乐中的空间感，正版入口用于继续聆听坂本龙一如何在电子音色与旋律留白之间安排呼吸。', false, '20世纪录音与作品，版权状态依地区而异'),
    item('tokyo-electro', 'Tokyo Electro Pop', 'merry-christmas', '《Merry Christmas Mr. Lawrence》', '电影主题导赏', '这首作品受现代著作权保护，本站不复制旋律或录音。导赏介绍电子音色、钢琴动机和电影叙事之间的关系，正版检索入口用于比较不同演出与录音中的速度、触键和空间处理。', false, '20世纪录音与作品，版权状态依地区而异'),
  ],
  'detroit-techno': [
    item('detroit-techno', 'Detroit Techno', 'no-ufos', '《No UFOs》', '四拍舞曲导赏', '这首作品受现代著作权保护，本站不提供合成试听。导赏从四拍底鼓、合成器循环和独立厂牌网络切入，说明底特律 Techno 如何把工业城市经验转成持续推进的舞池结构。', false, '20世纪录音与作品，版权状态依地区而异'),
    item('detroit-techno', 'Detroit Techno', 'strings-of-life', '《Strings of Life》', '钢琴与舞池导赏', '这首作品受现代著作权保护，本站不复制录音。导赏关注钢琴分解、鼓机四拍和长篇混音如何并置，正版入口用于继续比较俱乐部版本中的动态、层次与现场空间。', false, '20世纪录音与作品，版权状态依地区而异'),
  ],
  'jiahu-flute': [
    item('jiahu-flute', 'Jiahu Bone Flute', 'jiahu-tradition', '骨笛吹奏传统', '考古物证导赏', '贾湖骨笛提供的是器物、孔位和可吹奏性证据，而不是一套完整曲目。导赏把重点放在材料技术、音孔经验与仪式声响的可能性，明确区分考古推断和无法复原的旋律。', true, '新石器时代器物传统，无作者'),
  ],
  'sumer-lyre': [
    item('sumer-lyre', 'Sumerian Lyre of Ur', 'ur-royal-rite', '王陵祭礼乐', '里拉琴考古导赏', '乌尔王陵的琴体、琴师遗骸与祭礼语境说明弦乐已参与宫廷秩序，但没有一份可直接播放的完整曲谱。导赏使用有限史料讨论音色、编制与仪式空间，不把现代复原演出当作原声。', true, '青铜时代考古器物与仪式材料'),
    item('sumer-lyre', 'Sumerian Lyre of Ur', 'ur-lyre-song', '里拉琴伴唱', '歌唱伴奏导赏', '里拉琴伴唱是对古代合奏关系的保守描述：琴弦提供音程骨架，人声承担文本和仪式功能。由于旋律并未完整保存，示意只提示弦乐分解与短句呼应，不能指向某一首失传曲目。', true, '青铜时代考古器物与仪式材料', evocation(72, 4, 'lyre', [62, 64, 67, 69, 67, 64, 62, 60]), 'evocation'),
  ],
  'egypt-temple': [
    item('egypt-temple', 'Ancient Egyptian Temple Music', 'egypt-ritual-song', '神庙祭歌', '神庙图像导赏', '古埃及神庙歌唱主要通过壁画、文献和礼仪场景留下线索，缺少可直接解读的完整乐谱。导赏只讨论歌者、竖琴和仪式重复的关系，任何旋律都不能被称为古埃及原曲。', true, '神庙图像与文献材料，无完整旋律'),
    item('egypt-temple', 'Ancient Egyptian Temple Music', 'egypt-funeral', '葬仪歌唱', '墓室音乐导赏', '葬仪歌唱连接死亡观念、歌者职分与墓室图像，但现有材料不足以还原具体曲调。这里以文物和图像为边界，说明重复段落的可能作用，并把所有合成音型明确限定为听觉示意。', true, '墓室图像与文献材料，无完整旋律'),
  ],
  'hurrian-hymn': [
    item('hurrian-hymn', 'Hurrian Hymn to Nikkal', 'hurrian-nikkal', '献给尼卡尔的圣歌', 'H.6 泥板导赏', 'H.6 将歌词、音程提示与弦名并置，是讨论早期记谱边界的关键材料。各家转写和复原差异很大，本试听只作风格示意；导赏优先说明泥板保存了什么，以及哪些旋律细节仍不可确定。', true, '乌加里特泥板；作者与完整演出未知', evocation(58, 2, 'lyre', [62, 63, 67, 69, 67, 63, 62, 60]), 'evocation'),
    item('hurrian-hymn', 'Hurrian Hymn to Nikkal', 'hurrian-ritual', '乌加里特仪式歌', '近东礼仪导赏', '乌加里特仪式歌的证据来自泥板、宫廷和里拉琴文化的交叉线索，不能把后世复原录音当作唯一答案。示意片段只借用近东级进与持续音，保留对音高换算的谨慎。', true, '乌加里特泥板与宫廷仪式材料', evocation(60, 2, 'lyre', [60, 62, 63, 67, 65, 63, 62, 60]), 'evocation'),
  ],
  'andean-chavin': [
    item('andean-chavin', 'Chavin Ceremonial Flutes', 'chavin-flutes', '查文仪式吹奏', '海螺与空间导赏', '查文遗址的骨笛和海螺号说明吹奏与建筑声场密切相关，但没有完整记谱让我们重建仪式旋律。导赏讨论回声、方向感和交替回应，明确不把示意声响包装成查文原曲。', true, '考古器物与建筑声学材料，无完整旋律'),
    item('andean-chavin', 'Chavin Ceremonial Flutes', 'chavin-response', '高地呼应乐', '群体回应导赏', '“呼应”是对查文仪式声场的谨慎描述，而非一套已知曲名。导赏从多件吹管、地下回廊和集体聆听的证据出发，示意片段只展示交替进入的节奏，不补写失传旋律。', true, '考古器物与建筑声学材料，无完整旋律'),
  ],
  'zenghouyi-bells': [
    item('zenghouyi-bells', 'Bianzhong of Marquis Yi', 'zenghouyi-music', '曾侯乙编钟乐', '钟铭与双音导赏', '曾侯乙编钟的钟铭、钟体与双音结构提供了具体声学证据，但完整演奏曲目仍不能由一套现代示意代替。试听只用相近的金石音色帮助辨认音级层次，重点仍是出土材料与铭文。', true, '战国出土编钟与铭文；公版研究资料', evocation(48, 2, 'bronzeBell', [48, 60, 62, 64, 67, 69, 64, 60]), 'evocation'),
    item('zenghouyi-bells', 'Bianzhong of Marquis Yi', 'zenghouyi-ritual', '战国礼乐合奏', '礼制与编制导赏', '战国礼乐合奏把编钟、编磬和乐悬制度放在同一礼仪系统中。示意乐句不声称是墓主人生前曲目，只帮助听者注意双音钟、层级编制和循环式节拍的关系。', true, '战国礼乐制度与出土编制', evocation(52, 2, 'bronzeBell', [60, 62, 64, 67, 69, 67, 64, 62]), 'evocation'),
  ],
  'persian-silkroad': [
    item('persian-silkroad', 'Persian and Kucha Silk Road Music', 'kucha-dance', '龟兹乐舞', '石窟图像导赏', '龟兹石窟中的乐舞图像展示了弦乐、鼓乐与舞蹈的组合，却没有给出可逐音播放的完整谱本。示意段落只用弹拨和节奏提示跨域音色，不把壁画想象成一份音频档案。', true, '石窟图像与历史文献，旋律未完整保存', evocation(84, 2, 'ud', [62, 63, 66, 67, 69, 70, 69, 66]), 'evocation'),
    item('persian-silkroad', 'Persian and Kucha Silk Road Music', 'silk-seven-modes', '西域七调', '调名与传播导赏', '西域七调见于后世文献与音乐史叙述，不能简单视为一套仍可按现代音名复原的固定音阶。导赏说明调名、乐器和交通网络怎样共同传播，示意音型保留相对级进。', true, '后世文献记载与跨域传播材料', evocation(80, 2, 'ud', [60, 62, 63, 66, 67, 69, 66, 63]), 'evocation'),
  ],
  'roman-hydraulis': [
    item('roman-hydraulis', 'Roman Hydraulis Organ', 'arena-signal', '竞技场号曲', '机械声场导赏', '水力管风琴的考古遗存与技术描述说明它能够维持长时段持续声响，但没有一份竞技场曲目谱本留下。示意片段只模拟持续音柱和分层进入，帮助理解机械供气改变公共表演尺度的方式。', true, '古典机械与考古遗存，无完整曲目谱本', evocation(60, 2, 'organ', [48, 55, 60, 67, 72, 67, 60, 55]), 'evocation'),
    item('roman-hydraulis', 'Roman Hydraulis Organ', 'theatre-sustain', '剧场持续音', '剧场与仪式导赏', '水力管风琴进入剧场和公共仪式后，持续音能够连接空间、动作和观众注意力。这里的示意不是古罗马原曲，而是以持续低音和管风琴音色解释机械供气与公共声场的关系。', true, '古典机械与考古遗存，无完整曲目谱本', evocation(56, 2, 'organ', [48, 60, 67, 72, 67, 60, 55, 48]), 'evocation'),
  ],
  'han-wei-yuefu': [
    item('han-wei-yuefu', 'Han-Wei Yuefu and Qingshang', 'han-guangling', '广陵散', '文字谱与后世传承导赏', '《广陵散》的著名故事见于后世文献，现存可讨论的谱本与传承不能直接等同于汉魏现场。导赏区分嵇康故事、明代《神奇秘谱》等材料，示意只借五声轮廓说明琴曲语汇。', true, '传统曲名；现存文字谱与后世传承', evocation(64, 4, 'pluck', [60, 62, 64, 67, 69, 67, 64, 60]), 'evocation'),
    item('han-wei-yuefu', 'Han-Wei Yuefu and Qingshang', 'han-yuefu', '汉魏乐府歌辞', '歌辞与乐署导赏', '汉魏乐府歌辞保存的是文本、乐署和歌唱制度的交叉线索，不能把后世配乐当作原始旋律。导赏从清商音阶、相和歌与宫廷传播切入，示意音型只提供相对音级的听觉提示。', true, '汉魏文献与后世传承，旋律版本多样', evocation(66, 4, 'pluck', [67, 69, 72, 69, 67, 64, 62, 60]), 'evocation'),
  ],
  'hebrew-temple': [
    item('hebrew-temple', 'Jerusalem Temple Music', 'psalms', '诗篇', '文本与吟诵导赏', '《诗篇》首先是文本和礼仪诗歌传统，不是一份能直接播放的古代总谱。导赏区分圣殿时期、流亡记忆与中世纪马所拉吟诵体系，示意只提示应答式歌唱的高低关系。', true, '古代文本与后世吟诵传统，旋律未保存', evocation(54, 2, 'drone', [50, 62, 65, 67, 65, 62, 60, 50]), 'evocation'),
    item('hebrew-temple', 'Jerusalem Temple Music', 'temple-liturgy', '圣殿礼仪歌唱', '礼仪分工导赏', '圣殿礼仪歌唱的证据来自文本、歌者职分和后世传统，不能把现代诵读直接倒推为古代音高。导赏介绍应答、号角和弦乐的制度线索，示意片段保持相对音级。', true, '古代文本与后世吟诵传统，旋律未保存', evocation(52, 2, 'drone', [50, 62, 63, 65, 63, 62, 60, 50]), 'evocation'),
  ],
  'maya-ritual': [
    item('maya-ritual', 'Maya Ritual Music', 'bonampak-band', '博南帕克壁画乐队场景', '壁画与乐队导赏', '博南帕克壁画保存了鼓手、号角手和仪式队列的视觉证据，但没有可解读的旋律谱。导赏把图像、年代和宫廷场景分开讨论，示意声响只解释合奏层次，不声称复原古典期曲目。', true, '古典期壁画与考古图像，无完整旋律'),
    item('maya-ritual', 'Maya Ritual Music', 'maya-whistle', '玛雅陶制哨笛与多腔笛', '器物声学导赏', '多腔陶笛能制造复杂共鸣，但器物本身不能告诉我们一首完整歌曲的顺序。导赏关注腔体、气流和仪式合奏的可能关系，示意音型明确是听觉说明，不是玛雅原始谱。', true, '考古器物与图像材料，无完整旋律'),
  ],
};
