/* ============================================================
   M🌓🌓N Website to APK — moon-config.js  (site configuration)
   Provider: ADSTERRA (your account — all revenue is yours)
   Maintained via the admin panel (admin.html).
   Upload to repo ROOT. Loaded by index.html BEFORE the builder:
       <script src="moon-config.js"></script>
   ------------------------------------------------------------
   AD PLACEMENT (per Adsterra official docs):
   - Static banner  -> anywhere in <body>  (site: pinned bottom)
   - Native banner  -> anywhere in <body>  (site: monetization section)
   - Popunder       -> before </head>      (DISABLED by default)
   - Social Bar     -> before </body>      (DISABLED by default)
   - Smartlink      -> direct link, used as "Support us" button
   Keep Popunder + Social Bar OFF at launch — never both at once.
   ============================================================ */
window.CFG = {
  /* ---------- Pricing & Pro plan ---------- */
  PRO_PRICE: "9.99",
  CURRENCY: "$",
  PRO_PERIOD: "month",
  PRO_NOTE: "After paying, send your proof (screenshot + app name) via WhatsApp or email — your Pro build will be unlocked.",
  OWNER_EMAIL: "you@example.com",

  /* ---------- Payment wallets (shown on site) ---------- */
  WALLETS: [
    { label: "Bitcoin (BTC)", value: "" },
    { label: "USDT (TRC20)", value: "" },
    { label: "PayPal", value: "" },
    { label: "M-Pesa", value: "" }
  ],

  /* ---------- Contact info (shown on site footer + WhatsApp button) ---------- */
  CONTACT: {
    email: "you@example.com",
    whatsapp: "",
    telegram: "",
    phone: ""
  },

  /* ---------- Social media links (shown on site footer) ---------- */
  SOCIALS: [
    { label: "Facebook", url: "" },
    { label: "Instagram", url: "" },
    { label: "X (Twitter)", url: "" },
    { label: "TikTok", url: "" },
    { label: "YouTube", url: "" },
    { label: "Discord", url: "" }
  ],

  /* ---------- YOUR ADSTERRA UNITS (revenue -> your account) ---------- */
  ADS: {
    PROVIDER: "adsterra",

    /* #5 Banner 468x60 - injected in EVERY free-plan APK (bottom strip)
       + pinned strip on the SITE itself */
    SITE_BANNER: true,
    BANNER_KEY: "f27ec57d700fdd5933e6552a84e5ff6d",
    BANNER_SRC: "https://bauval.org/22/f27ec57d700fdd5933e6552a84e5ff6d",
    BANNER_WIDTH: 468,
    BANNER_HEIGHT: 60,

    /* #2 Native Banner - SITE monetization section (fits page style) */
    SITE_NATIVE: true,
    NATIVE_SRC: "https://bauval.org/21/a9040797764743a44371d306d1918e39",
    NATIVE_CONTAINER: "container-a9040797764743a44371d306d1918e39",

    /* #4 Smartlink - direct link used as the "Support us" button */
    SITE_SUPPORT_BTN: true,
    SMARTLINK_URL: "https://araplhn.org/4/1ca881361441ca1cbbb1af6929e1c25f",

    /* #1 Popunder - DISABLED by default (goes in <head>) */
    ENABLE_POPUNDER: false,
    POPUNDER_SRC: "https://abscloud.org/1/1f0ba2bf6f1d7bb0305242f7262afeb3",

    /* #3 Social Bar - DISABLED by default (goes before </body>) */
    ENABLE_SOCIALBAR: false,
    SOCIALBAR_SRC: "https://bauval.org/14/ad8dc63c5a40fdda45c6e097a8022545",

    /* Legacy fields (kept in sync so the admin panel + builder work) */
    ADSTERRA_BANNER_KEY: "f27ec57d700fdd5933e6552a84e5ff6d",
    ADSTERRA_POPUNDER_KEY: "",
    APP_ADS_LINE: ""
  }
};

/* ============================================================
   AUTO-WIRING — runs on every page that loads this file:
   1. pushes your ad units into the builder's PLATFORM constants
   2. injects SITE ads (banner strip, native, popunder, social bar,
      smartlink support button) — index.html only
   3. renders footer contact/socials + WhatsApp float button
   ============================================================ */
