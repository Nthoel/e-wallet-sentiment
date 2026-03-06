const BaseTransport = require('../src/mail/transports/base.transport');
const LoggerTransport = require('../src/mail/transports/logger.transport');
const SmtpTransport = require('../src/mail/transports/smtp.transport');
const GoogleTransport = require('../src/mail/transports/google.transport');
const {
  createTransport,
  TRANSPORTS,
  DEFAULT_TRANSPORT
} = require('../src/mail/mail.transport');
const templates = require('../src/mail/templates');

jest.mock('../src/config/logger.config', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
}));

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({
      accepted: ['test@mail.com'],
      messageId: 'mock-message-id-123'
    })
  }))
}));

const MAIL_OPTIONS = {
  to: 'recipient@mail.com',
  subject: 'Test Subject',
  html: '<p>Hello</p>',
  text: 'Hello'
};

describe('BaseTransport', () => {
  test('tidak bisa di-instantiate langsung', () => {
    expect(() => new BaseTransport('test')).toThrow(
      'BaseTransport tidak bisa di-instantiate langsung'
    );
  });

  test('send() throw error jika belum diimplementasikan', async () => {
    // Buat subclass tanpa override send()
    class DummyTransport extends BaseTransport {
      constructor() {
        super('dummy');
      }
    }

    const transport = new DummyTransport();
    await expect(transport.send(MAIL_OPTIONS)).rejects.toThrow(
      'Transport "dummy" belum mengimplementasikan send()'
    );
  });

  test('subclass bisa mengset nama transport', () => {
    class TestTransport extends BaseTransport {
      constructor() {
        super('test-name');
      }
    }

    const transport = new TestTransport();
    expect(transport.name).toBe('test-name');
  });
});

// ─── LoggerTransport ────────────────────────────────────────────────────────

describe('LoggerTransport', () => {
  const logger = require('../src/config/logger.config');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('nama transport adalah "logger"', () => {
    const transport = new LoggerTransport();
    expect(transport.name).toBe('logger');
  });

  test('send() mengembalikan result dengan transport, accepted, messageId', async () => {
    const transport = new LoggerTransport();
    const result = await transport.send(MAIL_OPTIONS);

    expect(result).toEqual(
      expect.objectContaining({
        transport: 'logger',
        accepted: [MAIL_OPTIONS.to],
        messageId: expect.stringMatching(/^logger-\d+$/)
      })
    );
  });

  test('send() memanggil logger.info untuk setiap field', async () => {
    const transport = new LoggerTransport();
    await transport.send(MAIL_OPTIONS);

    expect(logger.info).toHaveBeenCalledWith('=== MAIL (logger transport) ===');
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(MAIL_OPTIONS.to)
    );
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(MAIL_OPTIONS.subject)
    );
    expect(logger.info).toHaveBeenCalledWith('=== END MAIL ===');
  });

  test('send() menampilkan "(default)" jika from tidak ada', async () => {
    const transport = new LoggerTransport();
    await transport.send({ ...MAIL_OPTIONS, from: undefined });

    expect(logger.info).toHaveBeenCalledWith('From   : (default)');
  });

  test('send() menampilkan from jika disediakan', async () => {
    const transport = new LoggerTransport();
    await transport.send({ ...MAIL_OPTIONS, from: 'sender@mail.com' });

    expect(logger.info).toHaveBeenCalledWith('From   : sender@mail.com');
  });
});

// ─── SmtpTransport ──────────────────────────────────────────────────────────

describe('SmtpTransport', () => {
  const nodemailer = require('nodemailer');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('nama transport adalah "smtp"', () => {
    const transport = new SmtpTransport();
    expect(transport.name).toBe('smtp');
  });

  test('constructor membuat nodemailer transporter', () => {
    new SmtpTransport();
    expect(nodemailer.createTransport).toHaveBeenCalled();
  });

  test('send() memanggil transporter.sendMail dan mengembalikan result', async () => {
    const transport = new SmtpTransport();
    const result = await transport.send(MAIL_OPTIONS);

    expect(transport.transporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: MAIL_OPTIONS.to,
        subject: MAIL_OPTIONS.subject,
        html: MAIL_OPTIONS.html,
        text: MAIL_OPTIONS.text
      })
    );

    expect(result).toEqual({
      transport: 'smtp',
      accepted: ['test@mail.com'],
      messageId: 'mock-message-id-123'
    });
  });
});

// ─── GoogleTransport ────────────────────────────────────────────────────────

describe('GoogleTransport', () => {
  const nodemailer = require('nodemailer');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('nama transport adalah "google"', () => {
    const transport = new GoogleTransport();
    expect(transport.name).toBe('google');
  });

  test('constructor membuat nodemailer transporter dengan service gmail', () => {
    new GoogleTransport();
    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({ service: 'gmail' })
    );
  });

  test('send() memanggil transporter.sendMail dan mengembalikan result', async () => {
    const transport = new GoogleTransport();
    const result = await transport.send(MAIL_OPTIONS);

    expect(transport.transporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: MAIL_OPTIONS.to,
        subject: MAIL_OPTIONS.subject
      })
    );

    expect(result).toEqual({
      transport: 'google',
      accepted: ['test@mail.com'],
      messageId: 'mock-message-id-123'
    });
  });
});

// ─── mail.transport (factory) ───────────────────────────────────────────────

