import { useState } from 'react';
import { Brain, Play, Download, Plus, Trash2, Zap, Target, Database } from 'lucide-react';
import type { ContentType } from '../types/feedback';
import type { Lang } from '../lib/language';
import { trainModel, getTrainingStats, exportDataset, addManualTrainingData, getAllModels, predict } from '../lib/model-trainer';

interface TrainingPanelProps {
  lang: Lang;
}

export function TrainingPanel({ lang }: TrainingPanelProps) {
  const [stats, setStats] = useState(() => getTrainingStats());
  const [models, setModels] = useState(() => getAllModels());
  const [isTraining, setIsTraining] = useState(false);
  const [trainResult, setTrainResult] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<ContentType | ''>('');
  const [manualText, setManualText] = useState('');
  const [manualLabel, setManualLabel] = useState<'safe' | 'harmful'>('harmful');
  const [manualContentType, setManualContentType] = useState<ContentType>('text');
  const [testText, setTestText] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);

  const labels = {
    title: lang === 'uz' ? 'Model Training' : 'Model Training',
    dataset: lang === 'uz' ? 'Dataset' : 'Dataset',
    trainBtn: lang === 'uz' ? 'Modelni o\'rgatish' : 'Train Model',
    training: lang === 'uz' ? 'O\'rgatilmoqda...' : 'Training...',
    exportBtn: lang === 'uz' ? 'Eksport (JSONL)' : 'Export (JSONL)',
    exportCsv: lang === 'uz' ? 'Eksport (CSV)' : 'Export (CSV)',
    addData: lang === 'uz' ? 'Ma\'lumot qo\'shish' : 'Add Data',
    testModel: lang === 'uz' ? 'Modelni sinash' : 'Test Model',
    testBtn: lang === 'uz' ? 'Tekshirish' : 'Test',
    total: lang === 'uz' ? 'Jami' : 'Total',
    harmful: lang === 'uz' ? 'Zararli' : 'Harmful',
    safe: lang === 'uz' ? 'Xavfsiz' : 'Safe',
    balance: lang === 'uz' ? 'Balans' : 'Balance',
    models_trained: lang === 'uz' ? 'O\'rgatilgan modellar' : 'Trained models',
    best_accuracy: lang === 'uz' ? 'Eng yaxshi aniqlik' : 'Best accuracy',
    no_data: lang === 'uz' ? 'Ma\'lumot yo\'q. Feedback yuboring yoki qo\'lda qo\'shing.' : 'No data. Send feedback or add manually.',
    add_placeholder: lang === 'uz' ? 'Matn kiriting...' : 'Enter text...',
    test_placeholder: lang === 'uz' ? 'Tekshirish uchun matn kiriting...' : 'Enter text to classify...',
    all_types: lang === 'uz' ? 'Barcha turlar' : 'All types',
    by_source: lang === 'uz' ? 'Manba bo\'yicha' : 'By source',
    feedback: 'Feedback',
    manual: lang === 'uz' ? 'Qo\'lda' : 'Manual',
    augmented: lang === 'uz' ? 'Kengaytirilgan' : 'Augmented',
  };

  function handleTrain() {
    setIsTraining(true);
    setTrainResult(null);

    setTimeout(() => {
      const ct = selectedType || undefined;
      const result = trainModel(ct as ContentType | undefined);

      if (!result) {
        setTrainResult(lang === 'uz'
          ? '⚠️ Yetarli ma\'lumot yo\'q. Kamida 5 ta feedback kerak.'
          : '⚠️ Not enough data. Need at least 5 entries.');
      } else {
        setTrainResult([
          lang === 'uz' ? '✅ Training tugadi!' : '✅ Training complete!',
          `Accuracy: ${result.accuracy}%`,
          `Precision: ${(result.model.precision * 100).toFixed(1)}%`,
          `Recall: ${(result.model.recall * 100).toFixed(1)}%`,
          `F1: ${(result.model.f1_score * 100).toFixed(1)}%`,
          `${lang === 'uz' ? 'Patternlar' : 'Patterns'}: ${result.new_patterns}`,
          `${lang === 'uz' ? 'Vaqt' : 'Time'}: ${result.training_time_ms.toFixed(0)}ms`,
          `Version: v${result.model.version}`,
        ].join('\n'));
      }

      setStats(getTrainingStats());
      setModels(getAllModels());
      setIsTraining(false);
    }, 500);
  }

  function handleExport(format: 'jsonl' | 'csv') {
    const result = exportDataset(format);
    if (result.count === 0) return;

    const blob = new Blob([result.data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `training-data-${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleAddData() {
    if (!manualText.trim()) return;
    addManualTrainingData(manualText.trim(), manualLabel, manualContentType);
    setManualText('');
    setStats(getTrainingStats());
  }

  function handleTest() {
    if (!testText.trim()) return;
    const result = predict(testText.trim());

    const verdictMap = {
      safe: lang === 'uz' ? '✅ Xavfsiz' : '✅ Safe',
      harmful: lang === 'uz' ? '🚫 Zararli' : '🚫 Harmful',
      uncertain: lang === 'uz' ? '❓ Noaniq' : '❓ Uncertain',
    };

    const lines = [
      `${verdictMap[result.label]} (${(result.confidence * 100).toFixed(1)}%)`,
    ];

    if (result.matched_patterns.length > 0) {
      lines.push('', lang === 'uz' ? 'Patternlar:' : 'Patterns:');
      result.matched_patterns.slice(0, 3).forEach((p) => lines.push(`  • ${p}`));
    }

    if (result.top_features.length > 0) {
      lines.push('', lang === 'uz' ? 'Belgilar:' : 'Features:');
      result.top_features.slice(0, 5).forEach((f) => {
        lines.push(`  ${f.weight > 0 ? '🔴' : '🟢'} "${f.word}" (${f.weight > 0 ? '+' : ''}${f.weight.toFixed(4)})`);
      });
    }

    setTestResult(lines.join('\n'));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          {labels.title}
        </h3>
      </div>

      {/* Dataset Stats */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h4 className="text-gray-300 text-sm font-medium mb-3 flex items-center gap-2">
          <Database className="w-4 h-4" /> {labels.dataset}
        </h4>

        {stats.total_datapoints === 0 ? (
          <p className="text-gray-500 text-sm">{labels.no_data}</p>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <MiniStat label={labels.total} value={stats.total_datapoints} />
              <MiniStat label={labels.harmful} value={stats.harmful_count} color="text-red-400" />
              <MiniStat label={labels.safe} value={stats.safe_count} color="text-green-400" />
              <MiniStat label={labels.balance} value={`${(stats.balance_ratio * 100).toFixed(0)}%`} color={stats.balance_ratio > 0.6 ? 'text-green-400' : 'text-yellow-400'} />
            </div>

            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden flex">
              <div className="h-full bg-red-500" style={{ width: `${stats.total_datapoints > 0 ? (stats.harmful_count / stats.total_datapoints) * 100 : 0}%` }} />
              <div className="h-full bg-green-500" style={{ width: `${stats.total_datapoints > 0 ? (stats.safe_count / stats.total_datapoints) * 100 : 0}%` }} />
            </div>

            <div className="text-xs text-gray-400">
              <span className="font-medium">{labels.by_source}:</span>{' '}
              {labels.feedback}: {stats.by_source.feedback} | {labels.manual}: {stats.by_source.manual} | {labels.augmented}: {stats.by_source.augmented}
            </div>
          </div>
        )}
      </div>

      {/* Train Button */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as ContentType | '')}
            className="bg-gray-800 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-gray-700"
          >
            <option value="">{labels.all_types}</option>
            <option value="text">{lang === 'uz' ? 'Matn' : 'Text'}</option>
            <option value="image">{lang === 'uz' ? 'Rasm' : 'Image'}</option>
            <option value="video">Video</option>
            <option value="pose">{lang === 'uz' ? 'Poza' : 'Pose'}</option>
            <option value="movement">{lang === 'uz' ? 'Harakat' : 'Movement'}</option>
            <option value="body_shape">{lang === 'uz' ? 'Tana shakli' : 'Body shape'}</option>
          </select>

          <button
            onClick={handleTrain}
            disabled={isTraining || stats.total_datapoints < 5}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isTraining ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {labels.training}
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                {labels.trainBtn}
              </>
            )}
          </button>
        </div>

        {trainResult && (
          <pre className="bg-gray-800 rounded-xl p-3 text-xs text-green-300 whitespace-pre-wrap border border-green-500/30">{trainResult}</pre>
        )}
      </div>

      {/* Trained Models */}
      {Object.keys(models).length > 0 && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <h4 className="text-gray-300 text-sm font-medium mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" /> {labels.models_trained}
          </h4>
          <div className="space-y-2">
            {Object.entries(models).map(([key, model]) => (
              <div key={key} className="flex items-center justify-between bg-gray-900 rounded-lg p-2">
                <div>
                  <span className="text-white text-xs font-medium">{key}</span>
                  <span className="text-gray-500 text-[10px] ml-2">v{model.version}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-blue-400">A: {(model.accuracy * 100).toFixed(0)}%</span>
                  <span className="text-green-400">P: {(model.precision * 100).toFixed(0)}%</span>
                  <span className="text-yellow-400">R: {(model.recall * 100).toFixed(0)}%</span>
                  <span className="text-purple-400">F1: {(model.f1_score * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Model */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h4 className="text-gray-300 text-sm font-medium mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4" /> {labels.testModel}
        </h4>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTest()}
            placeholder={labels.test_placeholder}
            className="flex-1 bg-gray-900 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-500"
          />
          <button onClick={handleTest} disabled={!testText.trim()} className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm hover:bg-purple-500 transition disabled:opacity-40">
            {labels.testBtn}
          </button>
        </div>
        {testResult && (
          <pre className="bg-gray-900 rounded-lg p-2 text-xs text-gray-300 whitespace-pre-wrap">{testResult}</pre>
        )}
      </div>

      {/* Add Manual Data */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h4 className="text-gray-300 text-sm font-medium mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4" /> {labels.addData}
        </h4>
        <div className="space-y-2">
          <div className="flex gap-2">
            <select
              value={manualLabel}
              onChange={(e) => setManualLabel(e.target.value as 'safe' | 'harmful')}
              className="bg-gray-900 text-white rounded-xl px-3 py-2 text-sm focus:outline-none border border-gray-700"
            >
              <option value="harmful">{labels.harmful}</option>
              <option value="safe">{labels.safe}</option>
            </select>
            <select
              value={manualContentType}
              onChange={(e) => setManualContentType(e.target.value as ContentType)}
              className="bg-gray-900 text-white rounded-xl px-3 py-2 text-sm focus:outline-none border border-gray-700"
            >
              <option value="text">{lang === 'uz' ? 'Matn' : 'Text'}</option>
              <option value="image">{lang === 'uz' ? 'Rasm' : 'Image'}</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddData()}
              placeholder={labels.add_placeholder}
              className="flex-1 bg-gray-900 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-500"
            />
            <button onClick={handleAddData} disabled={!manualText.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-500 transition disabled:opacity-40">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="flex gap-2">
        <button onClick={() => handleExport('jsonl')} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700 transition border border-gray-700">
          <Download className="w-4 h-4" /> {labels.exportBtn}
        </button>
        <button onClick={() => handleExport('csv')} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700 transition border border-gray-700">
          <Download className="w-4 h-4" /> {labels.exportCsv}
        </button>
      </div>
    </div>
  );
}

function MiniStat({ label, value, color = 'text-white' }: { label: string; value: number | string; color?: string }) {
  return (
    <div className="bg-gray-900 rounded-lg p-2">
      <p className="text-gray-500 text-[10px]">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}
