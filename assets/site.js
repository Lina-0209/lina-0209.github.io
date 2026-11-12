(() => {
  const en = Object.fromEntries([...document.querySelectorAll('[data-i18n]')].map(el => [el.dataset.i18n, el.innerHTML]));
  const zh = {
    keywordsLabel:"关键词：",
    paveKeywords:"第一视角视觉问答；多模态学习；偏好对齐；辅助人工智能",
    rerouteKeywords:"动态深度语言模型；对抗鲁棒性；路由机制；迁移性",
    obsKeywords:"第一视角轨迹预测；运动历史恢复；观测依据；流匹配",
    drmotKeywords:"RGB-D；指代多目标跟踪；空间定位；多模态感知",
    nlpuKeywords:"光子计算；神经形态逻辑；黑磷；脉冲神经网络",
    berrKeywords:"多帧图像恢复；反光去除；可靠性感知融合；面部表情识别",
    recurBoolKeywords:"循环神经网络；布尔逻辑电路；精度感知编译；低比特量化；光子计算",
    opticalKeywords:"衍射神经计算；光学通道注意力；载流子动力学；交叉增益调制",
    stemKeywords:"人工智能教育；自适应辅导；多模态感知；人工智能素养",
    toeflKeywords:"口语练习；人工智能反馈；口语评估；开源学习工具",
    logicLmVisual:"RecurBool · 点击查看流程与网络",
    logicLmAbstract:"本研究探索循环神经网络向可执行布尔逻辑电路的转换方法，提出 RecurBool，一种面向循环语言模型的精度感知逻辑电路编译框架，旨在为未来具有状态记忆与时序处理能力的光子计算架构提供可验证的逻辑表示。该框架以训练完成并冻结的门控循环单元（GRU）为基础，通过分组量化、逐维码本校准与量化误差补偿，在降低数值表示精度的同时尽可能保持原模型的预测性能。在采用 5-bit 权重与循环状态编码的基础上，RecurBool 将门控计算、非线性映射、算术运算及状态更新转换为门类型和连接关系固定的二输入布尔逻辑电路。编译后的电路保留 GRU 的门控记忆机制，可跨时间步复用，并通过自主状态反馈完成连续字符预测，无需依赖原始浮点模型。实验结果表明，在 text8 完整验证集上，RecurBool 取得 1.7436 BPC，接近原始 FP32 GRU 的 1.7116 BPC；在 WikiText-2 字节级验证中，取得 1.9165 BPB，接近原始模型的 1.8903 BPB。此外，电路实现通过了随机输入及长序列前缀的逐码一致性验证，证明了编译电路与相应有限精度参考计算的一致性。上述结果验证了循环语言模型向固定布尔逻辑电路转换的可行性，为进一步研究逻辑电路优化、硬件感知编译以及面向光子器件的循环计算映射提供了方法基础。",
    logicLmPeriod:"2026 — 至今 · HKUST (GZ) / SZU",
    visitingPeriod:"2025 年 10 月 — 至今",
    visitingWork:"研究锂插层黑磷激活函数、光学神经网络、全光通道注意力及光学储备池计算。",
    visitingHost:"接收导师：Prof. <a class=\"mentor-link\" href=\"https://cpoe.szu.edu.cn/en/szxq.jsp?dm=zhanghan_1en&amp;id=1779754232620453889&amp;language=1&amp;urltype=tp.TpTeacherDetail&amp;wbtreeid=1119\" target=\"_blank\" rel=\"noopener noreferrer\">Han Zhang</a>",
    visitingTitle:"访问学生 · 深圳大学",
    logicLmDesc:"将循环语言模型编译为固定布尔电路，为未来光子循环计算提供可验证的逻辑基础。",
    researchDetails:"研究细节",
    visitingBio:"我同时在<strong>深圳大学</strong>担任访问学生，由 Prof. <a class=\"mentor-link\" href=\"https://cpoe.szu.edu.cn/en/szxq.jsp?dm=zhanghan_1en&amp;id=1779754232620453889&amp;language=1&amp;urltype=tp.TpTeacherDetail&amp;wbtreeid=1119\" target=\"_blank\" rel=\"noopener noreferrer\">Han Zhang</a> 接收，开展光学与神经形态计算研究。",
    obsAbstract:"第一视角观测中的遮挡、有限可见性和跟踪误差会破坏运动历史，使行人轨迹预测面临挑战，并影响自主机器人的导航。现有方法通常先补全噪声历史位置再进行预测，或联合训练辅助历史重建分支。然而，将不完美的历史估计直接输入预测器，会造成训练与部署之间的显著分布偏移；辅助重建方法仍可能在受损的原始坐标上计算智能体间交互。我们的核心思路是，将恢复的历史状态与原始观测证据显式耦合，逐步适配预测器并校准智能体间关系。基于此，我们提出 ObsBridge，一种通过观测依据连接历史恢复与未来预测的流式轨迹预测框架。首先，冻结的估计器根据智能体相对位置、自身相对位置、图像平面位置与可见性状态恢复历史运动。训练时，逐智能体课程学习在上下文编码前，将干净的教师历史逐渐替换为完整的估计历史，使预测器平滑适应残余恢复误差。进一步，残差几何适配器将编码后的运动与原始观测证据融合，再通过社交注意力聚合表示，为基于流的轨迹生成器提供条件。多个基准上的实验表明 ObsBridge 优于现有先进方法；在 EgoTraj-TBD 上，minADE@20 和 minFDE@20 分别降低 5.81% 与 9.15%。",
    obsDesc:"ObsBridge 将恢复的运动历史与原始观测证据相结合，实现面向第一视角输入的鲁棒行人轨迹预测。",
    obsVisual:"ObsBridge · 研究动机与概览",
    cvprStatus:"在审 · CVPR 2027",
    stemContributionsTitle:"五项平台贡献",
    stemSensing:"<strong>视觉与情绪感知。</strong>通过可选的摄像头面部情绪感知，支持关注学习者状态的交互。",
    stemMemory:"<strong>共享学习档案。</strong>整合学习历史与偏好，贯通辅导、练习和反馈。",
    stemTeaching:"<strong>自适应教学策略。</strong>根据学习者状态选择提示、解释与示例。",
    stemPractice:"<strong>练习与学习报告。</strong>配置练习、跟踪进度并生成学习报告。",
    stemEmbodiment:"<strong>台灯伙伴。</strong>通过动作与灯光，将学习提示延伸至实体学习空间。",
    stemPosterLink:'项目海报 <span aria-hidden="true">↗</span>',

    stemVisual:"工作台 · 点击查看截图与海报",
    toeflVisual:"工作台 · 点击查看 3 张截图",
    nlpuVisual:"Logic-SNN · MNIST 网络架构",
    navPlatforms:"平台",
    platformsTitle:"平台开发",
    platformsIntro:"将学习需求转化为可使用的应用。",
    collaborativePlatform:"合作开发平台",
    stemPlatformTeam:"与 HKUST (GZ) 红鸟同学 Fangting Dong、Nusratilla Abdullaev、Haiqi Jiang、Bowen Kuang 共同开发，由红鸟项目导师（PS）Dr. <a class=\"mentor-link\" href=\"https://facultyprofiles.hkust-gz.edu.cn/faculty-personal-page?id=422\" target=\"_blank\" rel=\"noopener noreferrer\">Ke XUE</a> 指导完成。",
    stemPlatformDesc:"面向本科物理的模块化 AI 辅导智能体，整合对话式辅导、共享学习记忆、自适应练习与多模态学生状态感知。",
    visitPlatform:"访问平台 <span aria-hidden=\"true\">↗</span>",
    independentPlatform:"独立开发",
    openSourcePlatform:"开源",
    toeflPlatformSubtitle:"面向新托福口语的开源练习平台",
    toeflPlatformDesc:"从托福备考需求出发，我独立开发并开源了这个口语练习平台，将题目截图、回答录音、AI 辅助反馈、回听复盘、练习历史和 Interview 回答优化整合到同一流程。其他学习者可下载源码，按照 Sites 部署指南搭建自己的实例，使用自己的材料开展口语练习。",
    opticalRepo:'GitHub <span aria-hidden="true">↗</span>',
    opticalVisual:'光学注意力 · 架构构想',
    nlpuCode:'SNN 组件代码 <span aria-hidden="true">↗</span>',
    nlpuStatus:"在审 · Science Advances",
    nlpuDesc:"我为这项黑磷光子计算合作研究开发并训练了可微逻辑门 SNN 组件，包括 soft-to-hard 布尔门转换与评估流程。",
    nlpuAbstract:"神经形态逻辑处理单元（nLPU）是传统逻辑处理单元（LPU）的重要演进，为通过高吞吐、节能的类脑计算突破冯·诺依曼瓶颈提供了一条极具前景的路径。然而，在单一硬件平台内实现多功能、可重构的 nLPU 仍是一项根本性挑战。在此，我们展示了一种基于单层黑磷（BP）范德华异质结构的可重构光子 nLPU 计算架构。通过将黑磷的各向异性光致发光（PL）与非易失性光控铁电调制相结合，该平台实现了七种基本布尔逻辑运算（AND、OR、NOT、NOR、NAND、XOR、XNOR）之间的动态可重构切换，同时兼容脉冲神经网络（SNN）所依托的连续时间驱动和离散稀疏脉冲事件驱动机制。通过将这些物理逻辑基元与可微分训练策略相结合，我们的光子 nLPU 架构实现了高准确率的并行模式识别，并显著降低了计算延迟和功耗。这项工作连接了物理光学计算与神经符号逻辑架构，为下一代智能光子处理器的发展奠定了基础。",

    compactInterests:"致力于开发契合人类需求，并在真实世界环境中可靠、高效运行的第一视角多模态人工智能系统。",
    compactTheme1:"第一视角多模态学习",
    compactTheme2:"以人为中心的人工智能",
    compactTheme3:"可靠与高效的人工智能",

    abstract:"摘要",
    paveAbstract:"第一视角视频问答使盲人及低视力（BLV）用户能够通过自然语言询问身边的环境。然而，现有基准和模型主要优化回答与参考答案之间的语义一致性，将视觉辅助简化为纯粹的事实匹配任务。在真实场景中，如果回答缺少用户当前任务所需的空间方位、可执行细节或简洁性，即使事实正确，也可能无法提供实际帮助。基于 EgoBlind 中真实的视障用户第一视角视频及真实用户提问，我们构建了偏好对齐数据集 PA-EgoQA，依据实证性的视障用户沟通准则重构参考答案。在此基础上，我们提出偏好对齐第一视角视觉学习框架 PAVE，将结构化回答策略微调与确定性的问题条件化路由相结合，使模型在推理时能够根据问题的表面形式直接调整回答方式。我们进一步通过 FILTER-GRPO 对齐模型：将分层的正确性—质量奖励与基于对比的候选组筛选结合，从事实准确性的差异以及正确答案之间细粒度的质量差异中提取学习信号。在三个视觉语言模型骨干上的广泛实验表明，该方法在持续提升事实准确性的同时，显著改善了辅助回答的质量。这些结果为将以人为中心的回答要求转化为第一视角监督、生成策略与后训练目标提供了具体范式。",
    rerouteAbstract:"大语言模型（LLM）支撑着从搜索摘要到自主 Web 智能体的广泛网络服务。为降低模型服务的高昂计算成本，动态深度推理成为一种有效范式，其词元表示动态决定需要执行的网络层。因此，每个表示承担双重职责：既编码语义内容，又控制后续计算。本文研究这一机制是否会引入可迁移的脆弱性。我们的核心洞见是，模型在干净文本上产生的路由决策能够提供内生、无标签的监督信号。这些决策适用于任意输入，无需任务标签，并指示当前输入位于各决策边界的哪一侧。基于这一观察，我们提出 REROUTE：通过学习嵌入扰动反转干净输入的路由决策，同时保持原始路径上的语言建模保真度，并将这些扰动蒸馏为离散词元替换。REROUTE 使源模型的零样本准确率下降 42.9%，并可迁移至未见过的路由架构，使其准确率相对下降 33.3%–35.3%。此外，所学扰动在输入嵌入空间中收敛到单一主导方向。理论与因果分析表明，这一共享方向源于对齐的路由决策边界拉回方向，它既破坏骨干模型表示，又通过离散重路由放大性能下降。",
    drmotAbstract:"指代多目标跟踪（RMOT）旨在根据语言描述跟踪特定目标，在机器人、自动驾驶等交互式人工智能系统中发挥着重要作用。然而，现有 RMOT 方法完全依赖二维 RGB 观测。由于相似的二维投影可能对应不同的三维场景配置，现有观测可能无法唯一确定被指代的目标，导致任务需求与可用输入之间存在根本性的不匹配。为推动 DRMOT 任务研究，我们构建了专门面向该任务的数据集 DRSet，包含来自 186 段 RGB-D 原始序列的 2,076 条指代表达。数据集将同步的 RGB 图像和深度图与语言描述配对，其中包括显式依赖深度的描述，用于系统评估空间语义检测与跟踪能力。此外，我们提出了由多模态大语言模型（MLLM）引导的深度指代跟踪框架 DRTrack。该框架利用经 Geometric-Aware GRPO 微调的 MLLM，从语言、RGB 与深度的联合输入中实现精确的空间语义检测，并结合显式深度线索实现稳健的轨迹关联。在 DRSet 数据集上的广泛实验验证了该框架的有效性。",

    navMenu:'菜单',stageSubtitle:'连接感知、推理与人的真实需求。',discoverResearch:'探索我的研究',stageCV:'查看简历',skip:'跳转到正文',navInterests:'研究兴趣',navResearch:'论文',navCode:'研究经历',navAbout:'背景',navContact:'联系',
    affiliation:'<a class="school-link" href="https://www.hkust-gz.edu.cn/" target="_blank" rel="noopener noreferrer">香港科技大学（广州）</a> · 人工智能',headline:'<span class="highlight">多模态学习。</span><br>可靠视觉感知。',
    bio:"我是<strong><a class=\"school-link\" href=\"https://www.hkust-gz.edu.cn/\" target=\"_blank\" rel=\"noopener noreferrer\">香港科技大学（广州）</a></strong>人工智能专业的 MPhil 学生，主导师为 Prof. <a class=\"mentor-link\" href=\"https://facultyprofiles.hkust-gz.edu.cn/faculty-personal-page?id=401\" target=\"_blank\" rel=\"noopener noreferrer\">Yutao Yue</a>，联合导师为 Prof. <a class=\"mentor-link\" href=\"https://personal.hkust-gz.edu.cn/bojuncheng/index.html\" target=\"_blank\" rel=\"noopener noreferrer\">Bojun Cheng</a>。红鸟项目导师为 Dr. <a class=\"mentor-link\" href=\"https://facultyprofiles.hkust-gz.edu.cn/faculty-personal-page?id=422\" target=\"_blank\" rel=\"noopener noreferrer\">Ke XUE</a>。",
    bio2:"我研究<strong>面向可靠、以人为中心人工智能的多模态感知与推理</strong>，工作涵盖偏好对齐第一视角辅助、RGB-D 跟踪及基于观测证据的轨迹预测。我也探索自适应语言模型的鲁棒性，以及高效、物理启发的计算机制。",
    bio3:'物理学背景也促使我探索<strong>逻辑门、脉冲动力学与光学计算</strong>。在这些方向中，我重视将模型设计与人们需要的信息、任务所要求的模型行为相联系。',
    viewCV:'学术简历 <span aria-hidden="true">↗</span>',opportunity:'正在寻求 2027 年秋季入学的博士机会，研究方向包括多模态学习、具身感知及可信高效人工智能。',profileAffiliation:'人工智能哲学硕士（MPhil）<br><span><a class="school-link" href="https://www.hkust-gz.edu.cn/" target="_blank" rel="noopener noreferrer">HKUST (GZ)</a></span>',
    portraitLabel:'物理学 → 人工智能',enlarge:'点击放大',perspective:'研究视角',noteStatement:'从视觉证据<br>走向有用的辅助。',noteCaption:'理解真实世界。<br>对齐人的需求。<br>探索有目标的计算。',noteFooter:'物理学 → 人工智能',
    interestsEyebrow:'贯穿不同工作的研究问题',interestsTitle:'研究兴趣',interestsLead:'理解真实世界。<br>服务人的需求。探索计算机制。',interestsIntro:'我关注连接感知、推理与人类需求的多模态智能，并探索其可靠性与计算效率。',
    theme1:'以人为中心的<br>多模态推理',theme1Body:'我研究偏好对齐的第一视角理解与语言引导的空间感知，将视觉、语言与深度信息，同人们理解环境、采取行动时真正需要的信息相连接。',interest1Tag:'从感知走向辅助',interest1Question:'此时此地，人真正需要什么信息？',interest1Work:'PAVE · DRMOT',
    theme2:'可靠感知与<br>自适应人工智能',theme2Body:'我的工作涵盖服务于下游表情识别的眼镜反光去除，以及动态深度语言模型的对抗分析，通过针对性评估联系输入质量、任务表现与模型行为。',interest2Tag:'从证据走向可靠性',interest2Question:'当输入或计算路径变化时，如何保持可靠？',interest2Work:'BERR · ReRoute',
    theme3:'高效与物理启发的<br>计算机制',theme3Body:'我探索可微逻辑门突触与时间脉冲动力学的结合，并提出输入自适应的光学注意力构想，将可学习计算与离散算子、物理机制相连接。',interest3Tag:'从机制走向计算',interest3Question:'逻辑、脉冲与光如何塑造神经计算？',interest3Work:'Logic-SNN · 光学注意力构想',
    researchEyebrow:'论文与研究稿件',researchTitle:'论文',researchIntro:'研究稿件。* 表示同等贡献。',all:'全部论文',multimodal:'多模态学习',reliability:'可靠感知与计算',
    manuscript:'研究稿件',wwwStatus:'在审 · WWW 2027',tcsvtStatus:'在审 · IEEE TCSVT',researchProject:'研究项目',independentModel:'独立模型开发',
    paveVisual:'PAVE · 研究动机与概览',paveDesc:'让正确的视觉回答成为有用的辅助。PAVE 结合面向视障用户需求的监督、问题条件化回答策略与正确性优先的后训练。',paveAcc:'准确率提升',paveLength:'平均回答长度减少',paveProtocol:'InternVL2.5-8B · 匹配的 EgoBlind 基线 · PA-EgoQA 主评估集',
    contributionDetails:'个人贡献与研究细节',paveRole:"<strong>我的贡献。</strong>第一作者；开发 PA-EgoQA、设计并实现 PAVE，并评估三个视觉语言模型骨干。",paveMethod:'PA-EgoQA 包含 4,762 个问题，采用六项用户中心的回答准则，并完成全覆盖的视频依据人工审核。框架结合结构化监督微调、确定性的问题条件化策略路由与 Filter-GRPO。主评估中，InternVL2.5-8B 的准确率由 62.88% 提升至 67.00%，模型评审估计的 BLV Score 从 3.0660 提升至 3.2878（0–5 分）。',equalContribution:'* 表示同等贡献。',paperPDF:'论文 PDF <span aria-hidden="true">↗</span>',
    berrVisual:"Beyond Glare · BERR 模型架构",berrSubtitle:"BERR · 可靠性感知四帧恢复",berrDesc:"BERR 通过轻量四帧网络恢复眼镜反光遮挡的人脸线索，支持鲁棒的面部表情识别。",berrAbstract:"眼镜反光会遮挡人工智能辅助学习中表情识别所需的人脸线索。BERR 是一种轻量四帧去反光网络，通过退化感知的时间融合整合互补观测。我们构建了包含 2,243 个合成反光 burst 的 LensGlare-4，并将 BERR–FER 流程集成到本科物理智能辅导平台中。在 FER2013 强反光评估中，BERR 将准确率与 Macro-F1 分别提升 0.54 和 0.78 个百分点，为多模态学生状态感知和个性化教学提供视觉前端。",berrRepo:"GitHub <span aria-hidden=\"true\">↗</span>",
    drmotVisual:'DRMOT · 深度感知跟踪亮点',drmotDesc:'让语言引导的跟踪获得深度线索。DRSet 将 RGB-D 观测与指代表达相连接，支持深度感知的空间定位与轨迹关联研究。',sequences:'段 RGB-D 视频序列',expressions:'条指代表达',drmotRole:'<strong>我的贡献。</strong>参与数据标注与组织、论文撰写及修改。',drmotMethod:'合作研究提出 DRSet 与 DRTrack。深度线索支持距离、前后关系及遮挡描述，框架结合空间定位与深度感知关联。数据集中包含 380 条带有显式深度语义的表达。',
    rerouteVisual:'ReRoute · 整体概览与分析',rerouteDesc:'研究自适应计算机制共享了什么。ReRoute 通过路由决策提供的监督，分析不同动态深度语言模型之间共享的对抗脆弱性。',rerouteRole:'<strong>我的贡献。</strong>共同第一作者；在十项零样本基准上，开展嵌入空间扰动及跨架构迁移实验，涵盖 SkipGPT、DiffSkip 与四种 Router-Tuning 配置。',rerouteMethod:'ReRoute 从中间路由决策中提取无标签监督。在报告的连续嵌入扰动设置中，源模型相对准确率下降 42.9%，共享 Llama 系列骨干的未见路由配置下降 33.3%–35.3%。',
    codeEyebrow:'模型、系统与研究构想',codeTitle:'研究经历',experienceIntro:'模型开发与计算架构构想。',allRepositories:'全部仓库 <span aria-hidden="true">↗</span>',openProject:'开源研究',logicDesc:'将可学习布尔计算与脉冲时间动力学结合。我实现并训练了可微逻辑门突触与 LIF 神经元结合的模型，提供 soft/hard 评估与离散门导出。',exploreCode:'查看代码 <span aria-hidden="true">↗</span>',proposal:'研究构想',opticalDesc:'通过衍射计算与 VCSOA 交叉增益调制，研究输入自适应的光学特征重校准。我独立构思了架构，并制定初步可行性验证方案。',dlgnDesc:'稀疏可微逻辑门网络复现',convDlgnDesc:'卷积逻辑树网络复现',convSnnDesc:'常规脉冲神经网络分类基线',
    logicRole:'模型实现与评估',logicSubtitle:'可微逻辑门脉冲神经网络',logicContribution:'<strong>我的贡献。</strong>在<a class="school-link" href="https://www.hkust-gz.edu.cn/" target="_blank" rel="noopener noreferrer">香港科技大学（广州）</a>的合作研究中，实现结合 LIF 神经元的可微卷积与全连接逻辑门层，并开发 soft-to-hard 评估与离散布尔门导出流程。',relatedImplementations:'相关实现',opticalRole:'架构构想与可行性研究',opticalSubtitle:'输入自适应的光学特征重校准',opticalAbstract:"衍射光学神经网络能够以空间并行的方式处理二维光场，但其固定的光学变换难以直接实现随输入变化的通道重标定。本文提出一种载流子介导的全光通道注意力框架，在保持训练后衍射参数固定的条件下，为二维光学特征引入输入相关的乘性调制。其核心思想是利用输入产生的控制光调节半导体放大器的载流子状态，将动态通道权重的生成嵌入光与物质的相互作用过程。具体而言，光学注意力支路通过特征压缩与跨通道衍射混合生成控制光，并通过大面积垂直腔半导体光放大器中的交叉增益调制，改变主支路各特征通道的增益。在弱信号与近似空间均匀的工作条件下，该机制将输入相关的增益作用于完整二维特征场，实现通道重标定。进一步，本文设计器件标定驱动的联合优化流程，将器件响应约束引入前端特征编码、注意力映射与后端衍射读出的协同设计。该框架使可学习的静态光学映射与输入驱动的动态增益共同参与计算，为无需逐样本电子权重计算与调制器刷新的光学通道注意力提供了一种设计方案。",
    bscThesis:"\u6bd5\u4e1a\u8bba\u6587\uff1aLieb\u6676\u683c\u4e2d\u7684\u5c40\u57df\u5316\u4e0e\u62d3\u6251\u6001",
    backgroundEyebrow:'从物理学出发，聚焦人工智能',backgroundTitle:"教育与研究任职",fullCV:'查看完整简历 <span aria-hidden="true">↗</span>',mphilDate:'2025 — 至今',mphilDegree:'人工智能哲学硕士（MPhil）',hkustName:'<a class="school-link" href="https://www.hkust-gz.edu.cn/" target="_blank" rel="noopener noreferrer">香港科技大学（广州）</a>',supervisors:"主导师：Prof. <a class=\"mentor-link\" href=\"https://facultyprofiles.hkust-gz.edu.cn/faculty-personal-page?id=401\" target=\"_blank\" rel=\"noopener noreferrer\">Yutao Yue</a><br>联合导师：Prof. <a class=\"mentor-link\" href=\"https://personal.hkust-gz.edu.cn/bojuncheng/index.html\" target=\"_blank\" rel=\"noopener noreferrer\">Bojun Cheng</a><br>项目导师（PS）：Dr. <a class=\"mentor-link\" href=\"https://facultyprofiles.hkust-gz.edu.cn/faculty-personal-page?id=422\" target=\"_blank\" rel=\"noopener noreferrer\">Ke XUE</a>",bscDegree:'物理学理学学士',guangzhouUniversity:'广州大学',toolsTitle:'研究工具与技能',toolsBody:'多模态模型评估、监督微调、强化学习、论文图表设计与可视化，以及科研软件实现。',cvIncludes:'教育、研究经历与代表稿件 <span aria-hidden="true">↗</span>',
    contactEyebrow:'保持联系',contactTitle:'关注相近的研究问题？',contactBody:'欢迎就多模态学习、可靠感知与以人为中心的人工智能交流博士机会和研究想法。',copyEmail:'复制邮箱',footerLine:'多模态学习 · 可靠感知 · 有目标的计算',backTop:'返回顶部 ↑'
  };
  let language = 'en';
  let activeFilter = 'all';
  const toggle = document.querySelector('[data-language-toggle]');
  function updateCount() {
    const count = [...document.querySelectorAll('[data-research]')].filter(el => !el.hidden).length;
    const label = document.querySelector('[data-result-count]');
    if (label) label.textContent = language === 'zh' ? `${count} 篇论文` : `${count} ${count === 1 ? 'paper' : 'papers'}`;
  }
  function setLanguage(next) {
    language = next === 'zh' ? 'zh' : 'en';
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const value = (language === 'zh' ? zh : en)[el.dataset.i18n];
      if (value !== undefined) el.innerHTML = value;
    });
    if (toggle) {
      toggle.querySelector('[data-language-label]').textContent = language === 'zh' ? 'EN' : '中文';
      toggle.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换为中文');
    }
    document.querySelector('nav')?.setAttribute('aria-label',language === 'zh' ? '主导航' : 'Main navigation');
    document.querySelector('.filter-bar')?.setAttribute('aria-label',language === 'zh' ? '筛选论文' : 'Filter publications');
    updateCopyLabels();
    try { localStorage.setItem('nan-li-language',language); } catch {}
    updateCount();
  }
  toggle?.addEventListener('click',() => setLanguage(language === 'en' ? 'zh' : 'en'));
  function filterResearch(nextFilter) {
    activeFilter = nextFilter;
    document.querySelectorAll('[data-filter]').forEach(b => {
      const selected = b.dataset.filter === activeFilter;
      b.classList.toggle('active',selected);
      b.setAttribute('aria-pressed',String(selected));
    });
    document.querySelectorAll('[data-research]').forEach(project => {
      project.hidden = activeFilter !== 'all' && project.dataset.research !== activeFilter;
    });
    updateCount();
  }
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click',() => filterResearch(button.dataset.filter)));
  document.querySelectorAll('[data-interest-filter]').forEach(link => link.addEventListener('click',() => filterResearch(link.dataset.interestFilter)));
  let toastTimer;
  function showToast(message) {
    const toast = document.querySelector('.toast');
    if (!toast) return;
    toast.textContent = message;toast.hidden = false;
    clearTimeout(toastTimer);toastTimer = setTimeout(() => {toast.hidden = true;},3000);
  }
  function updateCopyLabels() {
    document.querySelectorAll('[data-copy-email]').forEach(button => {
      const copied = button.dataset.copied === 'true';
      const label = language === 'zh' ? (copied ? '邮箱已复制' : '复制邮箱') : (copied ? 'Email copied' : 'Copy email');
      button.setAttribute('aria-label',label);
      button.title = label;
    });
  }
  const copyFeedbackTimers = new WeakMap();
  document.querySelectorAll('[data-copy-email]').forEach(button => button.addEventListener('click',async () => {
    const address = 'nli841@connect.hkust-gz.edu.cn';
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(address);
      button.dataset.copied = 'true';
      clearTimeout(copyFeedbackTimers.get(button));
      copyFeedbackTimers.set(button,setTimeout(() => {
        delete button.dataset.copied;
        updateCopyLabels();
      },2200));
      updateCopyLabels();
      showToast(language === 'zh' ? '邮箱已复制' : 'Email copied');
    } catch {
      showToast(language === 'zh' ? '请选中邮箱地址复制' : 'Please select the email address to copy it');
    }
  }));
  updateCopyLabels();
  const profileContact = document.querySelector('.profile-contact');
  const companion = document.querySelector('.avatar-companion');
  if (profileContact && companion && 'IntersectionObserver' in window) {
    const updateCompanionPosition = () => document.querySelector('[data-avatar]')?.dispatchEvent(new Event('avatar:positionchange'));
    companion.addEventListener('transitionend',event => {
      if (event.target === companion && event.propertyName === 'bottom') updateCompanionPosition();
    });
    new IntersectionObserver(entries => {
      const avoidContact = entries.some(entry => entry.isIntersecting);
      if (companion.classList.contains('avoid-profile-contact') === avoidContact) return;
      companion.classList.toggle('avoid-profile-contact',avoidContact);
      requestAnimationFrame(updateCompanionPosition);
    }).observe(profileContact);
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('nav a').forEach(a => a.classList.toggle('current',a.hash === `#${entry.target.id}`));
        }
      });
    },{rootMargin:'-10% 0px -65% 0px',threshold:0});
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
  }
  try { if (localStorage.getItem('nan-li-language') === 'zh') setLanguage('zh'); } catch {}
  updateCount();
})();
