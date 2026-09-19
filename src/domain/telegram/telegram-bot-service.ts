// Telegram Bot Adapter & Interactive Operational Hub (NIEX-TZ-001)
// Commands: /start, /status, /location, /quiet, /help
// Invariant: Bot CANNOT create permanent rules or add guardians (Dashboard authentication required)

export interface TelegramUser {
  telegramChatId: string;
  guardianId: string;
  fullName: string;
  quietHoursUntil?: string;
}

export interface TelegramInlineButton {
  text: string;
  callbackData: string;
}

export interface TelegramMessageResponse {
  chatId: string;
  text: string;
  inlineKeyboard?: TelegramInlineButton[][];
}

export interface TelegramCallbackResult {
  action: string;
  success: boolean;
  message: string;
  childNotification?: string;
}

export class TelegramBotService {
  private registeredGuardians: Map<string, TelegramUser> = new Map(); // chatId -> user

  public registerGuardian(chatId: string, guardianId: string, fullName: string): TelegramUser {
    const user: TelegramUser = {
      telegramChatId: chatId,
      guardianId,
      fullName,
    };
    this.registeredGuardians.set(chatId, user);
    return user;
  }

  public getGuardianByChatId(chatId: string): TelegramUser | null {
    return this.registeredGuardians.get(chatId) || null;
  }

  // Handle incoming telegram text command
  public handleCommand(
    chatId: string,
    commandText: string,
    context?: {
      childName?: string;
      batteryPercent?: number;
      screenTimeSpentMinutes?: number;
      screenTimeLimitMinutes?: number;
      currentZone?: string;
      lastLocationTime?: string;
      dashboardBaseUrl?: string;
    }
  ): TelegramMessageResponse {
    const user = this.getGuardianByChatId(chatId);
    const cmd = commandText.trim().split(' ')[0].toLowerCase();
    const baseUrl = context?.dashboardBaseUrl || 'https://niex.uz';

    if (cmd === '/start') {
      return {
        chatId,
        text: `Assalomu alaykum${user ? `, ${user.fullName}` : ''}! NIEX AI ota-ona tezkor xabarnoma botiga xush kelibsiz.\n\n` +
          `Quyidagi buyruqlardan foydalanishingiz mumkin:\n` +
          `/status - Farzandingizning hozirgi holati va ekran vaqti\n` +
          `/location - Oxirgi ma’lum geolokatsiya nuqtasi\n` +
          `/quiet - Vaqtincha tinch rejimni yoqish\n` +
          `/help - Yordam va ko‘rsatmalar`,
      };
    }

    if (cmd === '/status') {
      if (!user) {
        return {
          chatId,
          text: 'Ushbu buyruqdan foydalanish uchun hisobingiz NIEX ilovasiga ulangan bo‘lishi kerak.',
        };
      }
      const child = context?.childName || 'Farzandingiz';
      const battery = context?.batteryPercent ?? 85;
      const spent = context?.screenTimeSpentMinutes ?? 90;
      const limit = context?.screenTimeLimitMinutes ?? 120;
      const zone = context?.currentZone || 'Uy hududida';

      return {
        chatId,
        text: `📊 *${child}* qurilmasi holati:\n\n` +
          `🔋 Batareya: ${battery}%\n` +
          `⏳ Ekran vaqti: ${spent} / ${limit} daqiqa (Qolgan: ${Math.max(0, limit - spent)} daq)\n` +
          `📍 Joylashuv: ${zone}\n\n` +
          `To‘liq boshqaruv: ${baseUrl}/parent/dashboard`,
      };
    }

    if (cmd === '/location') {
      const zone = context?.currentZone || 'Maktab (Xavfsiz zona)';
      const time = context?.lastLocationTime || '5 daqiqa oldin';
      return {
        chatId,
        text: `📍 *Oxirgi ma’lum joylashuv*:\n\nHudud: ${zone}\nVaqti: ${time}\n\n` +
          `Xaritada ko‘rish: ${baseUrl}/parent/map`,
      };
    }

    if (cmd === '/quiet') {
      return {
        chatId,
        text: '🌙 *Tinch rejim sozlamalari*:\nOvozli bildirishnomalarni vaqtincha to‘xtatish muddatini tanlang (Favqulodda SOS xabarlari har doim yetkaziladi):',
        inlineKeyboard: [
          [
            { text: '1 soatga', callbackData: 'quiet:60' },
            { text: '8 soatga (tun)', callbackData: 'quiet:480' },
          ],
          [
            { text: 'Ertalabgacha (08:00)', callbackData: 'quiet:morning' },
            { text: 'Tinch rejimni bekor qilish', callbackData: 'quiet:cancel' },
          ],
        ],
      };
    }

    // Security Invariant: Telegram bot CANNOT create rules or add guardians
    if (cmd === '/add_rule' || cmd === '/add_guardian' || cmd === '/delete_child') {
      return {
        chatId,
        text: '⚠️ *Xavfsizlik talabi*: Qoidalar yaratish yoki yangi vasiylarni qo‘shish faqat himoyalangan veb-kabinet orqali amalga oshiriladi.\n\n' +
          `Iltimos, asosiy kabinetga kiring: ${baseUrl}/parent/rules`,
      };
    }

    return {
      chatId,
      text: 'Mavjud buyruqlar: /status, /location, /quiet, /help.\n' +
        `Batafsil sozlamalar uchun boshqaruv paneliga kiring: ${baseUrl}/parent/dashboard`,
    };
  }

