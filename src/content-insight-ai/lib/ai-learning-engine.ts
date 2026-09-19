import type { FeedbackReport, ContentType, LearningEntry } from '../types/feedback';
import { addLearningEntry, updateFeedbackStatus, addChatMessage } from './feedback-store';
import { detectLanguage, t, getContentTypeLabel, autoDetectAndSet, getLang, setLang, type Lang } from './language';
import { trainModel, predict, getTrainingStats, exportDataset, addManualTrainingData } from './model-trainer';
import {
  analyzeContent, analyzeContentSenior, learnFromUserFeedback, getBrainStatus, type BrainAnalysis,
  analyzeWithReasoning, analyzeImage, searchWeb, fetchWebPage,
  getToolSystem, getReasoningEngine, getWebSearch, getVisionAnalyzer,
  executeTool, getLocalLLM, initializeLocalLLM, chat, getLocalLLMStatus,
} from './brain';
import { getSeniorReasoningEngine } from './senior-reasoning';
import { initializeDefaultKnowledge } from './knowledge-graph';
import { requestBrowserNotificationPermission } from './notification-system';

// Initialize on first load
let initialized = false;
function ensureInitialized() {
  if (initialized) return;
  initialized = true;
  initializeDefaultKnowledge();
  requestBrowserNotificationPermission();
}

export function processAndLearn(report: FeedbackReport): { entry?: LearningEntry; aiResponse: string } {
  ensureInitialized();
  const lang = getLang();

  updateFeedbackStatus(report.id, 'reviewing');

  if (report.type === 'general') {
    updateFeedbackStatus(report.id, 'rejected');
    const msg = t('rejected_msg', lang);
    addChatMessage({ role: 'ai', content: msg, feedback_report_id: report.id });
    return { aiResponse: msg };
  }

  // Use Brain for full learning pipeline
  const result = learnFromUserFeedback(report);

  const confidenceDelta = report.type === 'false_positive' ? -0.15 : report.type === 'false_negative' ? 0.2 : 0;

  const entry = addLearningEntry({
    feedback_id: report.id,
    content_type: report.content_type,
    pattern_description: `${getContentTypeLabel(report.content_type, lang)}: ${report.description}`,
    new_rule: result.ai_response.split('\n').find((l) => l.includes('knowledge')) || report.description,
    confidence_delta: confidenceDelta,
  });

  updateFeedbackStatus(report.id, 'learned');
  addChatMessage({ role: 'ai', content: result.ai_response, feedback_report_id: report.id });

  return { entry, aiResponse: result.ai_response };
}

export function generateAIGreeting(): string {
  ensureInitialized();
  const lang = getLang();
  const status = getBrainStatus();

  const greeting = [
    t('greeting_line1', lang),
    '',
    t('greeting_line2', lang),
    `• ${t('greeting_fp', lang)}`,
    `• ${t('greeting_fn', lang)}`,
    `• ${t('greeting_media', lang)}`,
    `• ${t('greeting_note', lang)}`,
    '',
    t('greeting_end', lang),
  ];

  // Add brain status
  if (status.ml_model.total_datapoints > 0 || status.knowledge_graph.total_nodes > 10) {
    greeting.push('');
    if (lang === 'uz') {
      greeting.push('📊 **Hozirgi holat:**');
      greeting.push(`- Bilim tarmog'i: ${status.knowledge_graph.total_nodes} node, ${status.knowledge_graph.total_edges} aloqa`);
      if (status.ml_model.models_trained > 0) {
        greeting.push(`- ML model: ${status.ml_model.latest_accuracy.toFixed(0)}% aniqlik`);
      }
      greeting.push(`- Kontekst xotirasi: ${status.fingerprints_stored} ta namuna`);
    } else {
      greeting.push('📊 **Current status:**');
      greeting.push(`- Knowledge graph: ${status.knowledge_graph.total_nodes} nodes, ${status.knowledge_graph.total_edges} edges`);
      if (status.ml_model.models_trained > 0) {
        greeting.push(`- ML model: ${status.ml_model.latest_accuracy.toFixed(0)}% accuracy`);
      }
      greeting.push(`- Context memory: ${status.fingerprints_stored} samples`);
    }
  }

  return greeting.join('\n');
}

