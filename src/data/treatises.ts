import type { TreatiseItem } from '../domain/types';

export const TREATISES_BY_NODE: Record<string, TreatiseItem[]> = {
  "vedic-chant": [
    {"id":"vedic-chant-natya-1","title":"《舞论》","authorEra":"约公元前2世纪至公元2世纪 · 传统上归于婆罗多","kind":"canonical-text","digest":"全书三十六章，主体讲戏剧，第二十八至三十三章专论音乐：提出二十二个微分音（śruti），把七声分为具六、中两种音列（grāma），并列出 jāti 等旋律类型。","keyPoint":"成书比吠陀吟诵晚一千年以上，讲的是剧场音乐，不能直接拿来复原吠陀祭仪的唱法。"},
    {"id":"vedic-chant-sama-2","title":"《娑摩吠陀》","authorEra":"约公元前1500—前500年 · 吠陀传统汇编","kind":"canonical-text","digest":"考苏玛支派传本共收诗句1875节，除约七十五节外都见于《梨俱吠陀》。另有配套的歌集（gāna）记录旋律，在音节上方用数字1至7标注音高的升降。","keyPoint":"数字标记表示相对音高的走向，不是固定音高；各支派的唱法差别也很大。"},
  ],
  "zhou-ritual": [
    {"id":"zhou-ritual-yueji-1","title":"《乐记》","authorEra":"战国至西汉 · 儒家礼乐文献","kind":"canonical-text","digest":"今本是《礼记》第十九篇，分十一节，讲音乐起于人心感物，“声”“音”“乐”三个层次逐级递进，并主张礼、乐分别负责区分与调和人群。","excerpt":"凡音之起，由人心生也。人心之动，物使之然也。感于物而动，故形于声。","excerptSource":"《礼记·乐记》"},
    {"id":"zhou-ritual-xunzi-2","title":"《荀子·乐论》","authorEra":"战国末期 · 荀子学派","kind":"canonical-text","digest":"荀子针对墨子“非乐”而作，认为人生来有欲望，必须用雅颂之声加以引导；先王制乐，是为了让人在乡里、宗庙等场合彼此和顺，也能节制邪音。","excerpt":"夫乐者，乐也，人情之所必不免也。","excerptSource":"《荀子·乐论》"},
  ],
  "greek-modes": [
    {"id":"greek-modes-musica-1","title":"《论音乐》","authorEra":"约公元2世纪 · 传统上归于普鲁塔克，今多视为托名","kind":"canonical-text","digest":"以对话形式写成，回顾特尔潘德、奥林波斯等早期乐师的传说，叙述各种调式和体裁的起源，并抱怨当时的“新音乐”炫技浮华，败坏了古风。","keyPoint":"托名之作，作者引用了不少已经失传的早期文献，可作为二手史料使用，但要留意作者的崇古立场。"},
    {"id":"greek-modes-politics-2","title":"《政治学》中的音乐论述","authorEra":"公元前4世纪 · 亚里士多德","kind":"canonical-text","digest":"第八卷第五至七章讨论音乐教育：少年应亲自学奏乐，但不必练到职业水平；不同调式会引起不同性情，城邦应选用能培养品格的调式。","keyPoint":"这里讲的“调式”（harmonia）与后来教会调式名称相同，音阶结构却不一样，不能直接对应。"},
  ],
  "gagaku": [
    {"id":"gagaku-taigensho-1","title":"《体源抄》（1512）","authorEra":"1512年 · 丰原统秋","kind":"canonical-text","digest":"笙乐家丰原统秋所编，共十三卷，汇集乐曲来历、乐器制法、演奏口诀和乐人家谱，与《教训抄》《续教训抄》并称日本雅乐“三大乐书”。","keyPoint":"编成于战国乱世之初，有保存行将散失的家传知识的用意；书中的乐曲来历多有传说成分。"},
    {"id":"gagaku-kyokunsho-2","title":"《教训抄》","authorEra":"约1233年 · 狛近真","kind":"canonical-text","digest":"兴福寺系统的舞乐家狛近真所著，共十卷，是日本现存最早的综合性乐书。前半部分记述各支舞乐的来历和舞法，后半部分讲乐器与演奏心得。","keyPoint":"作者是左方舞的乐家，书中观点代表他所属家系的传承，并非雅乐的统一标准。"},
  ],
  "baghdad-maqam": [
    {"id":"baghdad-maqam-kitab-1","title":"《大音乐书》","authorEra":"约10世纪 · 法拉比","kind":"canonical-text","digest":"法拉比融合希腊理论与阿拉伯实践写成，详细描述乌德琴的指板品位、巴格达与呼罗珊两种坦布尔琴的音律，并整理出当时的节奏周期。","keyPoint":"作者首先是哲学家，书中音阶有些是理论推演的结果，未必都是当时乐师实际使用的。"},
    {"id":"baghdad-maqam-maqam-2","title":"《音乐论书》","authorEra":"中世纪阿拉伯语音乐学传统 · 作者不详","kind":"canonical-text","digest":"阿拉伯语音乐论著有一条连续的传统：9世纪金迪最早用乌德琴品位讨论音程，13世纪萨菲丁·乌尔马维在《周期之书》中把调式归纳为十七律体系。","keyPoint":"这一类论著定义调式用的是音程比例，与今天按四音列组合描述木卡姆的方式不同。"},
  ],
  "gregorian-chant": [
    {"id":"gregorian-chant-micrologus-1","title":"圭多《辨及微芒》（Micrologus，约1026）","authorEra":"约1026年 · 阿雷佐的圭多","kind":"canonical-text","digest":"圭多写给修道院歌童的教材，讲单弦琴定音、八个教会调式和简单的二声部奥尔加农。他还主张在线谱上标出音高，让歌童不用老师也能学会新歌。","keyPoint":"唱名 ut、re、mi 的教学法出自他的另一封书信，并不在此书中。"},
    {"id":"gregorian-chant-sankt-2","title":"圣加仑抄本 Cod. Sang. 359","authorEra":"约922—926年 · 修道院抄写者","kind":"inscription-artifact","digest":"圣加仑修道院的一部“领唱书”（Cantatorium），收录弥撒中由独唱者演唱的升阶经、阿肋路亚等曲目，是现存最早记有完整纽姆谱的圣咏书之一。","keyPoint":"这种纽姆不画谱线，只能看出节奏和起伏，确切音高要靠其他带谱线的抄本来对照。"},
  ],
  "griot-mali": [
    {"id":"griot-mali-griot-1","title":"曼德口述史诗传承谱系","authorEra":"中世纪以来 · 格里奥家族口传","kind":"oral-tradition","digest":"核心是《松迪亚塔》史诗，讲述13世纪马里帝国开国者的事迹。库亚特家族自称是松迪亚塔的格里奥巴拉·法塞凯的后人，世代负责唱诵这部史诗。","keyPoint":"马里康加巴每七年举行一次重修圣屋的“卡马布隆”仪式，史诗在仪式上公开唱诵，2009年列入联合国教科文组织名录。"},
    {"id":"griot-mali-kora-2","title":"科拉琴调弦与演奏传统","authorEra":"传统延续至今 · 曼德乐师群体","kind":"oral-tradition","digest":"科拉有21根弦，共鸣箱是一个大葫芦，外面蒙着牛皮。演奏者用两手拇指和食指拨弦，常用的定弦法有托莫拉、哈尔迪诺、绍塔、西拉巴等几种。","keyPoint":"定弦和指法主要在家族内部口耳相传，各地名称并不统一，书面记谱多由现代研究者整理。"},
  ],
  "hindustani": [
    {"id":"hindustani-raga-1","title":"拉格口传谱系","authorEra":"中世纪以来 · gharana 师徒传统","kind":"oral-tradition","digest":"gharana 是按家族和师承划分的流派，例如以瓜廖尔为名的流派被视为最早的卡雅尔流派。拜师时要行系线仪式（gaṇḍā bandhan），弟子跟随老师长期学艺。","keyPoint":"20世纪初，巴特坎德把拉格归入十种“塔特”（thāṭ），并出版记谱集，这是口传之外最重要的书面整理。"},
    {"id":"hindustani-tala-2","title":"塔拉节拍教学谱","authorEra":"近世以来 · 北印度鼓乐师承","kind":"oral-tradition","digest":"塔拉是循环节拍框架，最常用的“提恩塔尔”（tīntāl）一轮十六拍，分成四组。鼓手用 dhā、dhin 等口诵音节（bol）背诵节奏型（ṭhekā），学完再上手演奏塔布拉鼓。","keyPoint":"每轮第一拍叫“萨姆”（sam），独奏者的即兴通常要在这一拍与鼓手会合。"},
  ],
  "leipzig-baroque": [
    {"id":"leipzig-baroque-offering-1","title":"《音乐的奉献》初版谱","authorEra":"1747年 · 约翰·塞巴斯蒂安·巴赫","kind":"inscription-artifact","digest":"1747年5月，巴赫在波茨坦拜见普鲁士国王腓特烈二世，国王给了他一个主题让他即兴。回到莱比锡后，他以此主题写成两首利切卡尔、十首卡农和一首三重奏鸣曲，印刷后献给国王。","keyPoint":"献词中有一句拉丁文，取各词首字母正好拼成 RICERCAR。"},
    {"id":"leipzig-baroque-art-fugue-2","title":"《赋格的艺术》手稿","authorEra":"约1742—1750年 · 约翰·塞巴斯蒂安·巴赫","kind":"inscription-artifact","digest":"用同一个d小调主题写成十余首赋格和卡农。亲笔手稿约始于1742年，今藏柏林国家图书馆。1751年巴赫去世后出版，最后一首赋格写到以 B-A-C-H 为主题的段落时中断。","keyPoint":"手稿上卡尔·菲利普·埃马努埃尔写道，作者写到这里就去世了；但现代研究认为中断可能早于去世。"},
  ],
  "gamelan": [
    {"id":"gamelan-kunst-1","title":"Jaap Kunst《Music in Java》（1934）","authorEra":"1934 年荷兰文初版《De toonkunst van Java》；1949 年英文增订版","kind":"modern-record","digest":"荷兰学者孔斯特据在爪哇多年的田野录音与测音写成，1934 年以荷兰文出版，1949 年出英文增订版，系统测定斯连德罗、佩洛格两种音阶的音分值。","keyPoint":"孔斯特后来提出“民族音乐学”一词；书中的音分测量用他自制的设备完成，个别数值与后来的研究有出入。"},
    {"id":"gamelan-court-2","title":"宫廷加美兰谱本","authorEra":"近世以来 · 爪哇宫廷乐师","kind":"oral-tradition","digest":"19世纪末，梭罗王宫创制了用阿拉伯数字记写骨架旋律的“凯帕蒂汉”简谱，日惹宫廷则用格子状的纵向谱。两种谱都只记主旋律，装饰声部仍靠乐师即兴发挥。","keyPoint":"乐谱主要用于保存和教学，正式演出时乐师大多背谱，不看谱演奏。"},
  ],
  "vienna-classical": [
    {"id":"vienna-classical-griesinger-1","title":"格里辛格《海顿传记笔记》（1810）","authorEra":"1810年 · 格里辛格","kind":"modern-record","digest":"外交官格里辛格在海顿晚年多次登门拜访，记下他的谈话，1809年先在《大众音乐报》连载，次年出书。书中讲到海顿在埃斯特哈齐宫廷的生活和“惊愕”交响曲的由来。","keyPoint":"内容出自海顿本人晚年的回忆，有些细节记忆不准，可与同期的迪斯《海顿传》对照阅读。"},
    {"id":"vienna-classical-beethoven-2","title":"贝多芬晚期弦乐四重奏手稿","authorEra":"十九世纪初 · 路德维希·范·贝多芬","kind":"inscription-artifact","digest":"包括作品127、130、131、132、135号，作于1825至1826年。作品130原以《大赋格》为终曲，出版商阿塔利亚认为太难，贝多芬另写了终曲，《大赋格》单独出版为作品133号。","keyPoint":"前三首是受俄国加利钦亲王委托而作，委托信与草稿本可与手稿互相印证。"},
  ],
  "peking-opera": [
    {"id":"peking-opera-opera-score-1","title":"京剧唱腔谱例","authorEra":"近现代 · 戏班与剧种传承者","kind":"modern-record","digest":"京剧唱腔早期用工尺谱记录，20世纪逐渐改用简谱。谱例通常标出西皮、二黄等声腔，以及原板、慢板、流水、快板等板式，再附上京胡过门。","keyPoint":"谱面只记骨干音，行腔中的润腔和气口要跟老师学，同一段唱腔各流派唱法也不同。"},
    {"id":"peking-opera-mei-archive-2","title":"梅兰芳演出档案","authorEra":"二十世纪上半叶 · 梅兰芳及剧团","kind":"modern-record","digest":"包括1930年访美期间齐如山等人编印的英文说明册、剧照和报刊评论，以及1955年拍摄的电影《梅兰芳的舞台艺术》。北京护国寺的梅兰芳纪念馆收藏了大量戏服与手稿。","keyPoint":"访美说明册为外国观众改写了剧情与术语，读时要和中文剧本对照。"},
  ],
  "russian-national": [
    {"id":"russian-national-stassov-1","title":"斯塔索夫关于“强力集团”的评论文章","authorEra":"十九世纪后半叶 · 弗拉基米尔·斯塔索夫","kind":"modern-record","digest":"1867年，评论家斯塔索夫在报上评论巴拉基列夫指挥的斯拉夫音乐会，称这批俄国作曲家为“强力集团”。他一生不断撰文，主张俄国音乐应取材于民歌和本国历史。","keyPoint":"“五人团”是后来的说法。斯塔索夫立场鲜明，常贬低柴可夫斯基等学院派，读他的文章要考虑论战背景。"},
    {"id":"russian-national-folk-collection-2","title":"俄罗斯民歌采集谱","authorEra":"十九世纪 · 采风者与地方歌者","kind":"modern-record","digest":"早期有1790年出版的利沃夫与普拉奇合编民歌集，后来巴拉基列夫1866年出版四十首民歌，里姆斯基-科萨科夫1877年又编成一百首，许多旋律都进入了他们的作品。","keyPoint":"19世纪的采集者常用西方大小调和声给民歌配伴奏，改变了原有的调式特点。"},
  ],
  "paris-impressionism": [
    {"id":"paris-impressionism-monsieur-croche-1","title":"德彪西《克罗什先生》乐评集","authorEra":"1901—1903年 · 克洛德·德彪西","kind":"modern-record","digest":"德彪西为《白色杂志》等刊物写乐评时，虚构了一位冷嘲热讽的“克罗什先生”来代他发言，批评瓦格纳崇拜和学院习气。这些文章1921年结集出版。","keyPoint":"文字以反讽为主，不能当作系统的理论宣言来读。"},
    {"id":"paris-impressionism-expo-2","title":"1889 年巴黎世博会爪哇加美兰演出记录","authorEra":"1889年 · 世博会档案与观众记录","kind":"modern-record","digest":"1889年巴黎世博会的荷属东印度展区搭建了“爪哇村”，加美兰乐队在那里为舞者伴奏。德彪西、拉威尔都曾前往观看，多年后德彪西仍在文章中提起这次体验。","keyPoint":"这支乐队并非来自梭罗或日惹的宫廷，演奏的曲目和编制与宫廷加美兰有差别。"},
  ],
  "delta-blues": [
    {"id":"delta-blues-paramount-1","title":"Paramount 唱片目录","authorEra":"1920年代 · Paramount Records","kind":"modern-record","digest":"Paramount 是威斯康星一家家具公司的唱片部门，1920年代后期推出面向黑人听众的“种族唱片”系列，录下了查理·帕顿、桑·豪斯、斯基普·詹姆斯等三角洲歌手。","keyPoint":"唱片多靠邮购和家具店销售，母带后来大多散失，许多录音只靠收藏家保存的旧唱片流传。"},
    {"id":"delta-blues-blues-transcription-2","title":"蓝调吉他转录谱","authorEra":"二十世纪后半叶整理 · 研究者与演奏者","kind":"modern-record","digest":"研究者和吉他手从早期录音中扒出谱子，标出开放G、开放D等调弦法，以及滑棒的位置和拇指拨低音弦的交替低音模式，常配合六线谱记写。","keyPoint":"蓝调音介于大小三度之间，五线谱很难准确记写，转录谱只能作为听录音时的辅助。"},
  ],
  "new-orleans-jazz": [
    {"id":"new-orleans-jazz-hot-five-1","title":"Hot Five 录音档案","authorEra":"1925—1928年 · 路易斯·阿姆斯特朗 Hot Five","kind":"modern-record","digest":"1925至1928年间在芝加哥为 OKeh 唱片公司录制。1926年的《Heebie Jeebies》里有早期的拟声唱法（scat），1928年的《West End Blues》则与钢琴家厄尔·海因斯合作。","keyPoint":"这组录音是在录音室里专为唱片录制的，阿姆斯特朗本人并没有带着 Hot Five 巡回演出。"},
    {"id":"new-orleans-jazz-jazz-arrangement-2","title":"早期爵士乐队编制谱","authorEra":"二十世纪初 · 新奥尔良乐队传统","kind":"modern-record","digest":"典型编制分为前排和节奏组：短号吹主旋律，单簧管在上方穿插装饰，长号在下方滑音呼应；节奏组用班卓琴、大号和鼓。1917年第一张爵士唱片就采用这种编制。","keyPoint":"早期乐队大多不看谱，编制谱多是后人根据录音整理的。"},
  ],
  "chicago-blues": [
    {"id":"chicago-blues-chess-1","title":"Chess Records 唱片目录","authorEra":"1950—1960年代 · Chess Records","kind":"modern-record","digest":"波兰移民莱昂纳德与菲尔·切斯兄弟1950年创立，前身是 Aristocrat 唱片。公司签下穆迪·沃特斯、嚎狼、小沃尔特，词曲作者威利·迪克森兼任贝斯手，1955年还推出查克·贝里的《Maybellene》。","keyPoint":"录音室位于南密歇根大道2120号，滚石乐队1964年专程来此录音，还以门牌号作了曲名。"},
    {"id":"chicago-blues-amplifier-2","title":"电声蓝调放大器使用记录","authorEra":"二十世纪中叶 · 俱乐部乐手与录音工程师","kind":"modern-record","digest":"小沃尔特把口琴对着小号的“子弹”麦克风吹，再接入吉他放大器，故意推出失真音色。1952年推出的 Fender Bassman 音箱很受芝加哥乐手青睐，后来 Marshall 早期音箱也仿照它的电路。","keyPoint":"失真起初是小功率设备被推到极限的副产品，后来才被当作刻意追求的音色。"},
  ],
  "rio-bossa": [
    {"id":"rio-bossa-brazil-harmony-1","title":"巴西和声研究","authorEra":"二十世纪中叶 · 巴西作曲家与音乐学者","kind":"modern-record","digest":"安东尼奥·卡洛斯·若宾在桑巴旋律中加入德彪西、拉威尔和酷派爵士的扩展和弦。《Desafinado》《Samba de Uma Nota Só》两首歌词还拿自己的和声手法开玩笑。","keyPoint":"若宾受过古典训练，他的和声并非直接照搬爵士，许多进行来自巴西本地的肖罗音乐。"},
    {"id":"rio-bossa-bossa-guitar-2","title":"波萨诺瓦吉他节奏谱","authorEra":"1950年代以来 · 巴西吉他传承","kind":"modern-record","digest":"吉尔伯托的吉他被称作“结巴的琴”：拇指在每拍上拨低音，模仿桑巴的大鼓；其余手指在弱拍上切分扫和弦，模仿小手鼓的节奏型，一把吉他兼顾了整个打击乐组。","keyPoint":"他每次演奏都会细微地移动和弦位置，谱上写的节奏型只是近似。"},
  ],
  "london-rock": [
    {"id":"london-rock-recording-sessions-1","title":"Mark Lewisohn《The Beatles Recording Sessions》（1988）","authorEra":"1988年 · Mark Lewisohn","kind":"modern-record","digest":"作者获准逐盘聆听 EMI 保存的披头士母带和录音单，按日期记下从1962年6月6日首次试音到1970年的每一场录音：录了哪些版本、用了什么设备、谁在场。","keyPoint":"书中的日期和版本号被后来的再版与研究广泛引用，是核对“哪一版是母带”的基本工具书。"},
    {"id":"london-rock-emi-tapes-2","title":"EMI 四轨母带档案","authorEra":"1960年代 · EMI 录音工程档案","kind":"modern-record","digest":"1967年的《Sgt. Pepper》用两台四轨录音机制作，录满四轨就并成一轨再继续叠录。1966年的《Tomorrow Never Knows》则把磁带环同时接入多台机器实时混音。","keyPoint":"1968年起录音室才陆续用上八轨设备，此前许多复杂编曲都是靠反复并轨实现的。"},
  ],
  "lagos-afrobeat": [
    {"id":"lagos-afrobeat-kalakuta-1","title":"Kalakuta 唱片档案","authorEra":"1970年代 · Kalakuta Republic 与乐队","kind":"modern-record","digest":"费拉与 Africa 70 乐队1970年代发行的数十张专辑，大多每面只有一首十几分钟的长曲，鼓手托尼·艾伦的节奏是骨架。《Expensive Shit》《Zombie》等歌名直接嘲讽当局。","keyPoint":"这些唱片分属多家厂牌发行，版本混乱，后来的再版常有曲目合并或删节。"},
    {"id":"lagos-afrobeat-yoruba-drums-2","title":"约鲁巴鼓乐研究","authorEra":"二十世纪以来 · 研究者与约鲁巴鼓手","kind":"modern-record","digest":"约鲁巴语是声调语言，“说话鼓”（dùndún）通过挤压鼓绳改变音高，模仿语句的声调来传递话语。祭祀雷神尚戈时则用一组三面的巴塔鼓。","keyPoint":"Afrobeat 并未照搬某种约鲁巴鼓乐，而是把交错节奏的思路搬到了爵士鼓和贝斯上。"},
  ],
  "bronx-hiphop": [
    {"id":"bronx-hiphop-sugar-hill-1","title":"Sugar Hill 唱片目录","authorEra":"1979年起 · Sugar Hill Records","kind":"modern-record","digest":"罗宾逊夫妇在新泽西创立。1979年 Sugarhill Gang 的《Rapper's Delight》借用 Chic《Good Times》的贝斯线，是首支上榜的说唱单曲。1982年又推出《The Message》。","keyPoint":"早期作品由录音室乐手重新演奏伴奏，并非 DJ 现场采样。"},
    {"id":"bronx-hiphop-breakbeat-2","title":"街区 DJ breakbeat 记录","authorEra":"1970年代 · 布朗克斯 DJ 与舞者","kind":"oral-tradition","digest":"DJ 们从放克和拉丁唱片里找出只有鼓点的“break”，例如 Incredible Bongo Band 的《Apache》。闪手大师后来用耳机监听并在唱片上做记号，让两张唱片的鼓点无缝衔接。","keyPoint":"这些技巧最初只在派对现场流传，相关记录主要来自当事人多年后的访谈。"},
  ],
  "tokyo-electro": [
    {"id":"tokyo-electro-ymo-1","title":"YMO 录音室档案","authorEra":"1978—1983年 · Yellow Magic Orchestra","kind":"modern-record","digest":"乐队1978年发行首张专辑，次年的《Solid State Survivor》收录《Rydeen》《Technopolis》。松武秀树用罗兰 MC-8 音序器编程，1981年的《BGM》大量使用 TR-808。","keyPoint":"现场演出时松武秀树也在台上操作设备，常被称为乐队的“第四位成员”。"},
    {"id":"tokyo-electro-analog-notes-2","title":"模拟合成器编曲笔记","authorEra":"二十世纪后半叶 · 东京制作人与工程师","kind":"modern-record","digest":"罗兰在1980年推出 TR-808 鼓机，1981年推出 TB-303 贝斯合成器，1983年雅马哈推出数字调频合成器 DX7。制作人习惯在纸上记下旋钮位置，用来重现音色。","keyPoint":"808和303在日本销量不佳很快停产，后来在美国嘻哈和芝加哥 Acid House 中被大量使用。"},
  ],
  "detroit-techno": [
    {"id":"detroit-techno-metroplex-1","title":"Metroplex 厂牌出版物","authorEra":"1980年代 · Metroplex Records","kind":"modern-record","digest":"阿特金斯1985年创办，首张发行是 Model 500 的《No UFO's》。1988年英国合辑《Techno! The New Dance Sound of Detroit》让“Techno”成了这一曲风的正式名称。","keyPoint":"厂牌发行量很小，大多是12英寸单曲，主要卖给本地和欧洲的 DJ。"},
    {"id":"detroit-techno-belleville-2","title":"Belleville Three 访谈档案","authorEra":"二十世纪末 · 底特律 DJ 访谈","kind":"modern-record","digest":"三人在访谈中都提到电台 DJ“Electrifying Mojo”的影响：他把 Kraftwerk、Prince 和放克混在一起播。德里克·梅说 Techno 像乔治·克林顿和 Kraftwerk 被困在同一部电梯里。","keyPoint":"访谈多来自1990年代以后，当事人的回忆难免有自我叙事的成分。"},
  ],
  "jiahu-flute": [
    {"id":"jiahu-flute-jiahu-catalog-1","title":"《中国音乐文物大系》贾湖条目","authorEra":"二十世纪末 · 文物整理与考古研究","kind":"modern-record","digest":"收在《中国音乐文物大系·河南卷》，记录1980年代贾湖遗址前几次发掘出土的骨笛，逐件给出墓号、长度、孔数和保存状况，并附照片与线图。遗址年代约为公元前7000至前5800年。","keyPoint":"此后的发掘又出土了更多骨笛，件数以最新考古报告为准。"},
    {"id":"jiahu-flute-jiahu-pitch-2","title":"贾湖骨笛测音记录","authorEra":"现代考古音乐学 · 研究者整理","kind":"inscription-artifact","digest":"1987年，黄翔鹏等学者在中国艺术研究院对M282:20号七孔骨笛逐孔吹奏测音，记录各孔的频率与音分值，结果1989年发表于《文物》。","keyPoint":"测音结果受吹奏者口风影响很大，不同学者对同一支笛子推出的音阶并不一致。"},
  ],
  "sumer-lyre": [
    {"id":"sumer-lyre-ur-lyre-1","title":"乌尔里拉琴复原图录","authorEra":"二十世纪以来 · 考古复原研究","kind":"inscription-artifact","digest":"伍利1934年出版的王陵发掘报告记录了里拉琴出土时的状况。木质琴体早已朽坏，发掘者往空腔里灌石膏取型，再把金箔、贝壳镶嵌片按原位粘回。","keyPoint":"现在看到的琴颈、琴弦和琴码大多是现代复原，弦数和定弦都是推测。"},
    {"id":"sumer-lyre-nippur-2","title":"尼普尔调弦泥板 CBS 10996 研究","authorEra":"古巴比伦时期泥板 · 现代释读研究","kind":"inscription-artifact","digest":"宾夕法尼亚大学藏的这块泥板列出九根弦的名称，以及成对弦组的音程名，可以推出七种七声音阶的调弦法。1960至70年代由安妮·基尔默等学者释读。","keyPoint":"泥板只记录理论名称，没有一段旋律，不能单靠它复原乐曲。"},
  ],
  "egypt-temple": [
    {"id":"egypt-temple-aten-1","title":"《阿吞颂歌》","authorEra":"约公元前14世纪 · 阿肯那顿时期文本","kind":"canonical-text","digest":"最完整的版本刻在阿马尔纳的大臣阿伊墓中，歌颂太阳圆盘阿吞创造万物、按时升落。全诗与《旧约·诗篇》第104篇在意象和结构上颇为相似。","keyPoint":"这是供吟诵的宗教诗文，没有附任何乐谱或演唱说明。"},
    {"id":"egypt-temple-egypt-tombs-2","title":"古埃及墓室乐舞图录","authorEra":"古王国至新王国 · 墓室图像资料","kind":"inscription-artifact","digest":"古王国墓室浮雕中，歌者常一手贴耳、一手比画，研究者认为这是在用手势指示音高。新王国底比斯的内巴蒙墓壁画则画出宴会上吹双管、拍手的女乐师。","keyPoint":"图像是理想化的葬仪场景，乐器的弦数和比例未必按实物绘制。"},
  ],
  "hurrian-hymn": [
    {"id":"hurrian-hymn-h6-1","title":"H.6 泥板音程提示","authorEra":"约公元前1400年 · 乌加里特泥板","kind":"inscription-artifact","digest":"泥板上半部分是胡里语歌词，下半部分用阿卡德语音程名和数字交替书写，像是一份演奏提示。1970年代以来，基尔默、韦斯特等学者先后发表了多种转写方案。","keyPoint":"各家对音程名是指旋律还是指和音看法不同，复原结果从单声部到二声部都有。"},
    {"id":"hurrian-hymn-ugarit-2","title":"乌加里特楔形文字音乐研究","authorEra":"晚青铜时代材料 · 现代释读研究","kind":"modern-record","digest":"研究者把乌加里特泥板上的术语与尼普尔、乌尔出土的音乐文献对照，确认 qablītu、išartu 等调弦名称在不同城市通用。1976年基尔默等人还据此出版了复原演奏唱片《Sounds from Silence》。","keyPoint":"乌加里特出土的音乐泥板大多残缺，只有 H.6 能读出较完整的结构。"},
  ],
  "andean-chavin": [
    {"id":"andean-chavin-chavin-conch-1","title":"查文海螺号考古报告","authorEra":"约公元前1200—前200年遗存 · 现代考古整理","kind":"inscription-artifact","digest":"2001年，斯坦福大学考古学家约翰·里克在“海螺廊”中发掘出20支保存完整的凤尾螺号，有的刻有图像。凤尾螺产于厄瓜多尔以北的温暖海域，说明查文与远方存在交换。","keyPoint":"海螺号出土时集中摆放，可能是在仪式结束后被统一埋藏的。"},
    {"id":"andean-chavin-chavin-acoustics-2","title":"安第斯仪式建筑声学研究","authorEra":"现代跨学科研究 · 建筑声学与考古","kind":"modern-record","digest":"斯坦福计算机音乐与声学研究中心的米里亚姆·科拉尔等人，用复制的海螺号在原址廊道内播放并测量，发现廊道的形状会让声音变得模糊难辨，听者很难判断声源方向。","keyPoint":"测量是在现代修复后的廊道中进行的，结论属于推测古人可能的感受，不是对古代仪式的直接记录。"},
  ],
  "zenghouyi-bells": [
    {"id":"zenghouyi-bells-guoyu-1","title":"《国语·周语下》","authorEra":"约战国初期成书 · 记周景王与伶州鸠问答","kind":"canonical-text","digest":"记周景王二十三年将铸无射钟，乐官伶州鸠论律，逐一说明十二律的次序、五声与七律的关系，并以“纪之以三，平之以六，成于十二”概括生律之法。","keyPoint":"《左传·昭公二十一年》另记伶州鸠论乐，与此章互为参证；两书文字不同，不可混引。"},
    {"id":"zenghouyi-bells-zenghouyi-2","title":"曾侯乙编钟铭文释读","authorEra":"战国时期铭文 · 现代考古释读","kind":"inscription-artifact","digest":"编钟及钟架上共有铭文三千七百多字，标出每个钟发出的音名，以及这些音在曾、楚、周、齐、申等国律制中的对应名称，相当于一份刻在青铜上的乐律对照表。","keyPoint":"铭文中的许多律名不见于传世文献，释读至今仍在补充。"},
  ],
  "persian-silkroad": [
    {"id":"persian-silkroad-suishu-1","title":"《隋书·音乐志》","authorEra":"唐 · 魏征、长孙无忌等撰，志成于656年","kind":"canonical-text","digest":"记录隋代宫廷乐部的演变：开皇初年设七部乐，大业年间扩为九部乐，龟兹、西凉、天竺、康国、安国等外来乐部各列乐器与乐工人数，并记载了郑译据龟兹七调推演八十四调的经过。","excerpt":"有龟兹人曰苏祗婆，从突厥皇后入国，善胡琵琶。","excerptSource":"《隋书·音乐志》"},
    {"id":"persian-silkroad-kizil-2","title":"克孜尔石窟伎乐图研究","authorEra":"约3—8世纪图像 · 现代石窟研究","kind":"inscription-artifact","digest":"克孜尔石窟在今新疆拜城，已编号的洞窟有二百多个，壁画年代约为3至8世纪。伎乐天人手持五弦琵琶、曲项琵琶、竖箜篌、排箫和筚篥。20世纪初德国探险队曾切割大量壁画运往柏林。","keyPoint":"壁画中的乐器有一部分是佛教图像的程式化画法，不一定反映当地实际使用的乐队编制。"},
  ],
  "roman-hydraulis": [
    {"id":"roman-hydraulis-vitruvius-1","title":"《建筑十书》卷十","authorEra":"约公元前1世纪 · 维特鲁威","kind":"canonical-text","digest":"第十卷第八章逐个零件描述水力管风琴：铜制气室倒扣在水箱中，两个活塞泵交替打气，键盘拨动滑板打开音管。亚历山大的希罗在《气体力学》中也有类似描写。","keyPoint":"文字说明很详细，但原书配图早已失传，现代复原图都是后人重新绘制的。"},
    {"id":"roman-hydraulis-aquincum-2","title":"阿昆库姆 228 年管风琴遗存报告","authorEra":"公元228年遗存 · 现代考古报告","kind":"inscription-artifact","digest":"1931年在布达佩斯的阿昆库姆遗址出土，铭文记载228年由一位名叫尤利乌斯·维克托里努斯的官员捐给当地的纺织工行会。残件中有52根青铜音管，排成四排，每排十三根。","keyPoint":"它究竟靠水压还是皮囊供气，学界仍有争论。"},
  ],
  "han-wei-yuefu": [
    {"id":"han-wei-yuefu-sheng-1","title":"《声无哀乐论》","authorEra":"262年后 · 嵇康","kind":"canonical-text","digest":"全文假托“秦客”与“东野主人”的八次问答。秦客引用古人闻乐知国运的说法，主人一一反驳，认为声音只有好坏，悲哀和欢乐是听者心中原有的情感。","excerpt":"然则心之与声，明为二物。","excerptSource":"嵇康《声无哀乐论》"},
    {"id":"han-wei-yuefu-han-yueji-2","title":"《乐记》","authorEra":"战国至西汉 · 儒家礼乐文献","kind":"canonical-text","digest":"《汉书·艺文志》著录《乐记》二十三篇，今《礼记》只存十一篇。刘向校书时见过全本，其余十二篇只留下篇名。这说明汉代讨论礼乐时所依据的文本比今天多。","excerpt":"乐者，天地之和也；礼者，天地之序也。","excerptSource":"《礼记·乐记》"},
  ],
  "hebrew-temple": [
    {"id":"hebrew-temple-psalms-1","title":"《诗篇》","authorEra":"约公元前10世纪至前2世纪 · 多时期汇编","kind":"canonical-text","digest":"共一百五十篇，分为五卷。许多篇的标题写着“交与伶长”，或注明用丝弦乐器伴奏；篇中“细拉”一词的含义至今不明，可能是演唱时的停顿或间奏提示。","keyPoint":"标题中的乐器名和曲调名多是后加的，年代可能比诗歌正文晚。"},
    {"id":"hebrew-temple-chronicles-2","title":"《历代志上》","authorEra":"约公元前5—前3世纪 · 作者不详","kind":"canonical-text","digest":"第十五、十六章写大卫迁运约柜时，命利未人敲钹、弹琴、吹号；第二十五章列出二百八十八名受过训练的歌者，按抽签分成二十四班，轮流在圣殿供职。","keyPoint":"成书于第二圣殿时期，反映的可能是作者那个时代的圣殿制度，再把它追溯到大卫名下。"},
  ],
  "maya-ritual": [
    {"id":"maya-ritual-dresden-1","title":"《德累斯顿抄本》研究","authorEra":"后古典期抄本 · 现代玛雅学研究","kind":"modern-record","digest":"用无花果树皮纸折叠而成，共三十九页，是现存最完整的玛雅书籍之一。书中有金星周期表和日食表，以及按历法日期排列的祭祀图像。1880年德国学者弗斯特曼首先破译了其中的历法。","keyPoint":"抄本本身几乎没有音乐内容，只能借历法推测仪式举行的时间，乐器形象要看壁画和陶器。"},
    {"id":"maya-ritual-bonampak-2","title":"博南帕克壁画乐队研究","authorEra":"约公元790年壁画 · 现代考古研究","kind":"inscription-artifact","digest":"1946年外界首次见到这组壁画。1号建筑三间画室分别描绘王位继承、战争和庆典，耶鲁大学的玛丽·米勒团队用红外摄影重新描绘了已经褪色的乐队细节。","keyPoint":"壁画所描绘的是一次具体的宫廷庆典，乐队规模不一定代表日常仪式。"},
  ],
"tang-changan": [
  {"id":"tang-changan-jiaofang-1","title":"《教坊记》","authorEra":"唐 · 崔令钦（约 8 世纪中叶）","kind":"canonical-text","digest":"追记开元、天宝年间教坊旧事，列乐人姓名、歌舞曲名与演出规矩，末卷收曲名三百余首，是唐代俗乐机构最直接的一份记录。","keyPoint":"作者自序说写于安史乱后，靠记忆追述；所记多为长安左教坊见闻，不能当作全国乐制的通则。"},
  {"id":"tang-changan-jiutang-2","title":"《旧唐书·音乐志》","authorEra":"五代后晋 · 刘昫等修","kind":"canonical-text","digest":"四卷篇幅叙述唐初至末年的乐制沿革：九部乐、十部乐的部类与乐工编制，坐部伎、立部伎的分工，以及大曲、法曲在宫廷中的位置。","keyPoint":"成书于后晋，材料多取自唐代国史与实录；同一事常与《新唐书·礼乐志》互有详略，需对读。"},
  {"id":"tang-changan-p3808-3","title":"敦煌 P.3808 琵琶谱","authorEra":"晚唐五代 · 抄手不详（法藏敦煌写卷）","kind":"inscription-artifact","digest":"卷子背面抄有琵琶曲二十五首，用约二十个谱字记四弦四相的柱位，旁附“口”“丁”等节拍符号，是现存规模最大的唐代琵琶谱。","keyPoint":"谱卷未注明定弦，林谦三、叶栋、陈应时的解译彼此不同，据此还原的音高只能算一家之说。"},
],
"andalus-cordoba": [
  {"id":"andalus-cordoba-cantigas-1","title":"《圣母颂歌集》","authorEra":"约 1270—1284 年编纂 · 阿方索十世主持","kind":"canonical-text","digest":"存四百二十余首加列戈-葡萄牙语颂歌，抄本四种，埃斯科里亚尔本插图最丰，画中乐师分持乌德、雷巴布、竖琴与管风琴，是伊比利亚多宗教音乐生活的图像总集。","keyPoint":"插图所绘乐器未必都在当地使用，有些是按异域志的想象补入；抄本的编排顺序也不等于演奏顺序。"},
  {"id":"andalus-cordoba-nafh-2","title":"al-Maqqarī《Nafḥ al-ṭīb》","authorEra":"17 世纪 · 艾哈迈德·马卡里","kind":"canonical-text","digest":"这部伊比利亚穆斯林文化史成书于 17 世纪，其中对齐里亚布在科尔多瓦的记述最为详尽，包括他增设琴弦、改用鹰羽拨弦与排定努巴的做法。","keyPoint":"成书距齐里亚布去世已近八百年，属晚出辑录，所据早期材料今多不存，细节需与同期记载互证。"},
],
"notre-dame-polyphony": [
  {"id":"notre-dame-polyphony-magnus-1","title":"《奥尔加农大全》","authorEra":"12 世纪后半叶编成 · 归于莱奥南","kind":"canonical-text","digest":"为全年瞻礼的升阶经与阿肋路亚而编的二声部奥尔加农曲集，今存佛罗伦萨劳伦齐阿纳抄本与沃尔芬比特尔抄本等版本，各本曲目与编排并不一致。","keyPoint":"曲集原本已失，现存抄本晚于编成年代数十年，莱奥南究竟写了哪些曲子，只能据佚名理论家的记载推测。"},
  {"id":"notre-dame-polyphony-franco-2","title":"科隆的弗兰科《量度音乐艺术》","authorEra":"约 1280 年 · 科隆的弗兰科","kind":"canonical-text","digest":"讨论有量记谱的专著，把音符形状与固定时值对应起来，提出短拍三分与二分并存的比例规则，使多声部作品的节奏第一次可以被精确书写。","keyPoint":"书中规则针对 13 世纪后期的曲目，用它去读早一代的圣母院手稿会错判时值。"},
],
"suzhou-kunqu": [
  {"id":"suzhou-kunqu-baishi-1","title":"《白石道人歌曲》","authorEra":"约 1200 年前后 · 姜夔","kind":"canonical-text","digest":"六卷，收词调歌曲十七首，每首旁注俗字谱，另有琴歌《古怨》用减字谱。这是宋代唯一留下成体系乐谱的词乐集，20 世纪经杨荫浏等人译谱后可以歌唱。","keyPoint":"十七首俗字谱与《古怨》的减字谱是两套体系，不能混为一谈；译谱的音高与节奏各家仍有出入。"},
  {"id":"suzhou-kunqu-qulv-2","title":"魏良辅《曲律》","authorEra":"明嘉靖年间 · 魏良辅（又名《南词引正》）","kind":"canonical-text","digest":"二十余则唱论，讲五音四呼、字头字腹字尾的处理、曲牌联套与伴奏分工，并追述昆山腔的来历，是昆曲唱法最早的成文总结。","keyPoint":"全书为口授要点，不是系统教程；现存版本文字互有出入，明刊本与后世抄本条目数不同。"},
  {"id":"suzhou-kunqu-taihe-3","title":"朱权《太和正音谱》","authorEra":"1398 年 · 宁王朱权","kind":"canonical-text","digest":"北曲曲谱与曲论合集，按十二宫调收录三百余支曲牌的句格与平仄，附元明杂剧作家评语，是现存最早的北曲格律谱。","keyPoint":"所收为北曲，与昆曲所用的南曲曲牌体系有别；书中评语带个人好恶，不能当史料直引。"},
],
"renaissance-polyphony": [
  {"id":"renaissance-polyphony-zarlino-1","title":"扎利诺《和声法则》","authorEra":"1558 年 · 焦塞福·扎利诺","kind":"canonical-text","digest":"四卷，从音程比例讲到调式与对位，主张大小三度是协和音程，并以古代调式理论重排教会调式，为文艺复兴后期的和声实践提供依据。","keyPoint":"作者是理论家兼作曲家，书中部分调式方案是为论证古典渊源而设，与实际创作并不完全一致。"},
  {"id":"renaissance-polyphony-glar-2","title":"格拉雷安《十二调式论》","authorEra":"1547 年 · 海因里希·格拉雷安","kind":"canonical-text","digest":"把中世纪传下的八个教会调式扩为十二个，补入以 C 与 A 为主音的两种，并以古希腊民族名重新命名，影响了此后两百年的调式理论。","keyPoint":"新增两调的依据来自古代文献的重新解读，与当时作曲家实际使用的调式分类并不完全对应。"},
],
"aztec-tenochtitlan": [
  {"id":"aztec-tenochtitlan-cantares-1","title":"《墨西哥人之歌》","authorEra":"16 世纪中后期 · 纳瓦特尔语抄本","kind":"canonical-text","digest":"纳瓦特尔语诗歌总集，收“花与歌”体裁的赞歌、战歌与哲理诗，歌词旁偶有 ti、to、co、qui 一类音节，被认为提示鼓点与吟唱的分节。","keyPoint":"抄本成于西班牙征服之后，由传教士与土著书手合作录写，诗歌的原始演出方式只能部分复原。"},
  {"id":"aztec-tenochtitlan-sahagun-2","title":"萨阿贡《新西班牙事物通史》","authorEra":"16 世纪 · 贝尔纳迪诺·德·萨阿贡","kind":"canonical-text","digest":"十二卷，用西班牙文与纳瓦特尔文对照记录墨西哥中部的物产、礼仪、教育与技艺，其中论乐舞的章节详列神庙乐器、乐官职责与节期歌咏。","keyPoint":"由传教士主持编纂，特拉斯卡拉与特诺奇蒂特兰的报道人提供的材料侧重不同，读时需分辨信息来源。"},
],
};

