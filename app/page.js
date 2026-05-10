"use client";
import { useState, useEffect, useRef } from "react";

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
// ── CROC THEME — from gouache illustration ─────────────────────────────
// Sky blue bg · croc green · coke red · yellow belly · ink outline
const T = {
  bg:      "#EFF9F0",   // very light mint
  card:    "#FFFFFF",
  ink:     "#1A2E1F",   // dark green-black (outline color)
  ink2:    "#2D4835",
  muted:   "#6B8872",
  border:  "#B8DEC0",
  border2: "#8FBF9A",

  // Croc palette
  green:   "#3EAF5E",   // croc body green
  greenlt: "#6DCF88",
  greenbg: "#D4F5DF",
  red:     "#D93025",   // coke red
  redbg:   "#FFE5E3",
  yellow:  "#F5C842",   // croc belly yellow
  yellowbg:"#FFF9DD",
  purple:  "#7B52AB",
  purplebg:"#EDE7F6",
  blue:    "#3AAEDB",   // sky blue
  bluebg:  "#E0F5FF",
  sky:     "#5BC8F5",

  // Invoice theme
  navy:    "#0D1B3E",
  invRed:  "#C0392B",
  gold:    "#E8C97A",
};

// ── SUPABASE CLIENT ───────────────────────────────────────────────────────────
const SB_URL = "https://snjbfdgjvdcogmdxuetl.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuamJmZGdqdmRjb2dtZHh1ZXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNjQ3NzEsImV4cCI6MjA5Mzk0MDc3MX0.PmrsxdtLRzlGXzMEPyJLea0nt2xCBNoNv5_OSS3vkCg";

