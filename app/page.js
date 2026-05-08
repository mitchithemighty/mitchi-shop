"use client"
import { useState, useRef, useEffect } from "react";

// ── FONTS ─────────────────────────────────────────────────────────────────────
const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Nunito+Sans:wght@400;600;700&display=swap";
document.head.appendChild(fl);

// ── PALETTE — gouache illustration ────────────────────────────────────────────
const P = {
  sky:    "#5BC8F5", skydk: "#3AAEDB",
  green:  "#3FAF62", greenlt: "#6DCF8A", greenbg: "#E8F8EE",
  red:    "#D93025", redlt: "#FF6B5B",
  yellow: "#F5C842", yellowlt: "#FAE48A", yellowbg: "#FFFBE6",
  ink:    "#1A2E1F", inkmid: "#2D4835", muted: "#6B8872",
  border: "#C8E6C9", cloud: "#EDF9FF",
  card:   "#FFFFFF", bg:    "#F4FCF6",
  orange: "#F97316", pink: "#F472B6",
};

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:${P.bg};font-family:'Nunito Sans',sans-serif;color:${P.ink};-webkit-font-smoothing:antialiased}
.app{max-width:430px;margin:0 auto;min-height:100dvh;background:${P.bg};position:relative}

/* ── CHUNKY UI SYSTEM ── */
.box{background:${P.card};border-radius:18px;border:2.5px solid ${P.ink};box-shadow:3px 3px 0 ${P.ink};padding:16px}
.box-sky{background:${P.sky}}
.box-green{background:${P.green}}
.box-yellow{background:${P.yellow}}
.box-red{background:${P.red}}
.box-cloud{background:${P.cloud}}
.box-greenbg{background:${P.greenbg};border-color:${P.border};box-shadow:none}

/* ── HEADER ── */
.hdr{background:${P.sky};padding:50px 18px 18px;border-bottom:3px solid ${P.ink};position:relative;overflow:hidden}
.hdr-eyebrow{font-family:'Nunito',sans-serif;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${P.inkmid};margin-bottom:3px}
.hdr-h1{font-family:'Nunito',sans-serif;font-size:28px;font-weight:900;color:${P.ink};letter-spacing:-0.3px;line-height:1}
.hdr-sub{font-size:12px;font-weight:700;color:${P.inkmid};margin-top:5px}
.hdr-deco{position:absolute;right:18px;top:50%;transform:translateY(-50%);font-size:56px;opacity:.18;pointer-events:none}

/* ── BOTTOM NAV ── */
.bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:${P.ink};border-top:3px solid ${P.ink};display:flex;justify-content:space-around;padding:10px 4px 22px;z-index:100}
.nb{display:flex;flex-direction:column;align-items:center;gap:3px;color:rgba(255,255,255,.4);font-size:9px;font-weight:800;font-family:'Nunito',sans-serif;text-transform:uppercase;letter-spacing:.5px;background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:12px;transition:color .15s}
.nb.on{color:${P.yellow}}
.nb svg{width:20px;height:20px;stroke-width:2.5}

