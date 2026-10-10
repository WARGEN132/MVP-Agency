/**
 * Vercel serverless function: POST /api/send
 * Принимает заявку с сайта и пересылает её в Telegram.
 * Токен и chat id берутся из переменных окружения (Vercel -> Settings -> Environment Variables).
 */

// Минимальные типы: Vercel передаёт обычные Node-объекты запроса и ответа,
// поэтому отдельный пакет @vercel/node для типов не нужен.
type Req = { method?: string; body?: unknown };
type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

const ALLOWED_PACKAGES = ['STARTUP', 'BUSINESS', 'AGENCY'];

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Обрезаем до экранирования: после него строка может вырасти, поэтому лимиты небольшие
// (худший случай всё равно укладывается в 4096 символов, лимит Telegram).
const clean = (value: unknown, max: number) =>
  escapeHtml(String(value ?? '').trim().slice(0, max));

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = (typeof req.body === 'object' && req.body !== null ? req.body : {}) as Record<
    string,
    unknown
  >;

  // Скрытое поле-ловушка: люди его не видят, боты обычно заполняют.
  // Делаем вид, что всё прошло успешно, и ничего не отправляем.
  if (body.website) return res.status(200).json({ ok: true });

  const name = clean(body.name, 80);
  const contact = clean(body.contact, 80);
  const message = clean(body.message, 500);
  const pkg = ALLOWED_PACKAGES.includes(String(body.package)) ? String(body.package) : '';

  if (!name || !contact) {
    return res.status(400).json({ ok: false, error: 'Укажите имя и контакт.' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('Не заданы TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID');
    return res.status(500).json({ ok: false, error: 'Сервер не настроен.' });
  }

  const time = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Minsk' });

  let text = `<b>🚀 Новая заявка с сайта MVP Agency!</b>\n\n`;
  text += `👤 <b>Имя:</b> ${name}\n`;
  text += `📞 <b>Контакт:</b> ${contact}\n`;
  if (pkg) text += `📦 <b>Формат:</b> ${pkg}\n`;
  if (message) text += `💬 <b>Сообщение:</b> ${message}\n`;
  text += `\n⏰ <b>Время:</b> ${time}`;

  try {
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });

    if (!tg.ok) {
      console.error('Telegram API error:', tg.status, await tg.text());
      return res.status(502).json({ ok: false, error: 'Не удалось отправить.' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Ошибка при обращении к Telegram:', err);
    return res.status(502).json({ ok: false, error: 'Не удалось отправить.' });
  }
}
