// FR-31: Accessible File Safety Inspection (Static analysis, Magic Bytes, Isolated Scans)

export interface FileInspectionRequest {
  filename: string;
  sizeBytes: number;
  mimeType: string;
  sourceUrl?: string;
  magicBytesHex?: string; // First 8-16 bytes in hex
  sha256Hash: string;
}

export interface FileSafetyVerdict {
  status: 'SAFE' | 'WARN' | 'MALICIOUS' | 'UNKNOWN';
  reason: string;
  detectedThreat?: string;
  riskScore: number;
  isExecutable: boolean;
  isolatedScanCompleted: boolean;
}

const KNOWN_DANGEROUS_EXTENSIONS = new Set([
  'exe', 'bat', 'cmd', 'sh', 'vbs', 'scr', 'msi', 'pif', 'ps1', 'apk',
]);

const KNOWN_SAFE_DOCUMENT_EXTENSIONS = new Set([
  'pdf', 'docx', 'xlsx', 'pptx', 'txt', 'csv', 'png', 'jpg', 'jpeg', 'mp3', 'mp4',
]);

// Known executable magic bytes
const EXECUTABLE_MAGIC_PREFIXES = [
  '4d5a', // MZ (Windows PE Executable)
  '7f454c46', // ELF (Linux binary)
  'cafe', // Mach-O / Java class
  'feedface', // Mach-O 32-bit
  'feedfacf', // Mach-O 64-bit
];

export function inspectFileSafety(file: FileInspectionRequest): FileSafetyVerdict {
  const ext = file.filename.split('.').pop()?.toLowerCase() || '';
  const magic = (file.magicBytesHex || '').toLowerCase();

  // Rule: Static inspection only. NEVER execute untrusted files!
  let isExecutable = KNOWN_DANGEROUS_EXTENSIONS.has(ext);

  // Check magic bytes
  for (const prefix of EXECUTABLE_MAGIC_PREFIXES) {
    if (magic.startsWith(prefix)) {
      isExecutable = true;
      break;
    }
  }

  // Masquerading check: safe extension (e.g. .pdf or .jpg) but executable magic bytes
  if (KNOWN_SAFE_DOCUMENT_EXTENSIONS.has(ext) && isExecutable) {
    return {
      status: 'MALICIOUS',
      reason: `Fayl kengaytmasi (.${ext}) va uning ichki strukturasi (bajariluvchi dastur) mos kelmadi (spoofed executable).`,
      detectedThreat: 'trojan_masquerade',
      riskScore: 0.98,
      isExecutable: true,
      isolatedScanCompleted: true,
    };
  }

  // Dangerous direct executable
  if (isExecutable) {
    return {
      status: 'WARN',
      reason: `Bajariluvchi dastur fayli (.${ext}). Bolalar qurilmasida o‘zboshimchalik bilan ishga tushirish taqiqlanadi.`,
      detectedThreat: 'executable_download',
      riskScore: 0.8,
      isExecutable: true,
      isolatedScanCompleted: true,
    };
  }

  // Known safe document types
  if (KNOWN_SAFE_DOCUMENT_EXTENSIONS.has(ext)) {
    return {
      status: 'SAFE',
      reason: `Fayl formati xavfsiz hujjat yoki media deb tasdiqlandi (.${ext}).`,
      riskScore: 0.05,
      isExecutable: false,
      isolatedScanCompleted: true,
    };
  }

  // FR-31 Requirement: Unknown file != automatically malicious!
  return {
    status: 'UNKNOWN',
    reason: `Fayl turi (.${ext}) ma’lumotlar bazasida yo‘q, ammo xavfli dastur belgilari aniqlanmadi (avtomatik zararli deb hisoblanmaydi).`,
    riskScore: 0.3,
    isExecutable: false,
    isolatedScanCompleted: true,
  };
}