describe('mail.transport', () => {
  test('TRANSPORTS berisi logger, smtp, google', () => {
    expect(Object.keys(TRANSPORTS)).toEqual(
      expect.arrayContaining(['logger', 'smtp', 'google'])
    );
  });

  test('DEFAULT_TRANSPORT adalah "logger"', () => {
    expect(DEFAULT_TRANSPORT).toBe('logger');
  });

  test('createTransport("logger") mengembalikan LoggerTransport', () => {
    const transport = createTransport('logger');
    expect(transport).toBeInstanceOf(LoggerTransport);
  });

  test('createTransport("smtp") mengembalikan SmtpTransport', () => {
    const transport = createTransport('smtp');
    expect(transport).toBeInstanceOf(SmtpTransport);
  });

  test('createTransport("google") mengembalikan GoogleTransport', () => {
    const transport = createTransport('google');
    expect(transport).toBeInstanceOf(GoogleTransport);
  });

  test('createTransport() tanpa argumen menggunakan default (logger)', () => {
    delete process.env.MAIL_TRANSPORT;
    const transport = createTransport();
    expect(transport).toBeInstanceOf(LoggerTransport);
  });

  test('createTransport() menggunakan env MAIL_TRANSPORT jika ada', () => {
    process.env.MAIL_TRANSPORT = 'smtp';
    const transport = createTransport();
    expect(transport).toBeInstanceOf(SmtpTransport);
    delete process.env.MAIL_TRANSPORT;
  });

  test('createTransport() throw error untuk transport tidak dikenal', () => {
    expect(() => createTransport('unknown')).toThrow(
      'Transport "unknown" tidak ditemukan'
    );
  });
});

// ─── Templates ──────────────────────────────────────────────────────────────

describe('templates', () => {
  describe('welcome', () => {
    test('mengembalikan subject, html, text', () => {
      const result = templates.welcome({ name: 'John' });

      expect(result.subject).toBe('Selamat Datang di E-Wallet Sentiment!');
      expect(result.html).toContain('John');
      expect(result.text).toContain('John');
    });
  });

  describe('resetPassword', () => {
    test('mengembalikan subject, html, text dengan resetLink', () => {
      const data = { name: 'Jane', resetLink: 'https://example.com/reset' };
      const result = templates.resetPassword(data);

      expect(result.subject).toBe('Reset Password - E-Wallet Sentiment');
      expect(result.html).toContain('Jane');
      expect(result.html).toContain('https://example.com/reset');
      expect(result.text).toContain('https://example.com/reset');
    });
  });

  describe('notification', () => {
    test('mengembalikan subject, html, text dengan title dan message', () => {
      const data = { title: 'Info Penting', message: 'Ini pesan notifikasi' };
      const result = templates.notification(data);

      expect(result.subject).toBe('Info Penting - E-Wallet Sentiment');
      expect(result.html).toContain('Info Penting');
      expect(result.html).toContain('Ini pesan notifikasi');
      expect(result.text).toContain('Ini pesan notifikasi');
    });
  });
});

// ─── service.mail ───────────────────────────────────────────────────────────

describe('service.mail', () => {
  let mailService;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset module cache agar transportInstance di-reset
    jest.resetModules();

    jest.mock('../src/config/logger.config', () => ({
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn()
    }));

    jest.mock('nodemailer', () => ({
      createTransport: jest.fn(() => ({
        sendMail: jest.fn().mockResolvedValue({
          accepted: ['test@mail.com'],
          messageId: 'mock-id'
        })
      }))
    }));

    delete process.env.MAIL_TRANSPORT;
    mailService = require('../src/mail/service.mail');
  });

  describe('getTransport', () => {
    test('mengembalikan transport instance', () => {
      const transport = mailService.getTransport();
      expect(transport).toBeDefined();
      expect(transport.name).toBe('logger');
    });

    test('mengembalikan singleton (instance yang sama)', () => {
      const t1 = mailService.getTransport();
      const t2 = mailService.getTransport();
      expect(t1).toBe(t2);
    });
  });

  describe('sendMail', () => {
    test('mengirim email via transport dan mengembalikan result', async () => {
      const result = await mailService.sendMail(MAIL_OPTIONS);

      expect(result).toEqual(
        expect.objectContaining({
          transport: 'logger',
          accepted: expect.any(Array)
        })
      );
    });
  });

  describe('sendTemplateMail', () => {
    test('mengirim email menggunakan template "welcome"', async () => {
      const result = await mailService.sendTemplateMail(
        'welcome',
        'user@mail.com',
        { name: 'Test' }
      );

      expect(result).toEqual(
        expect.objectContaining({
          transport: 'logger',
          accepted: expect.any(Array)
        })
      );
    });

    test('mengirim email menggunakan template "resetPassword"', async () => {
      const result = await mailService.sendTemplateMail(
        'resetPassword',
        'user@mail.com',
        { name: 'Test', resetLink: 'https://example.com/reset' }
      );

      expect(result).toBeDefined();
      expect(result.transport).toBe('logger');
    });

    test('mengirim email menggunakan template "notification"', async () => {
      const result = await mailService.sendTemplateMail(
        'notification',
        'user@mail.com',
        { title: 'Test Title', message: 'Test message' }
      );

      expect(result).toBeDefined();
      expect(result.transport).toBe('logger');
    });

    test('throw error jika template tidak ditemukan', async () => {
      await expect(
        mailService.sendTemplateMail('nonexistent', 'user@mail.com', {})
      ).rejects.toThrow('Template "nonexistent" tidak ditemukan');
    });

    test('meneruskan overrides ke sendMail', async () => {
      const result = await mailService.sendTemplateMail(
        'welcome',
        'user@mail.com',
        { name: 'Test' },
        { from: 'custom@mail.com' }
      );

      expect(result).toBeDefined();
    });
  });
});
