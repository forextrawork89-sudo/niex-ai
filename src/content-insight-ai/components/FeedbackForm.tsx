import { useState, useRef } from 'react';
import { ShieldOff, ShieldAlert, Lightbulb, MessageSquare, Upload, X, Camera, Video, ChevronDown } from 'lucide-react';
import type { FeedbackType, ContentType, ContentVerdict } from '../types/feedback';
import type { Lang } from '../lib/language';

interface FeedbackFormProps {
  lang: Lang;
  onSubmit: (data: {
    type: FeedbackType;
    content_type: ContentType;
    verdict_given: ContentVerdict;
    verdict_correct: ContentVerdict;
    description: string;
    screenshot_urls: string[];
    video_url?: string;
    related_knowledge_file?: string;
    tags: string[];
  }) => void;
  onCancel: () => void;
}

const FEEDBACK_TYPES: { value: FeedbackType; label: string; description: string; icon: typeof ShieldOff; color: string }[] = [
  { value: 'false_positive', label: "Noto'g'ri blokladi", description: 'Xavfsiz kontentni blokladi', icon: ShieldOff, color: 'text-orange-400 bg-orange-500/20 border-orange-500/30' },
  { value: 'false_negative', label: 'Bloklamadi', description: 'Zararli kontentni bloklamadi', icon: ShieldAlert, color: 'text-red-400 bg-red-500/20 border-red-500/30' },
  { value: 'suggestion', label: 'Taklif', description: 'Yaxshilash taklifi', icon: Lightbulb, color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' },
  { value: 'general', label: 'Umumiy', description: 'Boshqa fikr-mulohaza', icon: MessageSquare, color: 'text-blue-400 bg-blue-500/20 border-blue-500/30' },
];

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: 'text', label: 'Matn' },
  { value: 'image', label: 'Rasm' },
  { value: 'video', label: 'Video' },
  { value: 'pose', label: 'Poza/holat' },
  { value: 'movement', label: 'Harakat' },
  { value: 'body_shape', label: 'Tana shakli' },
];

const KNOWLEDGE_FILES = [
  'harmful_text_patterns.json',
  'nsfw_image_classifier.json',
  'violence_detector.json',
  'nudity_pose_rules.json',
  'safe_content_whitelist.json',
  'age_restricted_rules.json',
  'drug_content_patterns.json',
  'gambling_patterns.json',
];