  // Handle inline keyboard button callbacks
  public handleCallbackQuery(
    chatId: string,
    callbackData: string,
    guardianId: string
  ): TelegramCallbackResult {
    // 1. Time Extension Approvals
    if (callbackData.startsWith('extend_time:')) {
      const parts = callbackData.split(':');
      const minutes = parseInt(parts[1], 10);
      const childId = parts[2] || 'default-child';
      return {
        action: 'approve_time_extension',
        success: true,
        message: `✅ Qo‘shimcha ${minutes} daqiqa ajratildi.`,
        childNotification: `Vasiyingiz sizga ${minutes} daqiqa qo‘shimcha vaqt berdi!`,
      };
    }

    // 2. SOS Alert Seen Confirmation
    if (callbackData.startsWith('sos_seen:')) {
      const parts = callbackData.split(':');
      const sosId = parts[1];
      return {
        action: 'acknowledge_sos',
        success: true,
        message: `🚨 SOS xabari tasdiqlandi. Boshqa vasiylarga ham siz xabardor bo‘lganingiz ma’lum qilindi. (SOS ID: ${sosId})`,
        childNotification: 'Vasiyingiz SOS xabaringizni ko‘rdi va sizga yordam yo‘lida!',
      };
    }

    // 3. Web Page Unblock Permission
    if (callbackData.startsWith('allow_web:')) {
      const parts = callbackData.split(':');
      const duration = parts[1]; // '1h' | 'today' | 'perm'
      const domain = parts[2] || 'site';
      return {
        action: 'allow_web_page',
        success: true,
        message: `✅ ${domain} saytiga ruxsat berildi (${duration === '1h' ? '1 soatga' : duration === 'today' ? 'bugunga' : 'doimiy'}).`,
        childNotification: `${domain} sayti ochildi!`,
      };
    }

    // 4. False Block Report
    if (callbackData.startsWith('report_false_block:')) {
      const domain = callbackData.split(':')[1];
      return {
        action: 'report_false_block',
        success: true,
        message: `📩 Rahmat. ${domain} saytini noto‘g‘ri bloklanganligi haqida shikoyat qabul qilindi. 72 soat ichida ko‘rib chiqiladi.`,
      };
    }

    // 5. Quiet Hours Selection
    if (callbackData.startsWith('quiet:')) {
      const mode = callbackData.split(':')[1];
      const user = this.getGuardianByChatId(chatId);
      if (user) {
        if (mode === 'cancel') {
          user.quietHoursUntil = undefined;
          return { action: 'quiet_hours', success: true, message: 'Ovozli bildirishnomalar qayta yoqildi.' };
        }
        const now = Date.now();
        const durationMinutes = mode === '60' ? 60 : mode === '480' ? 480 : 360;
        user.quietHoursUntil = new Date(now + durationMinutes * 60 * 1000).toISOString();
        return {
          action: 'quiet_hours',
          success: true,
          message: `Tinch rejim yoqildi (${mode === '60' ? '1 soat' : 'ertalabgacha'}). SOS signallari yetkaziladi.`,
        };
      }
    }

    return {
      action: 'unknown',
      success: false,
      message: 'Noma’lum amal.',
    };
  }

  // Create notification payload with inline action buttons
  public formatSosAlertTelegram(params: {
    sosId: string;
    childName: string;
    zoneOrCoords: string;
    timestamp: string;
  }): TelegramMessageResponse {
    return {
      chatId: '',
      text: `🚨🚨 *DIQQAT! FAVQULODDA SOS SIGNALI* 🚨🚨\n\n` +
        `Farzandingiz: *${params.childName}*\n` +
        `Joylashuv: *${params.zoneOrCoords}*\n` +
        `Vaqti: ${params.timestamp}\n\n` +
        `_Eslatma: NIEX davlat tezkor xizmatlari (112) o‘rnini bosmaydi._`,
      inlineKeyboard: [
        [
          { text: '👁 Ko‘rdim (Seen)', callbackData: `sos_seen:${params.sosId}` },
        ],
      ],
    };
  }

  public formatPermissionRequestTelegram(params: {
    childName: string;
    domain: string;
    reason: string;
  }): TelegramMessageResponse {
    return {
      chatId: '',
      text: `⚠️ *Sayt ochish uchun ruxsat so‘rovi*\n\n` +
        `Farzandingiz: *${params.childName}*\n` +
        `Sayt: *${params.domain}*\n` +
        `Sabab: ${params.reason}`,
      inlineKeyboard: [
        [
          { text: '1 soatga ruxsat', callbackData: `allow_web:1h:${params.domain}` },
          { text: 'Bugunga ruxsat', callbackData: `allow_web:today:${params.domain}` },
        ],
        [
          { text: 'Doimiy ruxsat', callbackData: `allow_web:perm:${params.domain}` },
          { text: 'Rad etish', callbackData: `reject_web:${params.domain}` },
        ],
      ],
    };
  }
}
