import { getFeedbackStats } from '../lib/feedback-store';
import { BENCHMARK_TARGETS } from '../types/feedback';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { Lang } from '../lib/language';

export function StatsPanel({ lang }: { lang: Lang }) {
  const stats = getFeedbackStats();

  return (
    <div className="space-y-6">
      <h3 className="text-white font-semibold">Statistika</h3>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Jami hisobotlar" value={stats.total_reports} icon={<AlertTriangle className="w-4 h-4 text-yellow-400" />} />
        <StatCard label="Kutilmoqda" value={stats.pending} icon={<Clock className="w-4 h-4 text-blue-400" />} />
        <StatCard label="O'rganildi" value={stats.learned} icon={<CheckCircle className="w-4 h-4 text-green-400" />} />
        <StatCard label="Rad etildi" value={stats.rejected} icon={<XCircle className="w-4 h-4 text-red-400" />} />
      </div>

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h4 className="text-gray-300 text-sm font-medium mb-3">Feedback turlari</h4>
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 text-sm">False Positive</span>
            </div>
            <span className="text-2xl font-bold text-white">{stats.false_positives}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm">False Negative</span>
            </div>
            <span className="text-2xl font-bold text-white">{stats.false_negatives}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h4 className="text-gray-300 text-sm font-medium mb-3">Kontent turlari bo'yicha</h4>
        <div className="space-y-2">
          {Object.entries(stats.by_content_type).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between">
              <span className="text-gray-400 text-sm capitalize">{type.replace('_', ' ')}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${stats.total_reports > 0 ? ((count as number) / stats.total_reports) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-white text-sm font-medium w-8 text-right">{count as number}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h4 className="text-gray-300 text-sm font-medium mb-3">O'rganish natijasi</h4>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-gray-400 text-xs">Jami o'rganishlar</p>
            <p className="text-white text-xl font-bold">{stats.total_learning_entries}</p>
          </div>
          <div className="flex-1">
            <p className="text-gray-400 text-xs">O'rtacha confidence o'zgarishi</p>
            <p className={`text-xl font-bold ${stats.avg_confidence_improvement >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.avg_confidence_improvement >= 0 ? '+' : ''}{(stats.avg_confidence_improvement * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h4 className="text-gray-300 text-sm font-medium mb-3">Benchmark maqsadlari</h4>
        <div className="space-y-3">
          {Object.entries(BENCHMARK_TARGETS).map(([key, target]) => (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs capitalize">{key.replace('_', ' ')}</span>
                <span className="text-gray-500 text-xs">
                  P: {(target.precision_target * 100).toFixed(0)}% | R: {(target.recall_target * 100).toFixed(0)}% | L: {target.latency_target_ms}ms
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>
          ))}
          <p className="text-gray-500 text-xs mt-2">* Haqiqiy natijalar model train bo'lgandan keyin ko'rinadi</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-gray-800 rounded-xl p-3 border border-gray-700">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-gray-400 text-xs">{label}</span>
      </div>
      <span className="text-white text-2xl font-bold">{value}</span>
    </div>
  );
}
