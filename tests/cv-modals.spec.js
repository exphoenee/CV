import { test, expect } from '@playwright/test';

const PAGES = [
  {
    name: 'index',
    url: '/',
    hirePrefix: 'hire-index',
    bookingPrefix: 'index',
    hireBtn: '#hire-index-btn',
    bookingBtn: '#index-booking-btn',
    isGame: false,
    pageLabel: 'index',
  },
  {
    name: 'cv-game',
    url: '/cv-game.html',
    hirePrefix: 'hire-game',
    bookingPrefix: 'game',
    hireBtn: '#hire-btn',
    bookingBtn: '#meet-game-btn',
    isGame: true,
    hireModalId: 'hire-modal',
    hireCloseId: 'hire-close',
    hireBackdropId: 'hire-backdrop',
    hireFormId: 'hire-game-form',
    hireNameId: 'hire-game-name',
    hireEmailId: 'hire-game-email',
    hireMessageId: 'hire-game-message',
    pageLabel: 'game',
  },
  {
    name: 'cv-swagger',
    url: '/cv-swagger.html',
    hirePrefix: 'hire',
    bookingPrefix: 'swagger',
    hireBtn: '#hire-btn',
    bookingBtn: '#meet-swagger-btn',
    isGame: false,
    pageLabel: 'swagger',
  },
  {
    name: 'cv-scrumboard',
    url: '/cv-scrumboard.html',
    hirePrefix: 'hire-scrumboard',
    bookingPrefix: 'scrumboard',
    hireBtn: '#hire-scrumboard-btn',
    bookingBtn: '#scrumboard-booking-btn',
    isGame: false,
    pageLabel: 'scrumboard',
  },
  {
    name: 'cv-plain',
    url: '/cv-plain.html',
    hirePrefix: 'hire-plain',
    bookingPrefix: 'plain',
    hireBtn: '#hire-plain-btn',
    bookingBtn: '#plain-booking-btn',
    isGame: false,
    pageLabel: 'plain',
  },
  {
    name: 'cv-json',
    url: '/cv-json.html',
    hirePrefix: 'hire-json',
    bookingPrefix: 'json',
    hireBtn: '#hire-json-btn',
    bookingBtn: '#meet-menu-btn',
    isGame: false,
    pageLabel: 'json',
  },
  {
    name: 'cv-gantt',
    url: '/cv-gantt.html',
    hirePrefix: 'hire-gantt',
    bookingPrefix: 'gantt',
    hireBtn: '#hire-gantt-btn',
    bookingBtn: '#gantt-booking-btn',
    isGame: false,
    pageLabel: 'gantt',
  },
];

function hModId(c) { return c.hireModalId || `${c.hirePrefix}-modal`; }
function hCloseId(c) { return c.hireCloseId || `${c.hirePrefix}-close`; }
function hBackdropId(c) { return c.hireBackdropId || `${c.hirePrefix}-backdrop`; }
function hFormId(c) { return c.hireFormId || `${c.hirePrefix}-form`; }
function hNameId(c) { return c.hireNameId || `${c.hirePrefix}-name`; }
function hEmailId(c) { return c.hireEmailId || `${c.hirePrefix}-email`; }
function hMsgId(c) { return c.hireMessageId || `${c.hirePrefix}-message`; }

async function stubExternals(page) {
  await page.addInitScript(() => {
    window.turnstile = {
      render(container, opts) {
        if (opts && opts.callback) setTimeout(() => opts.callback('test-token-abc'), 150);
        return 1;
      },
      reset() {},
    };
  });
  await page.route('**/challenges.cloudflare.com/turnstile/**', r =>
    r.fulfill({ status: 200, body: '', contentType: 'application/javascript' }),
  );
  await page.route('**/formspree.io/**', r =>
    r.fulfill({ status: 200, body: '{"ok":true}', contentType: 'application/json' }),
  );
  await page.route('**/1.1.1.1/dns-query**', r =>
    r.fulfill({ status: 200, body: JSON.stringify({ Status: 0, Answer: [{ data: 'mx.gmail.com' }] }), contentType: 'application/dns-json' }),
  );
}