export async function generateContextualResponse(userMessage: string, reportType?: string): Promise<string> {
  ensureInitialized();
  const lang = autoDetectAndSet(userMessage);
  const lower = userMessage.toLowerCase();

  // Stats
  if (/statistika|stats|holat|statistics/i.test(lower)) {
    return t('stats_hint', lang);
  }

  // Rollback
  if (/bekor|rollback|qaytarish|undo|revert/i.test(lower)) {
    return t('rollback_hint', lang);
  }

  // Help
  if (/qanday|nima|help|yordam|how.*work|nima.*qil/i.test(lower)) {
    return generateHelpResponse(lang);
  }

  // Train command
  if (/train|o'rgat|o'rganish|trenirovka|model.*train/i.test(lower)) {
    return handleTrainCommand(lang);
  }

  // Export
  if (/export|eksport|yuklab.*ol|download.*data/i.test(lower)) {
    return handleExportCommand(lang);
  }

  // Analyze / predict / test
  if (/predict|test|tekshir|sinab|aniqla|classify|analyze|tahlil/i.test(lower)) {
    const textToTest = lower.replace(/predict|test|tekshir|sinab|aniqla|classify|analyze|tahlil/gi, '').trim();
    if (textToTest.length > 3) {
      return handleAnalyzeCommand(textToTest, lang);
    }
  }

  // Add training data
  if (/add.*safe|add.*harmful|qo'sh.*xavfsiz|qo'sh.*zararli/i.test(lower)) {
    return handleAddDataCommand(lower, lang);
  }

  // Brain status
  if (/brain|miya|status|health|salomatlik/i.test(lower)) {
    return handleBrainStatusCommand(lang);
  }

  // Web search
  if (/search|izla|qidir|internet|web/i.test(lower)) {
    const query = lower.replace(/search|izla|qidir|internet|web/gi, '').trim();
    if (query.length > 2) {
      return handleSearchCommand(query, lang);
    }
  }

  // Fetch URL
  if (/https?:\/\/[^\s]+/.test(userMessage)) {
    const url = userMessage.match(/https?:\/\/[^\s]+/)?.[0];
    if (url) return handleFetchCommand(url, lang);
  }

  // Vision / image analyze
  if (/vision|rasm|image.*analy|ko'rish|screenshot.*analy/i.test(lower)) {
    return handleVisionStatusCommand(lang);
  }

  // Reasoning (deep think)
  if (/reason|fikrla|think|o'yla|chuqur.*tahlil|deep.*analy/i.test(lower)) {
    const text = lower.replace(/reason|fikrla|think|o'yla|chuqur.*tahlil|deep.*analy/gi, '').trim();
    if (text.length > 3) {
      return handleReasonCommand(text, lang);
    }
  }

  // LLM status
  if (/^llm\b|local.*llm|mahalliy.*llm/i.test(lower)) {
    await initializeLocalLLM();
    return getLocalLLMStatus();
  }

  // Senior reasoning — deep multi-step analysis
  if (/^senior\s+|chuqur.*fikr|deep.*reason|multi.*step/i.test(lower)) {
    const text = userMessage.replace(/^senior\s+|chuqur.*fikr|deep.*reason|multi.*step/gi, '').trim();
    if (text.length > 3) {
      const analysis = await analyzeContentSenior(text);
      const engine = getSeniorReasoningEngine();
      if (analysis.senior_analysis) {
        return engine.formatAnalysisForDisplay(analysis.senior_analysis, lang as 'uz' | 'en');
      }
    }
  }

  // Smart chat — use LocalLLM for general conversation
  if (/^chat\s+/i.test(lower)) {
    const chatText = userMessage.replace(/^chat\s+/i, '').trim();
    if (chatText.length > 1) {
      const response = await chat(chatText);
      return response.text;
    }
  }

  // Word similarity check
  if (/similar|o'xshash.*so'z|word.*sim/i.test(lower)) {
    const words = lower.replace(/similar|o'xshash.*so'z|word.*sim/gi, '').trim().split(/\s+/);
    if (words.length >= 2) {
      const llm = getLocalLLM();
      await llm.initialize();
      const sim = llm.wordSimilarity(words[0], words[1]);
      const similarWords = llm.findSimilarWords(words[0], 5);
      const lines = [
        `📐 **"${words[0]}" vs "${words[1]}":** ${(sim * 100).toFixed(0)}% o'xshash`,
        '',
        `🔤 **"${words[0]}" ga o'xshash so'zlar:**`,
        ...similarWords.map((w) => `- ${w.word} (${(w.similarity * 100).toFixed(0)}%)`),
      ];
      return lines.join('\n');
    }
  }

  // Tools list
  if (/tool|vosita|plugin|instrument/i.test(lower)) {
    return handleToolsCommand(lang);
  }

  // Generic message — analyze for content safety
  if (userMessage.length > 20 && !reportType) {
    const analysis = analyzeContent(userMessage);
    if (analysis.should_block || analysis.risk_level === 'high' || analysis.risk_level === 'critical') {
      return formatAnalysisResult(analysis, lang);
    }
  }

  if (!reportType) {
    // Use LocalLLM for intelligent generic responses
    try {
      const response = await chat(userMessage);
      return response.text;
    } catch {
      return t('generic_reply', lang);
    }
  }

  return t('feedback_received', lang);
}

// ---- Command Handlers ----

function generateHelpResponse(lang: Lang): string {
  const lines = [
    t('help_title', lang),
    '',
    t('help_1', lang),
    t('help_2', lang),
    t('help_3', lang),
    t('help_4', lang),
    '',
    t('help_end', lang),
    '',
  ];

  if (lang === 'uz') {
    lines.push('💬 **Chat buyruqlari:**');
    lines.push('- `analyze [matn]` — kontentni tahlil qilish');
    lines.push('- `senior [matn]` — 🧠 SENIOR DARAJADA chuqur ko\'p bosqichli tahlil');
    lines.push('- `reason [matn]` — chuqur fikrlash bilan tahlil');
    lines.push('- `search [so\'rov]` — internetdan izlash');
    lines.push('- `[URL]` — veb sahifani olish va tahlil qilish');
    lines.push('- `vision` — rasm tahlili holati');
    lines.push('- `tools` — mavjud vositalar ro\'yxati');
    lines.push('- `train` — modelni o\'rgatish');
    lines.push('- `export` — datasetni yuklab olish');
    lines.push('- `add harmful [matn]` — zararli namuna qo\'shish');
    lines.push('- `add safe [matn]` — xavfsiz namuna qo\'shish');
    lines.push('- `brain` — AI miya holati');
  } else {
    lines.push('💬 **Chat commands:**');
    lines.push('- `analyze [text]` — analyze content');
    lines.push('- `senior [text]` — 🧠 SENIOR-LEVEL deep multi-step analysis');
    lines.push('- `reason [text]` — deep reasoning analysis');
    lines.push('- `search [query]` — search the internet');
    lines.push('- `[URL]` — fetch and analyze a web page');
    lines.push('- `vision` — image analysis status');
    lines.push('- `tools` — list available tools');
    lines.push('- `train` — train the model');
    lines.push('- `export` — download dataset');
    lines.push('- `add harmful [text]` — add harmful example');
    lines.push('- `add safe [text]` — add safe example');
    lines.push('- `brain` — AI brain status');
  }

  return lines.join('\n');
}

function handleTrainCommand(lang: Lang): string {
  const stats = getTrainingStats();

  if (stats.total_datapoints < 5) {
    return t('train_no_data', lang);
  }

  const result = trainModel();
  if (!result) return t('train_no_data', lang);

  return [
    t('train_started', lang, { count: result.dataset_size }),
    '',
    t('train_complete', lang, { accuracy: result.accuracy, patterns: result.new_patterns }),
    '',
    `📊 Precision: ${(result.model.precision * 100).toFixed(1)}%`,
    `📊 Recall: ${(result.model.recall * 100).toFixed(1)}%`,
    `📊 F1: ${(result.model.f1_score * 100).toFixed(1)}%`,
    `⏱ ${result.training_time_ms.toFixed(0)}ms | v${result.model.version}`,
  ].join('\n');
}

function handleExportCommand(lang: Lang): string {
  const jsonl = exportDataset('jsonl');
  if (jsonl.count === 0) {
    return lang === 'uz' ? "⚠️ Ma'lumot yo'q." : "⚠️ No data to export.";
  }

  localStorage.setItem('cia_export_jsonl', jsonl.data);
  localStorage.setItem('cia_export_csv', exportDataset('csv').data);

  return t('train_export', lang, { count: jsonl.count, format: 'JSONL + CSV' });
}

function handleAnalyzeCommand(text: string, lang: Lang): string {
  const analysis = analyzeContent(text);
  return formatAnalysisResult(analysis, lang);
}

function formatAnalysisResult(analysis: BrainAnalysis, lang: Lang): string {
  const verdictMap = {
    safe: lang === 'uz' ? '✅ Xavfsiz' : '✅ Safe',
    harmful: lang === 'uz' ? '🚫 Zararli' : '🚫 Harmful',
    uncertain: lang === 'uz' ? '❓ Noaniq' : '❓ Uncertain',
  };

  const riskColors = { none: '🟢', low: '🟢', medium: '🟡', high: '🟠', critical: '🔴' };

  const lines = [
    `🔍 **${lang === 'uz' ? 'Chuqur tahlil' : 'Deep analysis'}:**`,
    '',
    `**${lang === 'uz' ? 'Natija' : 'Verdict'}:** ${verdictMap[analysis.verdict]} (${(analysis.confidence * 100).toFixed(0)}%)`,
    `**${lang === 'uz' ? 'Xavf darajasi' : 'Risk level'}:** ${riskColors[analysis.risk_level]} ${analysis.risk_level.toUpperCase()}`,
    `**${lang === 'uz' ? 'Bloklash' : 'Block'}:** ${analysis.should_block ? '🚫 Ha' : '✅ Yo\'q'}`,
    '',
    `📝 ${analysis.recommendation}`,
  ];

  // Reasoning chain
  if (analysis.reasoning.length > 0) {
    lines.push('', lang === 'uz' ? '🧠 **Fikrlash zanjiri:**' : '🧠 **Reasoning chain:**');
    for (const step of analysis.reasoning.slice(0, 6)) {
      const arrow = step.contribution > 0.05 ? '🔴' : step.contribution < -0.05 ? '🟢' : '⚪';
      lines.push(`${arrow} [${step.module}] ${step.description}`);
    }
  }

  // Semantic details
  lines.push('', lang === 'uz' ? '📊 **Semantik tahlil:**' : '📊 **Semantic analysis:**');
  lines.push(`- Toxicity: ${(analysis.semantic.toxicity * 100).toFixed(0)}%`);
  lines.push(`- Sentiment: ${analysis.semantic.sentiment.toFixed(2)}`);
  lines.push(`- Intent: ${analysis.semantic.intent}`);
  if (analysis.semantic.topics.length > 0) lines.push(`- Topics: ${analysis.semantic.topics.join(', ')}`);

  // Similar content
  if (analysis.similar_content.length > 0) {
    lines.push('', lang === 'uz' ? '🔗 **O\'xshash kontentlar:**' : '🔗 **Similar content:**');
    for (const s of analysis.similar_content.slice(0, 3)) {
      lines.push(`- ${(s.similarity * 100).toFixed(0)}% o'xshash → ${s.verdict}`);
    }
  }

  // Senior reasoning summary (if available)
  if (analysis.senior_analysis) {
    const sa = analysis.senior_analysis;
    lines.push('', lang === 'uz' ? '🧠 **Senior reasoning:**' : '🧠 **Senior reasoning:**');
    lines.push(`- Gipotezalar: ${sa.hypotheses.length} (g'olib: ${sa.hypotheses.find((h) => h.id === sa.winning_hypothesis)?.label || '—'})`);
    lines.push(`- Causal chains: ${sa.causal_chains.length}, counterfactuals: ${sa.counterfactuals.length}`);
    lines.push(`- FP risk: ${(sa.self_critique.false_positive_risk * 100).toFixed(0)}%, FN risk: ${(sa.self_critique.false_negative_risk * 100).toFixed(0)}%`);
    lines.push(`- Reasoning: ${sa.total_thoughts} thoughts, depth ${sa.reasoning_depth}, ${sa.reasoning_ms.toFixed(0)}ms`);
  }

  return lines.join('\n');
}

function handleAddDataCommand(input: string, lang: Lang): string {
  const isHarmful = /harmful|zararli/i.test(input);
  const text = input.replace(/add.*?(safe|harmful|xavfsiz|zararli)\s*/i, '').trim();

  if (text.length < 3) {
    return lang === 'uz' ? "⚠️ Matn juda qisqa." : "⚠️ Text too short.";
  }

  addManualTrainingData(text, isHarmful ? 'harmful' : 'safe', 'text');

  return lang === 'uz'
    ? `✅ "${text}" — **${isHarmful ? 'zararli' : 'xavfsiz'}** sifatida qo'shildi.`
    : `✅ "${text}" — added as **${isHarmful ? 'harmful' : 'safe'}**.`;
}

function handleBrainStatusCommand(lang: Lang): string {
  const status = getBrainStatus();

  const lines = [
    lang === 'uz' ? '🧠 **AI Miya holati:**' : '🧠 **AI Brain status:**',
    '',
  ];

  if (lang === 'uz') {
    lines.push('**Bilim tarmog\'i (Knowledge Graph):**');
    lines.push(`- Nodelar: ${status.knowledge_graph.total_nodes} (pattern: ${status.knowledge_graph.by_type.pattern}, rule: ${status.knowledge_graph.by_type.rule})`);
    lines.push(`- Aloqalar: ${status.knowledge_graph.total_edges}`);
    lines.push(`- O'rtacha ishonch: ${(status.knowledge_graph.avg_confidence * 100).toFixed(0)}%`);
    lines.push('');
    lines.push('**ML Model:**');
    lines.push(`- Dataset: ${status.ml_model.total_datapoints} (harmful: ${status.ml_model.harmful_count}, safe: ${status.ml_model.safe_count})`);
    lines.push(`- O'rgatilgan modellar: ${status.ml_model.models_trained}`);
    if (status.ml_model.latest_accuracy > 0) lines.push(`- Oxirgi aniqlik: ${status.ml_model.latest_accuracy.toFixed(0)}%`);
    lines.push('');
    lines.push(`**Kontekst xotirasi:** ${status.fingerprints_stored} ta namuna`);
    lines.push('');
    lines.push('**Qobiliyatlar:**');
    lines.push(`- Semantik tahlil: ✅`);
    lines.push(`- Bilim xulosasi: ${status.capabilities.knowledge_inference ? '✅' : '❌'}`);
    lines.push(`- ML klassifikatsiya: ${status.capabilities.ml_classification ? '✅' : '❌'}`);
    lines.push(`- O'xshashlik qidirish: ${status.capabilities.similarity_matching ? '✅' : '❌'}`);
    lines.push(`- Kontekst tushunish: ✅`);
    lines.push(`- Ko'p tilli: ✅ (UZ/EN)`);
    lines.push(`- Chain-of-thought fikrlash: ${status.capabilities.reasoning ? '✅' : '❌'}`);
    lines.push(`- Tool tizimi: ${status.capabilities.tool_use ? '✅' : '❌'}`);
    lines.push(`- Web qidiruv: ${status.capabilities.web_search ? '✅' : '❌'}`);
    lines.push(`- Rasm/video tahlili: ${status.capabilities.vision_analysis ? '✅' : '❌'}`);
    lines.push(`- Mahalliy LLM: ${status.capabilities.local_llm ? '✅' : '❌'}`);
    lines.push(`- Word Embeddings: ${status.capabilities.word_embeddings ? '✅' : '❌'}`);
    lines.push(`- Logistic Classifier: ${status.capabilities.logistic_classifier ? '✅' : '❌'}`);
    lines.push(`- N-gram Model: ${status.capabilities.ngram_model ? '✅' : '❌'}`);
    lines.push(`- Suhbat xotirasi: ${status.capabilities.conversation_memory ? '✅' : '❌'}`);
  } else {
    lines.push('**Knowledge Graph:**');
    lines.push(`- Nodes: ${status.knowledge_graph.total_nodes} (patterns: ${status.knowledge_graph.by_type.pattern}, rules: ${status.knowledge_graph.by_type.rule})`);
    lines.push(`- Edges: ${status.knowledge_graph.total_edges}`);
    lines.push(`- Avg confidence: ${(status.knowledge_graph.avg_confidence * 100).toFixed(0)}%`);
    lines.push('');
    lines.push('**ML Model:**');
    lines.push(`- Dataset: ${status.ml_model.total_datapoints} (harmful: ${status.ml_model.harmful_count}, safe: ${status.ml_model.safe_count})`);
    lines.push(`- Trained models: ${status.ml_model.models_trained}`);
    if (status.ml_model.latest_accuracy > 0) lines.push(`- Latest accuracy: ${status.ml_model.latest_accuracy.toFixed(0)}%`);
    lines.push('');
    lines.push(`**Context memory:** ${status.fingerprints_stored} samples`);
    lines.push('');
    lines.push('**Capabilities:**');
    lines.push(`- Semantic analysis: ✅`);
    lines.push(`- Knowledge inference: ${status.capabilities.knowledge_inference ? '✅' : '❌'}`);
    lines.push(`- ML classification: ${status.capabilities.ml_classification ? '✅' : '❌'}`);
    lines.push(`- Similarity matching: ${status.capabilities.similarity_matching ? '✅' : '❌'}`);
    lines.push(`- Context understanding: ✅`);
    lines.push(`- Multilingual: ✅ (UZ/EN)`);
    lines.push(`- Chain-of-thought reasoning: ${status.capabilities.reasoning ? '✅' : '❌'}`);
    lines.push(`- Tool system: ${status.capabilities.tool_use ? '✅' : '❌'}`);
    lines.push(`- Web search: ${status.capabilities.web_search ? '✅' : '❌'}`);
    lines.push(`- Image/video analysis: ${status.capabilities.vision_analysis ? '✅' : '❌'}`);
    lines.push(`- Local LLM: ${status.capabilities.local_llm ? '✅' : '❌'}`);
    lines.push(`- Word Embeddings: ${status.capabilities.word_embeddings ? '✅' : '❌'}`);
    lines.push(`- Logistic Classifier: ${status.capabilities.logistic_classifier ? '✅' : '❌'}`);
    lines.push(`- N-gram Model: ${status.capabilities.ngram_model ? '✅' : '❌'}`);
    lines.push(`- Conversation Memory: ${status.capabilities.conversation_memory ? '✅' : '❌'}`);
  }

  // Health check
  const health = status.health;
  const allHealthy = Object.values(health).every(Boolean);
  lines.push('');
  lines.push(allHealthy
    ? (lang === 'uz' ? '💚 Barcha tizimlar sog\'lom' : '💚 All systems healthy')
    : (lang === 'uz' ? '⚠️ Ba\'zi tizimlar yaxshilash talab qiladi' : '⚠️ Some systems need improvement')
  );

  if (!health.data_sufficient) {
    lines.push(lang === 'uz' ? '→ Ko\'proq feedback kerak (kamida 10 ta)' : '→ Need more feedback (at least 10)');
  }
  if (!health.balanced) {
    lines.push(lang === 'uz' ? '→ Dataset balanslanmagan — ikkala turdan ham feedback yuboring' : '→ Dataset imbalanced — send feedback for both types');
  }

  return lines.join('\n');
}

// ---- New Command Handlers ----

async function handleSearchCommand(query: string, lang: Lang): Promise<string> {
  try {
    const results = await searchWeb(query);
    if (results.length === 0) {
      return lang === 'uz' ? '🔍 Natija topilmadi.' : '🔍 No results found.';
    }

    const lines = [
      lang === 'uz' ? `🔍 **"${query}" uchun natijalar:**` : `🔍 **Results for "${query}":**`,
      '',
    ];

    for (const r of results.slice(0, 5)) {
      lines.push(`**${r.title}**`);
      if (r.url) lines.push(`🔗 ${r.url}`);
      lines.push(r.snippet.slice(0, 200));
      lines.push('');
    }

    return lines.join('\n');
  } catch (err) {
    return lang === 'uz'
      ? `⚠️ Qidirishda xato: ${err instanceof Error ? err.message : 'noma\'lum'}`
      : `⚠️ Search error: ${err instanceof Error ? err.message : 'unknown'}`;
  }
}

async function handleFetchCommand(url: string, lang: Lang): Promise<string> {
  try {
    const page = await fetchWebPage(url);
    const lines = [
      lang === 'uz' ? `🌐 **Sahifa olinadi:**` : `🌐 **Page fetched:**`,
      `**${page.title}**`,
      `🔗 ${page.url}`,
      '',
    ];

    if (page.meta_description) {
      lines.push(`📝 ${page.meta_description}`);
      lines.push('');
    }

    lines.push(page.text.slice(0, 1000));

    if (page.text.length > 1000) {
      lines.push('', lang === 'uz' ? `... (${page.content_length} belgi)` : `... (${page.content_length} chars)`);
    }

    return lines.join('\n');
  } catch (err) {
    return lang === 'uz'
      ? `⚠️ Sahifani olishda xato: ${err instanceof Error ? err.message : 'noma\'lum'}`
      : `⚠️ Fetch error: ${err instanceof Error ? err.message : 'unknown'}`;
  }
}

function handleVisionStatusCommand(lang: Lang): string {
  const va = getVisionAnalyzer();
  return va.getStatus(lang as 'uz' | 'en');
}

async function handleReasonCommand(text: string, lang: Lang): Promise<string> {
  try {
    const { analysis, reasoning_chain } = await analyzeWithReasoning(text);
    const engine = getReasoningEngine();

    const chainDisplay = engine.formatChainForDisplay(reasoning_chain, lang as 'uz' | 'en');

    const lines = [
      formatAnalysisResult(analysis, lang),
      '',
      '---',
      '',
      chainDisplay,
    ];

    return lines.join('\n');
  } catch (err) {
    return lang === 'uz'
      ? `⚠️ Fikrlashda xato: ${err instanceof Error ? err.message : 'noma\'lum'}`
      : `⚠️ Reasoning error: ${err instanceof Error ? err.message : 'unknown'}`;
  }
}

function handleToolsCommand(lang: Lang): string {
  const ts = getToolSystem();
  return ts.getStatus(lang as 'uz' | 'en');
}

export { detectLanguage, autoDetectAndSet, getLang, setLang } from './language';
export {
  analyzeContent, getBrainStatus,
  analyzeWithReasoning, analyzeImage, analyzeVideo,
  searchWeb, fetchWebPage, executeTool,
  getToolSystem, getReasoningEngine, getWebSearch, getVisionAnalyzer,
  getLocalLLM, initializeLocalLLM, chat, getLocalLLMStatus,
} from './brain';
