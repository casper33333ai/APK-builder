const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

async function injectSession(page, cookieData) {
  try {
    if (!cookieData || cookieData === '[]' || cookieData === '') {
      console.log('ℹ️ [SESSION] Geen sessie-cookies gevonden in secrets of config.');
      return;
    }
    const cookies = JSON.parse(cookieData);
    const validCookies = cookies.map(c => ({
      ...c,
      domain: c.domain ? (c.domain.startsWith('.') ? c.domain : '.' + c.domain) : '.google.com',
      path: c.path || '/',
      secure: true
    }));
    await page.setCookie(...validCookies);
    console.log('✅ [SESSION] Cookies succesvol geïnjecteerd.');
  } catch (err) {
    console.error('⚠️ [SESSION] Cookie-injectie mislukt:', err.message);
  }
}

async function scrapeAIStudio() {
  const url = process.env.AI_URL || "https://aistudio.google.com/u/1/apps/drive/1C95LlT34ylBJSzh30JU2J1ZlwMZSIQrx?showPreview=true&showAssistant=true";
  const rawCookies = process.env.SESSION_COOKIES || `[
    {
        "domain": ".aistudio.google.com",
        "expirationDate": 1802026091.823091,
        "hostOnly": false,
        "httpOnly": false,
        "name": "_ga",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "GA1.1.1096617774.1767188855",
        "id": 1
    },
    {
        "domain": ".aistudio.google.com",
        "expirationDate": 1802027846.900004,
        "hostOnly": false,
        "httpOnly": false,
        "name": "_ga_P1DBVKWT6V",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "GS2.1.s1767466074$o6$g1$t1767467846$j60$l0$h2056955521",
        "id": 2
    },
    {
        "domain": ".aistudio.google.com",
        "expirationDate": 1802027846.850979,
        "hostOnly": false,
        "httpOnly": false,
        "name": "_ga_RJSPDF5Y0Q",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "GS2.1.s1767466074$o6$g1$t1767467846$j60$l0$h0",
        "id": 3
    },
    {
        "domain": ".google.com",
        "expirationDate": 1801766252.17005,
        "hostOnly": false,
        "httpOnly": false,
        "name": "__Secure-1PAPISID",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "EV-2ZXCz8aBNsQhY/APT_tLDDFMYlZ4qKN",
        "id": 4
    },
    {
        "domain": ".google.com",
        "expirationDate": 1801766252.168079,
        "hostOnly": false,
        "httpOnly": true,
        "name": "__Secure-1PSID",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "g.a0005AjMoxiKDUd2lMuEqjoBbEQCvbCrnyEyjVwRY6G2MlCo6G2ChJbxpj3GkFEhIUHvu1y6PAACgYKAfkSARISFQHGX2MiN0LiTk1KQgTpgX2clxDlGRoVAUF8yKrfGiTuM6bOgUtg8P70h19f0076",
        "id": 5
    },
    {
        "domain": ".google.com",
        "expirationDate": 1799017707.678553,
        "hostOnly": false,
        "httpOnly": true,
        "name": "__Secure-1PSIDCC",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "AKEyXzUyYaiHgzrKw9mCiuKxm2PBZ5St3AnlppeJEihBBLEICpepu48xbptqJgd64lOmIMwr9Q",
        "id": 6
    },
    {
        "domain": ".google.com",
        "expirationDate": 1767482307.677391,
        "hostOnly": false,
        "httpOnly": true,
        "name": "__Secure-1PSIDRTS",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "sidts-CjYBflaCdcO8X5Ss3HEDJfrJJrnlxJDEQFxHq6Lo0S5M0BvMQ_LdcTJfLMk3iUZMdWs7_rIfbFQQAA",
        "id": 7
    },
    {
        "domain": ".google.com",
        "expirationDate": 1799017707.676829,
        "hostOnly": false,
        "httpOnly": true,
        "name": "__Secure-1PSIDTS",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "sidts-CjYBflaCdcO8X5Ss3HEDJfrJJrnlxJDEQFxHq6Lo0S5M0BvMQ_LdcTJfLMk3iUZMdWs7_rIfbFQQAA",
        "id": 8
    },
    {
        "domain": ".google.com",
        "expirationDate": 1801766252.170282,
        "hostOnly": false,
        "httpOnly": false,
        "name": "__Secure-3PAPISID",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "EV-2ZXCz8aBNsQhY/APT_tLDDFMYlZ4qKN",
        "id": 9
    },
    {
        "domain": ".google.com",
        "expirationDate": 1801766252.168333,
        "hostOnly": false,
        "httpOnly": true,
        "name": "__Secure-3PSID",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "g.a0005AjMoxiKDUd2lMuEqjoBbEQCvbCrnyEyjVwRY6G2MlCo6G2CN17ytMY7kgiwJNRJjvjVugACgYKAdoSARISFQHGX2Mic9K3BYpoVGHbkKC5UN8ctRoVAUF8yKpJAObShXdz9epk2lfJD4bj0076",
        "id": 10
    },
    {
        "domain": ".google.com",
        "expirationDate": 1799017906.028634,
        "hostOnly": false,
        "httpOnly": true,
        "name": "__Secure-3PSIDCC",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "AKEyXzVvUFin6x-idDLXmLHVmL4S51Ek9-63jeSjgX0satrYHfco7HXYY58wc6Y2K2bSfGBHAQ",
        "id": 11
    },
    {
        "domain": ".google.com",
        "expirationDate": 1767482307.678006,
        "hostOnly": false,
        "httpOnly": true,
        "name": "__Secure-3PSIDRTS",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "sidts-CjYBflaCdcO8X5Ss3HEDJfrJJrnlxJDEQFxHq6Lo0S5M0BvMQ_LdcTJfLMk3iUZMdWs7_rIfbFQQAA",
        "id": 12
    },
    {
        "domain": ".google.com",
        "expirationDate": 1799017707.677714,
        "hostOnly": false,
        "httpOnly": true,
        "name": "__Secure-3PSIDTS",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "sidts-CjYBflaCdcO8X5Ss3HEDJfrJJrnlxJDEQFxHq6Lo0S5M0BvMQ_LdcTJfLMk3iUZMdWs7_rIfbFQQAA",
        "id": 13
    },
    {
        "domain": ".google.com",
        "expirationDate": 1781083850.84499,
        "hostOnly": false,
        "httpOnly": true,
        "name": "__Secure-BUCKET",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "CPYD",
        "id": 14
    },
    {
        "domain": ".google.com",
        "expirationDate": 1775036644.927835,
        "hostOnly": false,
        "httpOnly": true,
        "name": "AEC",
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "AaJma5t6rMgsXZLoRuZXyTWbqRIb-XS98PDTViueIjjZ0Ca2YiQYK9N8YA",
        "id": 15
    },
    {
        "domain": ".google.com",
        "expirationDate": 1801766252.169534,
        "hostOnly": false,
        "httpOnly": false,
        "name": "APISID",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "jHWvR4faGvAMQnY7/AU5EKiw_AH0bUtuMa",
        "id": 16
    },
    {
        "domain": ".google.com",
        "expirationDate": 1801766252.169086,
        "hostOnly": false,
        "httpOnly": true,
        "name": "HSID",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "A5LJZkrKIHtDB1Dli",
        "id": 17
    },
    {
        "domain": ".google.com",
        "expirationDate": 1783252869.595156,
        "hostOnly": false,
        "httpOnly": true,
        "name": "NID",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "527=RxlZqBIT4gTc45ZO1voUiFvglWJ8s0n1Hr9dahAzuqEx2jObAv60k8q9Jjs4UIOqA0sVNsT-aVgU2XOVR8qX4zTWG5avy03soebOed16aj79ZgoMvt2rlYdsdq7YUvFebCsqNsn-GkVj4bYjnfQHBY4Z5dlrmfKFXbR8fzBvmunB_q2l2V_16jR2NJSXCsgBxdyP9xYpcBw_qT59lxugQ783c_FpusbFXAV5KMx_sliW8yFnBuWQDZiVIaM5TyJcd3XIbdVXGGKxZ5hksVUoYDPPqGgwCNUl-TSiRKoh0nqxzoYED_cI3Vzz-dHCAZ7DXEPBTRkcvsN0rURN8nmqmeps7yLm722NGLrBokfI7JFdOhZK20wpRA-LSnv3BI39gFKRQmCrAQcmliuBaWK4QFLvgCrFYCzF7ljmYhTLbYJzrUx07RbJHSZAp2w2ayVV7tZpUWwhVko58bD6LCHqG-QJxsEzezwNfQ85ckB-4XnDfh6i8skg-9cKNblzY4K3mhPIYgrVKWr3s_trklFZdIaHDnxA8Oz1dvx-ur5ehNQZwoA0aTTny49SVQAwXMuRYkwu_GuHEy36wamQ5PXfBpaxsr1VE--c4LTqyzFv3Las7XNJj15gIwEGXh2ljLrNFnn-Wq9UUgpHYKBjD6XPbwLqQYPCdZMEhQdX8pneAk9bHJpWQR9TWMOqjiwJJOyZL3HBCaBbwKo1XSAjc_txy4nd-pfLcx-0SjzvARqfv7KxgrrKBnobhLyd69TB9UkerKxBlb-3_zSw8qv1Iy8vV1nhp1n3_JpEXY32va9dIcv83HWmvpbYwHFacoSYvJqjQI0mekm2M_t0ZbyeQOVltlbaRtHs-WrQEbD_n4JI1L0KWyejGNhEFWxfpC6QhXPOE0SH6IvmG6BbRpO5DMCBVXR5hg",
        "id": 18
    },
    {
        "domain": ".google.com",
        "expirationDate": 1801766252.169816,
        "hostOnly": false,
        "httpOnly": false,
        "name": "SAPISID",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "EV-2ZXCz8aBNsQhY/APT_tLDDFMYlZ4qKN",
        "id": 19
    },
    {
        "domain": ".google.com",
        "expirationDate": 1780750000.101546,
        "hostOnly": false,
        "httpOnly": false,
        "name": "SEARCH_SAMESITE",
        "path": "/",
        "sameSite": "strict",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "CgQIzp8B",
        "id": 20
    },
    {
        "domain": ".google.com",
        "expirationDate": 1801766252.167643,
        "hostOnly": false,
        "httpOnly": false,
        "name": "SID",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "g.a0005AjMoxiKDUd2lMuEqjoBbEQCvbCrnyEyjVwRY6G2MlCo6G2Cq7cHrcDf65ZCGhSA-3zKBQACgYKAa0SARISFQHGX2MilDDDN_HkrUuheTajjJQvRRoVAUF8yKojKXtqEHuU5nkXpz6tsTPP0076",
        "id": 21
    },
    {
        "domain": ".google.com",
        "expirationDate": 1799017707.678287,
        "hostOnly": false,
        "httpOnly": false,
        "name": "SIDCC",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "AKEyXzVUbpQyL8EjaeFgiyOXGM6ZVrVZw2uyIp1zWV4ezhPC3kOf0upizU115d502LgJNo6f55k",
        "id": 22
    },
    {
        "domain": ".google.com",
        "expirationDate": 1793612650.576948,
        "hostOnly": false,
        "httpOnly": false,
        "name": "SOCS",
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "CAISHAgCEhJnd3NfMjAyNTEwMDItMF9SQzEaAm5sIAEaBgiApPzGBg",
        "id": 23
    },
    {
        "domain": ".google.com",
        "expirationDate": 1801766252.169311,
        "hostOnly": false,
        "httpOnly": true,
        "name": "SSID",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "Az00D5OqzLpA5TXTe",
        "id": 24
    }
]`;
  
  if (!url || url.includes('example.com')) {
    console.error('❌ [ERROR] Geen doel-URL gevonden. Stel de AI_URL secret in op GitHub.');
    process.exit(1);
  }

  console.log('🕶️ [STEALTH] Browser opstarten...');
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await injectSession(page, rawCookies);

  try {
    console.log('🌐 [NAVIGATE] Laden van: ' + url);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    console.log('⏳ [WAIT] Analyseren van DOM (30s pauze voor JS rendering)...');
    await new Promise(r => setTimeout(r, 30000));

    const content = await page.evaluate(() => {
      const getCode = (doc) => {
        // Zoek naar de preview container van AI Studio
        const selectors = ['iframe', 'app-root', '#app', '.preview-content', 'main'];
        for (const s of selectors) {
          const el = doc.querySelector(s);
          if (el && s === 'iframe') {
            try { return el.contentDocument.documentElement.outerHTML; } catch(e) {}
          }
          if (el && el.innerHTML.length > 500) return el.outerHTML;
        }
        return null;
      };

      let html = getCode(document);
      if (!html) {
        // Diepe scan door alle frames
        const frames = Array.from(document.querySelectorAll('iframe'));
        for (const f of frames) {
          try {
            const d = f.contentDocument || f.contentWindow.document;
            html = d.documentElement.outerHTML;
            if (html.length > 500) break;
          } catch(e) {}
        }
      }
      return html;
    });

    if (!content) throw new Error('Geen bruikbare code gevonden op de pagina.');

    const finalHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><title>Stealth AI App</title></head><body style="margin:0;padding:0">${content}</body></html>`;

    if (!fs.existsSync('www')) fs.mkdirSync('www', { recursive: true });
    fs.writeFileSync(path.join('www', 'index.html'), finalHtml);
    console.log('✅ [SUCCESS] Broncode opgeslagen in www/index.html');
  } catch (err) {
    console.error('❌ [FATAL] Scraper fout:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

scrapeAIStudio();