async function sbFetch(path, opts={}) {
  const res = await fetch(SB_URL + "/rest/v1" + path, {
    headers: {
      "apikey": SB_KEY,
      "Authorization": "Bearer " + SB_KEY,
      "Content-Type": "application/json",
      "Prefer": opts.prefer || "return=representation",
      ...opts.headers,
    },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase ${res.status}: ${err}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

// CRUD helpers
const sb = {
  // SELECT all rows
  getAll: (table, order="created_at.desc") =>
    sbFetch(`/${table}?order=${order}&limit=1000`),

  // INSERT one row
  insert: (table, row) =>
    sbFetch(`/${table}`, { method:"POST", body:JSON.stringify(row) }),

  // UPSERT (insert or update by id)
  upsert: (table, row) =>
    sbFetch(`/${table}`, {
      method:"POST", body:JSON.stringify(row),
      prefer:"resolution=merge-duplicates,return=representation",
      headers: { "Prefer":"resolution=merge-duplicates,return=representation" }
    }),

  // UPDATE by id
  update: (table, id, data) =>
    sbFetch(`/${table}?id=eq.${id}`, { method:"PATCH", body:JSON.stringify(data) }),

  // DELETE by id
  delete: (table, id) =>
    sbFetch(`/${table}?id=eq.${id}`, { method:"DELETE", prefer:"" }),

  // DELETE all in table
  deleteAll: (table) =>
    sbFetch(`/${table}?id=neq.00000000-0000-0000-0000-000000000000`, { method:"DELETE", prefer:"" }),
};


// ── SUPABASE AUTH ─────────────────────────────────────────────────────────────
const SB_AUTH_URL = "https://snjbfdgjvdcogmdxuetl.supabase.co/auth/v1";

async function sbAuth(action, email, password) {
  // action: "token?grant_type=password" for login, "signup" for register
  const res = await fetch(`${SB_AUTH_URL}/${action}`, {
    method: "POST",
    headers: {
      "apikey": SB_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || data.error_description || "Lỗi xác thực");
  return data;
}


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=Nunito+Sans:wght@400;500;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:${T.bg};font-family:'Nunito Sans',sans-serif;color:${T.ink};-webkit-font-smoothing:antialiased;overscroll-behavior:none;background-image:radial-gradient(circle at 20% 20%,rgba(91,200,245,.07) 0%,transparent 50%),radial-gradient(circle at 80% 80%,rgba(62,175,94,.06) 0%,transparent 50%)}
.app{max-width:430px;margin:0 auto;min-height:100dvh;background:${T.bg};position:relative}
.page-bg{position:relative}
.page-bg::before{content:'🐸';position:fixed;top:12px;right:12px;font-size:28px;opacity:.08;pointer-events:none;z-index:0}
.page-bg::after{content:'';position:fixed;bottom:100px;left:0;width:120px;height:120px;border-radius:0 120px 120px 0;background:linear-gradient(135deg,rgba(62,175,94,.06),rgba(91,200,245,.04));pointer-events:none;z-index:0}

/* CARD — chunky outline style like illustration */
.card{background:${T.card};border-radius:18px;border:2.5px solid ${T.ink};box-shadow:3px 3px 0 ${T.ink};padding:16px}
.card-ink{background:${T.ink};border-color:${T.ink}}
.card-green{background:${T.greenbg};border-color:${T.green};box-shadow:3px 3px 0 ${T.green}}
.card-red{background:${T.redbg};border-color:${T.red};box-shadow:3px 3px 0 ${T.red}}
.card-yellow{background:${T.yellowbg};border-color:${T.yellow};box-shadow:3px 3px 0 rgba(0,0,0,.12)}
.card-purple{background:${T.purplebg};border-color:${T.purple};box-shadow:3px 3px 0 ${T.purple}}
.card-blue{background:${T.bluebg};border-color:${T.blue};box-shadow:3px 3px 0 ${T.blue}}

/* HEADER — sky blue like illustration background */
.hdr{background:${T.sky};padding:52px 20px 20px;position:relative;overflow:hidden;border-bottom:3px solid ${T.ink}}
.hdr::before{content:'🐸';position:absolute;right:16px;top:50%;transform:translateY(-50%);font-size:44px;opacity:.12;pointer-events:none}.hdr::after{content:'✦';position:absolute;left:20px;bottom:14px;font-size:16px;color:rgba(255,255,255,.15);pointer-events:none}
.hdr-eye{font-family:'Nunito',sans-serif;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${T.ink};opacity:.6;margin-bottom:4px}
.hdr-h1{font-family:'Nunito',sans-serif;font-size:26px;font-weight:900;color:${T.ink};line-height:1.1}
.hdr-sub{font-size:12px;font-weight:700;color:${T.ink};opacity:.6;margin-top:5px}
.hdr-badge{display:inline-flex;align-items:center;gap:4px;background:rgba(255,255,255,.5);border:2px solid ${T.ink};border-radius:20px;padding:4px 10px;font-size:11px;font-weight:800;color:${T.ink};margin-top:8px}

/* NAV — dark ink base */
.bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:${T.ink};border-top:3px solid ${T.ink};display:flex;justify-content:space-around;padding:10px 4px 22px;z-index:100}
.nb{display:flex;flex-direction:column;align-items:center;gap:3px;color:rgba(255,255,255,.35);font-size:9px;font-weight:800;font-family:'Nunito',sans-serif;text-transform:uppercase;letter-spacing:.5px;background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:10px;transition:color .15s}
.nb.on{color:${T.yellow}}
.nb svg{width:20px;height:20px;stroke-width:2.5}

/* FAB — coke red */
.fab{position:fixed;bottom:86px;right:calc(50% - 215px + 18px);width:50px;height:50px;border-radius:50%;background:${T.red};border:3px solid ${T.ink};box-shadow:4px 4px 0 ${T.ink};display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:99;transition:transform .12s,box-shadow .12s}
.fab:active{transform:translate(3px,3px);box-shadow:1px 1px 0 ${T.ink}}
.fab svg{width:22px;height:22px;stroke:#fff;stroke-width:2.5}
.fab-menu{position:fixed;bottom:146px;right:calc(50% - 215px + 18px);display:flex;flex-direction:column;gap:8px;z-index:98;align-items:flex-end;animation:fabIn .2s ease}
@keyframes fabIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.fab-item{display:flex;align-items:center;gap:10px;cursor:pointer}
.fab-item-btn{background:${T.card};border:2.5px solid ${T.ink};border-radius:14px;padding:10px 16px;font-family:'Nunito',sans-serif;font-size:13px;font-weight:900;color:${T.ink};white-space:nowrap;box-shadow:3px 3px 0 ${T.ink};transition:all .1s}
.fab-item-btn:active{transform:translate(2px,2px);box-shadow:1px 1px 0 ${T.ink}}
.fab-dot{width:38px;height:38px;border-radius:50%;border:2.5px solid ${T.ink};display:flex;align-items:center;justify-content:center;font-size:16px;background:${T.card};box-shadow:3px 3px 0 ${T.ink}}

/* MODAL / SHEET */
.overlay{position:fixed;inset:0;background:rgba(26,46,31,.65);z-index:200;display:flex;align-items:flex-end;justify-content:center;animation:fi .2s ease;backdrop-filter:blur(2px)}
@keyframes fi{from{opacity:0}to{opacity:1}}
.sheet{background:${T.bg};border-radius:26px 26px 0 0;border-top:3px solid ${T.ink};border-left:3px solid ${T.ink};border-right:3px solid ${T.ink};padding:20px 18px 48px;width:100%;max-width:430px;max-height:92dvh;overflow-y:auto;animation:su .28s cubic-bezier(.32,.72,0,1)}
@keyframes su{from{transform:translateY(100%)}to{transform:translateY(0)}}
.drag-h{width:40px;height:5px;background:${T.border2};border-radius:3px;border:1.5px solid ${T.ink};margin:0 auto 20px}
.sheet-title{font-family:'Nunito',sans-serif;font-size:20px;font-weight:900;color:${T.ink};margin-bottom:16px}

/* FORM */
.f{margin-bottom:12px}
.f label{display:block;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:${T.muted};margin-bottom:5px}
.f input,.f select,.f textarea{width:100%;padding:11px 14px;border-radius:12px;border:2px solid ${T.ink};background:${T.card};font-family:'Nunito Sans',sans-serif;font-size:14px;font-weight:600;color:${T.ink};outline:none;box-shadow:2px 2px 0 ${T.ink};transition:border-color .15s,box-shadow .15s}
.f input:focus,.f select:focus,.f textarea:focus{border-color:${T.green};box-shadow:3px 3px 0 ${T.green}}
.f textarea{resize:vertical;min-height:72px}

/* BTN — chunky with offset shadow */
.btn{width:100%;padding:13px;border-radius:13px;border:2.5px solid ${T.ink};font-family:'Nunito',sans-serif;font-size:14px;font-weight:900;cursor:pointer;box-shadow:3px 3px 0 ${T.ink};transition:transform .1s,box-shadow .1s;letter-spacing:.2px}
.btn:active{transform:translate(2px,2px);box-shadow:1px 1px 0 ${T.ink}}
.btn-primary{background:${T.ink};color:#fff}
.btn-green{background:${T.green};color:#fff}
.btn-red{background:${T.red};color:#fff}
.btn-yellow{background:${T.yellow};color:${T.ink}}
.btn-ghost{background:transparent;color:${T.muted};border:2px solid ${T.border2};box-shadow:none}
.btn-outline{background:transparent;color:${T.ink};border:2px solid ${T.ink};box-shadow:2px 2px 0 ${T.ink}}
.xs{width:auto;padding:7px 13px;border-radius:10px;font-size:12px;font-weight:800;border:2px solid ${T.ink};font-family:'Nunito',sans-serif;cursor:pointer;box-shadow:2px 2px 0 ${T.ink};transition:all .1s;background:${T.card};color:${T.ink}}
.xs:active{transform:translate(2px,2px);box-shadow:0 0}
.xs-green{background:${T.greenbg};color:${T.green};border-color:${T.green};box-shadow:2px 2px 0 ${T.green}}
.xs-red{background:${T.redbg};color:${T.red};border-color:${T.red};box-shadow:2px 2px 0 ${T.red}}
.xs-yellow{background:${T.yellowbg};color:#7A5000;border-color:${T.yellow};box-shadow:2px 2px 0 rgba(0,0,0,.1)}
.xs-purple{background:${T.purplebg};color:${T.purple};border-color:${T.purple};box-shadow:2px 2px 0 ${T.purple}}

/* BADGE */
.bd{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;border:1.5px solid ${T.ink};font-size:10px;font-weight:800;font-family:'Nunito',sans-serif}
.bd-paid{background:${T.greenbg};color:${T.green}}
.bd-pend{background:${T.yellowbg};color:#7A5000}
.bd-new{background:${T.bluebg};color:${T.blue}}
.bd-view{background:${T.purplebg};color:${T.purple}}
.bd-can{background:${T.redbg};color:${T.red}}
.bd-confirm{background:${T.greenbg};color:${T.green}}

/* TAG */
.tg{display:inline-flex;align-items:center;padding:2px 8px;border-radius:8px;border:1.5px solid ${T.ink};font-size:10px;font-weight:800;margin-right:4px;margin-top:3px;font-family:'Nunito',sans-serif}
.tg-vip{background:${T.yellow};color:#7A5000}
.tg-new{background:${T.greenbg};color:${T.green}}
.tg-fu{background:#FCE4EC;color:#AD1457}
.tg-old{background:${T.bluebg};color:${T.blue}}
.tg-tip{background:${T.purplebg};color:${T.purple}}

/* ROW */
.row{background:${T.card};border-radius:15px;border:2px solid ${T.ink};box-shadow:3px 3px 0 ${T.ink};padding:13px 14px;display:flex;align-items:center;gap:12px;margin-bottom:9px;cursor:pointer;transition:transform .1s,box-shadow .1s,background .1s}
.row:hover{background:#F8FFF9}
.row:active{transform:translate(2px,2px);box-shadow:1px 1px 0 ${T.ink}}
.ava{width:40px;height:40px;border-radius:12px;border:2px solid ${T.ink};box-shadow:2px 2px 0 ${T.ink};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;background:${T.bg}}

/* METRIC */
.metric-big{background:${T.ink};border-radius:18px;border:2.5px solid ${T.ink};box-shadow:4px 4px 0 ${T.green};padding:20px;position:relative;overflow:hidden}
.metric-big::after{content:'';position:absolute;right:-20px;top:-20px;width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,.04)}
.metric-label{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,.5);margin-bottom:6px}
.metric-value{font-family:'Nunito',sans-serif;font-size:32px;font-weight:900;color:#fff;line-height:1}
.metric-sub{font-size:11px;font-weight:700;color:rgba(255,255,255,.5);margin-top:5px}
.metric-sm{background:${T.card};border-radius:14px;border:2px solid ${T.ink};box-shadow:3px 3px 0 ${T.ink};padding:14px}
.metric-sm-label{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${T.muted};margin-bottom:5px}
.metric-sm-value{font-family:'Nunito',sans-serif;font-size:22px;font-weight:900;color:${T.ink};line-height:1}
.metric-sm-sub{font-size:11px;font-weight:600;color:${T.muted};margin-top:3px}

/* ACTION CARD */
.action-card{background:${T.card};border-radius:14px;border:2px solid ${T.ink};box-shadow:3px 3px 0 ${T.ink};padding:14px;margin-bottom:9px}
.action-card-red{border-left:5px solid ${T.red};background:${T.redbg};box-shadow:3px 3px 0 ${T.red}}
.action-card-yellow{border-left:5px solid ${T.yellow};background:${T.yellowbg};box-shadow:3px 3px 0 rgba(0,0,0,.08)}
.action-card-green{border-left:5px solid ${T.green};background:${T.greenbg};box-shadow:3px 3px 0 ${T.green}}
.action-card-purple{border-left:5px solid ${T.purple};background:${T.purplebg};box-shadow:3px 3px 0 ${T.purple}}

/* SEC */
.sec{padding:16px 16px 0}
.sec-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.sec-t{font-family:'Nunito',sans-serif;font-size:15px;font-weight:900;color:${T.ink}}
.sec-a{font-size:12px;font-weight:800;color:${T.green};cursor:pointer;text-decoration:underline;text-underline-offset:2px}

/* SEARCH */
.sb{width:calc(100% - 32px);margin:12px 16px 0;padding:11px 16px 11px 40px;border-radius:13px;border:2px solid ${T.ink};box-shadow:3px 3px 0 ${T.ink};background:${T.card} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' fill='none' viewBox='0 0 24 24' stroke='%236B8872' stroke-width='2.5'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E") no-repeat 13px center;font-family:'Nunito Sans',sans-serif;font-size:14px;font-weight:700;color:${T.ink};outline:none}
.sb:focus{border-color:${T.green};box-shadow:3px 3px 0 ${T.green}}

/* PILL */
.pill-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.pill{padding:6px 13px;border-radius:20px;border:2px solid ${T.ink};font-size:12px;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;box-shadow:2px 2px 0 ${T.ink};transition:all .1s;background:${T.card};color:${T.ink}}
.pill.on{background:${T.ink};color:#fff}
.pill:active{transform:translate(2px,2px);box-shadow:0 0}

/* TOGGLE */
.tog{width:40px;height:22px;border-radius:11px;border:2px solid ${T.ink};position:relative;cursor:pointer;flex-shrink:0;transition:background .2s}
.tog.on{background:${T.green}}
.tog.off{background:${T.border}}
.tog::after{content:'';position:absolute;top:2px;width:14px;height:14px;border-radius:50%;background:#fff;border:1.5px solid ${T.ink};transition:left .18s;box-shadow:1px 1px 2px rgba(0,0,0,.15)}
.tog.on::after{left:20px}
.tog.off::after{left:2px}

/* BAR CHART */
.bc{display:flex;align-items:flex-end;gap:5px;height:84px}
.bcol{display:flex;flex-direction:column;align-items:center;flex:1;gap:4px}
.bbar{border-radius:7px 7px 0 0;width:100%;min-height:4px;border:1.5px solid ${T.ink};transition:height .5s cubic-bezier(.34,1.2,.64,1)}
.blbl{font-size:9px;font-weight:800;color:${T.muted};text-transform:uppercase}

/* RBAR */
.rb-row{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.rb-lbl{font-size:12px;font-weight:700;color:${T.ink};min-width:90px}
.rb-track{flex:1;height:10px;background:${T.border};border-radius:6px;border:1.5px solid ${T.ink};overflow:hidden}
.rb-fill{height:100%;border-radius:4px;transition:width .6s}
.rb-val{font-family:'Nunito',sans-serif;font-size:12px;font-weight:900;color:${T.ink};min-width:44px;text-align:right}

/* CALENDAR */
.cal-hd{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;padding:0 16px;margin-bottom:6px}
.cal-dh{text-align:center;font-size:10px;font-weight:800;color:${T.muted};text-transform:uppercase}
.cal-g{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;padding:0 16px}
.cd{aspect-ratio:1;display:flex;align-items:center;justify-content:center;border-radius:10px;font-size:13px;font-weight:800;cursor:pointer;transition:all .12s;position:relative;font-family:'Nunito',sans-serif;color:${T.ink}}
.cd:hover{background:rgba(91,200,245,.3)}
.cd.today{background:${T.ink};color:#fff;border:2px solid ${T.ink};box-shadow:2px 2px 0 ${T.green}}
.cd.has::after{content:'';position:absolute;bottom:2px;left:50%;transform:translateX(-50%);width:5px;height:5px;border-radius:50%;background:${T.red};border:1px solid ${T.ink}}

/* INVOICE */
.inv-wrap{background:linear-gradient(160deg,#0D1B3E 0%,#1a2d5a 100%);border-radius:18px;overflow:hidden;border:2px solid rgba(232,201,122,.3)}

/* TOAST */
.toast{position:fixed;top:20px;left:50%;transform:translateX(-50%);background:${T.ink};color:${T.yellow};padding:10px 20px;border-radius:50px;border:2.5px solid ${T.yellow};font-family:'Nunito',sans-serif;font-size:13px;font-weight:800;z-index:999;white-space:nowrap;box-shadow:4px 4px 0 ${T.yellow};animation:tst .3s cubic-bezier(.34,1.2,.64,1)}
@keyframes tst{from{opacity:0;top:10px}to{opacity:1;top:20px}}

/* EMPTY STATE */
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px;text-align:center}
.empty-ico{font-size:48px;margin-bottom:12px;opacity:.5}
.empty-title{font-family:'Nunito',sans-serif;font-size:16px;font-weight:900;color:${T.muted};margin-bottom:6px}
.empty-sub{font-size:13px;color:${T.muted};font-weight:600}

/* LOGIN */
.login-bg{min-height:100dvh;background:linear-gradient(160deg,${T.sky} 0%,#8DDAF8 50%,${T.greenbg} 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 24px;position:relative;overflow:hidden}
.login-bg::before{content:'🐸';position:absolute;font-size:260px;opacity:.07;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;line-height:1}
.login-bg::after{content:'';position:absolute;width:200px;height:200px;border-radius:50%;background:rgba(62,175,94,.15);bottom:-60px;left:-60px;pointer-events:none}

/* MISC */
.scroll-body{padding-bottom:100px}
.divider{height:1px;background:${T.border};margin:12px 0}
.ico-pick{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
.ico-btn{width:36px;height:36px;border-radius:9px;font-size:18px;cursor:pointer;transition:all .1s;display:flex;align-items:center;justify-content:center;border:1.5px solid ${T.ink}}
`;

// ── ICONS ─────────────────────────────────────────────────────────────────────
const I = {
  home:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  order: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  cal:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  msg:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  chart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  cog:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  plus:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  x:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  chk:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>,
  bell:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  send:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  rec:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16l4-2 4 2 4-2 4 2V8z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  arr:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="9 18 15 12 9 6"/></svg>,
};

// ── HELPERS ───────────────────────────────────────────────────────────────────
const vnd = n => Number(n||0).toLocaleString("vi-VN") + "đ";
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,5);
const todayStr = () => new Date().toLocaleDateString("vi-VN",{day:"2-digit",month:"2-digit",year:"numeric"});
const nowStr = () => new Date().toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"});
const calcQ = (q, p1, p6) => { const n=parseInt(q)||0; if(!n) return 0; return n<=5?n*p1:5*p1+(n-5)*(p6||p1); };
const calcOrderTotal = (items, extraQ, services) => {
  let t = 0;
  (items||[]).forEach(it => {
    const s = services.find(x=>x.id===it.svcId); if(!s) return;
    t += s.type==="fixed" ? s.price : calcQ(it.qty, s.price, s.price6);
  });
  t += calcQ(extraQ, 20000, 15000);
  return t;
};
const STATUS_MAP = { new:["MỚI","bd-new"], view:["ĐANG XEM","bd-view"], done:["XONG","bd-pend"], paid:["ĐÃ TT","bd-paid"], cancel:["HỦY","bd-can"] };
const STATUS_FLOW = ["new","view","done","paid","cancel"];
const GROUPS = ["Tình yêu","Hôn nhân / Ex","Sự nghiệp","Tài chính","Gia đình","Sức khỏe","Tổng quát"];
const AVAS = ["🌙","🌸","⭐","🦋","🌺","🌊","💫","🔮","🌈","🎴","🌿","🪷"];
const ICOS = ["💜","⭐","🌙","✨","🔮","🌟","🌸","🦋","🌈","🎴","🌊","🔥"];
const REPLIES = [
  {id:"r1",hash:"#menu",   title:"Menu dịch vụ",       body:"✨ MITCHI THE MIGHTY ✨\nTarot & Lenormand Reader\n\nInbox để đặt lịch nha bạn 🌙",images:[]},
  {id:"r2",hash:"#baogia", title:"Báo giá",             body:"Chào bạn! ✨\nGiá xem của Mitchi:\n• 5 câu đầu: 20.000đ/câu = 100.000đ\n• Từ câu 6+: 15.000đ/câu 💜",images:[]},
  {id:"r3",hash:"#thanhtoan",title:"Nhắc thanh toán",  body:"Bạn ơi đây là hóa đơn xem bài nhé! 🌙\nBạn chuyển khoản giúp Mitchi với nha 💜",images:[]},
  {id:"r4",hash:"#trabai",  title:"Trả kết quả",       body:"Mitchi đã xem xong cho bạn rồi nhé! ✨\n[Đính kèm ảnh kết quả + hóa đơn]\nCó thắc mắc gì cứ nhắn Mitchi nha 🌙",images:[]},
  {id:"r5",hash:"#camon",   title:"Cảm ơn",            body:"Cảm ơn bạn đã tin tưởng Mitchi! 💜✨\nMong bài mang năng lượng tích cực cho bạn~",images:[]},
  {id:"r6",hash:"#followup",title:"Follow-up",         body:"Dạo này bạn thế nào rồi? 🌙\nMitchi đang nghĩ đến bạn ~\nNếu có chuyện cần chia sẻ hay xem bài, cứ nhắn Mitchi nha 💜",images:[]},
];
const WEEK_DAYS = ["T2","T3","T4","T5","T6","T7","CN"];
const WEEK_COLORS = [T.green, T.blue, T.yellow, T.green, "#52B788", T.purple, T.red];

// ── SEED DATA ─────────────────────────────────────────────────────────────────
const SEED_SVCS = [];
const SEED_CUSTS = [];
const SEED_ORDERS = [];
const SEED_BOOKINGS = [];

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
function Badge({s}) {
  const [t,c] = STATUS_MAP[s]||["?","bd-new"];
  return <span className={`bd ${c}`}>{t}</span>;
}

function DragHandle() { return <div className="drag-h"/>; }

function EmptyState({ico, title, sub, action, onAction}) {
  return(
    <div className="empty">
      <div className="empty-ico">{ico}</div>
      <div className="empty-title">{title}</div>
      {sub&&<div className="empty-sub">{sub}</div>}
      {action&&<button className="btn btn-primary" style={{marginTop:16,width:"auto",padding:"10px 20px"}} onClick={onAction}>{action}</button>}
    </div>
  );
}

// ── ORDER FORM ────────────────────────────────────────────────────────────────
function OrderForm({order, customers, services, onSave, onClose, defaultCustId, topics}) {
  const isEdit = !!order;
  const [custId, setCustId] = useState(order?.custId || defaultCustId || "");
  const [items,  setItems]  = useState(order?.items  || [{svcId:"",qty:"",groups:[]}]);
  const [extraQ, setExtraQ] = useState(order?.extraQ || 0);
  const [notes,  setNotes]  = useState(order?.notes  || "");
  const [status, setStatus] = useState(order?.status || "new");
  const [oDate,  setODate]  = useState(order?.date   || todayStr());
  const [oTime,  setOTime]  = useState(order?.time   || nowStr());
  const [err,    setErr]    = useState("");

  const addItem = () => setItems(p=>[...p,{svcId:"",qty:"",group:""}]);
  const updItem = (i,k,v) => setItems(p=>p.map((x,j)=>j===i?{...x,[k]:v}:x));
  const delItem = (i) => setItems(p=>p.filter((_,j)=>j!==i));

  const total = calcOrderTotal(items, extraQ, services);

  const save = () => {
    if (!custId) { setErr("Chọn khách hàng!"); return; }
    if (items.every(it=>!it.svcId)) { setErr("Chọn ít nhất 1 dịch vụ!"); return; }
    setErr("");
    onSave({
      id: order?.id || uid(),
      custId, items: items.filter(it=>it.svcId),
      extraQ: parseInt(extraQ)||0,
      total, tips: order?.tips||0,
      status, notes,
      date: oDate || todayStr(),
      time: oTime || nowStr(),
    });
  };

  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet">
        <DragHandle/>
        <div className="sheet-title">{isEdit?"Sửa đơn":"Tạo đơn mới"}</div>

        <div className="f">
          <label>Khách hàng</label>
          <select value={custId} onChange={e=>setCustId(e.target.value)}>
            <option value="">Chọn khách...</option>
            {customers.map(c=><option key={c.id} value={c.id}>{c.ava} {c.name} – {c.nick}</option>)}
          </select>
        </div>

        <div className="f">
          <label>Gói / Dịch vụ đã xem</label>
          {items.map((it,i)=>{
            const svc = services.find(s=>s.id===it.svcId);
            return(
              <div key={i} style={{background:T.greenbg,borderRadius:12,border:`1px solid ${T.border}`,padding:12,marginBottom:8}}>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <select style={{flex:1,padding:"9px 10px",borderRadius:10,border:`1.5px solid ${T.border2}`,background:T.card,fontFamily:"Nunito Sans",fontSize:13,fontWeight:600,outline:"none",color:T.ink}}
                    value={it.svcId} onChange={e=>updItem(i,"svcId",e.target.value)}>
                    <option value="">Chọn dịch vụ...</option>
                    {services.filter(s=>s.active).map(s=>(
                      <option key={s.id} value={s.id}>{s.ico} {s.name} — {s.type==="fixed"?vnd(s.price):`${s.price/1000}k/câu`}</option>
                    ))}
                  </select>
                  {items.length>1&&<button className="xs xs-red" onClick={()=>delItem(i)}>✕</button>}
                </div>
                {svc?.type==="per_q"&&(
                  <input type="number" min="1" placeholder="Số câu hỏi" value={it.qty} onChange={e=>updItem(i,"qty",e.target.value)}
                    style={{width:"100%",padding:"9px 12px",borderRadius:10,border:`1.5px solid ${T.border2}`,background:T.card,fontFamily:"Nunito Sans",fontSize:13,fontWeight:600,outline:"none",marginBottom:8,color:T.ink}}/>
                )}
                <div style={{marginTop:4}}>
                  <div style={{fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Chủ đề câu hỏi (chọn nhiều)</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {(topics||[]).map(g=>{
                      const selected=(it.groups||[]).includes(g);
                      return(
                        <button key={g} type="button"
                          onClick={()=>{
                            const cur=it.groups||[];
                            updItem(i,"groups",selected?cur.filter(x=>x!==g):[...cur,g]);
                          }}
                          style={{padding:"5px 11px",borderRadius:20,border:`1.5px solid ${selected?T.green:T.border2}`,background:selected?T.greenbg:T.card,fontFamily:"Nunito",fontWeight:700,fontSize:11,cursor:"pointer",color:selected?T.green:T.muted,transition:"all .12s"}}>
                          {selected?"✓ ":""}{g}
                        </button>
                      );
                    })}
                  </div>
                  {(it.groups||[]).length>0&&(
                    <div style={{fontSize:11,color:T.green,fontWeight:700,marginTop:6}}>
                      Đã chọn: {(it.groups||[]).join(", ")}
                    </div>
                  )}
                </div>
                {svc&&it.qty&&svc.type==="per_q"&&(
                  <div style={{fontSize:12,fontWeight:700,color:T.green,marginTop:6,textAlign:"right"}}>
                    → {vnd(calcQ(it.qty,svc.price,svc.price6))}
                  </div>
                )}
                {svc?.type==="fixed"&&<div style={{fontSize:12,fontWeight:700,color:T.green,marginTop:6,textAlign:"right"}}>→ {vnd(svc.price)}</div>}
              </div>
            );
          })}
          <button className="xs xs-green" onClick={addItem} style={{marginTop:4}}>+ Thêm dịch vụ</button>
        </div>

        <div className="f">
          <label>Câu hỏi lẻ thêm ngoài gói (20k/câu, từ câu 6: 15k)</label>
          <input type="number" min="0" placeholder="0 = không có" value={extraQ||""} onChange={e=>setExtraQ(e.target.value)}/>
          {extraQ>0&&<div style={{fontSize:12,fontWeight:700,color:T.green,marginTop:4}}>+ {vnd(calcQ(extraQ,20000,15000))}</div>}
        </div>

        {isEdit&&(
          <div className="f">
            <label>Trạng thái</label>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {STATUS_FLOW.map(s=>{
                const[t,c]=STATUS_MAP[s];
                return(
                  <button key={s} onClick={()=>setStatus(s)}
                    style={{padding:"7px 12px",borderRadius:10,border:`1.5px solid ${status===s?T.ink:T.border2}`,fontFamily:"Nunito",fontWeight:700,fontSize:11,cursor:"pointer",background:status===s?T.ink:"transparent",color:status===s?"#fff":T.muted,transition:"all .12s"}}>
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="f">
          <label>Ghi chú</label>
          <textarea placeholder="Ghi chú về buổi xem..." value={notes} onChange={e=>setNotes(e.target.value)}/>
        </div>

        <div style={{display:"flex",gap:8}}>
          <div className="f" style={{flex:1}}>
            <label>Ngày xem (có thể chọn quá khứ)</label>
            <input type="text" placeholder="DD/MM/YYYY" value={oDate}
              onChange={e=>setODate(e.target.value)}/>
          </div>
          <div className="f" style={{flex:1}}>
            <label>Giờ</label>
            <input type="time" value={oTime.replace(/[^0-9:]/g,"")||""}
              onChange={e=>{
                const t=e.target.value;
                if(t) setOTime(t.slice(0,5));
              }}/>
          </div>
        </div>

        {total>0&&(
          <div className="card card-green" style={{marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:12,fontWeight:700,color:T.green}}>TỔNG TIỀN</div>
            <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:22,color:T.ink}}>{vnd(total)}</div>
          </div>
        )}

        {err&&<div style={{color:T.red,fontSize:13,fontWeight:600,marginBottom:10}}>⚠️ {err}</div>}

        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <button className="btn btn-primary" style={{flex:2}} onClick={save}>{isEdit?"Lưu thay đổi":"Tạo đơn"}</button>
          <button className="btn btn-ghost" style={{flex:1}} onClick={onClose}>Huỷ</button>
        </div>
      </div>
    </div>
  );
}

// ── INVOICE VIEW ──────────────────────────────────────────────────────────────
function InvoiceView({order, cust, services, toast, onClose, shop}) {
  const [qr, setQr] = useState("acb");

  const rows = [];
  (order.items||[]).forEach(it => {
    const svc = services.find(s=>s.id===it.svcId); if(!svc) return;
    const q = parseInt(it.qty)||0;
    if (svc.type==="fixed") {
      rows.push({qty:1, desc:svc.name, unit:svc.price, total:svc.price, group:it.group});
    } else if (q<=5) {
      rows.push({qty:q, desc:`${svc.name} (trong 5 câu đầu)`, unit:svc.price, total:q*svc.price, group:it.group});
      rows.push({qty:0, desc:`${svc.name} (từ câu 6 trở đi)`, unit:svc.price6||svc.price, total:0, group:""});
    } else {
      rows.push({qty:5, desc:`${svc.name} (trong 5 câu đầu)`, unit:svc.price, total:5*svc.price, group:it.group});
      rows.push({qty:q-5, desc:`${svc.name} (từ câu 6 trở đi)`, unit:svc.price6||svc.price, total:(q-5)*(svc.price6||svc.price), group:""});
    }
  });
  if (parseInt(order.extraQ)>0) {
    const eq=parseInt(order.extraQ);
    rows.push({qty:Math.min(eq,5),desc:"Câu lẻ thêm (câu 1–5)",unit:20000,total:Math.min(eq,5)*20000,group:""});
    if(eq>5) rows.push({qty:eq-5,desc:"Câu lẻ thêm (câu 6+)",unit:15000,total:(eq-5)*15000,group:""});
  }

  const copyText = () => {
    const lines = rows.filter(r=>r.total>0).map(r=>`${r.qty} câu | ${r.desc} | ${vnd(r.unit)}/câu | ${vnd(r.total)}`).join("\n");
    const bankInfo = qr==="acb" ? {name:"ACB (Á Châu)",no:shop?.acbNo||"6205237",owner:shop?.acbName||"TON NU HONG CHAU"} : {name:"Vietcombank",no:shop?.vcbNo||"-",owner:shop?.vcbName||"TON NU HONG CHAU"}; const bank = `${bankInfo.name}\nSố TK: ${bankInfo.no}\nTên: ${bankInfo.owner}`;
    navigator.clipboard?.writeText(`🧾 HOÁ ĐƠN TẠM TÍNH — ${shop?.name||"MITCHI THE MIGHTY"}\n📅 ${order.date} ${order.time}\n👤 Khách: ${cust?.name}\n\n${lines}\n\n💰 TỔNG: ${vnd(order.total)}\n\n🏦 Ngân hàng: ${bank}\n\n✨ Xin cảm ơn quý khách — Hẹn gặp lại!`);
    toast("📋 Đã copy text hóa đơn!");
  };

  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet" style={{background:"#0a1628"}}>
        <DragHandle/>
        <div style={{fontFamily:"Nunito",fontSize:18,fontWeight:900,color:"#fff",marginBottom:16}}>🧾 Hóa Đơn</div>

        <div className="inv-wrap" id="inv-print-area">
          <div style={{height:5,background:`repeating-linear-gradient(90deg,${T.gold} 0,${T.gold} 4px,transparent 4px,transparent 10px)`,opacity:.6}}/>
          <div style={{padding:"18px 18px 14px",textAlign:"center",position:"relative"}}>
            <div style={{position:"absolute",top:10,left:12,color:T.gold,opacity:.6,fontSize:16}}>✦</div>
            <div style={{position:"absolute",top:10,right:12,color:T.gold,opacity:.6,fontSize:16}}>✦</div>
            <img src="/images/logo.jpg" alt="Logo" style={{width:80,height:80,objectFit:"contain",borderRadius:12,marginBottom:8,display:"block",margin:"0 auto 8px"}}
              onError={e=>{e.target.style.display="none";}}/>
            <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:16,color:"#fff",letterSpacing:1.5,textTransform:"uppercase"}}>{shop?.name||"MITCHI THE MIGHTY"}</div>
            <div style={{fontSize:11,color:T.gold,fontStyle:"italic",marginBottom:12}}>{shop?.tagline||"Tarot and Lenormand Reader"}</div>
            <div style={{borderTop:"1px dotted rgba(232,201,122,.3)",marginBottom:10}}/>
            <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:20,color:"#fff",marginBottom:10}}>HOÁ ĐƠN TẠM TÍNH</div>
            <div style={{display:"inline-block",background:T.invRed,borderRadius:50,padding:"6px 18px",fontSize:12,fontWeight:700,color:"#fff"}}>{order.date} · {order.time}</div>
          </div>

          <div style={{margin:"0 16px 12px",background:"rgba(255,255,255,.07)",borderRadius:10,padding:"8px 12px",border:"1px solid rgba(232,201,122,.15)"}}>
            <span style={{fontSize:14,fontWeight:700,color:"#fff"}}>Khách: {cust?.name}</span>
          </div>

          <div style={{margin:"0 16px 14px",borderRadius:10,overflow:"hidden",border:"1px solid rgba(232,201,122,.15)"}}>
            <div style={{display:"grid",gridTemplateColumns:"44px 1fr 76px 76px",background:T.invRed,padding:"9px 10px",gap:4}}>
              {["Câu","Mô tả","Giá","Tổng"].map(h=>(
                <div key={h} style={{fontSize:11,fontWeight:800,color:"#fff",fontStyle:"italic"}}>{h}</div>
              ))}
            </div>
            {rows.map((r,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"44px 1fr 76px 76px",padding:"8px 10px",gap:4,background:i%2===0?"rgba(255,255,255,.04)":"rgba(255,255,255,.02)",borderTop:"1px solid rgba(232,201,122,.08)"}}>
                <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:14,color:r.total>0?T.invRed:"rgba(255,255,255,.3)"}}>{r.qty}</div>
                <div>
                  <div style={{fontSize:11,fontWeight:600,color:"#fff",lineHeight:1.3}}>{r.desc}</div>
                  {(r.groups||[]).length>0&&<div style={{fontSize:9,color:T.gold,marginTop:2}}>📌 {(r.groups||[]).join(" · ")}</div>}
                  {r.group&&!(r.groups||[]).length&&<div style={{fontSize:9,color:T.gold,marginTop:2}}>📌 {r.group}</div>}
                </div>
                <div style={{fontSize:11,color:"rgba(255,255,255,.6)",fontWeight:600}}>{vnd(r.unit)}</div>
                <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:12,color:r.total>0?"#fff":"rgba(255,255,255,.3)"}}>{vnd(r.total)}</div>
              </div>
            ))}
            <div style={{display:"grid",gridTemplateColumns:"44px 1fr 76px 76px",padding:"10px",gap:4,background:"rgba(192,57,43,.15)",borderTop:"1px solid rgba(232,201,122,.25)"}}>
              <div/><div/>
              <div style={{fontSize:13,fontWeight:900,color:T.gold}}>Tổng</div>
              <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:13,color:T.invRed}}>{vnd(order.total)}</div>
            </div>
          </div>

          <div style={{margin:"0 16px 14px",background:"rgba(255,255,255,.06)",borderRadius:12,border:"1px solid rgba(232,201,122,.15)",padding:14,textAlign:"center"}}>
            <img src={qr==="acb"?"/images/qr-acb.jpg":"/images/qr-vcb.jpg"} alt="QR"
              style={{width:160,height:160,borderRadius:12,objectFit:"cover",border:`2px solid ${T.gold}`,display:"block",margin:"0 auto 10px"}}
              onError={e=>{e.target.outerHTML=`<div style="width:160px;height:160px;background:rgba(255,255,255,.1);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:52px;border:2px solid ${T.gold};margin:0 auto 10px">📱</div>`;}}/>
            <div style={{fontSize:14,fontWeight:800,color:"#fff",marginBottom:3}}>Ngân hàng: {qr==="acb"?(shop?.acbNo?"ACB — "+(shop?.acbName||""):"ACB (Á Châu)"):(shop?.vcbNo?"Vietcombank — "+(shop?.vcbName||""):"Vietcombank")}</div>
            <div style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,.75)",marginBottom:2}}>Số TK: <strong>{qr==="acb"?(shop?.acbNo||"6205237"):(shop?.vcbNo||"—")}</strong></div>
            <div style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,.75)"}}>Chủ TK: {qr==="acb"?(shop?.acbName||"TON NU HONG CHAU"):(shop?.vcbName||"TON NU HONG CHAU")}</div>
          </div>

          <div style={{textAlign:"center",padding:"4px 16px 14px"}}>
            <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,.7)",textTransform:"uppercase",letterSpacing:1.5}}>{shop?.footer||"XIN CẢM ƠN QUÝ KHÁCH — HẸN GẶP LẠI"}</div>
          </div>
          <div style={{height:5,background:`repeating-linear-gradient(90deg,${T.gold} 0,${T.gold} 4px,transparent 4px,transparent 10px)`,opacity:.6}}/>
        </div>

        <div style={{display:"flex",gap:8,margin:"14px 0 8px"}}>
          {["acb","vcb"].map(b=>(
            <button key={b} onClick={()=>setQr(b)}
              style={{flex:1,padding:10,borderRadius:10,border:`1.5px solid ${qr===b?T.gold:"rgba(255,255,255,.2)"}`,background:qr===b?"rgba(232,201,122,.12)":"transparent",fontFamily:"Nunito",fontWeight:700,fontSize:13,cursor:"pointer",color:qr===b?T.gold:"rgba(255,255,255,.5)"}}>
              {b==="acb"?"🏦 ACB":"🏦 VCB"}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <button className="btn btn-red" style={{flex:1}} onClick={async()=>{
            const el = document.getElementById("inv-print-area");
            if(!el){toast("⚠️ Không tìm thấy hóa đơn!");return;}
            if(!window.html2canvas){toast("⏳ Đang tải thư viện, thử lại sau 2 giây...");return;}
            toast("📸 Đang xuất PNG...");
            try{
              const canvas = await window.html2canvas(el,{scale:2,useCORS:true,backgroundColor:null,logging:false});
              const link = document.createElement("a");
              link.download = `hoadon-${cust?.name||"khach"}-${order.date.replace(/\//g,"-")}.png`;
              link.href = canvas.toDataURL("image/png");
              link.click();
              toast("✅ Đã tải hóa đơn PNG!");
            }catch(e){toast("❌ Lỗi xuất PNG: "+e.message);}
          }}>📸 Xuất PNG</button>
          <button className="btn btn-yellow" style={{flex:1}} onClick={copyText}>📋 Copy text</button>
        </div>
        <button className="btn btn-ghost" style={{color:"rgba(255,255,255,.5)",border:"1px solid rgba(255,255,255,.15)"}} onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
}

// ── ORDER DETAIL ──────────────────────────────────────────────────────────────
function OrderDetail({order, customers, services, onUpdate, onDelete, onClose, toast, shop}) {
  const [tipsInput, setTipsInput] = useState("");
  const [showTips,  setShowTips]  = useState(false);
  const [showInv,   setShowInv]   = useState(false);
  const [editing,   setEditing]   = useState(false);
  const [confirm,   setConfirm]   = useState(false);

  const cust = customers.find(c=>c.id===order.custId);

  const advance = () => {
    const idx = STATUS_FLOW.indexOf(order.status);
    if (idx >= STATUS_FLOW.length-2) return;
    const next = STATUS_FLOW[idx+1];
    onUpdate({...order, status:next});
    toast(`✅ ${STATUS_MAP[next][0]}`);
  };

  const addTips = () => {
    const t = parseInt(tipsInput)||0;
    if (!t) return;
    onUpdate({...order, tips:(order.tips||0)+t});
    setTipsInput(""); setShowTips(false);
    toast(`💜 Ghi nhận tips ${vnd(t)}!`);
  };

  const nextLabel = () => {
    const s = order.status;
    if (s==="new") return "▶ Bắt đầu xem bài";
    if (s==="view") return "✅ Xem xong";
    if (s==="done") return "💰 Đã thanh toán";
    return null;
  };

  if (editing) return <OrderForm order={order} customers={customers} services={services}
    onSave={o=>{onUpdate(o);setEditing(false);toast("✅ Đã cập nhật đơn!");}}
    onClose={()=>setEditing(false)}/>;

  if (showInv) return <InvoiceView order={order} cust={cust} services={services} toast={toast} onClose={()=>setShowInv(false)} shop={shop}/>;

  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet">
        <DragHandle/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div className="sheet-title" style={{marginBottom:0}}>Chi tiết đơn</div>
          <div style={{display:"flex",gap:6}}>
            <button className="xs" onClick={()=>setEditing(true)}>✏️ Sửa</button>
            {order.status!=="paid"&&order.status!=="cancel"&&(
              <button className="xs xs-red" onClick={()=>setConfirm(true)}>🗑</button>
            )}
          </div>
        </div>

        {/* Khách */}
        <div className="card card-blue" style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,padding:12}}>
          <div style={{fontSize:28}}>{cust?.ava||"👤"}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"Nunito",fontWeight:800,fontSize:15}}>{cust?.name}</div>
            <div style={{fontSize:12,color:T.muted,marginTop:2}}>{cust?.nick} · {cust?.phone}</div>
          </div>
          <Badge s={order.status}/>
        </div>

        {/* Items */}
        <div className="card" style={{marginBottom:12}}>
          {order.items.map((it,i)=>{
            const svc=services.find(s=>s.id===it.svcId); if(!svc) return null;
            const amt=svc.type==="fixed"?svc.price:calcQ(it.qty,svc.price,svc.price6);
            return(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"10px 0",borderBottom:i<order.items.length-1?`1px dashed ${T.border}`:"none"}}>
                <div>
                  <div style={{fontSize:14,fontWeight:700}}>{svc.ico} {svc.name}{svc.type==="per_q"?` · ${it.qty} câu`:""}</div>
                  {(it.groups||[]).length>0&&<div style={{fontSize:11,color:T.purple,fontWeight:600,marginTop:2}}>📌 {(it.groups||[]).join(" · ")}</div>}
                  {it.group&&!(it.groups||[]).length&&<div style={{fontSize:11,color:T.purple,fontWeight:600,marginTop:2}}>📌 {it.group}</div>}
                </div>
                <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:14,color:T.green}}>{vnd(amt)}</div>
              </div>
            );
          })}
          {order.extraQ>0&&(
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 0",borderTop:`1px dashed ${T.border}`}}>
              <div style={{fontSize:14,fontWeight:700}}>💬 {order.extraQ} câu lẻ thêm</div>
              <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:14,color:T.green}}>{vnd(calcQ(order.extraQ,20000,15000))}</div>
            </div>
          )}
          <div style={{display:"flex",justifyContent:"space-between",paddingTop:12,marginTop:8,borderTop:`1.5px solid ${T.ink}`}}>
            <div style={{fontFamily:"Nunito",fontWeight:800,fontSize:15}}>TỔNG XEM BÀI</div>
            <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:20,color:T.green}}>{vnd(order.total)}</div>
          </div>
        </div>

        {/* Tips */}
        <div className="card card-purple" style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:T.purple,marginBottom:4}}>💜 Tips nhận được</div>
              <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:22,color:T.purple}}>{order.tips>0?vnd(order.tips):"Chưa có"}</div>
            </div>
            <button className="xs xs-purple" onClick={()=>setShowTips(v=>!v)}>
              {showTips?"Đóng":"+ Thêm tips"}
            </button>
          </div>
          {showTips&&(
            <div style={{marginTop:12,display:"flex",gap:8}}>
              <input type="number" placeholder="Số tiền tips..." value={tipsInput}
                onChange={e=>setTipsInput(e.target.value)}
                style={{flex:1,padding:"9px 12px",borderRadius:10,border:`1.5px solid ${T.purple}`,background:T.card,fontFamily:"Nunito Sans",fontSize:14,fontWeight:600,outline:"none",color:T.ink}}/>
              <button className="xs xs-purple" onClick={addTips}>Ghi nhận</button>
            </div>
          )}
        </div>

        {/* Total */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:T.ink,borderRadius:12,marginBottom:16}}>
          <div style={{color:"rgba(255,255,255,.6)",fontSize:12,fontWeight:700}}>TỔNG CỘNG</div>
          <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:22,color:"#fff"}}>{vnd(order.total+(order.tips||0))}</div>
        </div>

        {order.notes&&(
          <div className="card" style={{marginBottom:12,fontSize:13,color:T.muted}}>📝 {order.notes}</div>
        )}
        <div style={{fontSize:11,color:T.muted,marginBottom:12}}>📅 {order.date} · {order.time}</div>

        {/* Actions */}
        {nextLabel()&&<button className="btn btn-green" style={{marginBottom:8}} onClick={advance}>{nextLabel()}</button>}
        <button className="btn btn-outline" style={{marginBottom:8}} onClick={()=>setShowInv(true)}>🧾 Xem & xuất hóa đơn</button>
        <button className="btn btn-ghost" onClick={onClose}>Đóng</button>

        {/* Delete confirm */}
        {confirm&&(
          <div className="card card-red" style={{marginTop:12}}>
            <div style={{fontWeight:800,marginBottom:4,color:T.red}}>⚠️ Xử lý đơn này?</div>
            <div style={{fontSize:12,color:T.muted,marginBottom:12}}>Huỷ = đổi trạng thái Huỷ · Xoá = xoá vĩnh viễn</div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-red" style={{flex:1,fontSize:12}} onClick={()=>{onUpdate({...order,status:"cancel"});setConfirm(false);toast("🗑 Đã huỷ đơn!");}}>🚫 Huỷ đơn</button>
              <button className="btn btn-red" style={{flex:1,fontSize:12,background:"#7B0000"}} onClick={()=>{onDelete(order.id);onClose();toast("🗑 Đã xoá đơn vĩnh viễn!");}}>🗑 Xoá hẳn</button>
              <button className="btn btn-ghost" style={{flex:1,fontSize:12}} onClick={()=>setConfirm(false)}>Không</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ORDERS PAGE ───────────────────────────────────────────────────────────────
function OrdersPage({orders, setOrders, saveOrder, customers, services, toast, defaultCustId, clearDefaultCust, shop, topics, setTopics}) {
  const [filter,   setFilter]   = useState("all");
  const [showNew,  setShowNew]  = useState(!!defaultCustId);
  const [selId,    setSelId]    = useState(null);
  const [search,   setSearch]   = useState("");

  useEffect(()=>{ if(defaultCustId) setShowNew(true); },[defaultCustId]);

  const shown = orders.filter(o=>{
    if (filter!=="all"&&o.status!==filter) return false;
    if (search) {
      const c = customers.find(x=>x.id===o.custId);
      return c?.name.toLowerCase().includes(search.toLowerCase())||c?.nick.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const saveNew = o => { saveOrder(o); setShowNew(false); clearDefaultCust(); toast("✅ Đã tạo đơn! 🐸"); };
  const upd = o => saveOrder(o);
  const selOrder = orders.find(o=>o.id===selId);
  const cName = id => customers.find(c=>c.id===id)?.name||"?";
  const cAva  = id => customers.find(c=>c.id===id)?.ava||"👤";
  const sName = id => { const s=services.find(x=>x.id===id); return s?`${s.ico} ${s.name}`:"?"; };

  return(
    <div className="scroll-body">
      <div className="hdr">
        <div className="hdr-eye">Quản lý</div>
        <div className="hdr-h1">Đơn Xem Bói</div>
        <div className="hdr-sub">{orders.length} đơn · Hôm nay: {vnd(orders.filter(o=>o.date===todayStr()&&o.status==="paid").reduce((s,o)=>s+o.total,0))}</div>
      </div>

      <input className="sb" placeholder="Tìm khách hàng..." value={search} onChange={e=>setSearch(e.target.value)}/>

      <div className="sec" style={{paddingTop:10}}>
        <div className="pill-row">
          {[{k:"all",l:"Tất cả"},{k:"new",l:"Mới"},{k:"view",l:"Đang xem"},{k:"done",l:"Xong"},{k:"paid",l:"Đã TT"},{k:"cancel",l:"Huỷ"}].map(x=>(
            <button key={x.k} className={`pill ${filter===x.k?"on":""}`} onClick={()=>setFilter(x.k)}>{x.l}</button>
          ))}
        </div>

        {shown.length===0&&<EmptyState ico="🐸" title="Chưa có đơn nào" sub="Nhấn + để tạo đơn đầu tiên!"/>}

        {shown.map(o=>(
          <div key={o.id} className="row" onClick={()=>setSelId(o.id)} style={{borderLeft:`3px solid ${o.status==="paid"?T.green:o.status==="cancel"?T.red:o.status==="done"?T.yellow:o.status==="view"?T.purple:T.blue}`}}>
            <div className="ava" style={{borderRadius:"50%",fontSize:20}}>{cAva(o.custId)}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:700}}>{cName(o.custId)}</div>
              <div style={{fontSize:11,color:T.muted,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                {o.items.map(it=>sName(it.svcId)).join(" + ")}{o.extraQ>0?` + ${o.extraQ}c lẻ`:""}
              </div>
              <div style={{fontSize:10,color:T.muted}}>{o.date} · {o.time}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:14}}>{vnd(o.total)}</div>
              {o.tips>0&&<div style={{fontSize:10,fontWeight:700,color:T.purple}}>+{vnd(o.tips)} tips</div>}
              <Badge s={o.status}/>
            </div>
          </div>
        ))}
      </div>

      <button className="fab" onClick={()=>setShowNew(true)}>{I.plus}</button>

      {showNew&&<OrderForm customers={customers} services={services} onSave={saveNew} onClose={()=>{setShowNew(false);clearDefaultCust();}} defaultCustId={defaultCustId} topics={topics}/>}
      {selId&&selOrder&&<OrderDetail order={selOrder} customers={customers} services={services} onUpdate={upd} onDelete={id=>{deleteOrder(id);setSelId(null);}} onClose={()=>setSelId(null)} toast={toast} shop={shop}/>}
    </div>
  );
}

// ── CUSTOMERS PAGE ────────────────────────────────────────────────────────────
function CustomersPage({customers, setCustomers, orders, services, toast, onCreateOrder}) {
  const [sel,     setSel]     = useState(null);
  const [modal,   setModal]   = useState(false);
  const [editC,   setEditC]   = useState(null);
  const [delConf, setDelConf] = useState(false);
  const [tab,     setTab]     = useState("all");
  const [search,  setSearch]  = useState("");
  const [form,    setForm]    = useState({name:"",nick:"",phone:"",social:"",notes:"",ava:"🌙",created:todayStr()});

  const custOrders = id => orders.filter(o=>o.custId===id);
  const totalSpent = id => custOrders(id).filter(o=>o.status==="paid").reduce((s,o)=>s+o.total,0);
  const totalTips  = id => custOrders(id).reduce((s,o)=>s+(o.tips||0),0);
  const lastOrder  = id => { const ords=custOrders(id); return ords.length?ords[ords.length-1].date:"-"; };
  const daysSince  = dateStr => {
    if(!dateStr||dateStr==="-") return 999;
    const [d,m,y]=dateStr.split("/").map(Number);
    const diff=new Date()-new Date(y,m-1,d);
    return Math.floor(diff/(1000*60*60*24));
  };

  const needsFollowUp = c => daysSince(c.lastOrder||lastOrder(c.id)) > 21 && custOrders(c.id).length > 0;
  const isVip = c => totalSpent(c.id)>500000||custOrders(c.id).length>=5||totalTips(c.id)>100000;
  const autoTags = c => {
    const tags=[...(c.tags||[]).filter(t=>!["vip","tip"].includes(t))];
    if(isVip(c)&&!tags.includes("vip")) tags.push("vip");
    if(totalTips(c.id)>0&&!tags.includes("tip")) tags.push("tip");
    return tags;
  };
  const TAG_MAP = {vip:["👑 VIP","tg-vip"],new:["✨ Mới","tg-new"],fu:["📌 Follow","tg-fu"],old:["🔄 Cũ","tg-old"],tip:["💜 Tipper","tg-tip"]};

  const openNew  = () => { setForm({name:"",nick:"",phone:"",social:"",notes:"",ava:"🌙"}); setEditC(null); setModal(true); };
  const openEdit = c => { setForm({name:c.name,nick:c.nick||"",phone:c.phone||"",social:c.social||"",notes:c.notes||"",ava:c.ava||"🌙",created:c.created||todayStr()}); setEditC(c); setModal(true); };

  const save = () => {
    if(!form.name.trim()) return;
    if(editC) {
      setCustomers(p=>p.map(c=>c.id===editC.id?{...c,...form}:c));
      toast("✅ Đã cập nhật!");
    } else {
      const nc={id:uid(),...form,tags:["new"],created:todayStr(),lastOrder:""};
      setCustomers(p=>[nc,...p]);
      toast("✅ Đã thêm khách mới! 🐸");
    }
    setModal(false);
  };

  const del = id => { setCustomers(p=>p.filter(c=>c.id!==id)); setSel(null); setDelConf(false); toast("🗑 Đã xoá!"); };

  const filtered = customers.filter(c=>{
    if(tab==="vip"&&!isVip(c)) return false;
    if(tab==="fu"&&!needsFollowUp(c)) return false;
    if(tab==="new"&&!c.tags?.includes("new")) return false;
    if(search&&!c.name.toLowerCase().includes(search.toLowerCase())&&!c.nick?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if(sel) {
    const c=customers.find(x=>x.id===sel);
    if(!c) { setSel(null); return null; }
    const co=custOrders(c.id);
    const tags=autoTags(c);
    const ds=daysSince(c.lastOrder||lastOrder(c.id));
    return(
      <div className="scroll-body">
        <div className="hdr" style={{paddingTop:44}}>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
            <button onClick={()=>setSel(null)} style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",borderRadius:10,padding:"6px 12px",color:"#fff",cursor:"pointer",fontFamily:"Nunito",fontWeight:700,fontSize:13}}>← Quay lại</button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{fontSize:44}}>{c.ava}</div>
            <div>
              <div className="hdr-h1">{c.nick||c.name}</div>
              <div className="hdr-sub">{c.name} · {c.phone}</div>
            </div>
          </div>
        </div>

        <div className="sec">
          {/* Tags */}
          <div style={{marginBottom:14,display:"flex",flexWrap:"wrap",gap:4}}>
            {tags.map(t=>{const[l,cl]=TAG_MAP[t]||[t,"tg-new"];return<span key={t} className={`tg ${cl}`}>{l}</span>;})}
            {needsFollowUp(c)&&<span className="tg tg-fu">⚠️ {ds}ngày chưa quay lại</span>}
          </div>

          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {[
              {i:"🔮",l:"Lần xem",  v:co.length,         bg:T.bluebg},
              {i:"💰",l:"Đã chi",   v:vnd(totalSpent(c.id)),bg:T.greenbg},
              {i:"💜",l:"Tips",     v:vnd(totalTips(c.id)), bg:T.purplebg},
              {i:"📅",l:"Lần cuối", v:`${ds<999?ds+"ngày":"Chưa có"}`, bg:T.yellowbg},
            ].map(s=>(
              <div key={s.l} className="metric-sm" style={{background:s.bg}}>
                <div className="metric-sm-label">{s.i} {s.l}</div>
                <div className="metric-sm-value" style={{fontSize:18}}>{s.v}</div>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="card" style={{marginBottom:14}}>
            {[{l:"Điện thoại",v:c.phone},{l:"Zalo/Facebook",v:c.social||"—"},{l:"Ngày thêm",v:c.created}].map(x=>(
              <div key={x.l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px dashed ${T.border}`}}>
                <span style={{fontSize:12,color:T.muted,fontWeight:600}}>{x.l}</span>
                <span style={{fontSize:13,fontWeight:700}}>{x.v||"—"}</span>
              </div>
            ))}
            {c.notes&&<div style={{marginTop:8,fontSize:13,color:T.muted}}>📝 {c.notes}</div>}
          </div>

          {/* Action buttons */}
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <button className="btn btn-green" style={{flex:1}} onClick={()=>{setSel(null);onCreateOrder(c.id);}}>📋 Tạo đơn</button>
            <button className="btn btn-outline" style={{flex:1}} onClick={()=>openEdit(c)}>✏️ Sửa</button>
          </div>

          {needsFollowUp(c)&&(
            <div className="action-card action-card-yellow" style={{marginBottom:14}}>
              <div style={{fontWeight:700,marginBottom:8}}>⚠️ {ds} ngày chưa quay lại — nên follow-up!</div>
              <button className="xs xs-yellow" onClick={()=>{navigator.clipboard?.writeText(REPLIES[6].body);toast("📋 Copy tin follow-up!");}}>📋 Copy tin follow-up</button>
            </div>
          )}

          {/* Order history */}
          <div className="sec-h" style={{padding:0}}>
            <div className="sec-t">📋 Lịch sử đơn ({co.length})</div>
          </div>
          {co.length===0&&<EmptyState ico="📋" title="Chưa có đơn nào"/>}
          {co.map(o=>(
            <div key={o.id} className="row" style={{cursor:"default"}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700}}>{o.items.map(it=>{const s=services.find(x=>x.id===it.svcId);return s?`${s.ico} ${s.name}`:""}).filter(Boolean).join(" + ")}</div>
                <div style={{fontSize:11,color:T.muted}}>{o.date} · {o.time}</div>
                {o.items.map((it,idx)=>(it.groups||[]).length>0?<span key={idx} style={{fontSize:10,color:T.purple,fontWeight:600,marginRight:6}}>📌 {(it.groups||[]).join("·")}</span>:it.group?<span key={idx} style={{fontSize:10,color:T.purple,fontWeight:600,marginRight:6}}>📌 {it.group}</span>:null)}
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:14}}>{vnd(o.total)}</div>
                {o.tips>0&&<div style={{fontSize:10,color:T.purple,fontWeight:700}}>+{vnd(o.tips)}</div>}
                <Badge s={o.status}/>
              </div>
            </div>
          ))}

          <div style={{height:16}}/>
          <button className="btn btn-ghost" style={{color:T.red,borderColor:T.red}} onClick={()=>setDelConf(true)}>🗑 Xoá khách hàng</button>
          {delConf&&(
            <div className="card card-red" style={{marginTop:10}}>
              <div style={{fontWeight:700,color:T.red,marginBottom:10}}>Xoá "{c.name}"? Không thể hoàn tác!</div>
              <div style={{display:"flex",gap:8}}>
                <button className="btn btn-red" style={{flex:1}} onClick={()=>del(c.id)}>Xoá</button>
                <button className="btn btn-ghost" style={{flex:1}} onClick={()=>setDelConf(false)}>Huỷ</button>
              </div>
            </div>
          )}
        </div>

        {modal&&<CustomerModal form={form} setForm={setForm} onSave={save} onClose={()=>setModal(false)} isEdit={!!editC}/>}
      </div>
    );
  }

  return(
    <div className="scroll-body">
      <div className="hdr">
        <div className="hdr-eye">Danh sách</div>
        <div className="hdr-h1">Khách Hàng</div>
        <div className="hdr-sub">{customers.length} khách · {customers.filter(c=>isVip(c)).length} VIP · {customers.filter(c=>needsFollowUp(c)).length} cần follow-up</div>
      </div>

      <input className="sb" placeholder="Tìm tên, số điện thoại..." value={search} onChange={e=>setSearch(e.target.value)}/>

      <div className="sec" style={{paddingTop:10}}>
        <div className="pill-row">
          {[{k:"all",l:"Tất cả"},{k:"vip",l:"👑 VIP"},{k:"fu",l:"📌 Follow-up"},{k:"new",l:"✨ Mới"}].map(x=>(
            <button key={x.k} className={`pill ${tab===x.k?"on":""}`} onClick={()=>setTab(x.k)}>{x.l}</button>
          ))}
        </div>

        {/* Follow-up alert */}
        {tab==="all"&&customers.filter(c=>needsFollowUp(c)).length>0&&(
          <div className="action-card action-card-yellow" style={{marginBottom:10}}>
            <div style={{fontWeight:700,marginBottom:6}}>📌 {customers.filter(c=>needsFollowUp(c)).length} khách lâu chưa quay lại</div>
            <button className="xs xs-yellow" onClick={()=>setTab("fu")}>Xem danh sách</button>
          </div>
        )}

        {filtered.length===0&&<EmptyState ico="🐸" title="Chưa có khách nào" sub="Nhấn + để thêm khách đầu tiên!"/>}

        {filtered.map(c=>{
          const ts=totalSpent(c.id); const tt=totalTips(c.id); const tags=autoTags(c); const fu=needsFollowUp(c);
          return(
            <div key={c.id} className="row" onClick={()=>setSel(c.id)} style={{borderLeft:`3px solid ${isVip(c)?T.yellow:fu?T.red:T.border}`}}>
              <div className="ava" style={{borderRadius:"50%",fontSize:22}}>{c.ava}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:700}}>{c.nick||c.name}</div>
                <div style={{fontSize:11,color:T.muted,marginTop:1}}>{c.phone}</div>
                <div>{tags.slice(0,2).map(t=>{const[l,cl]=TAG_MAP[t]||[t,"tg-new"];return<span key={t} className={`tg ${cl}`}>{l}</span>;})}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:14,color:T.green}}>{vnd(ts)}</div>
                {tt>0&&<div style={{fontSize:10,color:T.purple,fontWeight:700}}>+{vnd(tt)}</div>}
                <div style={{fontSize:10,color:T.muted}}>{custOrders(c.id).length} lần</div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="fab" onClick={openNew}>{I.plus}</button>
      {modal&&<CustomerModal form={form} setForm={setForm} onSave={save} onClose={()=>setModal(false)} isEdit={!!editC}/>}
    </div>
  );
}

function CustomerModal({form, setForm, onSave, onClose, isEdit}) {
  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet">
        <DragHandle/>
        <div className="sheet-title">{isEdit?"Sửa khách hàng":"Thêm khách mới"}</div>
        <div className="f">
          <label>Avatar</label>
          <div className="ico-pick">{AVAS.map(a=>(
            <button key={a} className="ico-btn" onClick={()=>setForm(p=>({...p,ava:a}))}
              style={{background:form.ava===a?T.ink:"transparent",border:`1.5px solid ${form.ava===a?T.ink:T.border}`}}>{a}</button>
          ))}</div>
        </div>
        {[{l:"Tên đầy đủ",k:"name",p:"Nguyễn Thị A"},{l:"Nickname",k:"nick",p:"Bé A"},{l:"Số điện thoại",k:"phone",p:"0912345678",t:"tel"},{l:"Zalo / Facebook",k:"social",p:"Tên hoặc link"},{l:"Ngày trở thành khách (DD/MM/YYYY)",k:"created",p:"01/01/2025"}].map(x=>(
          <div className="f" key={x.k}>
            <label>{x.l}</label>
            <input type={x.t||"text"} placeholder={x.p} value={form[x.k]||""} onChange={e=>setForm(p=>({...p,[x.k]:e.target.value}))}/>
          </div>
        ))}
        <div className="f">
          <label>Ghi chú</label>
          <textarea placeholder="Ghi chú về khách..." value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-primary" style={{flex:2}} onClick={onSave}>{isEdit?"Lưu thay đổi":"Thêm khách"}</button>
          <button className="btn btn-ghost" style={{flex:1}} onClick={onClose}>Huỷ</button>
        </div>
      </div>
    </div>
  );
}

// ── BOOKING PAGE ──────────────────────────────────────────────────────────────
function BookingPage({bookings, setBookings, customers, services, orders, setOrders, saveOrder, toast}) {
  const [showNew,  setShowNew]  = useState(false);
  const [selId,    setSelId]    = useState(null);
  const [tab,      setTab]      = useState("today");
  const [form,     setForm]     = useState({custId:"",svcId:"",date:todayStr(),time:"",notes:""});

  const todayBks = bookings.filter(b=>b.date===todayStr());
  const upcomBks = bookings.filter(b=>b.date!==todayStr());
  const shown    = tab==="today"?todayBks:upcomBks;

  const cName = id => customers.find(c=>c.id===id)?.name||"?";
  const cAva  = id => customers.find(c=>c.id===id)?.ava||"👤";
  const sName = id => { const s=services.find(x=>x.id===id); return s?`${s.ico} ${s.name}`:"Dịch vụ"; };

  const today2 = new Date().getDate();
  const fd  = new Date(new Date().getFullYear(),new Date().getMonth(),1).getDay();
  const dim = new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate();
  const cells = Array(fd).fill(null).concat(Array.from({length:dim},(_,i)=>i+1));
  const hasBk = d => bookings.some(b=>{
    const parts=b.date.split("/");
    return parseInt(parts[0])===d&&parseInt(parts[1])===new Date().getMonth()+1;
  });

  const addBk = () => {
    if(!form.custId||!form.svcId||!form.time) { alert("Điền đầy đủ thông tin!"); return; }
    setBookings(p=>[...p,{id:uid(),...form,status:"pending"}]);
    setShowNew(false); setForm({custId:"",svcId:"",date:todayStr(),time:"",notes:""});
    toast("📅 Đã tạo booking!");
  };

  const confirm = id => { setBookings(p=>p.map(b=>b.id===id?{...b,status:"confirmed"}:b)); toast("✅ Đã xác nhận!"); };
  const cancel  = id => { setBookings(p=>p.map(b=>b.id===id?{...b,status:"cancel"}:b));    toast("🗑 Đã huỷ!"); };

  const createOrderFromBk = bk => {
    const o={id:uid(),custId:bk.custId,items:[{svcId:bk.svcId,qty:"",group:""}],extraQ:0,total:0,tips:0,status:"new",date:todayStr(),time:nowStr(),notes:bk.notes||""};
    saveOrder(o);
    toast("📋 Đã tạo đơn từ booking!");
  };

  const sendQR = bk => { navigator.clipboard?.writeText(REPLIES[3].body); toast("📋 Copy tin nhắn QR!"); };

  const selBk = bookings.find(b=>b.id===selId);

  return(
    <div className="scroll-body">
      <div className="hdr">
        <div className="hdr-eye">Lịch làm việc</div>
        <div className="hdr-h1">Booking</div>
        <div className="hdr-sub">{todayBks.length} lịch hôm nay · {todayBks.filter(b=>b.status==="confirmed").length} đã xác nhận</div>
      </div>

      {/* Mini calendar */}
      <div className="sec" style={{paddingTop:16}}>
        <div className="cal-hd">{["CN","T2","T3","T4","T5","T6","T7"].map(d=><div key={d} className="cal-dh">{d}</div>)}</div>
        <div className="cal-g">
          {cells.map((d,i)=>(
            <div key={i} className={`cd ${d===today2?"today":""} ${hasBk(d)?"has":""}`}>{d||""}</div>
          ))}
        </div>
      </div>

      <div className="sec">
        <div className="pill-row">
          <button className={`pill ${tab==="today"?"on":""}`} onClick={()=>setTab("today")}>Hôm nay ({todayBks.length})</button>
          <button className={`pill ${tab==="upcoming"?"on":""}`} onClick={()=>setTab("upcoming")}>Sắp tới ({upcomBks.length})</button>
        </div>

        {shown.length===0&&<EmptyState ico="🐸" title={tab==="today"?"Hôm nay chưa có lịch":"Chưa có lịch sắp tới"} sub="Nhấn + để tạo booking mới!"/>}

        {shown.map(b=>(
          <div key={b.id} className="action-card" style={{borderLeft:`4px solid ${b.status==="confirmed"?T.green:b.status==="cancel"?T.red:T.yellow}`,background:b.status==="cancel"?T.redbg:T.card}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <div style={{fontSize:24}}>{cAva(b.custId)}</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"Nunito",fontWeight:800,fontSize:15}}>{b.time} · {cName(b.custId)}</div>
                <div style={{fontSize:12,color:T.muted}}>{sName(b.svcId)}{b.notes?` · ${b.notes}`:""}</div>
              </div>
              <span className={`bd ${b.status==="confirmed"?"bd-confirm":b.status==="cancel"?"bd-can":"bd-pend"}`}>
                {b.status==="confirmed"?"XÁC NHẬN":b.status==="cancel"?"ĐÃ HUỶ":"CHỜ"}
              </span>
            </div>

            {b.status!=="cancel"&&(
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {b.status==="pending"&&(
                  <button className="xs xs-green" onClick={()=>confirm(b.id)}>✅ Xác nhận</button>
                )}
                <button className="xs xs-green" onClick={()=>createOrderFromBk(b)}>📋 Tạo đơn</button>
                <button className="xs" onClick={()=>sendQR(b)}>📤 Gửi QR</button>
                <button className="xs" onClick={()=>{navigator.clipboard?.writeText(REPLIES[4].body);toast("📋 Copy tin nhắc TT!");}}>💸 Nhắc TT</button>
                {b.status!=="cancel"&&<button className="xs xs-red" onClick={()=>cancel(b.id)}>✕ Huỷ</button>}
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="fab" onClick={()=>setShowNew(true)}>{I.plus}</button>

      {showNew&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setShowNew(false)}>
          <div className="sheet">
            <DragHandle/>
            <div className="sheet-title">Tạo Booking Mới</div>
            <div className="f">
              <label>Khách hàng</label>
              <select value={form.custId} onChange={e=>setForm(p=>({...p,custId:e.target.value}))}>
                <option value="">Chọn khách...</option>
                {customers.map(c=><option key={c.id} value={c.id}>{c.ava} {c.name} – {c.nick}</option>)}
              </select>
            </div>
            <div className="f">
              <label>Dịch vụ</label>
              <select value={form.svcId} onChange={e=>setForm(p=>({...p,svcId:e.target.value}))}>
                <option value="">Chọn dịch vụ...</option>
                {services.filter(s=>s.active).map(s=><option key={s.id} value={s.id}>{s.ico} {s.name}</option>)}
              </select>
            </div>
            <div style={{display:"flex",gap:8}}>
              <div className="f" style={{flex:1}}>
                <label>Ngày (DD/MM/YYYY)</label>
                <input placeholder={todayStr()} value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))}/>
              </div>
              <div className="f" style={{flex:1}}>
                <label>Giờ</label>
                <input type="time" value={form.time} onChange={e=>setForm(p=>({...p,time:e.target.value}))}/>
              </div>
            </div>
            <div className="f">
              <label>Ghi chú</label>
              <textarea placeholder="Ghi chú..." value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-primary" style={{flex:2}} onClick={addBk}>📅 Tạo booking</button>
              <button className="btn btn-ghost" style={{flex:1}} onClick={()=>setShowNew(false)}>Huỷ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ── MESSAGES PAGE — full CRUD + image attachments ─────────────────────────────
function MessagesPage({toast, replies, setReplies}) {
  const [expanded, setExpanded] = useState(null);
  const [modal,    setModal]    = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [delId,    setDelId]    = useState(null);
  const [form,     setForm]     = useState({hash:"",title:"",body:"",images:[]});
  const fileRef = useRef(null);

  const openNew = () => {
    setForm({hash:"",title:"",body:"",images:[]});
    setEditId(null); setModal(true);
  };
  const openEdit = r => {
    setForm({hash:r.hash,title:r.title,body:r.body,images:r.images||[]});
    setEditId(r.id); setModal(true);
  };

  const save = () => {
    if(!form.title.trim()||!form.body.trim()) { toast("⚠️ Điền đủ tiêu đề và nội dung!"); return; }
    const entry = {...form, hash:form.hash||"#mau"+Date.now()};
    if(editId) {
      setReplies(p=>p.map(r=>r.id===editId?{...r,...entry}:r));
      toast("✅ Đã cập nhật mẫu!");
    } else {
      setReplies(p=>[...p,{id:uid(),...entry}]);
      toast("✅ Đã thêm mẫu mới!");
    }
    setModal(false);
  };

  const del = id => {
    setReplies(p=>p.filter(r=>r.id!==id));
    setDelId(null); setExpanded(null);
    toast("🗑 Đã xoá mẫu!");
  };

  // Handle image upload — convert to base64 for in-memory storage
  const handleImages = e => {
    const files = Array.from(e.target.files||[]);
    if(!files.length) return;
    const remaining = 5 - (form.images||[]).length;
    if(remaining<=0) { toast("⚠️ Tối đa 5 ảnh mỗi mẫu!"); return; }
    const toProcess = files.slice(0, remaining);
    let done = 0;
    const newImgs = [];
    toProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        newImgs.push({name:file.name, dataUrl:ev.target.result, size:file.size});
        done++;
        if(done===toProcess.length) {
          setForm(p=>({...p, images:[...(p.images||[]), ...newImgs]}));
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImg = (rId, imgIdx, isEdit) => {
    if(isEdit) {
      setForm(p=>({...p,images:p.images.filter((_,i)=>i!==imgIdx)}));
    } else {
      setReplies(p=>p.map(r=>r.id===rId?{...r,images:(r.images||[]).filter((_,i)=>i!==imgIdx)}:r));
      toast("🗑 Đã xoá ảnh!");
    }
  };

  // Download image
  const downloadImg = (img) => {
    const a = document.createElement("a");
    a.href = img.dataUrl;
    a.download = img.name||"image.jpg";
    a.click();
    toast("📥 Đang tải ảnh về...");
  };

  return(
    <div className="scroll-body">
      <div className="hdr">
        <div className="hdr-eye">Quản lý mẫu</div>
        <div className="hdr-h1">Tin Nhắn Mẫu</div>
        <div className="hdr-sub">{replies.length} mẫu · Nhấn để xem · Có thể đính kèm ảnh</div>
      </div>

      <div className="sec">
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:10}}>
          <button className="xs xs-green" onClick={openNew}>+ Thêm mẫu mới</button>
        </div>

        {replies.length===0&&<EmptyState ico="💬" title="Chưa có mẫu nào" sub="Nhấn + để tạo tin nhắn mẫu đầu tiên"/>}

        {replies.map(r=>(
          <div key={r.id} className="card" style={{marginBottom:10}}>
            {/* Header row */}
            <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setExpanded(expanded===r.id?null:r.id)}>
              <div style={{background:T.greenbg,borderRadius:8,padding:"5px 10px",fontFamily:"Nunito",fontWeight:800,fontSize:12,color:T.green,minWidth:80,textAlign:"center",flexShrink:0}}>
                {r.hash}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:700,color:T.ink}}>{r.title}</div>
                {expanded!==r.id&&<div style={{fontSize:11,color:T.muted,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.body.split("\n")[0]}</div>}
              </div>
              <div style={{display:"flex",gap:5,flexShrink:0}}>
                <button className="xs xs-green" style={{padding:"6px 11px"}} onClick={e=>{e.stopPropagation();navigator.clipboard?.writeText(r.body);toast("📋 Đã copy text!");}}>COPY</button>
                <button className="xs" style={{padding:"6px 10px"}} onClick={e=>{e.stopPropagation();openEdit(r);}}>✏️</button>
                <button className="xs xs-red" style={{padding:"6px 10px"}} onClick={e=>{e.stopPropagation();setDelId(r.id===delId?null:r.id);}}>🗑</button>
              </div>
            </div>

            {/* Delete confirm */}
            {delId===r.id&&(
              <div className="card card-red" style={{marginTop:10}}>
                <div style={{fontSize:13,fontWeight:700,color:T.red,marginBottom:8}}>Xoá mẫu "{r.title}"?</div>
                <div style={{display:"flex",gap:8}}>
                  <button className="xs xs-red" onClick={()=>del(r.id)}>Xoá</button>
                  <button className="xs" onClick={()=>setDelId(null)}>Huỷ</button>
                </div>
              </div>
            )}

            {/* Expanded content */}
            {expanded===r.id&&(
              <div style={{marginTop:12}}>
                <div style={{background:T.bg,borderRadius:10,padding:12,fontSize:13,color:T.ink,whiteSpace:"pre-line",lineHeight:1.6,fontWeight:500,marginBottom:(r.images||[]).length>0?10:0}}>
                  {r.body}
                </div>

                {/* Image attachments */}
                {(r.images||[]).length>0&&(
                  <div>
                    <div style={{fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>
                      📎 Ảnh đính kèm ({r.images.length})
                    </div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {r.images.map((img,i)=>(
                        <div key={i} style={{position:"relative",width:80,height:80}}>
                          <img src={img.dataUrl} alt={img.name}
                            style={{width:80,height:80,objectFit:"cover",borderRadius:10,border:`1.5px solid ${T.border}`}}/>
                          <div style={{position:"absolute",bottom:0,left:0,right:0,display:"flex",gap:3,padding:4,background:"rgba(0,0,0,.5)",borderRadius:"0 0 8px 8px"}}>
                            <button onClick={()=>downloadImg(img)}
                              style={{flex:1,background:"rgba(255,255,255,.9)",border:"none",borderRadius:5,padding:"2px 0",fontSize:9,fontWeight:700,cursor:"pointer",color:T.ink}}>
                              ⬇️
                            </button>
                            <button onClick={()=>removeImg(r.id,i,false)}
                              style={{flex:1,background:"rgba(193,18,31,.8)",border:"none",borderRadius:5,padding:"2px 0",fontSize:9,fontWeight:700,cursor:"pointer",color:"#fff"}}>
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                      {/* Add more images button */}
                      {r.images.length<5&&(
                        <div style={{width:80,height:80,borderRadius:10,border:`2px dashed ${T.border2}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",background:T.bg}}
                          onClick={()=>{setEditId(r.id);setForm({...r,images:r.images||[]});setTimeout(()=>fileRef.current?.click(),50);}}>
                          <div style={{fontSize:22,color:T.muted}}>+</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Add image if no images yet */}
                {(r.images||[]).length===0&&(
                  <button className="xs" style={{marginTop:6}}
                    onClick={()=>{setEditId(r.id);setForm({...r,images:[]});setTimeout(()=>fileRef.current?.click(),50);}}>
                    📎 Thêm ảnh đính kèm
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hidden file input for add-image-from-expanded */}
      <input ref={fileRef} type="file" accept="image/*" multiple style={{display:"none"}}
        onChange={e=>{
          if(!editId) return;
          const files=Array.from(e.target.files||[]);
          if(!files.length) return;
          const cur = replies.find(r=>r.id===editId);
          const remaining = 5 - (cur?.images||[]).length;
          const toProcess = files.slice(0,remaining);
          let done=0; const newImgs=[];
          toProcess.forEach(file=>{
            const reader=new FileReader();
            reader.onload=ev=>{
              newImgs.push({name:file.name,dataUrl:ev.target.result,size:file.size});
              done++;
              if(done===toProcess.length){
                setReplies(p=>p.map(r=>r.id===editId?{...r,images:[...(r.images||[]),...newImgs]}:r));
                toast("📸 Đã thêm ảnh!");
                setEditId(null);
              }
            };
            reader.readAsDataURL(file);
          });
          e.target.value="";
        }}/>

      {/* Add/Edit Modal */}
      {modal&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="sheet">
            <DragHandle/>
            <div className="sheet-title">{editId?"Sửa mẫu tin nhắn":"Thêm mẫu mới"}</div>

            <div className="f">
              <label>Hashtag (dùng để nhận ra nhanh)</label>
              <input placeholder="#menu / #baogia / #camon..." value={form.hash} onChange={e=>setForm(p=>({...p,hash:e.target.value}))}/>
            </div>
            <div className="f">
              <label>Tiêu đề</label>
              <input placeholder="VD: Menu dịch vụ" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/>
            </div>
            <div className="f">
              <label>Nội dung tin nhắn</label>
              <textarea style={{minHeight:120}} placeholder="Nhập nội dung..." value={form.body} onChange={e=>setForm(p=>({...p,body:e.target.value}))}/>
            </div>

            {/* Image upload */}
            <div className="f">
              <label>Ảnh đính kèm (tối đa 5 ảnh)</label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
                {(form.images||[]).map((img,i)=>(
                  <div key={i} style={{position:"relative",width:72,height:72}}>
                    <img src={img.dataUrl} alt={img.name} style={{width:72,height:72,objectFit:"cover",borderRadius:10,border:`1.5px solid ${T.border}`}}/>
                    <button onClick={()=>removeImg(null,i,true)}
                      style={{position:"absolute",top:-6,right:-6,width:20,height:20,borderRadius:"50%",background:T.red,border:"none",color:"#fff",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800}}>
                      ✕
                    </button>
                  </div>
                ))}
                {(form.images||[]).length<5&&(
                  <div style={{width:72,height:72,borderRadius:10,border:`2px dashed ${T.border2}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",background:T.bg,gap:2}}
                    onClick={()=>document.getElementById("msg-img-upload")?.click()}>
                    <div style={{fontSize:20,color:T.muted}}>📎</div>
                    <div style={{fontSize:9,color:T.muted,fontWeight:700}}>Thêm ảnh</div>
                  </div>
                )}
              </div>
              <input id="msg-img-upload" type="file" accept="image/*" multiple style={{display:"none"}} onChange={handleImages}/>
              {(form.images||[]).length>0&&(
                <div style={{fontSize:11,color:T.muted}}>Nhấn ảnh để xem trước. Bấm ✕ để xoá.</div>
              )}
            </div>

            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-primary" style={{flex:2}} onClick={save}>{editId?"Lưu thay đổi":"Thêm mẫu"}</button>
              <button className="btn btn-ghost" style={{flex:1}} onClick={()=>setModal(false)}>Huỷ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── REPORT PAGE ───────────────────────────────────────────────────────────────
function ReportPage({orders, customers, services}) {
  const [period, setPeriod] = useState("month");
  const paidOrders = orders.filter(o=>o.status==="paid");
  const totalRev   = paidOrders.reduce((s,o)=>s+o.total,0);
  const totalTips  = orders.reduce((s,o)=>s+(o.tips||0),0);
  const activeOrders = orders.filter(o=>o.status!=="cancel");

  // Repeat customers
  const repeatCusts = customers.filter(c=>orders.filter(o=>o.custId===c.id).length>1);
  const repeatRate  = customers.length>0?Math.round(repeatCusts.length/customers.length*100):0;

  // Avg spend
  const avgSpend = customers.length>0?Math.round(totalRev/customers.length):0;
  const avgTips  = customers.length>0?Math.round(totalTips/customers.length):0;

  // Service revenue
  const svcStats = services.map(s=>{
    const rev = paidOrders.reduce((sum,o)=>{
      const it=o.items.find(i=>i.svcId===s.id); if(!it) return sum;
      return sum+(s.type==="fixed"?s.price:calcQ(it.qty,s.price,s.price6));
    },0);
    const cnt = activeOrders.filter(o=>o.items.some(i=>i.svcId===s.id)).length;
    const tipAvg = cnt>0?Math.round(paidOrders.filter(o=>o.items.some(i=>i.svcId===s.id)).reduce((sum,o)=>sum+(o.tips||0),0)/Math.max(cnt,1)):0;
    const repCnt = customers.filter(c=>{const ords=orders.filter(o=>o.custId===c.id&&o.items.some(i=>i.svcId===s.id));return ords.length>1;}).length;
    return {...s, rev, cnt, tipAvg, repRate:cnt>0?Math.round(repCnt/Math.max(cnt,1)*100):0};
  }).filter(s=>s.cnt>0).sort((a,b)=>b.rev-a.rev);
  const maxRev = svcStats[0]?.rev||1;

  // Group stats
  const groupStats = [];
  activeOrders.forEach(o=>o.items.forEach(it=>{
    const grps=(it.groups&&it.groups.length)?it.groups:(it.group?[it.group]:[]);
    grps.forEach(g=>{
      const ex=groupStats.find(x=>x.n===g);
      if(ex) ex.c++; else groupStats.push({n:g,c:1});
    });
  }));
  groupStats.sort((a,b)=>b.c-a.c);

  // Tips leaderboard
  const tipsBoard = customers.map(c=>({
    ...c,
    tips:orders.filter(o=>o.custId===c.id).reduce((s,o)=>s+(o.tips||0),0),
    spent:paidOrders.filter(o=>o.custId===c.id).reduce((s,o)=>s+o.total,0),
    cnt:orders.filter(o=>o.custId===c.id).length,
  })).filter(c=>c.tips>0||c.spent>0).sort((a,b)=>b.spent+b.tips-(a.spent+a.tips));

  const WEEK_DATA = (() => {
    const result = [0,0,0,0,0,0,0];
    const today2 = new Date();
    paidOrders.forEach(o=>{
      if(!o.date) return;
      const [d,m,y] = (o.date||"").split("/").map(Number);
      if(!d||!m||!y) return;
      const oDate = new Date(y,m-1,d);
      const diff = Math.floor((today2-oDate)/(86400000));
      if(diff>=0&&diff<7) result[6-diff] += Number(o.total||0);
    });
    return result;
  })();
  const maxW = Math.max(...WEEK_DATA,1);

  const COLS = [T.green,T.blue,T.yellow,T.green,T.greenlt,T.purple,T.red];

  return(
    <div className="scroll-body">
      <div className="hdr">
        <div className="hdr-eye">Analytics</div>
        <div className="hdr-h1">Báo Cáo</div>
        <div className="hdr-sub">Tháng {new Date().getMonth()+1}/{new Date().getFullYear()}</div>
      </div>

      {/* Period tabs */}
      <div className="sec" style={{paddingTop:12}}>
        <div className="pill-row">
          {[{k:"week",l:"Tuần"},{k:"month",l:"Tháng"},{k:"all",l:"Tất cả"}].map(p=>(
            <button key={p.k} className={`pill ${period===p.k?"on":""}`} onClick={()=>setPeriod(p.k)}>{p.l}</button>
          ))}
        </div>
      </div>

      {/* Revenue breakdown */}
      <div className="sec">
        <div className="metric-big" style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div className="metric-label">Doanh thu xem bói</div>
              <div className="metric-value">{vnd(totalRev)}</div>
              <div className="metric-sub">+ {vnd(totalTips)} tips</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Tổng cộng</div>
              <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:22,color:T.yellow}}>{vnd(totalRev+totalTips)}</div>
            </div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          {[
            {l:"Đơn hoàn thành",v:paidOrders.length,ico:"📋",bg:T.greenbg},
            {l:"Tỷ lệ quay lại",v:`${repeatRate}%`,ico:"🔄",bg:T.bluebg},
            {l:"Chi tiêu TB",v:vnd(avgSpend),ico:"💰",bg:T.yellowbg},
            {l:"Tips TB",v:vnd(avgTips),ico:"💜",bg:T.purplebg},
          ].map(s=>(
            <div key={s.l} className="metric-sm" style={{background:s.bg}}>
              <div className="metric-sm-label">{s.ico} {s.l}</div>
              <div className="metric-sm-value" style={{fontSize:18}}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue vs Tips bar */}
      <div className="sec">
        <div className="sec-h"><div className="sec-t">💰 Doanh thu vs Tips</div></div>
        <div className="card">
          {[{l:"Xem bói",v:totalRev,c:T.green},{l:"Tips",v:totalTips,c:T.purple}].map((r,i)=>(
            <div key={i} className="rb-row" style={{marginBottom:i===0?12:0}}>
              <div className="rb-lbl">{r.l}</div>
              <div className="rb-track"><div className="rb-fill" style={{width:`${Math.round(r.v/Math.max(totalRev,totalTips,1)*100)}%`,background:r.c}}/></div>
              <div className="rb-val">{vnd(r.v)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Service analytics */}
      {svcStats.length>0&&(
        <div className="sec">
          <div className="sec-h"><div className="sec-t">🏆 Phân tích dịch vụ</div></div>
          {svcStats.map((s,i)=>(
            <div key={s.id} className="card" style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{fontSize:24}}>{s.ico}</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:700}}>{s.name}</div>
                    <div style={{fontSize:11,color:T.muted}}>{s.cnt} đơn · tips TB {vnd(s.tipAvg)}</div>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:16,color:T.green}}>{vnd(s.rev)}</div>
                  <div style={{fontSize:11,color:T.blue,fontWeight:600}}>{s.repRate}% quay lại</div>
                </div>
              </div>
              <div className="rb-track" style={{height:6}}>
                <div className="rb-fill" style={{width:`${Math.round(s.rev/maxRev*100)}%`,background:COLS[i]||T.green}}/>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Group analytics */}
      {groupStats.length>0&&(
        <div className="sec">
          <div className="sec-h"><div className="sec-t">❓ Chủ đề câu hỏi phổ biến</div></div>
          <div className="card">
            {groupStats.slice(0,6).map((g,i)=>(
              <div key={g.n} className="rb-row" style={{marginBottom:i<groupStats.length-1?10:0}}>
                <div className="rb-lbl" style={{fontSize:11}}>{g.n}</div>
                <div className="rb-track"><div className="rb-fill" style={{width:`${Math.round(g.c/groupStats[0].c*100)}%`,background:COLS[i]||T.green}}/></div>
                <div className="rb-val">{g.c} đơn</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips leaderboard → Khách thân thiết */}
      {tipsBoard.length>0&&(
        <div className="sec">
          <div className="sec-h"><div className="sec-t">💎 Khách thân thiết</div></div>
          {tipsBoard.slice(0,5).map((c,i)=>(
            <div key={c.id} className="row" style={{cursor:"default"}}>
              <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:18,color:[T.yellow,T.muted,"#CD7F32"][i]||T.muted,minWidth:24}}>#{i+1}</div>
              <div className="ava" style={{borderRadius:"50%",fontSize:20}}>{c.ava}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700}}>{c.nick||c.name}</div>
                <div style={{fontSize:11,color:T.muted}}>{c.cnt} lần xem · chi {vnd(c.spent)}</div>
              </div>
              {c.tips>0&&<div style={{fontFamily:"Nunito",fontWeight:900,fontSize:14,color:T.purple}}>+{vnd(c.tips)} tips</div>}
            </div>
          ))}
        </div>
      )}

      {/* 7-day bar chart */}
      <div className="sec">
        <div className="sec-h"><div className="sec-t">📊 Doanh thu 7 ngày</div></div>
        <div className="card">
          <div className="bc">
            {WEEK_DAYS.map((d,i)=>(
              <div key={d} className="bcol">
                <div className="bbar" style={{height:`${(WEEK_DATA[i]/maxW)*70}px`,background:COLS[i],borderRadius:6,opacity:.85}}/>
                <div className="blbl">{d}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:10,paddingTop:10,borderTop:`1px dashed ${T.border}`}}>
            <div style={{fontSize:11,color:T.muted,fontWeight:600}}>Tổng tuần</div>
            <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:14,color:T.green}}>{vnd(WEEK_DATA.reduce((s,v)=>s+v,0))}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SERVICE MANAGER ───────────────────────────────────────────────────────────
function ServiceManager({services, setServices, toast}) {
  const [modal,  setModal]  = useState(false);
  const [editId, setEditId] = useState(null);
  const [delId,  setDelId]  = useState(null);
  const [form,   setForm]   = useState({name:"",ico:"💜",type:"per_q",price:"",price6:"",dur:"60",active:true});

  const openNew  = () => { setForm({name:"",ico:"💜",type:"per_q",price:"",price6:"",dur:"60",active:true}); setEditId(null); setModal(true); };
  const openEdit = s => { setForm({name:s.name,ico:s.ico,type:s.type,price:String(s.price),price6:String(s.price6||""),dur:String(s.dur||60),active:s.active}); setEditId(s.id); setModal(true); };

  const save = () => {
    if(!form.name.trim()||!form.price) { toast("⚠️ Điền đủ tên và giá!"); return; }
    const d={...form,price:Number(form.price),price6:Number(form.price6)||0,dur:Number(form.dur)||60};
    if(editId) { setServices(p=>p.map(s=>s.id===editId?{...s,...d}:s)); toast("✅ Đã cập nhật!"); }
    else { setServices(p=>[...p,{id:uid(),...d,sold:0}]); toast("✅ Đã thêm dịch vụ!"); }
    setModal(false);
  };

  const p1=Number(form.price)||0; const p6=Number(form.price6)||p1;

  return(
    <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontFamily:"Nunito",fontWeight:700,fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:1}}>Dịch vụ ({services.length})</div>
        <button className="xs xs-green" onClick={openNew}>+ Thêm dịch vụ</button>
      </div>

      {services.length===0&&<EmptyState ico="✨" title="Chưa có dịch vụ nào"/>}

      {services.map(s=>(
        <div key={s.id} className="card" style={{marginBottom:10,opacity:s.active?1:.6}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div className="ava" style={{fontSize:20}}>{s.ico}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700}}>{s.name}</div>
              <div style={{fontSize:11,color:T.muted,marginTop:2}}>
                {s.type==="fixed"?vnd(s.price):`${(s.price/1000).toFixed(0)}k/câu(1-5)${s.price6?` · ${(s.price6/1000).toFixed(0)}k(6+)`:""}`}
                {s.dur?` · ${s.dur} phút`:""}
              </div>
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <button className="xs" style={{padding:"6px 10px"}} onClick={()=>openEdit(s)}>✏️</button>
              <button className="xs xs-red" style={{padding:"6px 10px"}} onClick={()=>setDelId(s.id===delId?null:s.id)}>🗑</button>
              <button className={`tog ${s.active?"on":"off"}`} onClick={()=>setServices(p=>p.map(x=>x.id===s.id?{...x,active:!x.active}:x))}/>
            </div>
          </div>
          {delId===s.id&&(
            <div className="card card-red" style={{marginTop:10}}>
              <div style={{fontSize:13,fontWeight:700,color:T.red,marginBottom:8}}>Xoá "{s.name}"?</div>
              <div style={{display:"flex",gap:8}}>
                <button className="xs xs-red" onClick={()=>{setServices(p=>p.filter(x=>x.id!==s.id));setDelId(null);toast("🗑 Đã xoá!");}}>Xoá</button>
                <button className="xs" onClick={()=>setDelId(null)}>Huỷ</button>
              </div>
            </div>
          )}
        </div>
      ))}

      {modal&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="sheet">
            <DragHandle/>
            <div className="sheet-title">{editId?"Sửa dịch vụ":"Thêm dịch vụ mới"}</div>
            <div className="f">
              <label>Icon</label>
              <div className="ico-pick">{ICOS.map(ic=>(
                <button key={ic} className="ico-btn" onClick={()=>setForm(p=>({...p,ico:ic}))}
                  style={{background:form.ico===ic?T.ink:"transparent",border:`1.5px solid ${form.ico===ic?T.ink:T.border}`}}>{ic}</button>
              ))}</div>
            </div>
            <div className="f"><label>Tên dịch vụ</label><input placeholder="Tarot Tình Yêu" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
            <div className="f">
              <label>Loại giá</label>
              <div style={{display:"flex",gap:8}}>
                {[{k:"per_q",l:"💬 Theo câu"},{k:"fixed",l:"📦 Trọn gói"}].map(t=>(
                  <button key={t.k} onClick={()=>setForm(p=>({...p,type:t.k}))}
                    style={{flex:1,padding:11,borderRadius:12,border:`1.5px solid ${form.type===t.k?T.ink:T.border2}`,background:form.type===t.k?T.ink:"transparent",fontFamily:"Nunito",fontWeight:700,fontSize:13,cursor:"pointer",color:form.type===t.k?"#fff":T.muted}}>
                    {t.l}
                  </button>
                ))}
              </div>
            </div>
            {form.type==="per_q"?(
              <>
                <div className="f"><label>Giá câu 1–5 (VND/câu)</label><input type="number" placeholder="20000" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))}/></div>
                <div className="f"><label>Giá câu 6+ (để trống = cùng giá)</label><input type="number" placeholder="15000" value={form.price6} onChange={e=>setForm(p=>({...p,price6:e.target.value}))}/></div>
                {form.price&&(
                  <div className="card card-green" style={{marginBottom:12}}>
                    <div style={{fontSize:10,fontWeight:700,color:T.green,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Xem trước tính tiền</div>
                    {[3,5,7,10].map(q=>{const amt=q<=5?q*p1:5*p1+(q-5)*p6;return(
                      <div key={q} style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:600,padding:"4px 0",borderBottom:`1px dashed ${T.border}`}}>
                        <span style={{color:T.muted}}>{q} câu</span>
                        <span style={{fontFamily:"Nunito",fontWeight:800,color:T.green}}>{vnd(amt)}</span>
                      </div>
                    );})}
                  </div>
                )}
              </>
            ):(
              <div className="f"><label>Giá trọn gói (VND)</label><input type="number" placeholder="100000" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))}/></div>
            )}
            <div className="f"><label>Thời lượng (phút)</label><input type="number" placeholder="60" value={form.dur} onChange={e=>setForm(p=>({...p,dur:e.target.value}))}/></div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-primary" style={{flex:2}} onClick={save}>{editId?"Lưu":"Thêm"}</button>
              <button className="btn btn-ghost" style={{flex:1}} onClick={()=>setModal(false)}>Huỷ</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



// ── SETTINGS SUB-COMPONENTS (extracted to avoid hooks-in-inner-component crash) ───
function ShopForm({shop, setShop, toast, onClose}) {
  const [f,setF] = useState({name:shop.name||"",tagline:shop.tagline||"",phone:shop.phone||"",fb:shop.fb||"",footer:shop.footer||""});
  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet">
        <DragHandle/>
        <div className="sheet-title">🏪 Thông tin shop</div>
        <div className="f"><label>Tên shop</label><input value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))} placeholder="Mitchi The Mighty"/></div>
        <div className="f"><label>Tagline / Mô tả ngắn</label><input value={f.tagline} onChange={e=>setF(p=>({...p,tagline:e.target.value}))} placeholder="Tarot and Lenormand Reader"/></div>
        <div className="f"><label>Số điện thoại</label><input type="tel" value={f.phone} onChange={e=>setF(p=>({...p,phone:e.target.value}))} placeholder="0912345678"/></div>
        <div className="f"><label>Facebook / Zalo / Instagram</label><input value={f.fb} onChange={e=>setF(p=>({...p,fb:e.target.value}))} placeholder="Link hoặc tên trang"/></div>
        <div className="f"><label>Lời cảm ơn cuối hóa đơn</label><input value={f.footer} onChange={e=>setF(p=>({...p,footer:e.target.value}))} placeholder="Xin cảm ơn quý khách — Hẹn gặp lại!"/></div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-primary" style={{flex:2}} onClick={()=>{setShop(p=>({...p,...f}));onClose();toast("✅ Đã lưu thông tin shop! 🐸");}}>Lưu</button>
          <button className="btn btn-ghost" style={{flex:1}} onClick={onClose}>Huỷ</button>
        </div>
      </div>
    </div>
  );
}

function BankForm({shop, setShop, toast, onClose}) {
  const [f,setF] = useState({acbNo:shop.acbNo||"",acbName:shop.acbName||"",vcbNo:shop.vcbNo||"",vcbName:shop.vcbName||"",defaultQr:shop.defaultQr||"acb"});
  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet">
        <DragHandle/>
        <div className="sheet-title">💳 Tài khoản ngân hàng</div>
        <div style={{fontFamily:"Nunito",fontWeight:700,fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>ACB</div>
        <div className="f"><label>Số tài khoản ACB</label><input value={f.acbNo} onChange={e=>setF(p=>({...p,acbNo:e.target.value}))} placeholder="6205237"/></div>
        <div className="f"><label>Tên chủ tài khoản ACB</label><input value={f.acbName} onChange={e=>setF(p=>({...p,acbName:e.target.value}))} placeholder="TON NU HONG CHAU"/></div>
        <div style={{fontFamily:"Nunito",fontWeight:700,fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:1,margin:"12px 0 8px"}}>Vietcombank</div>
        <div className="f"><label>Số tài khoản VCB</label><input value={f.vcbNo} onChange={e=>setF(p=>({...p,vcbNo:e.target.value}))} placeholder="Để trống nếu không dùng"/></div>
        <div className="f"><label>Tên chủ tài khoản VCB</label><input value={f.vcbName} onChange={e=>setF(p=>({...p,vcbName:e.target.value}))} placeholder="TON NU HONG CHAU"/></div>
        <div className="f">
          <label>Ngân hàng mặc định trên hóa đơn</label>
          <div style={{display:"flex",gap:8}}>
            {["acb","vcb"].map(b=>(
              <button key={b} onClick={()=>setF(p=>({...p,defaultQr:b}))}
                style={{flex:1,padding:11,borderRadius:12,border:`2px solid ${f.defaultQr===b?T.ink:T.border2}`,background:f.defaultQr===b?T.ink:"transparent",fontFamily:"Nunito",fontWeight:700,fontSize:13,cursor:"pointer",color:f.defaultQr===b?"#fff":T.muted}}>
                🏦 {b==="acb"?"ACB":"VCB"}
              </button>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-primary" style={{flex:2}} onClick={()=>{setShop(p=>({...p,...f}));onClose();toast("✅ Đã lưu tài khoản ngân hàng! 🐸");}}>Lưu</button>
          <button className="btn btn-ghost" style={{flex:1}} onClick={onClose}>Huỷ</button>
        </div>
      </div>
    </div>
  );
}

function NotifForm({shop, setShop, toast, onClose}) {
  const [f,setF] = useState({unpaid:shop.notifUnpaid??true,booking:shop.notifBooking??true,followup:shop.notifFollowup??true});
  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet">
        <DragHandle/>
        <div className="sheet-title">🔔 Thông báo</div>
        <div className="card" style={{marginBottom:12}}>
          {[
            {k:"unpaid",  l:"Nhắc đơn chưa thanh toán",    s:"Hiện cảnh báo trên Dashboard"},
            {k:"booking", l:"Nhắc booking sắp tới",         s:"Hiện trong Today Operations"},
            {k:"followup",l:"Nhắc khách lâu chưa quay lại", s:"Sau 21 ngày không có đơn"},
          ].map((x,i)=>(
            <div key={x.k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:i<2?`1px dashed ${T.border}`:"none"}}>
              <div>
                <div style={{fontSize:14,fontWeight:700}}>{x.l}</div>
                <div style={{fontSize:11,color:T.muted,marginTop:2}}>{x.s}</div>
              </div>
              <button className={`tog ${f[x.k]?"on":"off"}`} onClick={()=>setF(p=>({...p,[x.k]:!p[x.k]}))}/>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-primary" style={{flex:2}} onClick={()=>{setShop(p=>({...p,notifUnpaid:f.unpaid,notifBooking:f.booking,notifFollowup:f.followup}));onClose();toast("✅ Đã lưu cài đặt thông báo!");}}>Lưu</button>
          <button className="btn btn-ghost" style={{flex:1}} onClick={onClose}>Huỷ</button>
        </div>
      </div>
    </div>
  );
}

function PwaInfo({onClose}) {
  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet">
        <DragHandle/>
        <div className="sheet-title">📱 Cài như app (PWA)</div>
        <div className="card card-green" style={{marginBottom:14}}>
          <div style={{fontWeight:700,marginBottom:6}}>✅ App đã sẵn sàng cài!</div>
          <div style={{fontSize:13,color:T.muted,lineHeight:1.6}}>Link: <strong>mitchi-shop.vercel.app</strong></div>
        </div>
        {[
          {ico:"🍎",title:"iPhone / iPad (Safari)",steps:["Mở Safari → vào link app","Nhấn nút chia sẻ ⬆️ ở dưới","Chọn 'Thêm vào màn hình chính'","Nhấn 'Thêm' — xong! 🎉"]},
          {ico:"🤖",title:"Android (Chrome)",steps:["Mở Chrome → vào link app","Nhấn menu ⋮ góc trên phải","Chọn 'Thêm vào màn hình chính'","Nhấn 'Thêm' — xong! 🎉"]},
        ].map(d=>(
          <div key={d.ico} className="card" style={{marginBottom:10}}>
            <div style={{fontWeight:800,marginBottom:8}}>{d.ico} {d.title}</div>
            {d.steps.map((s,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:i<d.steps.length-1?6:0}}>
                <div style={{width:20,height:20,borderRadius:"50%",background:T.ink,color:"#fff",fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</div>
                <div style={{fontSize:13,color:T.muted}}>{s}</div>
              </div>
            ))}
          </div>
        ))}
        <button className="btn btn-ghost" onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
}

// ── TOPIC MANAGER — quản lý chủ đề câu hỏi ──────────────────────────────────
function TopicManager({topics, setTopics, toast}) {
  const [newTopic, setNewTopic] = useState("");
  const [editing, setEditing] = useState(null); // {idx, val}

  const add = () => {
    const t = newTopic.trim();
    if(!t) return;
    if(topics.includes(t)) { toast("⚠️ Chủ đề đã tồn tại!"); return; }
    setTopics(p=>[...p, t]);
    setNewTopic("");
    toast("✅ Đã thêm chủ đề!");
  };

  const del = idx => {
    setTopics(p=>p.filter((_,i)=>i!==idx));
    toast("🗑 Đã xoá chủ đề!");
  };

  const saveEdit = () => {
    if(!editing) return;
    const t = editing.val.trim();
    if(!t) return;
    setTopics(p=>p.map((x,i)=>i===editing.idx?t:x));
    setEditing(null);
    toast("✅ Đã sửa chủ đề!");
  };

  return(
    <div style={{marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{fontFamily:"Nunito",fontWeight:700,fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:1}}>
          Chủ đề câu hỏi ({topics.length})
        </div>
      </div>

      {/* Add new topic */}
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <input value={newTopic} onChange={e=>setNewTopic(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&add()}
          placeholder="Thêm chủ đề mới..." 
          style={{flex:1,padding:"9px 12px",borderRadius:10,border:`2px solid ${T.ink}`,background:T.card,fontFamily:"Nunito Sans",fontSize:13,fontWeight:600,outline:"none",boxShadow:`2px 2px 0 ${T.ink}`,color:T.ink}}/>
        <button className="xs xs-green" onClick={add} style={{flexShrink:0}}>+ Thêm</button>
      </div>

      {/* Topic list */}
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {topics.map((t,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:8,background:T.card,borderRadius:10,border:`1.5px solid ${T.ink}`,padding:"8px 12px",boxShadow:`2px 2px 0 ${T.ink}`}}>
            {editing?.idx===i ? (
              <>
                <input value={editing.val} onChange={e=>setEditing(p=>({...p,val:e.target.value}))}
                  onKeyDown={e=>e.key==="Enter"&&saveEdit()}
                  style={{flex:1,padding:"5px 8px",borderRadius:8,border:`1.5px solid ${T.green}`,fontFamily:"Nunito Sans",fontSize:13,fontWeight:600,outline:"none",color:T.ink}}
                  autoFocus/>
                <button className="xs xs-green" style={{padding:"5px 10px",fontSize:11}} onClick={saveEdit}>✓</button>
                <button className="xs" style={{padding:"5px 10px",fontSize:11}} onClick={()=>setEditing(null)}>✕</button>
              </>
            ) : (
              <>
                <div style={{flex:1,fontSize:13,fontWeight:700,color:T.ink}}>📌 {t}</div>
                <button className="xs" style={{padding:"5px 10px",fontSize:11}} onClick={()=>setEditing({idx:i,val:t})}>✏️</button>
                <button className="xs xs-red" style={{padding:"5px 10px",fontSize:11}} onClick={()=>del(i)}>🗑</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


// ── SETTINGS PAGE ─────────────────────────────────────────────────────────────
function SettingsPage({logout, toast, services, setServices, shop, setShop, topics, setTopics}) {
  const [section, setSection] = useState(null);

  return(
    <div className="scroll-body">
      <div className="hdr">
        <div className="hdr-eye">Tùy chỉnh</div>
        <div className="hdr-h1">Cài Đặt</div>
      </div>
      <div className="sec">
        <div className="card card-green" style={{marginBottom:16,display:"flex",alignItems:"center",gap:14}}>
          <img src="/images/logo.jpg" alt="Logo" style={{width:52,height:52,objectFit:"contain",borderRadius:10,flexShrink:0}} onError={e=>{e.target.outerHTML="<div style='width:52px;height:52px;font-size:36px;display:flex;align-items:center;justify-content:center'>🐸</div>";}}/>
          <div>
            <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:16}}>{shop.name}</div>
            <div style={{fontSize:12,color:T.muted}}>{shop.tagline}</div>
          </div>
        </div>

        <ServiceManager services={services} setServices={setServices} toast={toast}/>

        <div style={{fontFamily:"Nunito",fontWeight:700,fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:1,margin:"20px 0 10px"}}>Chủ đề câu hỏi</div>
        <TopicManager topics={topics} setTopics={setTopics} toast={toast}/>

        <div style={{fontFamily:"Nunito",fontWeight:700,fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:1,margin:"20px 0 10px"}}>Shop & Tài Khoản</div>

        {[
          {ico:"🏪",t:"Thông tin shop",     s:`${shop.name} · ${shop.tagline}`,                                     fn:()=>setSection("shop")},
          {ico:"💳",t:"Tài khoản ngân hàng",s:`ACB ${shop.acbNo||"—"}${shop.vcbNo?" · VCB "+shop.vcbNo:""}`,       fn:()=>setSection("bank")},
          {ico:"🔔",t:"Thông báo",          s:"Nhắc booking, chưa TT, follow-up",                                  fn:()=>setSection("notif")},
          {ico:"📱",t:"Cài như app (PWA)",  s:"Thêm vào màn hình chính điện thoại",                                fn:()=>setSection("pwa")},
          {ico:"☁️",t:"Sao lưu & đồng bộ", s:"Cần setup Supabase để lưu data thật",                              fn:()=>window.open('https://supabase.com/dashboard','_blank')},
        ].map(x=>(
          <div key={x.t} className="row" onClick={x.fn}>
            <div style={{fontSize:22,width:36,textAlign:"center",flexShrink:0}}>{x.ico}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700}}>{x.t}</div>
              <div style={{fontSize:11,color:T.muted,marginTop:2}}>{x.s}</div>
            </div>
            <div style={{color:T.border2}}>{I.arr}</div>
          </div>
        ))}

        <div style={{height:16}}/>
        <button className="btn btn-ghost" style={{color:T.red,borderColor:T.red}} onClick={logout}>Đăng xuất</button>
      </div>

      {section==="shop"  && <ShopForm  shop={shop} setShop={setShop} toast={toast} onClose={()=>setSection(null)}/>}
      {section==="bank"  && <BankForm  shop={shop} setShop={setShop} toast={toast} onClose={()=>setSection(null)}/>}
      {section==="notif" && <NotifForm shop={shop} setShop={setShop} toast={toast} onClose={()=>setSection(null)}/>}
      {section==="pwa"   && <PwaInfo   onClose={()=>setSection(null)}/>}
    </div>
  );
}


// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({nav, orders, setOrders, customers, services, bookings, setBookings, toast, shop}) {
  const [fabOpen, setFabOpen] = useState(false);

  const todayOrds  = orders.filter(o=>o.date===todayStr());
  const unpaidOrds = orders.filter(o=>["new","view","done"].includes(o.status));
  const revToday   = todayOrds.filter(o=>o.status==="paid").reduce((s,o)=>s+o.total,0);
  const tipsToday  = todayOrds.reduce((s,o)=>s+(o.tips||0),0);
  const todayBks   = bookings.filter(b=>b.date===todayStr());
  const pendingBks = todayBks.filter(b=>b.status==="pending").length;

  const custOrders = id => orders.filter(o=>o.custId===id);
  const daysSince  = dateStr => {
    if(!dateStr||dateStr==="-"||dateStr==="") return 999;
    try {
      let d,m,y;
      if(dateStr.includes("/")) {[d,m,y]=dateStr.split("/").map(Number);}
      else if(dateStr.includes("-")) {[y,m,d]=dateStr.split("-").map(Number);}
      else return 999;
      if(!d||!m||!y) return 999;
      return Math.floor((new Date()-new Date(y,m-1,d))/(86400000));
    } catch { return 999; }
  };
  const needFollowUp = customers.filter(c=>daysSince(c.lastOrder||"")>21&&custOrders(c.id).length>0);
  const topSvc = [...services].filter(s=>s.active).sort((a,b)=>b.sold-a.sold)[0];
  // Compute real revenue for last 7 days
  const WEEK_DATA = (() => {
    const result = [0,0,0,0,0,0,0];
    const today2 = new Date();
    orders.filter(o=>o.status==="paid").forEach(o=>{
      if(!o.date) return;
      const [d,m,y] = (o.date||"").split("/").map(Number);
      if(!d||!m||!y) return;
      const oDate = new Date(y,m-1,d);
      const diff = Math.floor((today2-oDate)/(86400000));
      if(diff>=0&&diff<7) result[6-diff] += Number(o.total||0);
    });
    return result;
  })();
  const maxW=Math.max(...WEEK_DATA,1);
  const COLS=[T.green,T.blue,T.yellow,T.green,T.greenlt,T.purple,T.red];

  const advanceOrder = id => {
    setOrders(p=>p.map(o=>{
      if(o.id!==id) return o;
      const idx=STATUS_FLOW.indexOf(o.status);
      if(idx>=STATUS_FLOW.length-2) return o;
      return {...o,status:STATUS_FLOW[idx+1]};
    }));
    toast("✅ Đã cập nhật trạng thái!");
  };

  const confirmBk = id => { setBookings(p=>p.map(b=>b.id===id?{...b,status:"confirmed"}:b)); toast("✅ Đã xác nhận booking!"); };

  return(
    <div className="scroll-body">
      {/* Header */}
      <div className="hdr">
        <div className="hdr-eye">🐸 Hôm nay · {new Date().toLocaleDateString("vi-VN",{weekday:"long",day:"numeric",month:"long"})}</div>
        <div className="hdr-h1">Mitchi Shop ✨</div>
        {unpaidOrds.length>0&&(
          <div className="hdr-badge">
            <span style={{color:T.yellow}}>●</span> {unpaidOrds.length} đơn chưa thu tiền
          </div>
        )}
      </div>

      {/* SECTION 1 — Priority metrics */}
      <div className="sec">
        <div className="metric-big" style={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div className="metric-label">Doanh thu hôm nay</div>
              <div className="metric-value">{vnd(revToday)}</div>
              {tipsToday>0&&<div className="metric-sub">+{vnd(tipsToday)} tips 💜</div>}
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,.4)",textTransform:"uppercase",marginBottom:3}}>Đơn</div>
              <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:22,color:T.yellow}}>{todayOrds.length}</div>
            </div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {[
            {l:"Booking hôm nay",v:todayBks.length,ico:"📅",bg:T.bluebg,c:T.blue},
            {l:"Slot chờ xác nhận",v:pendingBks,ico:"⏳",bg:T.yellowbg,c:"#92660A"},
            {l:"Chưa thu tiền",v:unpaidOrds.length,ico:"💸",bg:T.redbg,c:T.red},
          ].map(s=>(
            <div key={s.l} className="metric-sm" style={{background:s.bg,padding:12,border:`2px solid ${T.ink}`,borderRadius:14,boxShadow:`3px 3px 0 ${T.ink}`}}>
              <div style={{fontSize:18,marginBottom:4}}>{s.ico}</div>
              <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:22,color:s.c}}>{s.v}</div>
              <div style={{fontSize:10,fontWeight:700,color:s.c,opacity:.8,textTransform:"uppercase",letterSpacing:.5,marginTop:2,lineHeight:1.2}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2 — Action Required */}
      {unpaidOrds.length>0&&(
        <div className="sec">
          <div className="sec-h"><div className="sec-t">⚡ Cần xử lý</div></div>
          {unpaidOrds.slice(0,3).map(o=>{
            const c=customers.find(x=>x.id===o.custId);
            const nl=STATUS_MAP[STATUS_FLOW[STATUS_FLOW.indexOf(o.status)+1]];
            return(
              <div key={o.id} className="action-card" style={{borderLeft:`3px solid ${o.status==="done"?T.yellow:o.status==="view"?T.purple:T.blue}`}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <div style={{fontSize:22}}>{c?.ava||"👤"}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700}}>{c?.name} · <Badge s={o.status}/></div>
                    <div style={{fontSize:11,color:T.muted}}>{o.items.map(it=>{const s=services.find(x=>x.id===it.svcId);return s?s.name:"";}).filter(Boolean).join(" + ")} · {vnd(o.total)}</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {nl&&<button className="xs xs-green" onClick={()=>advanceOrder(o.id)}>→ {nl[0]}</button>}
                  <button className="xs" onClick={()=>{navigator.clipboard?.writeText(REPLIES[3].body);toast("📋 Copy nhắc TT!");}}>💸 Nhắc TT</button>
                  <button className="xs" onClick={()=>nav("orders")}>Xem đơn</button>
                </div>
              </div>
            );
          })}
          {unpaidOrds.length>3&&(
            <button className="xs" style={{width:"100%",textAlign:"center",padding:10}} onClick={()=>nav("orders")}>
              Xem tất cả {unpaidOrds.length} đơn →
            </button>
          )}
        </div>
      )}

      {/* Booking hôm nay cần xác nhận */}
      {pendingBks>0&&(
        <div className="sec">
          <div className="sec-h"><div className="sec-t">📅 Booking chờ xác nhận</div></div>
          {todayBks.filter(b=>b.status==="pending").map(b=>{
            const c=customers.find(x=>x.id===b.custId);
            return(
              <div key={b.id} className="action-card action-card-yellow">
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <div style={{fontSize:22}}>{c?.ava||"👤"}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700}}>{b.time} · {c?.name}</div>
                    <div style={{fontSize:11,color:T.muted}}>{services.find(s=>s.id===b.svcId)?.name||"Dịch vụ"}</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button className="xs xs-green" onClick={()=>confirmBk(b.id)}>✅ Xác nhận</button>
                  <button className="xs" onClick={()=>nav("booking")}>Xem lịch</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Follow-up alert */}
      {needFollowUp.length>0&&(
        <div className="sec">
          <div className="action-card action-card-purple">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{fontWeight:700,color:T.purple}}>📌 {needFollowUp.length} khách lâu chưa quay lại</div>
              <button className="xs xs-purple" onClick={()=>nav("customers")}>Xem</button>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {needFollowUp.slice(0,3).map(c=>(
                <button key={c.id} className="xs" style={{background:T.purplebg,borderColor:T.purple,color:T.purple}}
                  onClick={()=>{navigator.clipboard?.writeText(REPLIES[6].body.replace("bạn",c.nick||c.name));toast(`📋 Copy tin follow-up cho ${c.nick||c.name}!`);}}>
                  {c.ava} {c.nick||c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Today bookings confirmed */}
      {todayBks.filter(b=>b.status==="confirmed").length>0&&(
        <div className="sec">
          <div className="sec-h">
            <div className="sec-t">🗓 Lịch hôm nay</div>
            <span className="sec-a" onClick={()=>nav("booking")}>Xem tất cả</span>
          </div>
          {todayBks.filter(b=>b.status==="confirmed").map(b=>{
            const c=customers.find(x=>x.id===b.custId);
            return(
              <div key={b.id} className="row" style={{borderLeft:`3px solid ${T.green}`}}>
                <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:18,minWidth:50,color:T.ink}}>{b.time}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700}}>{c?.name}</div>
                  <div style={{fontSize:11,color:T.muted}}>{services.find(s=>s.id===b.svcId)?.name||"Dịch vụ"}{b.notes?` · ${b.notes}`:""}</div>
                </div>
                <span className="bd bd-confirm">XÁC NHẬN</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Business insights */}
      <div className="sec">
        <div className="sec-h"><div className="sec-t">📊 Doanh thu tuần</div><span className="sec-a" onClick={()=>nav("report")}>Chi tiết</span></div>
        <div className="card">
          <div className="bc">
            {WEEK_DAYS.map((d,i)=>(
              <div key={d} className="bcol">
                <div className="bbar" style={{height:`${(WEEK_DATA[i]/maxW)*70}px`,background:COLS[i]}}/>
                <div className="blbl">{d}</div>
              </div>
            ))}
          </div>
          {topSvc&&(
            <div style={{marginTop:12,paddingTop:10,borderTop:`1px dashed ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:12,color:T.muted,fontWeight:600}}>Hot nhất tuần</div>
              <div style={{fontSize:13,fontWeight:700,color:T.green}}>{topSvc.ico} {topSvc.name}</div>
            </div>
          )}
        </div>
      </div>

      {/* FAB with quick actions */}
      {fabOpen&&(
        <>
          <div style={{position:"fixed",inset:0,zIndex:97}} onClick={()=>setFabOpen(false)}/>
          <div className="fab-menu">
            {[
              {ico:"🐸",l:"Thêm khách mới",fn:()=>{setFabOpen(false);nav("customers");}},
              {ico:"📋",l:"Tạo đơn mới",   fn:()=>{setFabOpen(false);nav("orders");}},
              {ico:"📅",l:"Tạo booking",    fn:()=>{setFabOpen(false);nav("booking");}},
              {ico:"💬",l:"Copy tin mẫu",   fn:()=>{setFabOpen(false);nav("messages");}},
            ].map(q=>(
              <div key={q.l} className="fab-item" onClick={q.fn}>
                <div className="fab-item-btn">{q.ico} {q.l}</div>
                <div className="fab-dot">{q.ico}</div>
              </div>
            ))}
          </div>
        </>
      )}
      <button className="fab" onClick={()=>setFabOpen(v=>!v)} style={{background:fabOpen?T.red:T.green}}>
        {fabOpen?I.x:I.plus}
      </button>
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function Login({onLogin}) {
  const [tab, setTab]   = useState("login");  // "login" | "signup"
  const [f,   setF]     = useState({e:"",p:"",p2:""});
  const [err, setErr]   = useState("");
  const [load,setLoad]  = useState(false);

  const go = async () => {
    if(!f.e||!f.p){setErr("Điền đủ email và mật khẩu!"); return;}
    if(tab==="signup"&&f.p!==f.p2){setErr("Mật khẩu không khớp!"); return;}
    if(f.p.length<6){setErr("Mật khẩu tối thiểu 6 ký tự!"); return;}
    setLoad(true); setErr("");
    try {
      const action = tab==="login" ? "token?grant_type=password" : "signup";
      await sbAuth(action, f.e, f.p);
      onLogin();
    } catch(e) {
      const msg = e.message||"";
      if(msg.includes("Invalid login")) setErr("Sai email hoặc mật khẩu!");
      else if(msg.includes("already registered")) setErr("Email đã được đăng ký! Hãy đăng nhập.");
      else if(msg.includes("confirm")) setErr("✅ Đã gửi email xác nhận — kiểm tra hộp thư rồi đăng nhập!");
      else setErr(msg||"Lỗi kết nối, thử lại!");
    }
    setLoad(false);
  };
  return(
    <div className="login-bg">
      {/* Cloud + Frog decorations */}
      <div style={{position:"absolute",top:40,left:-30,width:150,height:65,background:"rgba(255,255,255,.5)",borderRadius:50,border:`2px solid ${T.ink}`,zIndex:0}}/>
      <div style={{position:"absolute",top:20,left:60,width:100,height:45,background:"rgba(255,255,255,.4)",borderRadius:40,border:`2px solid ${T.ink}`,zIndex:0}}/>
      <div style={{position:"absolute",top:55,right:-20,width:130,height:55,background:"rgba(255,255,255,.45)",borderRadius:45,border:`2px solid ${T.ink}`,zIndex:0}}/>
      <div style={{position:"absolute",bottom:80,left:-40,width:180,height:70,background:"rgba(255,255,255,.3)",borderRadius:50,border:`2px solid ${T.ink}`,zIndex:0}}/>
      <div style={{position:"absolute",bottom:120,right:-30,width:120,height:50,background:"rgba(255,255,255,.35)",borderRadius:40,border:`2px solid ${T.ink}`,zIndex:0}}/>
      <div style={{position:"absolute",top:52,left:18,fontSize:26,zIndex:1,transform:"rotate(-15deg)",opacity:.7}}>🐸</div>
      <div style={{position:"absolute",top:28,right:22,fontSize:18,zIndex:1,transform:"rotate(10deg)",opacity:.6}}>🐸</div>
      <div style={{position:"absolute",bottom:95,right:10,fontSize:22,zIndex:1,transform:"rotate(-8deg)",opacity:.65}}>🐸</div>
      <div style={{position:"absolute",bottom:88,left:8,fontSize:16,zIndex:1,transform:"rotate(12deg)",opacity:.5}}>🐸</div>
      <div style={{position:"relative",zIndex:1,textAlign:"center",marginBottom:32}}>
        <div style={{fontSize:110,lineHeight:1,marginBottom:4,filter:"drop-shadow(0 6px 0 rgba(26,46,31,.2))",userSelect:"none",animation:"frogBob 2.5s ease-in-out infinite",display:"block",textAlign:"center"}}>🐸</div>
        <style>{`@keyframes frogBob{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-10px) rotate(3deg)}}`}</style>
        <div style={{fontFamily:"Nunito",fontSize:38,fontWeight:900,color:T.ink,letterSpacing:-1}}>Mitchi</div>
        <div style={{fontSize:13,fontWeight:800,color:T.ink,opacity:.65,marginTop:4,letterSpacing:.5}}>Shop Manager · Tarot & Lenormand</div>
      </div>
      <div style={{background:T.card,border:`2.5px solid ${T.ink}`,borderRadius:20,padding:24,width:"100%",maxWidth:360,boxShadow:`5px 5px 0 ${T.ink}`,position:"relative",zIndex:1}}>
        {/* Tab Đăng nhập / Đăng ký */}
        <div style={{display:"flex",gap:8,marginBottom:18}}>
          {[{k:"login",l:"Đăng nhập"},{k:"signup",l:"Đăng ký"}].map(t=>(
            <button key={t.k} onClick={()=>{setTab(t.k);setErr("");}}
              style={{flex:1,padding:"9px",borderRadius:10,border:`2px solid ${tab===t.k?T.ink:T.border}`,background:tab===t.k?T.ink:"transparent",fontFamily:"Nunito",fontWeight:800,fontSize:13,cursor:"pointer",color:tab===t.k?"#fff":T.muted,transition:"all .15s"}}>
              {t.l}
            </button>
          ))}
        </div>
        <div className="f"><label style={{color:T.muted}}>Email</label>
          <input type="email" placeholder="email@example.com" value={f.e}
            onChange={e=>setF(p=>({...p,e:e.target.value}))}
            onKeyDown={e=>e.key==="Enter"&&go()}/>
        </div>
        <div className="f"><label style={{color:T.muted}}>Mật khẩu</label>
          <input type="password" placeholder="Tối thiểu 6 ký tự" value={f.p}
            onChange={e=>setF(p=>({...p,p:e.target.value}))}
            onKeyDown={e=>e.key==="Enter"&&go()}/>
        </div>
        {tab==="signup"&&(
          <div className="f"><label style={{color:T.muted}}>Xác nhận mật khẩu</label>
            <input type="password" placeholder="Nhập lại mật khẩu" value={f.p2}
              onChange={e=>setF(p=>({...p,p2:e.target.value}))}
              onKeyDown={e=>e.key==="Enter"&&go()}/>
          </div>
        )}
        {err&&<div style={{color:err.startsWith("✅")?T.green:T.red,fontSize:13,fontWeight:700,marginBottom:12,lineHeight:1.4}}>{err}</div>}
        <button className="btn btn-yellow" onClick={go} disabled={load} style={{opacity:load?.6:1}}>
          {load?"⏳ Đang xử lý...":(tab==="login"?"Đăng nhập 🐸":"Tạo tài khoản 🐸")}
        </button>
        {tab==="signup"&&(
          <div style={{fontSize:11,color:T.muted,textAlign:"center",marginTop:10,lineHeight:1.5,fontWeight:600}}>
            Sau khi đăng ký có thể đăng nhập ngay
          </div>
        )}
      </div>
    </div>
  );
}


// ── ROOT APP ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {id:"dashboard",l:"Home",    ico:()=>I.home},
  {id:"orders",   l:"Đơn",    ico:()=>I.order},
  {id:"customers",l:"Khách",  ico:()=>I.users},
  {id:"booking",  l:"Lịch",   ico:()=>I.cal},
  {id:"messages", l:"Mẫu",    ico:()=>I.msg},
  {id:"report",   l:"Báo cáo",ico:()=>I.chart},
  {id:"settings", l:"Cài đặt",ico:()=>I.cog},
];

const DEFAULT_SHOP = {
  name:     "Mitchi The Mighty",
  tagline:  "Tarot and Lenormand Reader",
  phone:    "",
  fb:       "",
  acbNo:    "6205237",
  acbName:  "TON NU HONG CHAU",
  vcbNo:    "",
  vcbName:  "TON NU HONG CHAU",
  defaultQr:"acb",
  footer:   "Xin cảm ơn quý khách — Hẹn gặp lại!",
  notifUnpaid:   true,
  notifBooking:  true,
  notifFollowup: true,
};

// Load html2canvas for PNG export
if (typeof window !== "undefined") {
  // Add PWA manifest if not present
  if (!document.querySelector('link[rel="manifest"]')) {
    const manifestData = {
      name: "Mitchi Shop Manager",
      short_name: "Mitchi",
      description: "Quản lý shop Tarot & Lenormand",
      start_url: "/",
      display: "standalone",
      background_color: "#EFF9F0",
      theme_color: "#1A2E1F",
      icons: [
        { src: "/images/logo.jpg", sizes: "192x192", type: "image/jpeg", purpose: "any maskable" },
        { src: "/images/logo.jpg", sizes: "512x512", type: "image/jpeg", purpose: "any" }
      ]
    };
    const blob = new Blob([JSON.stringify(manifestData)],{type:"application/json"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("link");
    link.rel = "manifest"; link.href = url;
    document.head.appendChild(link);
  }
  if (!window.html2canvas) {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    s.async = true;
    document.head.appendChild(s);
  }
}

export default function App() {
  const [auth,      setAuth]      = useState(false);
  const [page,      setPage]      = useState("dashboard");
  const [toastMsg,  setToast]     = useState("");
  const [services,  setServices]  = useState(SEED_SVCS);
  const [customers, setCustomers] = useState(SEED_CUSTS);
  const [orders,    setOrders]    = useState(SEED_ORDERS);
  const [bookings,  setBookings]  = useState(SEED_BOOKINGS);
  const [defCustId, setDefCustId] = useState(null);
  const [shop,      setShop]      = useState(DEFAULT_SHOP);
  const [replies,   setReplies]   = useState(REPLIES);
  const [topics,    setTopics]    = useState(["Tình yêu","Hôn nhân / Ex","Sự nghiệp","Tài chính","Gia đình","Sức khỏe","Tổng quát"]);
  const [dbReady,   setDbReady]   = useState(false);
  const [syncing,   setSyncing]   = useState(false);

  const toast = msg => { setToast(msg); setTimeout(()=>setToast(""), 2500); };
  const nav   = id  => setPage(id);

  // ── Load all data from Supabase on login ─────────────────────────────
  const loadFromDb = async () => {
    setSyncing(true);
    try {
      const [svcs, custs, ords, bks, reps, settings] = await Promise.all([
        sb.getAll("services", "name.asc"),
        sb.getAll("customers", "created_at.desc"),
        sb.getAll("orders", "created_at.desc"),
        sb.getAll("bookings", "date.asc,time.asc"),
        sb.getAll("replies", "created_at.asc"),
        sb.getAll("shop_settings"),
      ]);
      // Parse JSON fields from Supabase string columns
      if (svcs.length)  setServices(svcs);
      if (custs.length) setCustomers(custs);
      if (ords.length)  setOrders(ords.map(o => ({
        ...o,
        items:  typeof o.items  === "string" ? JSON.parse(o.items  || "[]") : (o.items  || []),
        extraQ: Number(o.extraQ || 0),
        total:  Number(o.total  || 0),
        tips:   Number(o.tips   || 0),
      })));
      if (bks.length)   setBookings(bks);
      if (reps.length)  setReplies(reps.map(r => ({
        ...r,
        images: typeof r.images === "string" && r.images
          ? (() => { try { return JSON.parse(r.images); } catch { return []; } })()
          : (r.images || []),
      })));
      if (settings.length) {
        const s = settings[0];
        if (s.shop)   { try { setShop(JSON.parse(s.shop)); }   catch{} }
        if (s.topics) { try { setTopics(JSON.parse(s.topics)); } catch{} }
      }
      setDbReady(true);
    } catch(e) {
      console.error("Load error:", e);
      toast("⚠️ Không tải được data từ cloud — dùng data mẫu tạm thời");
      setDbReady(true);
    }
    setSyncing(false);
  };

  useEffect(() => { if (auth) loadFromDb(); }, [auth]);

  // ── Auto-sync helpers ─────────────────────────────────────────────────
  const syncSettings = async (newShop, newTopics) => {
    try {
      await sb.upsert("shop_settings", {
        id: "singleton",
        shop: JSON.stringify(newShop),
        topics: JSON.stringify(newTopics),
        updated_at: new Date().toISOString(),
      });
    } catch(e) { console.error("Sync settings:", e); }
  };

  // Wrapped setters that also sync to Supabase
  const setShopAndSync = async (updater) => {
    setShop(prev => {
      const next = typeof updater==="function" ? updater(prev) : updater;
      syncSettings(next, topics).catch(console.error);
      return next;
    });
  };

  const setTopicsAndSync = async (updater) => {
    setTopics(prev => {
      const next = typeof updater==="function" ? updater(prev) : updater;
      setShop(s => { syncSettings(s, next).catch(console.error); return s; });
      return next;
    });
  };

  const setServicesAndSync = (updater) => {
    setServices(prev => {
      const next = typeof updater==="function" ? updater(prev) : updater;
      // Sync changed services
      const prevIds = prev.map(s=>s.id);
      const nextIds = next.map(s=>s.id);
      // Upsert all
      next.forEach(s => sb.upsert("services", s).catch(console.error));
      // Delete removed
      prevIds.filter(id=>!nextIds.includes(id)).forEach(id => sb.delete("services", id).catch(console.error));
      return next;
    });
  };

  const setCustomersAndSync = (updater) => {
    setCustomers(prev => {
      const next = typeof updater==="function" ? updater(prev) : updater;
      const prevIds = prev.map(c=>c.id);
      const nextIds = next.map(c=>c.id);
      next.forEach(c => sb.upsert("customers", c).catch(console.error));
      prevIds.filter(id=>!nextIds.includes(id)).forEach(id => sb.delete("customers", id).catch(console.error));
      return next;
    });
  };

  const setBookingsAndSync = (updater) => {
    setBookings(prev => {
      const next = typeof updater==="function" ? updater(prev) : updater;
      const prevIds = prev.map(b=>b.id);
      const nextIds = next.map(b=>b.id);
      next.forEach(b => sb.upsert("bookings", b).catch(console.error));
      prevIds.filter(id=>!nextIds.includes(id)).forEach(id => sb.delete("bookings", id).catch(console.error));
      return next;
    });
  };

  const setRepliesAndSync = (updater) => {
    setReplies(prev => {
      const next = typeof updater==="function" ? updater(prev) : updater;
      const prevIds = prev.map(r=>r.id);
      const nextIds = next.map(r=>r.id);
      next.forEach(r => sb.upsert("replies", {...r, images: r.images ? JSON.stringify(r.images) : null}).catch(console.error));
      prevIds.filter(id=>!nextIds.includes(id)).forEach(id => sb.delete("replies", id).catch(console.error));
      return next;
    });
  };

  // Centralized order save — updates local + Supabase + customer.lastOrder
  const saveOrder = async (o) => {
    setOrders(p => {
      const exists = p.find(x=>x.id===o.id);
      return exists ? p.map(x=>x.id===o.id?o:x) : [o,...p];
    });
    setCustomers(p=>p.map(c=>c.id===o.custId?{...c,lastOrder:o.date}:c));
    try {
      await sb.upsert("orders", {
        ...o,
        items: JSON.stringify(o.items),
      });
      // Also update customer lastOrder in DB
      await sb.update("customers", o.custId, { lastOrder: o.date });
    } catch(e) { console.error("Save order:", e); }
  };

  const deleteOrder = async (id) => {
    setOrders(p=>p.filter(o=>o.id!==id));
    try { await sb.delete("orders", id); } catch(e) { console.error("Delete order:", e); }
  };

  const createOrderFor = custId => { setDefCustId(custId); setPage("orders"); };
  const clearDef = () => setDefCustId(null);

  // Sync banner
  const SyncBanner = () => syncing ? (
    <div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:T.green,color:"#fff",textAlign:"center",fontSize:12,fontWeight:700,padding:"6px",zIndex:1000,fontFamily:"Nunito"}}>
      🐸 Đang đồng bộ dữ liệu...
    </div>
  ) : null;

  const pages = {
    dashboard: <Dashboard
      nav={nav} orders={orders} setOrders={setOrders}
      customers={customers} services={services}
      bookings={bookings} setBookings={setBookings}
      toast={toast} shop={shop}
    />,
    orders: <OrdersPage
      orders={orders} setOrders={setOrders} saveOrder={saveOrder}
      customers={customers} services={services} toast={toast}
      defaultCustId={defCustId} clearDefaultCust={clearDef} shop={shop}
      topics={topics} setTopics={setTopics}
    />,
    customers: <CustomersPage
      customers={customers} setCustomers={setCustomersAndSync}
      orders={orders} services={services}
      toast={toast} onCreateOrder={createOrderFor}
    />,
    booking: <BookingPage
      bookings={bookings} setBookings={setBookingsAndSync}
      customers={customers} services={services}
      orders={orders} setOrders={setOrders} saveOrder={saveOrder}
      toast={toast}
    />,
    messages: <MessagesPage toast={toast} replies={replies} setReplies={setRepliesAndSync}/>,
    report:   <ReportPage orders={orders} customers={customers} services={services}/>,
    settings: <SettingsPage
      logout={()=>setAuth(false)} toast={toast}
      services={services} setServices={setServicesAndSync}
      shop={shop} setShop={setShopAndSync}
      topics={topics} setTopics={setTopicsAndSync}
    />,
  };

  return(
    <>
      <style>{CSS}</style>
      {!auth ? (
        <Login onLogin={()=>setAuth(true)}/>
      ) : (
        <div className="app">
          <SyncBanner/>
          {toastMsg&&<div className="toast">{toastMsg}</div>}
          {pages[page]||pages.dashboard}
          <nav className="bnav">
            {NAV_ITEMS.map(n=>(
              <button key={n.id} className={`nb ${page===n.id?"on":""}`} onClick={()=>setPage(n.id)}>
                {n.ico()}<span>{n.l}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