async function loadPage(page, c) {
  await page.goto(c.url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  if (c.isGame) {
    const sb = page.locator('#btn-start-game');
    if (await sb.isVisible({ timeout: 3000 }).catch(() => false)) {
      await sb.click();
      await page.waitForTimeout(2000);
    }
  }
  await page.waitForSelector(c.hireBtn, { state: 'attached', timeout: 10000 });
  await page.waitForTimeout(1000);
}

async function hireIsVisible(page, c) {
  return page.evaluate(id => {
    const el = document.getElementById(id);
    if (!el) return false;
    if (el.classList.contains('dialogue-hidden')) return false;
    if (el.classList.contains('cv-modal-hidden')) return false;
    if (el.classList.contains('dialogue-visible')) return true;
    return el.style.display !== 'none';
  }, hModId(c));
}

async function bookingIsVisible(page, c) {
  return page.evaluate(id => {
    const el = document.getElementById(id);
    if (!el) return false;
    return !el.classList.contains('cv-modal-hidden');
  }, `${c.bookingPrefix}-booking-modal`);
}

// Opens the booking modal and waits until the real Google Apps Script fetch
// resolves into one of the terminal states: date list, empty, or error.
// Returns the number of available date buttons (0 if empty/error).
// Tests that need a real slot use this so they skip gracefully instead of
// hanging for 60s when the live API legitimately has no free slots.
async function openBookingToDates(page, c) {
  await page.locator(c.bookingBtn).click();
  await page.waitForSelector(
    `#${c.bookingPrefix}-bk-step-date:not(.bk-hidden), ` +
    `#${c.bookingPrefix}-bk-empty:not(.bk-hidden), ` +
    `#${c.bookingPrefix}-bk-error:not(.bk-hidden)`,
    { timeout: 60000 },
  );
  return page.locator(`#${c.bookingPrefix}-bk-dates .bk-date-btn`).count();
}

for (const c of PAGES) {
  test.describe(c.name, () => {
    test.beforeEach(async ({ page }) => {
      await stubExternals(page);
    });

    // ── Hire Modal ──

    test('hire modal opens and closes', async ({ page }) => {
      await loadPage(page, c);
      await page.locator(c.hireBtn).click();
      await page.waitForTimeout(1500);
      expect(await hireIsVisible(page, c)).toBe(true);
      await page.locator(`#${hCloseId(c)}`).click();
      await page.waitForTimeout(500);
      expect(await hireIsVisible(page, c)).toBe(false);
    });

    test('hire modal closes on Escape', async ({ page }) => {
      await loadPage(page, c);
      await page.locator(c.hireBtn).click();
      await page.waitForTimeout(1500);
      expect(await hireIsVisible(page, c)).toBe(true);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      expect(await hireIsVisible(page, c)).toBe(false);
    });

    test('hire modal closes on backdrop click', async ({ page }) => {
      await loadPage(page, c);
      await page.locator(c.hireBtn).click();
      await page.waitForTimeout(1500);
      expect(await hireIsVisible(page, c)).toBe(true);
      await page.mouse.click(10, 10);
      await page.waitForTimeout(500);
      expect(await hireIsVisible(page, c)).toBe(false);
    });

    test('hire form has correct labels and fields', async ({ page }) => {
      await loadPage(page, c);
      await page.locator(c.hireBtn).click();
      await page.waitForTimeout(1500);
      if (c.isGame) {
        await expect(page.locator('#hire-modal-title')).toBeVisible();
      } else {
        await expect(page.locator(`#${hModId(c)} h3`)).toBeVisible();
      }
      await expect(page.locator(`label[for="${hNameId(c)}"]`)).toBeVisible();
      await expect(page.locator(`label[for="${hEmailId(c)}"]`)).toBeVisible();
      await expect(page.locator(`label[for="${hMsgId(c)}"]`)).toBeVisible();
      await expect(page.locator(`#${hNameId(c)}`)).toBeVisible();
      await expect(page.locator(`#${hEmailId(c)}`)).toBeVisible();
      await expect(page.locator(`#${hMsgId(c)}`)).toBeVisible();
    });

    if (!c.isGame) {
      test('hire form validation rejects empty fields', async ({ page }) => {
        await loadPage(page, c);
        await page.locator(c.hireBtn).click();
        await page.waitForTimeout(3500);
        await page.evaluate(fid => {
          const btn = document.querySelector(`#${fid} [type="submit"]`);
          if (btn) btn.disabled = false;
        }, hFormId(c));
        const btn = page.locator(`#${hFormId(c)} [type="submit"]`);
        await btn.click();
        await page.waitForTimeout(500);
        await expect(page.locator(`#${c.hirePrefix}-name-err`)).not.toHaveText('');
        await expect(page.locator(`#${c.hirePrefix}-email-err`)).not.toHaveText('');
        await expect(page.locator(`#${c.hirePrefix}-msg-err`)).not.toHaveText('');
      });

      test('hire form validation rejects invalid email', async ({ page }) => {
        await loadPage(page, c);
        await page.locator(c.hireBtn).click();
        await page.waitForTimeout(3500);
        await page.locator(`#${hNameId(c)}`).fill('Test User');
        await page.locator(`#${hEmailId(c)}`).fill('notanemail');
        await page.locator(`#${hMsgId(c)}`).fill('This is a test message with enough words to pass validation checks');
        await page.evaluate(fid => {
          const btn = document.querySelector(`#${fid} [type="submit"]`);
          if (btn) btn.disabled = false;
        }, hFormId(c));
        await page.locator(`#${hFormId(c)} [type="submit"]`).click();
        await page.waitForTimeout(500);
        await expect(page.locator(`#${c.hirePrefix}-email-err`)).not.toHaveText('');
      });

      test('hire form validation rejects short message', async ({ page }) => {
        await loadPage(page, c);
        await page.locator(c.hireBtn).click();
        await page.waitForTimeout(3500);
        await page.locator(`#${hNameId(c)}`).fill('Test User');
        await page.locator(`#${hEmailId(c)}`).fill('test@example.com');
        await page.locator(`#${hMsgId(c)}`).fill('short');
        await page.evaluate(fid => {
          const btn = document.querySelector(`#${fid} [type="submit"]`);
          if (btn) btn.disabled = false;
        }, hFormId(c));
        await page.locator(`#${hFormId(c)} [type="submit"]`).click();
        await page.waitForTimeout(500);
        await expect(page.locator(`#${c.hirePrefix}-msg-err`)).not.toHaveText('');
      });
    }

    test('game hire form rejects empty submit', async ({ page }) => {
      if (!c.isGame) { test.skip(); return; }
      await loadPage(page, c);
      await page.locator(c.hireBtn).click();
      await page.waitForTimeout(3500);
      const btn = page.locator(`#${hFormId(c)} [type="submit"]`);
      await expect(btn).toBeEnabled({ timeout: 5000 });
      await btn.click();
      await page.waitForTimeout(1000);
      await expect(page.locator(`#${hFormId(c)} [type="submit"]`)).toBeVisible();
    });

    test('hire form fills and submits successfully', async ({ page }) => {
      await loadPage(page, c);
      await page.locator(c.hireBtn).click();
      await page.waitForTimeout(3500);
      const msg = `Playwright automated test from ${c.pageLabel} page — testing form submission with enough words`;
      await page.locator(`#${hNameId(c)}`).fill('Playwright Test');
      await page.locator(`#${hEmailId(c)}`).fill('playwright-test@example.com');
      await page.locator(`#${hMsgId(c)}`).fill(msg);
      const btn = page.locator(`#${hFormId(c)} [type="submit"]`);
      await expect(btn).toBeEnabled({ timeout: 5000 });
      await btn.click();
      await page.waitForTimeout(2000);
      await expect(page.locator(`#${hModId(c)} [data-fs-success]`)).not.toHaveClass(/cv-success-hidden/);
    });

    // ── Booking Modal ──

    test('booking modal opens and closes', async ({ page }) => {
      await loadPage(page, c);
      await page.locator(c.bookingBtn).click();
      await page.waitForTimeout(1500);
      expect(await bookingIsVisible(page, c)).toBe(true);
      await page.locator(`#${c.bookingPrefix}-bk-close`).click();
      await page.waitForTimeout(500);
      expect(await bookingIsVisible(page, c)).toBe(false);
    });

    test('booking modal closes on Escape', async ({ page }) => {
      await loadPage(page, c);
      await page.locator(c.bookingBtn).click();
      await page.waitForTimeout(1500);
      expect(await bookingIsVisible(page, c)).toBe(true);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      expect(await bookingIsVisible(page, c)).toBe(false);
    });

    test('booking modal closes on backdrop click', async ({ page }) => {
      await loadPage(page, c);
      await page.locator(c.bookingBtn).click();
      await page.waitForTimeout(1500);
      expect(await bookingIsVisible(page, c)).toBe(true);
      await page.mouse.click(10, 10);
      await page.waitForTimeout(500);
      expect(await bookingIsVisible(page, c)).toBe(false);
    });

    test('booking modal loads available dates from real API', async ({ page }) => {
      await loadPage(page, c);
      await page.locator(c.bookingBtn).click();
      await page.waitForTimeout(1500);
      const dateStep = page.locator(`#${c.bookingPrefix}-bk-step-date`);
      const emptyState = page.locator(`#${c.bookingPrefix}-bk-empty`);
      const errorState = page.locator(`#${c.bookingPrefix}-bk-error`);
      await page.waitForSelector(
        `#${c.bookingPrefix}-bk-step-date:not(.bk-hidden), ` +
        `#${c.bookingPrefix}-bk-empty:not(.bk-hidden), ` +
        `#${c.bookingPrefix}-bk-error:not(.bk-hidden)`,
        { timeout: 60000 },
      );
      const dateBtns = page.locator(`#${c.bookingPrefix}-bk-dates .bk-date-btn`);
      const count = await dateBtns.count();
      if (count > 0) {
        await dateBtns.first().click();
        await page.waitForTimeout(500);
        await expect(page.locator(`#${c.bookingPrefix}-bk-step-time`)).toBeVisible();
        await expect(page.locator(`#${c.bookingPrefix}-bk-slots .bk-slot-btn`).first()).toBeVisible();
      }
    });

    test('booking navigates date → time → form', async ({ page }) => {
      await loadPage(page, c);
      const count = await openBookingToDates(page, c);
      test.skip(count === 0, 'real API returned no available slots');
      await page.locator(`#${c.bookingPrefix}-bk-dates .bk-date-btn`).first().click();
      await page.waitForTimeout(500);
      await expect(page.locator(`#${c.bookingPrefix}-bk-step-time`)).toBeVisible();
      await page.locator(`#${c.bookingPrefix}-bk-slots .bk-slot-btn`).first().click();
      await page.waitForTimeout(500);
      await expect(page.locator(`#${c.bookingPrefix}-bk-step-form`)).toBeVisible();
    });

    test('booking form validation rejects empty fields', async ({ page }) => {
      await loadPage(page, c);
      const count = await openBookingToDates(page, c);
      test.skip(count === 0, 'real API returned no available slots');
      await page.locator(`#${c.bookingPrefix}-bk-dates .bk-date-btn`).first().click();
      await page.waitForTimeout(500);
      await page.locator(`#${c.bookingPrefix}-bk-slots .bk-slot-btn`).first().click();
      await page.waitForTimeout(3500);
      await page.locator(`#${c.bookingPrefix}-bk-submit`).click();
      await page.waitForTimeout(500);
      await expect(page.locator(`#${c.bookingPrefix}-bk-email-err`)).not.toHaveText('');
      await expect(page.locator(`#${c.bookingPrefix}-bk-topic-err`)).not.toHaveText('');
    });

    test('booking form validation rejects invalid email', async ({ page }) => {
      await loadPage(page, c);
      const count = await openBookingToDates(page, c);
      test.skip(count === 0, 'real API returned no available slots');
      await page.locator(`#${c.bookingPrefix}-bk-dates .bk-date-btn`).first().click();
      await page.waitForTimeout(500);
      await page.locator(`#${c.bookingPrefix}-bk-slots .bk-slot-btn`).first().click();
      await page.waitForTimeout(3500);
      await page.locator(`#${c.bookingPrefix}-bk-name`).fill('Playwright Test');
      await page.locator(`#${c.bookingPrefix}-bk-email`).fill('notanemail');
      await page.locator(`#${c.bookingPrefix}-bk-topic`).fill('Playwright booking test — automated meeting request with enough words for validation');
      await page.locator(`#${c.bookingPrefix}-bk-submit`).click();
      await page.waitForTimeout(500);
      await expect(page.locator(`#${c.bookingPrefix}-bk-email-err`)).not.toHaveText('');
    });

    test('booking fills first available slot and submits', async ({ page }) => {
      await loadPage(page, c);
      const count = await openBookingToDates(page, c);
      test.skip(count === 0, 'real API returned no available slots');
      await page.locator(`#${c.bookingPrefix}-bk-dates .bk-date-btn`).first().click();
      await page.waitForTimeout(500);
      await page.locator(`#${c.bookingPrefix}-bk-slots .bk-slot-btn`).first().click();
      await page.waitForTimeout(3500);
      await page.locator(`#${c.bookingPrefix}-bk-name`).fill('Playwright Test');
      await page.locator(`#${c.bookingPrefix}-bk-email`).fill('playwright-test@example.com');
      await page.locator(`#${c.bookingPrefix}-bk-topic`).fill(`Automated booking test from ${c.pageLabel} page — requesting a brief meeting to discuss portfolio and technical skills`);
      await page.waitForTimeout(1000);
      const submitBtn = page.locator(`#${c.bookingPrefix}-bk-submit`);
      await expect(submitBtn).toBeEnabled({ timeout: 10000 });
      await submitBtn.click();
      await page.waitForSelector(
        `#${c.bookingPrefix}-bk-step-confirm:not(.bk-hidden), ` +
        `#${c.bookingPrefix}-bk-step-error:not(.bk-hidden)`,
        { timeout: 15000 },
      );
    });

    test('booking back navigation works', async ({ page }) => {
      await loadPage(page, c);
      const count = await openBookingToDates(page, c);
      test.skip(count === 0, 'real API returned no available slots');
      await page.locator(`#${c.bookingPrefix}-bk-dates .bk-date-btn`).first().click();
      await page.waitForTimeout(500);
      await page.locator(`#${c.bookingPrefix}-bk-slots .bk-slot-btn`).first().click();
      await page.waitForTimeout(500);
      await page.locator(`#${c.bookingPrefix}-bk-back-time`).click();
      await page.waitForTimeout(500);
      await expect(page.locator(`#${c.bookingPrefix}-bk-step-time`)).toBeVisible();
      await page.locator(`#${c.bookingPrefix}-bk-back-date`).click();
      await page.waitForTimeout(500);
      await expect(page.locator(`#${c.bookingPrefix}-bk-step-date`)).toBeVisible();
    });

    // ── Music Player (non-game pages) ──

    if (!c.isGame) {
      test('music player toggle opens and closes', async ({ page }) => {
        await loadPage(page, c);
        await page.locator('#music-toggle').click();
        await page.waitForTimeout(500);
        await expect(page.locator('#music-player-box')).not.toHaveClass(/music-box-hidden/);
        await page.locator('#music-box-close').click();
        await page.waitForTimeout(500);
        await expect(page.locator('#music-player-box')).toHaveClass(/music-box-hidden/);
      });

      test('music player play/pause toggles', async ({ page }) => {
        await loadPage(page, c);
        await page.locator('#music-toggle').click();
        await page.waitForTimeout(500);
        await page.locator('#music-playpause').click();
        await page.waitForTimeout(1000);
        await expect(page.locator('#music-playpause i')).toHaveClass(/fa-pause/);
        await page.locator('#music-playpause').click();
        await page.waitForTimeout(500);
        await expect(page.locator('#music-playpause i')).toHaveClass(/fa-play/);
      });

      test('music player next/prev track changes genre', async ({ page }) => {
        await loadPage(page, c);
        await page.locator('#music-toggle').click();
        await page.waitForTimeout(500);
        const tt = page.locator('#custom-genre-select .custom-select-trigger > span').first();
        const initial = await tt.textContent();
        await page.locator('#music-next').click();
        await page.waitForTimeout(800);
        expect(await tt.textContent()).not.toBe(initial);
        await page.locator('#music-prev').click();
        await page.waitForTimeout(800);
        expect(await tt.textContent()).toBe(initial);
      });

      test('music player volume slider works', async ({ page }) => {
        await loadPage(page, c);
        await page.locator('#music-toggle').click();
        await page.waitForTimeout(500);
        const vs = page.locator('#music-volume');
        await vs.fill('0.8');
        await vs.dispatchEvent('input');
        await page.waitForTimeout(300);
        await expect(vs).toHaveValue('0.8');
      });

      test('music player repeat cycles through modes', async ({ page }) => {
        await loadPage(page, c);
        await page.locator('#music-toggle').click();
        await page.waitForTimeout(500);
        const rb = page.locator('#music-repeat');
        await expect(rb).not.toHaveClass(/active/);
        await rb.click();
        await page.waitForTimeout(500);
        await expect(rb).toHaveClass(/active/);
        await expect(rb).not.toHaveClass(/repeat-one/);
        await rb.click();
        await page.waitForTimeout(500);
        await expect(rb).toHaveClass(/repeat-one/);
        await rb.click();
        await page.waitForTimeout(500);
        await expect(rb).not.toHaveClass(/active/);
      });

      test('music player genre dropdown opens and selects', async ({ page }) => {
        await loadPage(page, c);
        await page.locator('#music-toggle').click();
        await page.waitForTimeout(500);
        const cs = page.locator('#custom-genre-select');
        await cs.locator('.custom-select-trigger').click();
        await page.waitForTimeout(300);
        await expect(cs).toHaveClass(/open/);
        const opts = cs.locator('.custom-option');
        expect(await opts.count()).toBeGreaterThan(1);
        await opts.nth(1).click();
        await page.waitForTimeout(300);
        await expect(cs).not.toHaveClass(/open/);
      });
    }

    if (c.isGame) {
      test('game music player play/pause toggles', async ({ page }) => {
        await loadPage(page, c);
        await page.locator('#game-music-playpause').click();
        await page.waitForTimeout(1000);
        await expect(page.locator('#game-music-playpause i')).toHaveClass(/fa-pause/);
        await page.locator('#game-music-playpause').click();
        await page.waitForTimeout(500);
        await expect(page.locator('#game-music-playpause i')).toHaveClass(/fa-play/);
      });

      test('game music player next/prev track changes genre', async ({ page }) => {
        await loadPage(page, c);
        const tt = page.locator('#game-genre-select .custom-select-trigger span');
        const initial = await tt.textContent();
        await page.locator('#game-music-next').click();
        await page.waitForTimeout(800);
        expect(await tt.textContent()).not.toBe(initial);
        await page.locator('#game-music-prev').click();
        await page.waitForTimeout(800);
        expect(await tt.textContent()).toBe(initial);
      });
    }
  });
}