export function FeedbackForm({ onSubmit, onCancel, lang }: FeedbackFormProps) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<FeedbackType | null>(null);
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [description, setDescription] = useState('');
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [knowledgeFile, setKnowledgeFile] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [confidence, setConfidence] = useState(50);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleScreenshotUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      setScreenshots((prev) => [...prev, url]);
    });
    e.target.value = '';
  }

  function addTag() {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  }

  function handleSubmit() {
    if (!type || !contentType || !description.trim()) return;

    const verdictGiven: ContentVerdict = type === 'false_positive' ? 'harmful' : type === 'false_negative' ? 'safe' : 'uncertain';
    const verdictCorrect: ContentVerdict = type === 'false_positive' ? 'safe' : type === 'false_negative' ? 'harmful' : 'uncertain';

    onSubmit({
      type,
      content_type: contentType,
      verdict_given: verdictGiven,
      verdict_correct: verdictCorrect,
      description: description.trim(),
      screenshot_urls: screenshots,
      video_url: videoUrl || undefined,
      related_knowledge_file: knowledgeFile || undefined,
      tags,
    });
  }

  const canProceed = step === 1 ? !!type : step === 2 ? !!contentType : step === 3 ? description.trim().length > 0 : true;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Yangi Feedback</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`flex-1 h-1 rounded-full transition ${s <= step ? 'bg-blue-500' : 'bg-gray-700'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <p className="text-gray-400 text-sm">Feedback turi:</p>
          {FEEDBACK_TYPES.map(({ value, label, description, icon: Icon, color }) => (
            <button
              key={value}
              onClick={() => setType(value)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition ${type === value ? color + ' ring-1 ring-current' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium text-sm">{label}</div>
                <div className="text-xs opacity-70">{description}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <p className="text-gray-400 text-sm">Kontent turi:</p>
          <div className="grid grid-cols-2 gap-2">
            {CONTENT_TYPES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setContentType(value)}
                className={`p-3 rounded-xl border text-sm font-medium transition ${contentType === value ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <p className="text-gray-400 text-sm mb-2">AI ning confidence darajasi ({confidence}%):</p>
            <input
              type="range"
              min="0"
              max="100"
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Past</span>
              <span>O'rta</span>
              <span>Yuqori</span>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <p className="text-gray-400 text-sm mb-2">Nima bo'lganini tushuntiring:</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masalan: Bu rasmda faqat plyaj manzarasi bor edi, lekin AI uni blokladi..."
              rows={4}
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-500 text-sm"
            />
          </div>

          <div>
            <p className="text-gray-400 text-sm mb-2">Screenshot qo'shing (ixtiyoriy):</p>
            <div className="flex gap-2 flex-wrap">
              {screenshots.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt={`Screenshot ${i + 1}`} className="w-20 h-20 rounded-lg object-cover border border-gray-700" />
                  <button
                    onClick={() => setScreenshots((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center gap-1 text-gray-500 hover:border-gray-400 hover:text-gray-300 transition"
              >
                <Camera className="w-5 h-5" />
                <span className="text-[10px]">Qo'shish</span>
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleScreenshotUpload} className="hidden" />
          </div>

          <div>
            <p className="text-gray-400 text-sm mb-2">Video yozuv URL (ixtiyoriy):</p>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://... yoki lokal fayl yo'li"
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-500 text-sm"
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div>
            <p className="text-gray-400 text-sm mb-2">Bog'liq knowledge fayl (ixtiyoriy):</p>
            <select
              value={knowledgeFile}
              onChange={(e) => setKnowledgeFile(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
            >
              <option value="">Tanlang...</option>
              {KNOWLEDGE_FILES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-gray-400 text-sm mb-2">Teglar:</p>
            <div className="flex gap-2 flex-wrap mb-2">
              {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg text-xs">
                  {tag}
                  <button onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Teg qo'shing..."
                className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-500 text-sm"
              />
              <button onClick={addTag} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-xl text-sm hover:bg-gray-600">
                +
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-300 text-sm font-medium mb-2">Xulosa:</p>
            <div className="space-y-1 text-xs text-gray-400">
              <p><strong className="text-gray-300">Turi:</strong> {FEEDBACK_TYPES.find((f) => f.value === type)?.label}</p>
              <p><strong className="text-gray-300">Kontent:</strong> {CONTENT_TYPES.find((c) => c.value === contentType)?.label}</p>
              <p><strong className="text-gray-300">Confidence:</strong> {confidence}%</p>
              <p><strong className="text-gray-300">Izoh:</strong> {description.slice(0, 80)}...</p>
              <p><strong className="text-gray-300">Screenshotlar:</strong> {screenshots.length}</p>
              {videoUrl && <p><strong className="text-gray-300">Video:</strong> Ha</p>}
              {knowledgeFile && <p><strong className="text-gray-300">Knowledge file:</strong> {knowledgeFile}</p>}
              {tags.length > 0 && <p><strong className="text-gray-300">Teglar:</strong> {tags.join(', ')}</p>}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        {step > 1 && (
          <button onClick={() => setStep((s) => s - 1)} className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 transition">
            Orqaga
          </button>
        )}
        {step < 4 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Keyingi
          </button>
        ) : (
          <button onClick={handleSubmit} className="flex-1 py-3 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-500 transition">
            Yuborish & O'rganish
          </button>
        )}
      </div>
    </div>
  );
}
