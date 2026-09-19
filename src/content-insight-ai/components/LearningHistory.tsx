import { useState } from 'react';
import { RotateCcw, CheckCircle, Brain, Clock, AlertTriangle } from 'lucide-react';
import { getLearningEntries, rollbackLearning, getAllFeedbackReports } from '../lib/feedback-store';
import type { LearningEntry, FeedbackReport } from '../types/feedback';
import type { Lang } from '../lib/language';

export function LearningHistory({ lang }: { lang: Lang }) {
  const [entries, setEntries] = useState(getLearningEntries);
  const reports = getAllFeedbackReports();

  function handleRollback(entryId: string) {
    const success = rollbackLearning(entryId);
    if (success) {
      setEntries(getLearningEntries());
    }
  }

  function getReport(feedbackId: string): FeedbackReport | undefined {
    return reports.find((r) => r.id === feedbackId);
  }

  if (entries.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-white font-semibold">O'rganish tarixi</h3>
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Brain className="w-12 h-12 mb-3 opacity-50" />
          <p className="text-sm">Hali hech narsa o'rganilmagan</p>
          <p className="text-xs mt-1">Feedback yuboring va AI o'rgansin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">O'rganish tarixi</h3>
        <span className="text-gray-400 text-xs">{entries.length} ta yozuv</span>
      </div>

      <div className="space-y-3">
        {entries.map((entry) => {
          const report = getReport(entry.feedback_id);
          const isRolledBack = !entry.rollback_available;

          return (
            <div key={entry.id} className={`bg-gray-800 rounded-xl p-4 border ${isRolledBack ? 'border-red-500/30 opacity-60' : 'border-gray-700'}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Brain className={`w-4 h-4 ${isRolledBack ? 'text-red-400' : 'text-purple-400'}`} />
                  <span className="text-xs text-gray-400 capitalize">{entry.content_type.replace('_', ' ')}</span>
                  {isRolledBack && (
                    <span className="text-xs text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full">Bekor qilingan</span>
                  )}
                </div>
                <span className="text-[10px] text-gray-500">
                  {new Date(entry.applied_at).toLocaleDateString('uz')}
                </span>
              </div>

              <p className="text-gray-300 text-sm mb-2">{entry.pattern_description}</p>

              <div className="bg-gray-900 rounded-lg p-2 mb-2">
                <p className="text-xs text-gray-400 mb-1">Yangi qoida:</p>
                <p className="text-xs text-blue-300">{entry.new_rule}</p>
              </div>

              {entry.old_rule && (
                <div className="bg-gray-900 rounded-lg p-2 mb-2">
                  <p className="text-xs text-gray-400 mb-1">Eski qoida:</p>
                  <p className="text-xs text-gray-500 line-through">{entry.old_rule}</p>
                </div>
              )}

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${entry.confidence_delta >= 0 ? 'text-green-400' : 'text-orange-400'}`}>
                    Confidence: {entry.confidence_delta >= 0 ? '+' : ''}{(entry.confidence_delta * 100).toFixed(0)}%
                  </span>
                  {report && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      report.status === 'learned' ? 'bg-green-500/20 text-green-400'
                      : report.status === 'rolled_back' ? 'bg-red-500/20 text-red-400'
                      : 'bg-gray-700 text-gray-400'
                    }`}>
                      {report.status}
                    </span>
                  )}
                </div>

                {entry.rollback_available && (
                  <button
                    onClick={() => handleRollback(entry.id)}
                    className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30 transition"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Bekor qilish
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