/* ── FAB ── */
.fab{position:fixed;bottom:82px;right:calc(50% - 215px + 16px);width:54px;height:54px;border-radius:50%;background:${P.red};border:3px solid ${P.ink};box-shadow:4px 4px 0 ${P.ink};display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:99;transition:transform .1s,box-shadow .1s}
.fab:active{transform:translate(3px,3px);box-shadow:1px 1px 0 ${P.ink}}
.fab svg{width:24px;height:24px;stroke:#fff;stroke-width:2.5}

/* ── MODAL ── */
.overlay{position:fixed;inset:0;background:rgba(26,46,31,.65);z-index:200;display:flex;align-items:flex-end;justify-content:center;animation:fi .2s ease}
@keyframes fi{from{opacity:0}to{opacity:1}}
.sheet{background:${P.bg};border-radius:26px 26px 0 0;border-top:3px solid ${P.ink};border-left:3px solid ${P.ink};border-right:3px solid ${P.ink};padding:20px 18px 44px;width:100%;max-width:430px;max-height:92dvh;overflow-y:auto;animation:su .3s cubic-bezier(.32,.72,0,1)}
@keyframes su{from{transform:translateY(100%)}to{transform:translateY(0)}}
.drag{width:40px;height:5px;background:${P.border};border-radius:3px;border:1.5px solid ${P.ink};margin:0 auto 18px}
.modal-h{font-family:'Nunito',sans-serif;font-size:22px;font-weight:900;color:${P.ink};margin-bottom:16px}

/* ── FORM ── */
.f{margin-bottom:12px}
.f label{display:block;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${P.muted};margin-bottom:5px}
.f input,.f select,.f textarea{width:100%;padding:11px 14px;border-radius:12px;border:2px solid ${P.ink};background:${P.card};font-family:'Nunito Sans',sans-serif;font-size:14px;font-weight:600;color:${P.ink};outline:none;box-shadow:2px 2px 0 ${P.ink};transition:all .12s}
.f input:focus,.f select:focus,.f textarea:focus{border-color:${P.green};box-shadow:3px 3px 0 ${P.green}}
.f textarea{resize:vertical;min-height:70px}

/* ── BTN ── */
.btn{width:100%;padding:13px;border-radius:14px;border:2.5px solid ${P.ink};font-family:'Nunito',sans-serif;font-size:14px;font-weight:900;cursor:pointer;box-shadow:3px 3px 0 ${P.ink};transition:transform .1s,box-shadow .1s;letter-spacing:.2px}
.btn:active{transform:translate(3px,3px);box-shadow:0 0 0 ${P.ink}}
.btn-g{background:${P.green};color:#fff}
.btn-y{background:${P.yellow};color:${P.ink}}
.btn-s{background:${P.sky};color:${P.ink}}
.btn-r{background:${P.red};color:#fff}
.btn-gh{background:${P.card};color:${P.muted}}
.btn-xs{width:auto;padding:7px 14px;border-radius:10px;font-size:12px;border:2px solid ${P.ink};box-shadow:2px 2px 0 ${P.ink}}

/* ── BADGE ── */
.bd{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;border:1.5px solid ${P.ink};font-size:10px;font-weight:800;font-family:'Nunito',sans-serif}
.bd-paid{background:${P.greenlt};color:${P.ink}}
.bd-pend{background:${P.yellow};color:${P.ink}}
.bd-new{background:${P.sky};color:${P.ink}}
.bd-can{background:#FFB3B3;color:${P.ink}}

/* ── TAG ── */
.tg{display:inline-flex;align-items:center;padding:2px 8px;border-radius:10px;border:1.5px solid ${P.ink};font-size:10px;font-weight:800;font-family:'Nunito',sans-serif;margin-right:4px;margin-top:3px}
.tg-vip{background:${P.yellow}}
.tg-new{background:${P.greenlt}}
.tg-fu{background:#FDA4AF}
.tg-old{background:${P.sky}}

/* ── ROW CARD ── */
.row{background:${P.card};border-radius:15px;border:2px solid ${P.ink};box-shadow:3px 3px 0 ${P.ink};padding:13px 14px;display:flex;align-items:center;gap:12px;margin-bottom:9px;cursor:pointer;transition:transform .1s,box-shadow .1s}
.row:active{transform:translate(2px,2px);box-shadow:1px 1px 0 ${P.ink}}
.ava{width:40px;height:40px;border-radius:12px;border:2px solid ${P.ink};box-shadow:2px 2px 0 ${P.ink};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}

/* ── STAT GRID ── */
.sg{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 16px;margin-top:14px}
.sc{border-radius:17px;border:2.5px solid ${P.ink};box-shadow:3px 3px 0 ${P.ink};padding:14px}
.sc-n{font-family:'Nunito',sans-serif;font-size:24px;font-weight:900;color:${P.ink};line-height:1}
.sc-l{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:${P.inkmid};margin-top:3px}
.sc-i{font-size:22px;margin-bottom:5px}

/* ── SECTION ── */
.sec{padding:16px 16px 0}
.sec-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.sec-t{font-family:'Nunito',sans-serif;font-size:17px;font-weight:900;color:${P.ink}}
.sec-a{font-size:12px;font-weight:700;color:${P.green};cursor:pointer;text-decoration:underline;text-underline-offset:2px}

/* ── BAR CHART ── */
.bc{display:flex;align-items:flex-end;gap:6px;height:88px}
.bcol{display:flex;flex-direction:column;align-items:center;flex:1;gap:5px}
.bbar{border-radius:8px 8px 0 0;width:100%;border:1.5px solid ${P.ink};min-height:6px;transition:height .5s cubic-bezier(.34,1.56,.64,1)}
.blbl{font-size:9px;font-weight:800;color:${P.muted};text-transform:uppercase}

/* ── PILL ── */
.pill-row{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px}
.pill{padding:6px 13px;border-radius:20px;border:2px solid ${P.ink};font-size:12px;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;transition:all .1s;box-shadow:2px 2px 0 ${P.ink}}
.pill.on{background:${P.green};color:#fff}
.pill:not(.on){background:${P.card};color:${P.ink}}
.pill:active{transform:translate(2px,2px);box-shadow:0 0 0}

/* ── SEARCH ── */
.sb{width:calc(100% - 32px);margin:10px 16px 0;padding:11px 16px 11px 42px;border-radius:13px;border:2px solid ${P.ink};box-shadow:3px 3px 0 ${P.ink};background:${P.card} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 24 24' stroke='%236B8872' stroke-width='2.5'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E") no-repeat 14px center;font-family:'Nunito Sans',sans-serif;font-size:14px;font-weight:600;color:${P.ink};outline:none}
.sb:focus{border-color:${P.green};box-shadow:3px 3px 0 ${P.green}}

/* ── RBAR ── */
.rb-row{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.rb-lbl{font-size:12px;font-weight:700;color:${P.ink};min-width:96px}
.rb-track{flex:1;height:13px;background:${P.border};border-radius:7px;border:1.5px solid ${P.ink};overflow:hidden}
.rb-fill{height:100%;border-radius:5px;transition:width .6s cubic-bezier(.34,1.56,.64,1)}
.rb-val{font-family:'Nunito',sans-serif;font-size:13px;font-weight:900;color:${P.ink};min-width:44px;text-align:right}

/* ── INVOICE CARD ── */
.inv{background:${P.card};border-radius:20px;border:3px solid ${P.ink};box-shadow:5px 5px 0 ${P.ink};overflow:hidden}
.inv-hdr{background:${P.sky};padding:18px;border-bottom:2.5px solid ${P.ink};text-align:center}
.inv-shop{font-family:'Nunito',sans-serif;font-size:21px;font-weight:900;color:${P.ink}}
.inv-tag{font-size:11px;font-weight:700;color:${P.inkmid};margin-top:2px}
.inv-body{padding:16px}
.inv-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1.5px dashed ${P.border}}
.inv-row:last-child{border:none}
.inv-k{font-size:12px;font-weight:700;color:${P.muted}}
.inv-v{font-size:13px;font-weight:700;color:${P.ink}}
.inv-tot{display:flex;justify-content:space-between;padding:13px 0 0;border-top:2.5px solid ${P.ink}}
.inv-tl{font-family:'Nunito',sans-serif;font-size:14px;font-weight:900}
.inv-ta{font-family:'Nunito',sans-serif;font-size:26px;font-weight:900;color:${P.green}}
.qr-box{display:flex;flex-direction:column;align-items:center;gap:6px;background:${P.bg};border-radius:13px;border:2px solid ${P.ink};padding:14px;margin:13px 0 6px}

/* ── QUICK ACTION ── */
.qa-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 16px;margin-top:14px}
.qa{background:${P.card};border-radius:16px;border:2.5px solid ${P.ink};box-shadow:3px 3px 0 ${P.ink};padding:16px;cursor:pointer;transition:transform .1s,box-shadow .1s;text-align:center}
.qa:active{transform:translate(2px,2px);box-shadow:1px 1px 0 ${P.ink}}
.qa-ico{font-size:30px;margin-bottom:8px}
.qa-lbl{font-family:'Nunito',sans-serif;font-size:13px;font-weight:900;color:${P.ink}}
.qa-sub{font-size:10px;font-weight:700;color:${P.muted};margin-top:2px}

/* ── TOGGLE ── */
.tog{width:40px;height:22px;border-radius:11px;border:2px solid ${P.ink};position:relative;cursor:pointer;flex-shrink:0;transition:background .2s}
.tog.on{background:${P.green}}
.tog.off{background:${P.border}}
.tog::after{content:'';position:absolute;top:2px;width:14px;height:14px;border-radius:50%;background:#fff;border:1.5px solid ${P.ink};transition:left .2s}
.tog.on::after{left:20px}
.tog.off::after{left:2px}

/* ── TOAST ── */
.toast{position:fixed;top:20px;left:50%;transform:translateX(-50%);background:${P.ink};color:${P.yellow};padding:11px 22px;border-radius:50px;border:2.5px solid ${P.yellow};font-family:'Nunito',sans-serif;font-size:13px;font-weight:800;z-index:999;white-space:nowrap;box-shadow:4px 4px 0 ${P.yellow};animation:tst .3s cubic-bezier(.34,1.56,.64,1)}
@keyframes tst{from{opacity:0;top:0}to{opacity:1;top:20px}}

/* ── CALENDAR ── */
.cal-hd{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;padding:0 16px;margin-bottom:6px}
.cal-dh{text-align:center;font-size:10px;font-weight:800;color:${P.muted};text-transform:uppercase}
.cal-g{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;padding:0 16px}
.cd{aspect-ratio:1;display:flex;align-items:center;justify-content:center;border-radius:10px;font-size:13px;font-weight:700;font-family:'Nunito',sans-serif;cursor:pointer;transition:all .12s;position:relative}
.cd:hover{background:${P.cloud}}
.cd.today{background:${P.green};color:#fff;border:2px solid ${P.ink};box-shadow:2px 2px 0 ${P.ink}}
.cd.has::after{content:'';position:absolute;bottom:3px;left:50%;transform:translateX(-50%);width:5px;height:5px;border-radius:50%;background:${P.red};border:1px solid ${P.ink}}

/* ── LOGIN ── */
.login-wrap{min-height:100dvh;background:${P.sky};display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 24px;position:relative;overflow:hidden}
.lc1{position:absolute;top:50px;left:-40px;width:160px;height:70px;background:#fff;border-radius:50px;border:2.5px solid ${P.ink};opacity:.6}
.lc2{position:absolute;top:30px;right:-20px;width:120px;height:55px;background:#fff;border-radius:40px;border:2px solid ${P.ink};opacity:.45}
.lc3{position:absolute;bottom:120px;right:-50px;width:200px;height:85px;background:#fff;border-radius:50px;border:2px solid ${P.ink};opacity:.35}
.lcard{background:${P.card};border-radius:24px;border:3px solid ${P.ink};box-shadow:6px 6px 0 ${P.ink};padding:24px;width:100%;max-width:360px}
.lfield label{display:block;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${P.muted};margin-bottom:5px}
.lfield input{width:100%;padding:12px 14px;margin-bottom:12px;border-radius:12px;border:2px solid ${P.ink};box-shadow:2px 2px 0 ${P.ink};background:${P.bg};font-family:'Nunito Sans',sans-serif;font-size:14px;font-weight:600;outline:none}
.lfield input:focus{border-color:${P.green};box-shadow:3px 3px 0 ${P.green}}
.lbtn{width:100%;padding:14px;border-radius:14px;border:2.5px solid ${P.ink};background:${P.green};color:#fff;font-family:'Nunito',sans-serif;font-size:15px;font-weight:900;cursor:pointer;box-shadow:4px 4px 0 ${P.ink};transition:all .1s;margin-top:4px}
.lbtn:active{transform:translate(3px,3px);box-shadow:1px 1px 0 ${P.ink}}

.scroll-body{padding-bottom:100px}
.divider{height:1px;background:${P.border};margin:4px 16px}
`;

// ── SVG ICONS ─────────────────────────────────────────────────────────────────
const I = {
  home:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  order:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  cal:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  users:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  invoice: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  msg:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  chart:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  cog:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  plus:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  copy:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  check:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>,
  back:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="15 18 9 12 15 6"/></svg>,
  zap:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
};

// ── DATA ──────────────────────────────────────────────────────────────────────
const initServices = [
  { id:1, name:"Tarot Tình Yêu",    ico:"💜", type:"per_q", price:20000, dur:60, active:true,  sold:42 },
  { id:2, name:"Tarot Sự Nghiệp",   ico:"⭐", type:"per_q", price:20000, dur:60, active:true,  sold:28 },
  { id:3, name:"Lenormand Tổng Quát",ico:"🌙", type:"fixed", price:100000,dur:45, active:true,  sold:19 },
  { id:4, name:"Tarot Năm Mới",     ico:"✨", type:"fixed", price:150000,dur:30, active:false, sold:7  },
];
const initOrders = [
  { id:1, cust:"Linh Nguyễn",  ava:"🐸", svc:"Tarot Tình Yêu",   q:7,  amt:110000, status:"paid",    time:"09:30", date:"hôm nay" },
  { id:2, cust:"Minh Châu",    ava:"🌸", svc:"Lenormand Tổng Quát",q:0, amt:100000, status:"pending", time:"11:00", date:"hôm nay" },
  { id:3, cust:"Thu Hà",       ava:"⭐", svc:"Tarot Sự Nghiệp",   q:10, amt:175000, status:"new",     time:"14:15", date:"hôm nay" },
  { id:4, cust:"Bảo Ngân",     ava:"🦋", svc:"Tarot Tình Yêu",   q:3,  amt:60000,  status:"paid",    time:"16:00", date:"hôm nay" },
  { id:5, cust:"Mai Anh",      ava:"🌙", svc:"Tarot Năm Mới",     q:0,  amt:150000, status:"paid",    time:"10:00", date:"07/05"   },
];
const initCusts = [
  { id:1, name:"Linh Nguyễn",  nick:"Bé Linh",   phone:"0901234567", orders:12, spent:1420000, tags:["vip","old"], ava:"🐸", last:"3 ngày" },
  { id:2, name:"Minh Châu",    nick:"Châu",       phone:"0912345678", orders:3,  spent:310000,  tags:["new"],        ava:"🌸", last:"hôm nay" },
  { id:3, name:"Thu Hà",       nick:"Hà Trắng",   phone:"0923456789", orders:7,  spent:780000,  tags:["old","fu"],   ava:"⭐", last:"1 tuần" },
  { id:4, name:"Bảo Ngân",     nick:"Ngân",       phone:"0934567890", orders:1,  spent:60000,   tags:["new"],        ava:"🦋", last:"hôm nay" },
  { id:5, name:"Mai Anh",      nick:"Mai",         phone:"0945678901", orders:18, spent:2100000, tags:["vip","old"], ava:"🌙", last:"2 ngày" },
];
const WEEK = [
  {d:"T2",v:320000,c:P.sky},{d:"T3",v:510000,c:P.green},{d:"T4",v:280000,c:P.yellow},
  {d:"T5",v:620000,c:P.orange},{d:"T6",v:450000,c:P.skydk},{d:"T7",v:780000,c:P.green},{d:"CN",v:590000,c:P.red},
];
const REPLIES = [
  { id:1, hash:"#menu",      title:"Menu dịch vụ",      body:"💚 MITCHI TAROT 💚\n\n💜 Tarot Tình Yêu: 20k/câu\n⭐ Tarot Sự Nghiệp: 20k/câu\n🌙 Lenormand Tổng Quát: 100k\n✨ Tarot Năm Mới: 150k\n\n📌 5 câu đầu: 20k/câu · Từ câu 6+: 15k/câu\nInbox đặt lịch nhé 💌" },
  { id:2, hash:"#baogia",    title:"Báo giá nhanh",      body:"Chào bạn! 🐸\n• 5 câu đầu: 20k/câu = 100k\n• Từ câu 6+: 15k/câu\nVD: 7 câu = 100k + 30k = 130.000đ 💚" },
  { id:3, hash:"#booking",   title:"Hướng dẫn đặt lịch", body:"Đặt lịch với Mitchi:\n1️⃣ Nhắn câu hỏi muốn xem\n2️⃣ Mitchi báo giá & xác nhận\n3️⃣ Chuyển khoản\n4️⃣ Nhận kết quả trong 24h 🔮" },
  { id:4, hash:"#thanhtoan", title:"Nhắc thanh toán",    body:"Bạn ơi xem bài xong rồi nha! 🎉\nBạn chuyển khoản theo hóa đơn giúp Mitchi nhé 💚" },
  { id:5, hash:"#trabai",    title:"Trả kết quả",        body:"Mitchi đã xem xong bài rồi nha! ✨\n[Đính kèm ảnh kết quả]\nCó câu hỏi thêm cứ nhắn Mitchi 🐸" },
  { id:6, hash:"#camon",     title:"Cảm ơn sau xem",    body:"Cảm ơn bạn đã tin tưởng Mitchi! 🐸💚\nMong bài mang năng lượng tích cực cho bạn~" },
  { id:7, hash:"#followup",  title:"Follow-up khách cũ", body:"Dạo này bạn khỏe không? 🐸\nMitchi nhớ bạn ~ Có chuyện gì cần chia sẻ không? 💚" },
];
const BOOKINGS = [
  { id:1, name:"Linh Nguyễn", svc:"Tarot Tình Yêu",   time:"09:30", status:"confirmed", note:"Hỏi về bạn trai" },
  { id:2, name:"Minh Châu",   svc:"Lenormand",          time:"11:00", status:"pending",   note:"" },
  { id:3, name:"Thu Hà",      svc:"Tarot Sự Nghiệp",   time:"14:15", status:"confirmed", note:"Muốn đổi việc" },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const vnd = n => n.toLocaleString("vi-VN") + "đ";
const calcLines = q => {
  const n = parseInt(q) || 0;
  if (!n) return [];
  if (n <= 5) return [{ label:`${n} câu`, amt: n * 20000 }];
  return [
    { label:"5 câu đầu (câu 1–5)",         amt: 100000 },
    { label:`${n-5} câu tiếp (câu 6–${n})`, amt: (n-5)*15000 },
  ];
};

function Badge({ s }) {
  const m = { paid:["ĐÃ TT","bd-paid"], pending:["CHỜ TT","bd-pend"], new:["MỚI","bd-new"], cancel:["HỦY","bd-can"], confirmed:["XÁC NHẬN","bd-paid"] };
  const [t,c] = m[s] || ["?","bd-new"];
  return <span className={`bd ${c}`}>{t}</span>;
}

const tagMap = { vip:["👑 VIP","tg-vip"], new:["✨ Mới","tg-new"], fu:["📌 Follow","tg-fu"], old:["🔄 Cũ","tg-old"] };

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [f, setF] = useState({ e:"", p:"" });
  const [err, setErr] = useState("");
  const go = () => {
    if (f.e === "mitchi@shop.vn" && f.p === "mitchi2024") onLogin();
    else setErr("Sai email hoặc mật khẩu! 🐸");
  };
  return (
    <div className="login-wrap">
      <div className="lc1"/><div className="lc2"/><div className="lc3"/>
      <div style={{fontSize:64,marginBottom:6}}>🐸</div>
      <div style={{fontFamily:"Nunito",fontSize:46,fontWeight:900,color:P.ink,letterSpacing:-1}}>Mitchi</div>
      <div style={{fontSize:13,fontWeight:700,color:P.inkmid,marginBottom:28,letterSpacing:.5}}>Shop Manager · Tarot & Lenormand</div>
      <div className="lcard">
        <div className="lfield">
          <label>Email</label>
          <input type="email" placeholder="mitchi@shop.vn" value={f.e}
            onChange={e=>setF(p=>({...p,e:e.target.value}))}
            onKeyDown={e=>e.key==="Enter"&&go()}/>
          <label>Mật khẩu</label>
          <input type="password" placeholder="••••••••" value={f.p}
            onChange={e=>setF(p=>({...p,p:e.target.value}))}
            onKeyDown={e=>e.key==="Enter"&&go()}/>
        </div>
        {err && <div style={{color:P.red,fontSize:12,fontWeight:700,textAlign:"center",marginBottom:10}}>{err}</div>}
        <button className="lbtn" onClick={go}>Đăng nhập 🐸</button>
        <div style={{fontSize:11,fontWeight:700,color:P.muted,textAlign:"center",marginTop:10}}>
          Demo: mitchi@shop.vn / mitchi2024
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD — speed-first ───────────────────────────────────────────────────
function Dashboard({ nav, toast, services }) {
  const mx = Math.max(...WEEK.map(w=>w.v));
  const todayRev = initOrders.filter(o=>o.date==="hôm nay"&&o.status==="paid").reduce((s,o)=>s+o.amt,0);
  const unpaid   = initOrders.filter(o=>o.status==="pending"||o.status==="new").length;

  // Sort services by sold count for insight
  const topSvcs = [...services].filter(s=>s.active).sort((a,b)=>b.sold-a.sold).slice(0,3);

  return (
    <div className="scroll-body">
      <div className="hdr">
        <div className="hdr-deco">🔮</div>
        <div className="hdr-eyebrow">🐸 Xin chào Mitchi!</div>
        <div className="hdr-h1">Hôm nay</div>
        <div className="hdr-sub">{new Date().toLocaleDateString("vi-VN",{weekday:"long",day:"numeric",month:"long"})}</div>
      </div>

      {/* Revenue pill */}
      <div style={{margin:"14px 16px 0"}}>
        <div className="box box-green" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,color:"rgba(255,255,255,.7)",marginBottom:3}}>Doanh thu hôm nay</div>
            <div style={{fontFamily:"Nunito",fontSize:36,fontWeight:900,color:"#fff",lineHeight:1}}>{vnd(todayRev)}</div>
            <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,.6)",marginTop:4}}>Tháng này: 4.850.000đ</div>
          </div>
          <div style={{fontSize:52,opacity:.25}}>💰</div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="sg">
        {[
          {i:"📋",n:4,  l:"Đơn hôm nay",  bg:P.sky},
          {i:"⏳",n:unpaid,l:"Chưa TT",    bg:P.yellowlt, alert:unpaid>0},
          {i:"👤",n:2,  l:"Khách mới",     bg:P.greenbg},
          {i:"🔄",n:2,  l:"Quay lại",      bg:P.cloud},
        ].map(s=>(
          <div key={s.l} className="sc" style={{background:s.bg,position:"relative"}}>
            {s.alert && <div style={{position:"absolute",top:10,right:10,width:8,height:8,borderRadius:"50%",background:P.red,border:`1.5px solid ${P.ink}`}}/>}
            <div className="sc-i">{s.i}</div>
            <div className="sc-n">{s.n}</div>
            <div className="sc-l">{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── QUICK ACTIONS — most-used daily tasks ── */}
      <div className="sec">
        <div className="sec-h"><div className="sec-t">⚡ Thao tác nhanh</div></div>
        <div className="qa-grid">
          <div className="qa" style={{background:P.red,borderColor:P.ink}} onClick={()=>nav("invoice")}>
            <div className="qa-ico">🧾</div>
            <div className="qa-lbl" style={{color:"#fff"}}>Tạo Hóa Đơn</div>
            <div className="qa-sub" style={{color:"rgba(255,255,255,.7)"}}>Xuất ảnh gửi khách</div>
          </div>
          <div className="qa" style={{background:P.yellow}} onClick={()=>nav("orders")}>
            <div className="qa-ico">📋</div>
            <div className="qa-lbl">Tạo Đơn Mới</div>
            <div className="qa-sub">Ghi nhận khách xem</div>
          </div>
          <div className="qa" style={{background:P.sky}} onClick={()=>nav("messages")}>
            <div className="qa-ico">📋</div>
            <div className="qa-lbl">Tin Mẫu</div>
            <div className="qa-sub">Copy 1 chạm</div>
          </div>
          <div className="qa" style={{background:P.greenbg}} onClick={()=>nav("customers")}>
            <div className="qa-ico">👤</div>
            <div className="qa-lbl">Tra Khách</div>
            <div className="qa-sub">Xem lịch sử</div>
          </div>
        </div>
      </div>

      {/* ── SALES INSIGHT — which service sells best ── */}
      <div className="sec">
        <div className="sec-h">
          <div className="sec-t">🏆 Dịch vụ bán chạy</div>
          <span className="sec-a" onClick={()=>nav("report")}>Chi tiết</span>
        </div>
        <div className="box">
          {topSvcs.map((s,i)=>{
            const pct = Math.round((s.sold / topSvcs[0].sold)*100);
            return (
              <div key={s.id} className="rb-row" style={{marginBottom:i<topSvcs.length-1?12:0}}>
                <div className="rb-lbl">
                  <span style={{marginRight:5}}>{s.ico}</span>{s.name.replace("Tarot ","").replace("Lenormand ","")}
                </div>
                <div className="rb-track">
                  <div className="rb-fill" style={{width:`${pct}%`,background:[P.green,P.sky,P.yellow][i]}}/>
                </div>
                <div className="rb-val">{s.sold} đơn</div>
              </div>
            );
          })}
          <div style={{marginTop:12,paddingTop:10,borderTop:`1.5px dashed ${P.border}`,display:"flex",justifyContent:"space-between"}}>
            <div style={{fontSize:12,fontWeight:700,color:P.muted}}>Dịch vụ hot nhất tuần:</div>
            <div style={{fontSize:13,fontWeight:900,color:P.green,fontFamily:"Nunito"}}>{topSvcs[0]?.ico} {topSvcs[0]?.name}</div>
          </div>
        </div>
      </div>

      {/* Weekly bar chart */}
      <div className="sec">
        <div className="sec-h"><div className="sec-t">📊 Doanh thu 7 ngày</div></div>
        <div className="box">
          <div className="bc">
            {WEEK.map(w=>(
              <div key={w.d} className="bcol">
                <div className="bbar" style={{height:`${(w.v/mx)*74}px`,background:w.c}}/>
                <div className="blbl">{w.d}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:10,paddingTop:8,borderTop:`1.5px dashed ${P.border}`}}>
            <div style={{fontSize:11,fontWeight:700,color:P.muted}}>Tổng tuần</div>
            <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:14,color:P.green}}>{vnd(WEEK.reduce((s,w)=>s+w.v,0))}</div>
          </div>
        </div>
      </div>

      {/* Today's bookings */}
      <div className="sec">
        <div className="sec-h">
          <div className="sec-t">🗓 Lịch hôm nay</div>
          <span className="sec-a" onClick={()=>nav("booking")}>Xem tất cả</span>
        </div>
        {BOOKINGS.map(b=>(
          <div key={b.id} className="row" style={{borderLeft:`4px solid ${b.status==="confirmed"?P.green:P.yellow}`}}>
            <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:17,color:P.ink,minWidth:44,textAlign:"center"}}>{b.time}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:P.ink}}>{b.name}</div>
              <div style={{fontSize:11,fontWeight:600,color:P.muted}}>{b.svc}{b.note&&` · ${b.note}`}</div>
            </div>
            <Badge s={b.status}/>
          </div>
        ))}
      </div>

      {/* Unpaid alert */}
      {unpaid > 0 && (
        <div className="sec">
          <div className="box" style={{background:P.yellowbg,borderColor:P.yellow,display:"flex",alignItems:"center",gap:14}}>
            <div style={{fontSize:28}}>⚠️</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:14}}>Có {unpaid} đơn chưa thanh toán</div>
              <div style={{fontSize:12,fontWeight:600,color:P.muted,marginTop:2}}>Nhắc khách để không bị quên nhé</div>
            </div>
            <button className="btn-xs btn" style={{background:P.yellow,borderColor:P.ink}} onClick={()=>{navigator.clipboard?.writeText("Bạn ơi xem bài xong rồi nha! Bạn chuyển khoản theo hóa đơn giúp Mitchi nhé 💚");toast("📋 Đã copy tin nhắn nhắc TT!");}}>
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── QUICK INVOICE — the core feature, speed-optimized ────────────────────────
function QuickInvoice({ toast, services, customers }) {
  const [step, setStep] = useState(1); // 1=form, 2=preview
  const [f, setF] = useState({ cust:"", q:"", svc:"", qr:"acb" });
  const lines = calcLines(f.q);
  const total = lines.reduce((s,l)=>s+l.amt,0);

  const preview = f.cust && (f.q || f.svc);

  const reset = () => { setF({cust:"",q:"",svc:"",qr:"acb"}); setStep(1); };

  return (
    <div className="scroll-body">
      <div className="hdr">
        <div className="hdr-deco">🧾</div>
        <div className="hdr-eyebrow">Xuất nhanh</div>
        <div className="hdr-h1">Tạo Hóa Đơn</div>
        <div className="hdr-sub">Điền 3 ô → xuất ảnh gửi khách ngay</div>
      </div>

      <div className="sec">
        {/* Step indicator */}
        <div style={{display:"flex",gap:6,marginBottom:14}}>
          {[1,2,3].map(n=>(
            <div key={n} style={{flex:1,height:5,borderRadius:3,border:`1.5px solid ${P.ink}`,background:
              n===1&&f.cust ? P.green :
              n===2&&(f.q||f.svc) ? P.green :
              n===3&&f.qr ? P.green : P.border
            }}/>
          ))}
        </div>

        <div className="box">
          {/* Step 1: customer */}
          <div className="f">
            <label>① Chọn khách hàng</label>
            <select value={f.cust} onChange={e=>setF(p=>({...p,cust:e.target.value}))}>
              <option value="">Chọn khách...</option>
              {customers.map(c=><option key={c.id} value={c.name}>{c.ava} {c.name} – {c.nick}</option>)}
            </select>
          </div>

          {/* Step 2: service or question count */}
          <div className="f">
            <label>② Số câu hỏi</label>
            <input type="number" min="0" placeholder="Nhập số câu (0 = trọn gói)" value={f.q}
              onChange={e=>setF(p=>({...p,q:e.target.value}))}/>
          </div>

          {/* Live price preview — appears as you type */}
          {f.q > 0 && (
            <div className="box box-greenbg" style={{marginBottom:14}}>
              {lines.map((l,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:700,
                  padding:"6px 0",borderBottom:i<lines.length-1?`1.5px dashed ${P.border}`:"none"}}>
                  <span style={{color:P.muted}}>{l.label}</span>
                  <span style={{color:P.green,fontFamily:"Nunito",fontWeight:900}}>{vnd(l.amt)}</span>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",fontFamily:"Nunito",fontWeight:900,
                fontSize:18,color:P.ink,paddingTop:10,marginTop:6,borderTop:`2px solid ${P.ink}`}}>
                <span>TỔNG {f.q} CÂU</span>
                <span style={{color:P.green}}>{vnd(total)}</span>
              </div>
            </div>
          )}

          {/* Step 3: QR bank */}
          <div className="f">
            <label>③ Ngân hàng QR</label>
            <div style={{display:"flex",gap:8}}>
              {["acb","vcb"].map(b=>(
                <button key={b} onClick={()=>setF(p=>({...p,qr:b}))}
                  style={{flex:1,padding:"11px",borderRadius:12,border:`2.5px solid ${f.qr===b?P.ink:P.border}`,
                    background:f.qr===b?P.yellow:P.card,fontFamily:"Nunito",fontWeight:800,fontSize:14,
                    cursor:"pointer",boxShadow:f.qr===b?`3px 3px 0 ${P.ink}`:"none",transition:"all .12s"}}>
                  {b==="acb"?"🏦 ACB":"🏦 VCB"}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-g" onClick={()=>setStep(2)}
            disabled={!preview} style={{opacity:preview?1:.45,marginTop:4}}>
            Xem trước hóa đơn →
          </button>
        </div>
      </div>

      {/* ── INVOICE PREVIEW ── */}
      {step===2 && preview && (
        <div className="sec" style={{paddingBottom:0}}>
          <div className="sec-h">
            <div className="sec-t">📄 Hóa đơn</div>
            <button className="btn-xs btn btn-gh" onClick={reset}>← Sửa</button>
          </div>
          <div className="inv">
            <div className="inv-hdr">
              <div style={{fontSize:36,marginBottom:4}}>🐸</div>
              <div className="inv-shop">Mitchi Tarot</div>
              <div className="inv-tag">Hóa đơn xem bói · {new Date().toLocaleDateString("vi-VN",{day:"2-digit",month:"2-digit",year:"numeric"})}</div>
            </div>
            <div className="inv-body">
              <div className="inv-row">
                <span className="inv-k">Khách hàng</span>
                <span className="inv-v">{f.cust}</span>
              </div>
              <div className="inv-row">
                <span className="inv-k">Thời gian</span>
                <span className="inv-v">{new Date().toLocaleString("vi-VN",{hour:"2-digit",minute:"2-digit",day:"2-digit",month:"2-digit"})}</span>
              </div>
              {f.svc && <div className="inv-row"><span className="inv-k">Dịch vụ</span><span className="inv-v">{f.svc}</span></div>}
              <div style={{height:6}}/>
              {f.q > 0 ? lines.map((l,i)=>(
                <div key={i} className="inv-row">
                  <span className="inv-k">{l.label}</span>
                  <span className="inv-v" style={{fontFamily:"Nunito",fontWeight:900,color:P.green}}>{vnd(l.amt)}</span>
                </div>
              )) : (
                <div className="inv-row">
                  <span className="inv-k">{f.svc||"Dịch vụ trọn gói"}</span>
                  <span className="inv-v" style={{fontFamily:"Nunito",fontWeight:900,color:P.green}}>Theo thỏa thuận</span>
                </div>
              )}
              <div className="inv-tot">
                <div>
                  <div className="inv-tl">{f.q>0?`TỔNG ${f.q} CÂU`:"TỔNG CỘNG"}</div>
                </div>
                <div className="inv-ta">{f.q>0?vnd(total):"—"}</div>
              </div>
              <div className="qr-box">
                <div style={{fontSize:64}}>📱</div>
                <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:14,color:P.ink}}>
                  {f.qr==="acb"?"ACB – Nguyễn Thị Mitchi":"Vietcombank – Nguyễn Thị Mitchi"}
                </div>
                <div style={{fontSize:11,fontWeight:700,color:P.muted}}>Quét QR để chuyển khoản</div>
              </div>
              <div style={{textAlign:"center",fontSize:12,fontWeight:700,color:P.muted,paddingBottom:4}}>
                🐸 Cảm ơn bạn đã tin tưởng Mitchi Tarot! 🐸
              </div>
            </div>
          </div>

          <div style={{height:12}}/>

          {/* Export buttons */}
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-y" style={{flex:1}} onClick={()=>toast("📸 Đã xuất PNG! Lưu vào album.")}>📸 Xuất PNG</button>
            <button className="btn btn-g" style={{flex:1}} onClick={()=>toast("📄 Đã xuất PDF!")}>📄 PDF</button>
          </div>
          <div style={{height:8}}/>
          <button className="btn btn-s" onClick={()=>{
            const msg = `🧾 HÓA ĐƠN MITCHI TAROT\nKhách: ${f.cust}\n${lines.map(l=>`${l.label}: ${vnd(l.amt)}`).join("\n")}\nTỔNG: ${f.q>0?vnd(total):"Theo TT"}\nNH: ${f.qr==="acb"?"ACB":"VCB"} – Nguyễn Thị Mitchi`;
            navigator.clipboard?.writeText(msg);
            toast("📋 Đã copy text hóa đơn!");
          }}>📋 Copy text gửi Zalo/Messenger</button>
        </div>
      )}
    </div>
  );
}

// ── ORDERS ────────────────────────────────────────────────────────────────────
function Orders({ toast, services, customers }) {
  const [orders, setOrders] = useState(initOrders);
  const [modal, setModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ cust:"", svc:"", q:"", group:"" });
  const lines = calcLines(form.q);
  const total = lines.reduce((s,l)=>s+l.amt,0);
  const shown = filter==="all" ? orders : orders.filter(o=>o.status===filter);

  const add = () => {
    setOrders(p=>[{ id:Date.now(), cust:form.cust, ava:"🆕", svc:form.svc||"Dịch vụ",
      q:parseInt(form.q)||0, amt:total, status:"new",
      time:new Date().toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"}), date:"hôm nay"
    },...p]);
    setForm({cust:"",svc:"",q:"",group:""}); setModal(false);
    toast("🐸 Đã tạo đơn mới!");
  };

  return (
    <div className="scroll-body">
      <div className="hdr">
        <div className="hdr-deco">📋</div>
        <div className="hdr-eyebrow">Quản lý</div>
        <div className="hdr-h1">Đơn Xem Bói</div>
        <div className="hdr-sub">{orders.length} đơn tổng · Hôm nay: {vnd(orders.filter(o=>o.date==="hôm nay"&&o.status==="paid").reduce((s,o)=>s+o.amt,0))}</div>
      </div>
      <input className="sb" placeholder="Tìm khách, dịch vụ..."/>
      <div className="sec" style={{paddingTop:10}}>
        <div className="pill-row">
          {[{k:"all",l:"Tất cả"},{k:"new",l:"Mới"},{k:"pending",l:"Chờ TT"},{k:"paid",l:"Đã TT"}].map(x=>(
            <button key={x.k} className={`pill ${filter===x.k?"on":""}`} onClick={()=>setFilter(x.k)}>{x.l}</button>
          ))}
        </div>
        {shown.map(o=>(
          <div key={o.id} className="row">
            <div className="ava" style={{background:P.cloud}}>{o.ava}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:P.ink}}>{o.cust}</div>
              <div style={{fontSize:11,fontWeight:600,color:P.muted}}>{o.svc} · {o.q>0?`${o.q} câu`:"Trọn gói"} · {o.time}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:15,color:P.ink}}>{vnd(o.amt)}</div>
              <Badge s={o.status}/>
            </div>
          </div>
        ))}
      </div>
      <button className="fab" onClick={()=>setModal(true)}>{I.plus}</button>
      {modal && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="sheet">
            <div className="drag"/>
            <div className="modal-h">Tạo Đơn Mới 🐸</div>
            <div className="f"><label>Khách hàng</label>
              <select value={form.cust} onChange={e=>setForm(p=>({...p,cust:e.target.value}))}>
                <option value="">Chọn khách...</option>
                {customers.map(c=><option key={c.id} value={c.name}>{c.ava} {c.name} – {c.nick}</option>)}
              </select>
            </div>
            <div className="f"><label>Dịch vụ</label>
              <select value={form.svc} onChange={e=>setForm(p=>({...p,svc:e.target.value}))}>
                <option value="">Chọn dịch vụ...</option>
                {services.filter(s=>s.active).map(s=>(
                  <option key={s.id} value={s.name}>{s.ico} {s.name} — {s.type==="fixed"?vnd(s.price):`${s.price/1000}k/câu`}</option>
                ))}
              </select>
            </div>
            <div className="f"><label>Số câu hỏi (0 = trọn gói)</label>
              <input type="number" min="0" placeholder="0" value={form.q} onChange={e=>setForm(p=>({...p,q:e.target.value}))}/>
            </div>
            <div className="f"><label>Nhóm câu hỏi</label>
              <select value={form.group} onChange={e=>setForm(p=>({...p,group:e.target.value}))}>
                <option value="">Chọn nhóm...</option>
                {["Tình yêu / Hôn nhân","Sự nghiệp / Công việc","Tài chính","Sức khỏe","Tổng quát"].map(g=><option key={g}>{g}</option>)}
              </select>
            </div>
            {form.q>0 && (
              <div className="box box-greenbg" style={{marginBottom:12}}>
                {lines.map((l,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:700,
                    padding:"5px 0",borderBottom:i<lines.length-1?`1.5px dashed ${P.border}`:"none"}}>
                    <span style={{color:P.muted}}>{l.label}</span>
                    <span style={{fontFamily:"Nunito",fontWeight:900,color:P.green}}>{vnd(l.amt)}</span>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",fontFamily:"Nunito",fontWeight:900,
                  fontSize:17,paddingTop:9,marginTop:6,borderTop:`2px solid ${P.ink}`}}>
                  <span>TỔNG {form.q} CÂU</span><span style={{color:P.green}}>{vnd(total)}</span>
                </div>
              </div>
            )}
            <button className="btn btn-g" onClick={add} style={{marginBottom:8}}>Tạo đơn</button>
            <button className="btn btn-gh" onClick={()=>setModal(false)}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── BOOKING ───────────────────────────────────────────────────────────────────
function Booking({ toast }) {
  const today = new Date().getDate();
  const fd = new Date(new Date().getFullYear(),new Date().getMonth(),1).getDay();
  const dim = new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate();
  const cells = Array(fd).fill(null).concat(Array.from({length:dim},(_,i)=>i+1));
  const hasBk = [3,8,12,15,19,22,26];

  return (
    <div className="scroll-body">
      <div className="hdr">
        <div className="hdr-deco">📅</div>
        <div className="hdr-eyebrow">Lịch làm việc</div>
        <div className="hdr-h1">Booking</div>
        <div className="hdr-sub">{new Date().toLocaleDateString("vi-VN",{month:"long",year:"numeric"})}</div>
      </div>
      <div className="sec" style={{paddingTop:16}}>
        <div className="cal-hd">{["CN","T2","T3","T4","T5","T6","T7"].map(d=><div key={d} className="cal-dh">{d}</div>)}</div>
        <div className="cal-g">
          {cells.map((d,i)=>(
            <div key={i} className={`cd ${d===today?"today":""} ${hasBk.includes(d)?"has":""}`}>{d||""}</div>
          ))}
        </div>
      </div>
      <div className="sec">
        <div className="sec-h">
          <div className="sec-t">📌 Hôm nay · {today}/{new Date().getMonth()+1}</div>
          <button className="btn-xs btn btn-g" onClick={()=>toast("📅 Tạo slot mới!")}>+ Slot</button>
        </div>
        {BOOKINGS.map(b=>(
          <div key={b.id} className="row" style={{borderLeft:`4px solid ${b.status==="confirmed"?P.green:P.yellow}`}}>
            <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:18,color:P.ink,minWidth:46,textAlign:"center"}}>{b.time}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700}}>{b.name}</div>
              <div style={{fontSize:11,fontWeight:600,color:P.muted}}>{b.svc}{b.note&&` · ${b.note}`}</div>
            </div>
            <Badge s={b.status}/>
          </div>
        ))}
      </div>
      <button className="fab" onClick={()=>toast("📅 Tạo booking mới!")}>{I.plus}</button>
    </div>
  );
}

// ── CUSTOMERS ─────────────────────────────────────────────────────────────────
function Customers({ toast }) {
  const [custs, setCusts] = useState(initCusts);
  const [sel, setSel] = useState(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({name:"",nick:"",phone:"",social:"",notes:""});

  const add = () => {
    setCusts(p=>[{id:Date.now(),name:form.name,nick:form.nick,phone:form.phone,orders:0,spent:0,tags:["new"],ava:"🆕",last:"vừa thêm"},...p]);
    setForm({name:"",nick:"",phone:"",social:"",notes:""}); setModal(false);
    toast("🐸 Đã thêm khách mới!");
  };

  if (sel) {
    const c = custs.find(x=>x.id===sel);
    return (
      <div className="scroll-body">
        <div className="hdr" style={{paddingTop:40}}>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
            <button onClick={()=>setSel(null)}
              style={{background:"rgba(255,255,255,.3)",border:`2px solid ${P.ink}`,borderRadius:12,
                padding:"6px 12px",fontFamily:"Nunito",fontWeight:900,fontSize:14,cursor:"pointer",
                boxShadow:`2px 2px 0 ${P.ink}`}}>← Back</button>
            <div>
              <div className="hdr-h1">{c.nick||c.name}</div>
              <div className="hdr-sub">{c.name} · {c.phone}</div>
            </div>
          </div>
        </div>
        <div className="sec">
          <div className="box" style={{textAlign:"center",padding:"22px 16px"}}>
            <div style={{fontSize:52,marginBottom:10}}>{c.ava}</div>
            <div style={{fontFamily:"Nunito",fontSize:20,fontWeight:900}}>{c.nick||c.name}</div>
            <div style={{fontSize:12,fontWeight:700,color:P.muted,margin:"4px 0 10px"}}>{c.phone} · {c.last}</div>
            <div>{c.tags.map(t=>{const[l,cl]=tagMap[t]||[t,"tg-new"];return<span key={t} className={`tg ${cl}`}>{l}</span>;})}</div>
          </div>
          <div className="sg" style={{padding:0,marginTop:10}}>
            {[{i:"🔮",n:c.orders,l:"Lần xem",bg:P.cloud},{i:"💰",n:vnd(c.spent),l:"Đã chi",bg:P.greenbg}].map(s=>(
              <div key={s.l} className="sc" style={{background:s.bg,textAlign:"center"}}>
                <div className="sc-i">{s.i}</div>
                <div className="sc-n" style={{fontSize:18}}>{s.n}</div>
                <div className="sc-l">{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{height:14}}/>
          <div className="sec-t" style={{marginBottom:10}}>📋 Lịch sử xem bài</div>
          {initOrders.slice(0,3).map(o=>(
            <div key={o.id} className="row">
              <div className="ava" style={{background:P.cloud,fontSize:18}}>{o.ava}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700}}>{o.svc}</div>
                <div style={{fontSize:11,fontWeight:600,color:P.muted}}>{o.q>0?`${o.q} câu`:"Trọn gói"} · {o.date}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:14}}>{vnd(o.amt)}</div>
                <Badge s={o.status}/>
              </div>
            </div>
          ))}
          <div style={{height:10}}/>
          <button className="btn btn-y" onClick={()=>{navigator.clipboard?.writeText(REPLIES[6].body);toast("📋 Copy tin follow-up!");}}>📋 Gửi tin follow-up</button>
        </div>
      </div>
    );
  }

  return (
    <div className="scroll-body">
      <div className="hdr">
        <div className="hdr-deco">👥</div>
        <div className="hdr-eyebrow">Danh sách</div>
        <div className="hdr-h1">Khách Hàng</div>
        <div className="hdr-sub">{custs.length} khách · {custs.filter(c=>c.tags.includes("vip")).length} VIP</div>
      </div>
      <input className="sb" placeholder="Tìm tên, số điện thoại..."/>
      <div className="sec" style={{paddingTop:10}}>
        <div className="pill-row">
          {["Tất cả","👑 VIP","✨ Mới","📌 Follow-up"].map(f=>(
            <button key={f} className={`pill ${f==="Tất cả"?"on":""}`}>{f}</button>
          ))}
        </div>
        {custs.map(c=>(
          <div key={c.id} className="row" onClick={()=>setSel(c.id)}>
            <div className="ava" style={{background:P.cloud,borderRadius:"50%",fontSize:22}}>{c.ava}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700}}>{c.nick||c.name}</div>
              <div style={{fontSize:11,fontWeight:600,color:P.muted}}>{c.phone} · {c.last}</div>
              <div>{c.tags.map(t=>{const[l,cl]=tagMap[t]||[t,"tg-new"];return<span key={t} className={`tg ${cl}`}>{l}</span>;})}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:14,color:P.green}}>{vnd(c.spent)}</div>
              <div style={{fontSize:10,fontWeight:700,color:P.muted}}>{c.orders} lần</div>
            </div>
          </div>
        ))}
      </div>
      <button className="fab" onClick={()=>setModal(true)}>{I.plus}</button>
      {modal && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="sheet">
            <div className="drag"/>
            <div className="modal-h">Thêm Khách Mới 🐸</div>
            {[{l:"Tên đầy đủ",k:"name",p:"Nguyễn Văn A"},{l:"Nickname",k:"nick",p:"Bé A"},
              {l:"Số điện thoại",k:"phone",p:"0912345678",t:"tel"},{l:"Facebook / Zalo",k:"social",p:"Tên hoặc link"}].map(x=>(
              <div className="f" key={x.k}><label>{x.l}</label>
                <input type={x.t||"text"} placeholder={x.p} value={form[x.k]} onChange={e=>setForm(p=>({...p,[x.k]:e.target.value}))}/>
              </div>
            ))}
            <div className="f"><label>Ghi chú</label>
              <textarea placeholder="Ghi chú về khách..." value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/>
            </div>
            <button className="btn btn-g" onClick={add} style={{marginBottom:8}}>Thêm khách</button>
            <button className="btn btn-gh" onClick={()=>setModal(false)}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MESSAGES ──────────────────────────────────────────────────────────────────
function Messages({ toast }) {
  return (
    <div className="scroll-body">
      <div className="hdr">
        <div className="hdr-deco">💬</div>
        <div className="hdr-eyebrow">Copy 1 chạm</div>
        <div className="hdr-h1">Tin Nhắn Mẫu</div>
        <div className="hdr-sub">{REPLIES.length} mẫu · Nhấn COPY để dùng ngay</div>
      </div>
      <div className="sec">
        {REPLIES.map(r=>(
          <div key={r.id} className="row" style={{cursor:"default",alignItems:"flex-start"}}>
            <div>
              <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:15,color:P.red,marginBottom:3}}>{r.hash}</div>
              <div style={{fontSize:13,fontWeight:700,color:P.ink}}>{r.title}</div>
              <div style={{fontSize:11,fontWeight:600,color:P.muted,marginTop:2,maxWidth:220,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.body.split("\n")[0]}</div>
            </div>
            <button className="btn-xs btn btn-y" style={{marginLeft:"auto",flexShrink:0}}
              onClick={()=>{navigator.clipboard?.writeText(r.body);toast("📋 Đã copy!");}}>
              COPY
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── REPORT ────────────────────────────────────────────────────────────────────
function Report({ services }) {
  const mx = Math.max(...WEEK.map(w=>w.v));
  const topSvcs = [...services].sort((a,b)=>b.sold-a.sold);
  const maxSold = topSvcs[0]?.sold || 1;

  return (
    <div className="scroll-body">
      <div className="hdr">
        <div className="hdr-deco">📊</div>
        <div className="hdr-eyebrow">Phân tích</div>
        <div className="hdr-h1">Báo Cáo</div>
        <div className="hdr-sub">Tháng {new Date().getMonth()+1}/{new Date().getFullYear()}</div>
      </div>
      <div className="sg">
        {[
          {i:"💰",n:"4.85M",l:"Doanh thu",bg:P.greenbg},
          {i:"📋",n:"54",   l:"Đơn xong",  bg:P.cloud},
          {i:"👤",n:"12",   l:"Khách mới", bg:P.yellowbg},
          {i:"🔄",n:"68%",  l:"Quay lại",  bg:"#FFE4E4"},
        ].map(s=><div key={s.l} className="sc" style={{background:s.bg}}><div className="sc-i">{s.i}</div><div className="sc-n">{s.n}</div><div className="sc-l">{s.l}</div></div>)}
      </div>

      {/* ── KEY INSIGHT: which service drives revenue ── */}
      <div className="sec">
        <div className="sec-h"><div className="sec-t">🏆 Dịch vụ bán chạy nhất</div></div>
        <div className="box">
          {topSvcs.map((s,i)=>(
            <div key={s.id} className="rb-row" style={{marginBottom:i<topSvcs.length-1?12:0}}>
              <div className="rb-lbl"><span style={{marginRight:5}}>{s.ico}</span>{s.name.replace("Tarot ","").replace("Lenormand ","")}</div>
              <div className="rb-track">
                <div className="rb-fill" style={{width:`${Math.round(s.sold/maxSold*100)}%`,background:[P.green,P.sky,P.yellow,P.orange][i]||P.muted}}/>
              </div>
              <div className="rb-val">{s.sold}</div>
            </div>
          ))}
          <div style={{marginTop:12,paddingTop:10,borderTop:`1.5px dashed ${P.border}`,fontSize:12,fontWeight:700,color:P.muted}}>
            💡 <span style={{color:P.ink}}>Tarot Tình Yêu</span> chiếm 44% tổng đơn — đây là dịch vụ nên quảng cáo nhiều nhất.
          </div>
        </div>
      </div>

      <div className="sec">
        <div className="sec-h"><div className="sec-t">📊 Doanh thu 7 ngày</div></div>
        <div className="box">
          <div className="bc">
            {WEEK.map(w=><div key={w.d} className="bcol"><div className="bbar" style={{height:`${(w.v/mx)*74}px`,background:w.c}}/><div className="blbl">{w.d}</div></div>)}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:10,paddingTop:8,borderTop:`1.5px dashed ${P.border}`}}>
            <div style={{fontSize:12,fontWeight:700,color:P.muted}}>Ngày cao nhất: T7</div>
            <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:14,color:P.green}}>{vnd(780000)}</div>
          </div>
        </div>
      </div>

      {/* Revenue by question group */}
      <div className="sec">
        <div className="sec-h"><div className="sec-t">❓ Nhóm câu hỏi phổ biến</div></div>
        <div className="box">
          {[{n:"Tình yêu / Hôn nhân",pct:58,v:"58%"},{n:"Sự nghiệp",pct:24,v:"24%"},{n:"Tổng quát",pct:11,v:"11%"},{n:"Tài chính",pct:7,v:"7%"}].map((s,i)=>(
            <div key={i} className="rb-row" style={{marginBottom:i<3?10:0}}>
              <div className="rb-lbl">{s.n}</div>
              <div className="rb-track"><div className="rb-fill" style={{width:`${s.pct}%`,background:[P.red,P.sky,P.green,P.yellow][i]}}/></div>
              <div className="rb-val">{s.v}</div>
            </div>
          ))}
          <div style={{marginTop:12,paddingTop:10,borderTop:`1.5px dashed ${P.border}`,fontSize:12,fontWeight:700,color:P.muted}}>
            💡 Tình yêu = chủ đề hot nhất. Nên làm content về chủ đề này để thu hút thêm khách.
          </div>
        </div>
      </div>

      <div className="sec">
        <div className="sec-h"><div className="sec-t">💎 Khách VIP</div></div>
        {initCusts.sort((a,b)=>b.spent-a.spent).slice(0,3).map((c,i)=>(
          <div key={c.id} className="row" style={{cursor:"default"}}>
            <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:20,color:[P.yellow,P.muted,P.orange][i],minWidth:28}}>#{i+1}</div>
            <div className="ava" style={{background:P.cloud,borderRadius:"50%",fontSize:18,width:36,height:36}}>{c.ava}</div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>{c.nick}</div><div style={{fontSize:11,fontWeight:600,color:P.muted}}>{c.orders} lần xem</div></div>
            <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:14,color:P.green}}>{vnd(c.spent)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SETTINGS ──────────────────────────────────────────────────────────────────
function Settings({ logout, toast, services, setServices }) {
  return (
    <div className="scroll-body">
      <div className="hdr">
        <div className="hdr-deco">⚙️</div>
        <div className="hdr-eyebrow">Tùy chỉnh</div>
        <div className="hdr-h1">Cài Đặt</div>
      </div>
      <div className="sec">
        <div style={{fontFamily:"Nunito",fontWeight:800,fontSize:12,color:P.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Dịch vụ đang bán</div>
        {services.map(s=>(
          <div key={s.id} className="row" style={{cursor:"default"}}>
            <div className="ava" style={{background:P.cloud,fontSize:20}}>{s.ico}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700}}>{s.name}</div>
              <div style={{fontSize:11,fontWeight:600,color:P.muted}}>{s.type==="fixed"?vnd(s.price):`${s.price/1000}k/câu`} · {s.dur} phút</div>
            </div>
            <button className={`tog ${s.active?"on":"off"}`}
              onClick={()=>setServices(p=>p.map(x=>x.id===s.id?{...x,active:!x.active}:x))}/>
          </div>
        ))}

        <div style={{fontFamily:"Nunito",fontWeight:800,fontSize:12,color:P.muted,textTransform:"uppercase",letterSpacing:1,margin:"18px 0 8px"}}>Shop & tài khoản</div>
        {[
          {ico:"🏪",t:"Thông tin shop",     s:"Mitchi Tarot · Tên, logo, mô tả"},
          {ico:"💳",t:"Tài khoản ngân hàng",s:"ACB · Vietcombank"},
          {ico:"🔔",t:"Thông báo",          s:"Nhắc booking & chưa thanh toán"},
          {ico:"📱",t:"Cài như app (PWA)",  s:"Thêm vào màn hình chính"},
          {ico:"☁️",t:"Sao lưu & đồng bộ", s:"Kết nối Supabase · Real-time"},
        ].map(x=>(
          <div key={x.t} className="row" onClick={()=>toast("✏️ Tính năng sắp ra mắt!")}>
            <div style={{fontSize:22}}>{x.ico}</div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>{x.t}</div><div style={{fontSize:11,fontWeight:600,color:P.muted,marginTop:2}}>{x.s}</div></div>
            <div style={{fontWeight:800,fontSize:18,color:P.muted}}>›</div>
          </div>
        ))}

        <div style={{height:16}}/>
        <button className="btn" style={{background:P.card,color:P.red,border:`2.5px solid ${P.red}`,boxShadow:`3px 3px 0 ${P.red}`,fontFamily:"Nunito",fontWeight:900}} onClick={logout}>
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
const NAV = [
  { id:"dashboard", l:"Home",    ico:()=>I.home    },
  { id:"orders",    l:"Đơn",     ico:()=>I.order   },
  { id:"invoice",   l:"Hóa đơn", ico:()=>I.invoice },
  { id:"booking",   l:"Lịch",    ico:()=>I.cal     },
  { id:"customers", l:"Khách",   ico:()=>I.users   },
  { id:"messages",  l:"Mẫu",     ico:()=>I.msg     },
  { id:"report",    l:"Báo cáo", ico:()=>I.chart   },
  { id:"settings",  l:"Cài đặt", ico:()=>I.cog     },
];

export default function App() {
  const [auth, setAuth]       = useState(false);
  const [page, setPage]       = useState("dashboard");
  const [toastMsg, setToast]  = useState("");
  const [services, setServices] = useState(initServices);
  const [customers]           = useState(initCusts);

  const toast = msg => { setToast(msg); setTimeout(()=>setToast(""), 2200); };

  const pages = {
    dashboard: <Dashboard nav={setPage} toast={toast} services={services}/>,
    orders:    <Orders    toast={toast} services={services} customers={customers}/>,
    invoice:   <QuickInvoice toast={toast} services={services} customers={customers}/>,
    booking:   <Booking   toast={toast}/>,
    customers: <Customers toast={toast}/>,
    messages:  <Messages  toast={toast}/>,
    report:    <Report    services={services}/>,
    settings:  <Settings  logout={()=>setAuth(false)} toast={toast} services={services} setServices={setServices}/>,
  };

  return (
    <>
      <style>{CSS}</style>
      {!auth ? (
        <Login onLogin={()=>setAuth(true)}/>
      ) : (
        <div className="app">
          {toastMsg && <div className="toast">{toastMsg}</div>}
          {pages[page] || pages.dashboard}
          <nav className="bnav">
            {NAV.map(n=>(
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