(function () {
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* ---- 1. PLATFORM push (builder reads these at build time) ---- */
  function pushPlatform() {
    try {
      if (window.PLATFORM && window.CFG && window.CFG.ADS) {
        var A = window.CFG.ADS;
        if (A.PROVIDER) PLATFORM.ADS_PROVIDER = A.PROVIDER;
        if (A.BANNER_KEY && !/^YOUR_/.test(A.BANNER_KEY)) {
          PLATFORM.ADSTERRA_BANNER_KEY = A.BANNER_KEY;
          PLATFORM.BANNER_SRC = A.BANNER_SRC;
          PLATFORM.BANNER_W = A.BANNER_WIDTH;
          PLATFORM.BANNER_H = A.BANNER_HEIGHT;
        }
        if (A.ENABLE_POPUNDER && A.POPUNDER_SRC)
          PLATFORM.ADSTERRA_POPUNDER_KEY = A.POPUNDER_SRC;
      }
    } catch (e) {}
  }

  /* ---- 2. SITE ads (only on pages marked <body id="mn-site">) ---- */
  function siteAds() {
    var A = (window.CFG && window.CFG.ADS) || {};
    if (!document.getElementById("mn-site")) return;
    if (!A.PROVIDER || A.PROVIDER !== "adsterra") return;

    var css = [
      "#mn-adbar{position:fixed;left:0;right:0;bottom:0;height:50px;z-index:2147483647;background:#fff;text-align:center;overflow:hidden;border-top:1px solid #e6e8ee}",
      "body{padding-bottom:50px}"
    ].join("\n");
    var st = document.createElement("style");
    st.textContent = css;
    document.head.appendChild(st);

    /* #5 Static banner — pinned bottom strip on the site */
    if (A.SITE_BANNER !== false && A.BANNER_KEY) {
      var bar = document.createElement("div");
      bar.id = "mn-adbar";
      var o = document.createElement("script");
      o.type = "text/javascript";
      o.text = "atOptions = {'key':'" + A.BANNER_KEY + "','format':'iframe','height':50,'width':320,'params':{}};";
      bar.appendChild(o);
      var i = document.createElement("script");
      i.type = "text/javascript";
      i.src = A.BANNER_SRC || ("https://www.highperformanceformat.com/" + A.BANNER_KEY + "/invoke.js");
      bar.appendChild(i);
      document.body.appendChild(bar);
    }

    /* #1 Popunder — before </head> per Adsterra docs */
    if (A.ENABLE_POPUNDER && A.POPUNDER_SRC) {
      var p = document.createElement("script");
      p.setAttribute("data-cfasync", "false");
      p.src = A.POPUNDER_SRC;
      document.head.appendChild(p);
    }

    /* #3 Social Bar — right above </body> per Adsterra docs */
    if (A.ENABLE_SOCIALBAR && A.SOCIALBAR_SRC) {
      var s = document.createElement("script");
      s.setAttribute("data-cfasync", "false");
      s.src = A.SOCIALBAR_SRC;
      document.body.appendChild(s);
    }

    /* #2 Native Banner — inside the monetization section slot */
    if (A.SITE_NATIVE !== false && A.NATIVE_SRC) {
      var slot = document.getElementById("mn-native-slot");
      if (slot) {
        if (A.NATIVE_CONTAINER) slot.id = A.NATIVE_CONTAINER;
        var n = document.createElement("script");
        n.async = true;
        n.setAttribute("data-cfasync", "false");
        n.src = A.NATIVE_SRC;
        slot.parentNode.insertBefore(n, slot);
      }
    }

    /* #4 Smartlink — "Support us" button in the footer */
    if (A.SITE_SUPPORT_BTN !== false && A.SMARTLINK_URL) {
      var fb = document.querySelector("footer .foot-bottom");
      if (fb) {
        var a = document.createElement("a");
        a.href = A.SMARTLINK_URL;
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = "🌙 Support M🌓🌓N";
        var supCss = document.createElement("style");
        supCss.textContent =
          ".mn-support{display:inline-block;background:#ffd65a;color:#14151a;font-weight:800;font-size:13px;border-radius:999px;padding:8px 18px;margin:4px 0;transition:.2s}" +
          ".mn-support:hover{transform:translateY(-1px);filter:brightness(1.05)}";
        document.head.appendChild(supCss);
        a.className = "mn-support";
        fb.insertBefore(a, fb.firstChild);
      }
    }
  }

  /* ---- 3. Footer contact/socials + WhatsApp float button ---- */
  function render() {
    var C = (window.CFG && window.CFG.CONTACT) || {};
    var S = ((window.CFG && window.CFG.SOCIALS) || []).filter(function (x) {
      return x && x.url && String(x.url).trim();
    });
    var items = [];
    if (C.email && C.email.trim())
      items.push('<a class="mn-contact" href="mailto:' + esc(C.email.trim()) + '">&#9993; <span>' + esc(C.email.trim()) + "</span></a>");
    if (C.whatsapp && C.whatsapp.trim())
      items.push('<a class="mn-contact" href="https://wa.me/' + esc(C.whatsapp.trim()) + '" target="_blank" rel="noopener">&#128172; <span>WhatsApp</span></a>");
    if (C.telegram && C.telegram.trim()) {
      var tg = String(C.telegram.trim()).replace(/^@/, "");
      items.push('<a class="mn-contact" href="https://t.me/' + esc(tg) + '" target="_blank" rel="noopener">&#9992; <span>Telegram</span></a>");
    }
    if (C.phone && C.phone.trim())
      items.push('<a class="mn-contact" href="tel:' + esc(C.phone.trim()) + '">&#128222; <span>' + esc(C.phone.trim()) + "</span></a>");

    var pills = S.map(function (x) {
      return '<a class="mn-social" href="' + esc(x.url.trim()) + '" target="_blank" rel="noopener">' + esc(x.label) + "</a>";
    }).join("");

    var html = "";
    if (items.length)
      html += '<div class="mn-row"><h4>Contact us</h4><div class="mn-contacts">' + items.join("") + "</div></div>";
    if (pills)
      html += '<div class="mn-row"><h4>Follow M&#x1F313;&#x1F313;N</h4><div class="mn-socials">' + pills + "</div></div>";
    if (!html) return;

    var css = [
      ".mn-contactbar{padding-top:6px;padding-bottom:26px;display:grid;grid-template-columns:1fr 1fr;gap:28px}",
      ".mn-contactbar .mn-row h4{color:#fff;font-size:15px;margin-bottom:12px}",
      ".mn-contacts{display:flex;flex-wrap:wrap;gap:10px 18px}",
      ".mn-contact{display:inline-flex;align-items:center;gap:7px;color:#c9cede;font-size:14px;padding:6px 12px;border:1px solid #2a2c35;border-radius:999px;transition:.2s}",
      ".mn-contact:hover{color:#fff;border-color:#16c76a;transform:translateY(-1px)}",
      ".mn-socials{display:flex;flex-wrap:wrap;gap:10px}",
      ".mn-social{color:#dfe3f0;font-size:13.5px;font-weight:600;border:1px solid rgba(255,255,255,.22);border-radius:999px;padding:7px 16px;transition:.2s;background:rgba(255,255,255,.04)}",
      ".mn-social:hover{background:#16c76a;border-color:#16c76a;color:#fff;transform:translateY(-1px)}",
      ".mn-wa-fab{position:fixed;right:22px;bottom:70px;z-index:9998;width:56px;height:56px;border-radius:50%;background:#25d366;display:grid;place-items:center;box-shadow:0 8px 24px rgba(37,211,102,.45);transition:.2s}",
      ".mn-wa-fab:hover{transform:scale(1.08)}",
      "@media(max-width:760px){.mn-contactbar{grid-template-columns:1fr;gap:20px}.mn-wa-fab{bottom:70px}}"
    ].join("\n");
    var st = document.createElement("style");
    st.textContent = css;
    document.head.appendChild(st);

    var block = document.createElement("div");
    block.className = "container mn-contactbar";
    block.innerHTML = html;
    var footer = document.querySelector("footer");
    if (footer) {
      var bottom = footer.querySelector(".foot-bottom");
      if (bottom && bottom.parentElement) bottom.parentElement.insertBefore(block, bottom);
      else footer.appendChild(block);
    }

    if (C.whatsapp && C.whatsapp.trim()) {
      var fab = document.createElement("a");
      fab.href = "https://wa.me/" + C.whatsapp.trim();
      fab.target = "_blank";
      fab.rel = "noopener";
      fab.className = "mn-wa-fab";
      fab.title = "Chat with us on WhatsApp";
      fab.innerHTML = '<svg viewBox="0 0 32 32" width="30" height="30"><path fill="#fff" d="M16 3C9.4 3 4 8.3 4 14.9c0 2.6.8 5 2.3 7L4.5 28l6.3-1.7c1.9 1 4 1.6 5.2 1.6 6.6 0 12-5.3 12-11.9S22.6 3 16 3zm5.9 16.8c-.3.8-1.5 1.5-2.4 1.6-.6.1-1.4.2-4.1-.9-3.4-1.4-5.6-4.9-5.8-5.1-.2-.2-1.4-1.9-1.4-3.6s.9-2.6 1.3-2.9c.3-.3.7-.4 1-.4h.7c.2 0 .5-.1.8.6.3.8 1.1 2.6 1.2 2.8.1.2.2.4 0 .7-.1.3-.2.4-.4.7l-.6.7c-.2.2-.4.4-.2.8.2.4 1 1.7 2.2 2.7 1.5 1.4 2.8 1.8 3.2 2 .4.2.6.2.8-.1.2-.2.9-1 1.1-1.4.2-.4.5-.3.8-.2.3.1 2.1 1 2.4 1.2.4.2.6.3.7.5.1.1.1.9-.2 1.7z"/></svg>';
      document.body.appendChild(fab);
    }
  }

  function boot() {
    pushPlatform();
    siteAds();
    render();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else
    boot();
})();
