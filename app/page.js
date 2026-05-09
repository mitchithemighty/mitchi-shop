"use client";
import { useState, useEffect } from "react";

// ── FONTS ─────────────────────────────────────────────────────────────────────
const P = {
  sky:"#5BC8F5", skydk:"#3AAEDB",
  green:"#3FAF62", greenlt:"#6DCF8A", greenbg:"#E8F8EE",
  red:"#D93025", yellow:"#F5C842", yellowbg:"#FFFBE6",
  ink:"#1A2E1F", inkmid:"#2D4835", muted:"#6B8872",
  border:"#C8E6C9", cloud:"#EDF9FF",
  card:"#FFFFFF", bg:"#F4FCF6",
  orange:"#F97316", pink:"#F472B6", purple:"#A855F7",
};

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:${P.bg};font-family:'Nunito Sans',sans-serif;color:${P.ink};-webkit-font-smoothing:antialiased}
.app{max-width:430px;margin:0 auto;min-height:100dvh;background:${P.bg}}

/* BOX */
.box{background:${P.card};border-radius:18px;border:2.5px solid ${P.ink};box-shadow:3px 3px 0 ${P.ink};padding:16px}
.box-greenbg{background:${P.greenbg};border-color:${P.border};box-shadow:none}
.box-yellowbg{background:${P.yellowbg};border-color:#F5C842;box-shadow:none}
.box-sky{background:${P.sky}}
.box-green{background:${P.green}}

/* HEADER */
.hdr{background:${P.sky};padding:50px 18px 18px;border-bottom:3px solid ${P.ink};position:relative;overflow:hidden}
.hdr-eye{font-family:'Nunito',sans-serif;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${P.inkmid};margin-bottom:3px}
.hdr-h1{font-family:'Nunito',sans-serif;font-size:28px;font-weight:900;color:${P.ink};line-height:1}
.hdr-sub{font-size:12px;font-weight:700;color:${P.inkmid};margin-top:5px}
.hdr-deco{position:absolute;right:18px;top:50%;transform:translateY(-50%);font-size:52px;opacity:.18;pointer-events:none}

/* NAV */
.bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:${P.ink};border-top:3px solid ${P.ink};display:flex;justify-content:space-around;padding:10px 2px 22px;z-index:100}
.nb{display:flex;flex-direction:column;align-items:center;gap:3px;color:rgba(255,255,255,.4);font-size:9px;font-weight:800;font-family:'Nunito',sans-serif;text-transform:uppercase;letter-spacing:.4px;background:none;border:none;cursor:pointer;padding:3px 6px;border-radius:10px}
.nb.on{color:${P.yellow}}
.nb svg{width:20px;height:20px;stroke-width:2.5}

/* FAB */
.fab{position:fixed;bottom:82px;right:calc(50% - 215px + 16px);width:54px;height:54px;border-radius:50%;background:${P.red};border:3px solid ${P.ink};box-shadow:4px 4px 0 ${P.ink};display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:99;transition:transform .1s,box-shadow .1s}
.fab:active{transform:translate(3px,3px);box-shadow:1px 1px 0 ${P.ink}}
.fab svg{width:24px;height:24px;stroke:#fff;stroke-width:2.5}

/* MODAL */
.overlay{position:fixed;inset:0;background:rgba(26,46,31,.65);z-index:200;display:flex;align-items:flex-end;justify-content:center;animation:fi .2s ease}
@keyframes fi{from{opacity:0}to{opacity:1}}
.sheet{background:${P.bg};border-radius:26px 26px 0 0;border-top:3px solid ${P.ink};border-left:3px solid ${P.ink};border-right:3px solid ${P.ink};padding:20px 18px 48px;width:100%;max-width:430px;max-height:92dvh;overflow-y:auto;animation:su .3s cubic-bezier(.32,.72,0,1)}
@keyframes su{from{transform:translateY(100%)}to{transform:translateY(0)}}
.drag{width:40px;height:5px;background:${P.border};border-radius:3px;border:1.5px solid ${P.ink};margin:0 auto 18px}
.mh{font-family:'Nunito',sans-serif;font-size:22px;font-weight:900;color:${P.ink};margin-bottom:16px}

/* FORM */
.f{margin-bottom:12px}
.f label{display:block;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${P.muted};margin-bottom:5px}
.f input,.f select,.f textarea{width:100%;padding:11px 14px;border-radius:12px;border:2px solid ${P.ink};background:${P.card};font-family:'Nunito Sans',sans-serif;font-size:14px;font-weight:600;color:${P.ink};outline:none;box-shadow:2px 2px 0 ${P.ink};transition:all .12s}
.f input:focus,.f select:focus,.f textarea:focus{border-color:${P.green};box-shadow:3px 3px 0 ${P.green}}
.f textarea{resize:vertical;min-height:68px}

/* BTN */
.btn{width:100%;padding:13px;border-radius:14px;border:2.5px solid ${P.ink};font-family:'Nunito',sans-serif;font-size:14px;font-weight:900;cursor:pointer;box-shadow:3px 3px 0 ${P.ink};transition:transform .1s,box-shadow .1s}
.btn:active{transform:translate(3px,3px);box-shadow:0 0 0}
.btn-g{background:${P.green};color:#fff}
.btn-y{background:${P.yellow};color:${P.ink}}
.btn-s{background:${P.sky};color:${P.ink}}
.btn-r{background:${P.red};color:#fff}
.btn-gh{background:${P.card};color:${P.muted}}
.btn-xs{width:auto;padding:7px 12px;border-radius:10px;font-size:12px;border:2px solid ${P.ink};box-shadow:2px 2px 0 ${P.ink};font-family:'Nunito',sans-serif;font-weight:800;cursor:pointer;transition:all .1s}
.btn-xs:active{transform:translate(2px,2px);box-shadow:0 0}

/* BADGE */
.bd{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;border:1.5px solid ${P.ink};font-size:10px;font-weight:800;font-family:'Nunito',sans-serif}
.bd-paid{background:${P.greenlt};color:${P.ink}}
.bd-pend{background:${P.yellow};color:${P.ink}}
.bd-new{background:${P.sky};color:${P.ink}}
.bd-view{background:#E9D5FF;color:#6B21A8}
.bd-can{background:#FFB3B3;color:${P.ink}}

/* TAG */
.tg{display:inline-flex;align-items:center;padding:2px 8px;border-radius:10px;border:1.5px solid ${P.ink};font-size:10px;font-weight:800;font-family:'Nunito',sans-serif;margin-right:4px;margin-top:3px}
.tg-vip{background:${P.yellow}}
.tg-new{background:${P.greenlt}}
.tg-fu{background:#FDA4AF}
.tg-old{background:${P.sky}}
.tg-tip{background:#E9D5FF}

/* ROW */
.row{background:${P.card};border-radius:15px;border:2px solid ${P.ink};box-shadow:3px 3px 0 ${P.ink};padding:13px 14px;display:flex;align-items:center;gap:12px;margin-bottom:9px;cursor:pointer;transition:transform .1s,box-shadow .1s}
.row:active{transform:translate(2px,2px);box-shadow:1px 1px 0 ${P.ink}}
.ava{width:40px;height:40px;border-radius:12px;border:2px solid ${P.ink};box-shadow:2px 2px 0 ${P.ink};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}

/* STAT */
.sg{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 16px;margin-top:14px}
.sc{border-radius:17px;border:2.5px solid ${P.ink};box-shadow:3px 3px 0 ${P.ink};padding:14px}
.sc-n{font-family:'Nunito',sans-serif;font-size:22px;font-weight:900;color:${P.ink};line-height:1}
.sc-l{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:${P.inkmid};margin-top:3px}
.sc-i{font-size:20px;margin-bottom:5px}

/* SEC */
.sec{padding:16px 16px 0}
.sec-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.sec-t{font-family:'Nunito',sans-serif;font-size:17px;font-weight:900;color:${P.ink}}
.sec-a{font-size:12px;font-weight:700;color:${P.green};cursor:pointer;text-decoration:underline;text-underline-offset:2px}

/* MISC */
.pill-row{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px}
.pill{padding:6px 13px;border-radius:20px;border:2px solid ${P.ink};font-size:12px;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;transition:all .1s;box-shadow:2px 2px 0 ${P.ink}}
.pill.on{background:${P.green};color:#fff}
.pill:not(.on){background:${P.card};color:${P.ink}}
.pill:active{transform:translate(2px,2px);box-shadow:0 0}
.sb{width:calc(100% - 32px);margin:10px 16px 0;padding:11px 16px 11px 42px;border-radius:13px;border:2px solid ${P.ink};box-shadow:3px 3px 0 ${P.ink};background:${P.card} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 24 24' stroke='%236B8872' stroke-width='2.5'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E") no-repeat 14px center;font-family:'Nunito Sans',sans-serif;font-size:14px;font-weight:600;color:${P.ink};outline:none}
.sb:focus{border-color:${P.green};box-shadow:3px 3px 0 ${P.green}}
.tog{width:40px;height:22px;border-radius:11px;border:2px solid ${P.ink};position:relative;cursor:pointer;flex-shrink:0;transition:background .2s;background:none}
.tog.on{background:${P.green}}
.tog.off{background:${P.border}}
.tog::after{content:'';position:absolute;top:2px;width:14px;height:14px;border-radius:50%;background:#fff;border:1.5px solid ${P.ink};transition:left .2s}
.tog.on::after{left:20px}
.tog.off::after{left:2px}
.bc{display:flex;align-items:flex-end;gap:6px;height:88px}
.bcol{display:flex;flex-direction:column;align-items:center;flex:1;gap:5px}
.bbar{border-radius:8px 8px 0 0;width:100%;border:1.5px solid ${P.ink};min-height:6px;transition:height .5s}
.blbl{font-size:9px;font-weight:800;color:${P.muted};text-transform:uppercase}
.rb-row{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.rb-lbl{font-size:12px;font-weight:700;color:${P.ink};min-width:90px}
.rb-track{flex:1;height:12px;background:${P.border};border-radius:7px;border:1.5px solid ${P.ink};overflow:hidden}
.rb-fill{height:100%;border-radius:5px;transition:width .6s}
.rb-val{font-family:'Nunito',sans-serif;font-size:13px;font-weight:900;color:${P.ink};min-width:44px;text-align:right}
.scroll-body{padding-bottom:100px}
.divider{height:1.5px;background:${P.border};margin:12px 0;border:none}
.toast{position:fixed;top:20px;left:50%;transform:translateX(-50%);background:${P.ink};color:${P.yellow};padding:11px 22px;border-radius:50px;border:2.5px solid ${P.yellow};font-family:'Nunito',sans-serif;font-size:13px;font-weight:800;z-index:999;white-space:nowrap;box-shadow:4px 4px 0 ${P.yellow};animation:tst .3s cubic-bezier(.34,1.56,.64,1)}
@keyframes tst{from{opacity:0;top:0}to{opacity:1;top:20px}}

/* LOGIN */
.login-wrap{min-height:100dvh;background:${P.sky};display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 24px;position:relative;overflow:hidden}
.lc{position:absolute;background:#fff;border-radius:50px;border:2px solid ${P.ink};opacity:.5}
.lcard{background:${P.card};border-radius:24px;border:3px solid ${P.ink};box-shadow:6px 6px 0 ${P.ink};padding:24px;width:100%;max-width:360px}
.lf label{display:block;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${P.muted};margin-bottom:5px}
.lf input{width:100%;padding:12px 14px;margin-bottom:12px;border-radius:12px;border:2px solid ${P.ink};box-shadow:2px 2px 0 ${P.ink};background:${P.bg};font-family:'Nunito Sans',sans-serif;font-size:14px;font-weight:600;outline:none}
.lf input:focus{border-color:${P.green};box-shadow:3px 3px 0 ${P.green}}

/* INVOICE PRINT */
.inv{background:${P.card};border-radius:20px;border:3px solid ${P.ink};box-shadow:5px 5px 0 ${P.ink};overflow:hidden}
.inv-hdr{background:${P.sky};padding:18px;border-bottom:2.5px solid ${P.ink};text-align:center}
.inv-body{padding:16px}
.inv-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1.5px dashed ${P.border}}
.inv-row:last-child{border:none}

/* CAL */
.cal-hd{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;padding:0 16px;margin-bottom:6px}
.cal-dh{text-align:center;font-size:10px;font-weight:800;color:${P.muted};text-transform:uppercase}
.cal-g{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;padding:0 16px}
.cd{aspect-ratio:1;display:flex;align-items:center;justify-content:center;border-radius:10px;font-size:13px;font-weight:700;font-family:'Nunito',sans-serif;cursor:pointer;transition:all .12s;position:relative}
.cd:hover{background:${P.cloud}}
.cd.today{background:${P.green};color:#fff;border:2px solid ${P.ink};box-shadow:2px 2px 0 ${P.ink}}
.cd.has::after{content:'';position:absolute;bottom:3px;left:50%;transform:translateX(-50%);width:5px;height:5px;border-radius:50%;background:${P.red};border:1px solid ${P.ink}}

/* SERVICE ICONS */
.ico-pick{display:flex;flex-wrap:wrap;gap:7px;margin-top:4px}
.ico-btn{width:38px;height:38px;border-radius:10px;font-size:19px;cursor:pointer;transition:all .1s;display:flex;align-items:center;justify-content:center}
`;

// ── ICONS ─────────────────────────────────────────────────────────────────────
const I = {
  home:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  order:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  users:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  cal:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  msg:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  chart:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  cog:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  plus:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  back:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="15 18 9 12 15 6"/></svg>,
  receipt: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16l4-2 4 2 4-2 4 2V8z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  heart:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
};

// ── HELPERS ───────────────────────────────────────────────────────────────────
const vnd = n => Number(n||0).toLocaleString("vi-VN") + "đ";
const today = () => new Date().toLocaleDateString("vi-VN",{day:"2-digit",month:"2-digit",year:"numeric"});
const now = () => new Date().toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"});
const uid = () => Date.now() + Math.random().toString(36).slice(2,6);

// Tính tiền câu lẻ
const calcQ = (q, p1, p6) => {
  const n=parseInt(q)||0; if(!n) return 0;
  return n<=5 ? n*p1 : 5*p1+(n-5)*(p6||p1);
};

// Tính tổng đơn
const calcOrderTotal = (items, extraQ, services) => {
  let total = 0;
  items.forEach(it => {
    const svc = services.find(s=>s.id===it.svcId);
    if (!svc) return;
    if (svc.type==="fixed") total += svc.price * (it.qty||1);
    else total += calcQ(it.qty, svc.price, svc.price6);
  });
  if (extraQ>0) {
    // extra câu lẻ dùng giá mặc định 20k/15k nếu không chọn dịch vụ riêng
    total += calcQ(extraQ, 20000, 15000);
  }
  return total;
};

const STATUS_MAP = {
  new:   ["MỚI","bd-new"],
  view:  ["ĐANG XEM","bd-view"],
  done:  ["XONG","bd-pend"],
  paid:  ["ĐÃ TT","bd-paid"],
  cancel:["HỦY","bd-can"],
};
const STATUS_FLOW = ["new","view","done","paid","cancel"];

function Badge({s}) {
  const [t,c] = STATUS_MAP[s]||["?","bd-new"];
  return <span className={`bd ${c}`}>{t}</span>;
}

const TAG_MAP = {vip:["👑 VIP","tg-vip"],new:["✨ Mới","tg-new"],fu:["📌 Follow","tg-fu"],old:["🔄 Cũ","tg-old"],tip:["💜 Tipper","tg-tip"]};
const ICOS = ["💜","⭐","🌙","✨","🔮","🌟","🌸","🦋","🌈","🎴","🃏","🌊","🔥","💫","🌺","🐸"];
const GROUPS = ["Tình yêu / Hôn nhân","Sự nghiệp / Công việc","Tài chính","Sức khỏe","Gia đình","Tổng quát","Tương lai"];
const WEEK = [{d:"T2",v:320000},{d:"T3",v:510000},{d:"T4",v:280000},{d:"T5",v:620000},{d:"T6",v:450000},{d:"T7",v:780000},{d:"CN",v:590000}];
const REPLIES = [
  {id:1,hash:"#menu",   title:"Menu dịch vụ",      body:"💚 MITCHI TAROT 💚\n\n💜 Tarot Tình Yêu: 20k/câu\n⭐ Tarot Sự Nghiệp: 20k/câu\n🌙 Lenormand: 100k trọn gói\n\n📌 5 câu đầu: 20k/câu\n📌 Từ câu 6+: 15k/câu\n\nInbox đặt lịch nhé 💌"},
  {id:2,hash:"#baogia", title:"Báo giá nhanh",      body:"Chào bạn! 🐸\n• 5 câu đầu: 20.000đ/câu\n• Từ câu 6+: 15.000đ/câu\nVD 7 câu = 100k + 30k = 130.000đ 💚"},
  {id:3,hash:"#booking",title:"Hướng dẫn đặt lịch", body:"Đặt lịch với Mitchi:\n1️⃣ Nhắn câu hỏi muốn xem\n2️⃣ Mitchi báo giá & xác nhận\n3️⃣ Xem bài → nhận hóa đơn\n4️⃣ Chuyển khoản là xong 🔮"},
  {id:4,hash:"#tt",     title:"Nhắc thanh toán",    body:"Bạn ơi đây là hóa đơn của mình nha! 🎉\nBạn chuyển khoản giúp Mitchi với nhé 💚"},
  {id:5,hash:"#trabai", title:"Trả kết quả",        body:"Mitchi đã xem xong bài cho bạn rồi nha! ✨\n[Đính kèm ảnh kết quả + hóa đơn]\nNếu có câu hỏi thêm cứ nhắn Mitchi 🐸"},
  {id:6,hash:"#camon",  title:"Cảm ơn sau xem",    body:"Cảm ơn bạn đã tin tưởng Mitchi! 🐸💚\nMong bài mang năng lượng tích cực cho bạn~"},
  {id:7,hash:"#followup",title:"Follow-up khách cũ",body:"Dạo này bạn khỏe không? 🐸\nMitchi nhớ bạn ~ Có chuyện gì cần chia sẻ không? 💚"},
];

// ── SEED DATA ─────────────────────────────────────────────────────────────────
const SEED_SVCS = [
  {id:"s1",name:"Tarot Tình Yêu",   ico:"💜",type:"per_q",price:20000,price6:15000,dur:60, active:true, sold:42},
  {id:"s2",name:"Tarot Sự Nghiệp",  ico:"⭐",type:"per_q",price:20000,price6:15000,dur:60, active:true, sold:28},
  {id:"s3",name:"Lenormand Tổng Quát",ico:"🌙",type:"fixed",price:100000,price6:0,dur:45,active:true, sold:19},
  {id:"s4",name:"Tarot Năm Mới",    ico:"✨",type:"fixed",price:150000,price6:0,dur:30,active:false,sold:7},
];
const SEED_CUSTS = [
  {id:"c1",name:"Linh Nguyễn",nick:"Bé Linh",phone:"0901234567",social:"fb/linhnguyyen",tags:["vip","old"],ava:"🐸",notes:"Hay hỏi về bạn trai",created:"01/01/2025"},
  {id:"c2",name:"Minh Châu",  nick:"Châu",    phone:"0912345678",social:"zalo/minchau",  tags:["new"],       ava:"🌸",notes:"",created:"05/05/2025"},
  {id:"c3",name:"Thu Hà",     nick:"Hà Trắng",phone:"0923456789",social:"tele/thuha",   tags:["old","fu"],  ava:"⭐",notes:"Hay đổi việc",created:"10/02/2025"},
  {id:"c4",name:"Mai Anh",    nick:"Mai",     phone:"0945678901",social:"fb/maianh99",  tags:["vip","old"], ava:"🌙",notes:"VIP, tips nhiều",created:"15/01/2025"},
];
const SEED_ORDERS = [
  {id:"o1",custId:"c1",items:[{svcId:"s1",qty:7,group:"Tình yêu / Hôn nhân"}],extraQ:0,total:110000,tips:50000,status:"paid",  date:"08/05/2025",time:"09:30",notes:"Xem xong khách hài lòng"},
  {id:"o2",custId:"c2",items:[{svcId:"s3",qty:1,group:"Tổng quát"}],          extraQ:0,total:100000,tips:0,    status:"done",  date:"08/05/2025",time:"11:00",notes:""},
  {id:"o3",custId:"c3",items:[{svcId:"s2",qty:10,group:"Sự nghiệp / Công việc"}],extraQ:0,total:175000,tips:0, status:"new",  date:"08/05/2025",time:"14:15",notes:""},
  {id:"o4",custId:"c4",items:[{svcId:"s1",qty:5,group:"Tình yêu / Hôn nhân"},{svcId:"s2",qty:3,group:"Sự nghiệp / Công việc"}],extraQ:2,total:225000,tips:100000,status:"paid",date:"07/05/2025",time:"16:00",notes:""},
];
const SEED_BOOKINGS = [
  {id:"b1",custId:"c1",svc:"Tarot Tình Yêu",date:"09/05/2025",time:"09:30",status:"confirmed",notes:"Hỏi về bạn trai mới"},
  {id:"b2",custId:"c2",svc:"Lenormand",      date:"09/05/2025",time:"11:00",status:"pending",  notes:""},
  {id:"b3",custId:"c3",svc:"Tarot Sự Nghiệp",date:"09/05/2025",time:"14:15",status:"confirmed",notes:"Muốn đổi việc"},
];

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function Login({onLogin}) {
  const [f,setF]=useState({e:"",p:""});
  const [err,setErr]=useState("");
  const go=()=>{
    if(f.e==="mitchi@shop.vn"&&f.p==="mitchi2024") onLogin();
    else setErr("Sai email hoặc mật khẩu! 🐸");
  };
  return(
    <div className="login-wrap">
      <div className="lc" style={{top:50,left:-40,width:160,height:70}}/>
      <div className="lc" style={{top:30,right:-20,width:120,height:55}}/>
      <div className="lc" style={{bottom:120,right:-50,width:200,height:85}}/>
      <div style={{fontSize:64,marginBottom:6}}>🐸</div>
      <div style={{fontFamily:"Nunito",fontSize:46,fontWeight:900,color:P.ink,letterSpacing:-1,marginBottom:2}}>Mitchi</div>
      <div style={{fontSize:13,fontWeight:700,color:P.inkmid,marginBottom:28}}>Shop Manager · Tarot & Lenormand</div>
      <div className="lcard">
        <div className="lf">
          <label>Email</label>
          <input type="email" placeholder="mitchi@shop.vn" value={f.e} onChange={e=>setF(p=>({...p,e:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&go()}/>
          <label>Mật khẩu</label>
          <input type="password" placeholder="••••••••" value={f.p} onChange={e=>setF(p=>({...p,p:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&go()}/>
        </div>
        {err&&<div style={{color:P.red,fontSize:12,fontWeight:700,textAlign:"center",marginBottom:10}}>{err}</div>}
        <button className="btn btn-g" onClick={go}>Đăng nhập 🐸</button>
        <div style={{fontSize:11,fontWeight:700,color:P.muted,textAlign:"center",marginTop:10}}>Demo: mitchi@shop.vn / mitchi2024</div>
      </div>
    </div>
  );
}

// ── ORDER FORM (create / edit) ────────────────────────────────────────────────
function OrderForm({order, customers, services, onSave, onClose}) {
  const isEdit = !!order;
  const [custId, setCustId] = useState(order?.custId||"");
  const [items,  setItems]  = useState(order?.items||[{svcId:"",qty:"",group:""}]);
  const [extraQ, setExtraQ] = useState(order?.extraQ||0);
  const [notes,  setNotes]  = useState(order?.notes||"");
  const [status, setStatus] = useState(order?.status||"new");

  const addItem = () => setItems(p=>[...p,{svcId:"",qty:"",group:""}]);
  const updItem = (i,k,v) => setItems(p=>p.map((x,j)=>j===i?{...x,[k]:v}:x));
  const delItem = (i) => setItems(p=>p.filter((_,j)=>j!==i));

  const total = (() => {
    let t=0;
    items.forEach(it=>{
      const svc=services.find(s=>s.id===it.svcId);
      if(!svc) return;
      if(svc.type==="fixed") t+=svc.price;
      else t+=calcQ(it.qty,svc.price,svc.price6);
    });
    t+=calcQ(extraQ,20000,15000);
    return t;
  })();

  const save = () => {
    if(!custId){alert("Chọn khách hàng!");return;}
    if(items.every(it=>!it.svcId)){alert("Chọn ít nhất 1 dịch vụ!");return;}
    onSave({
      id: order?.id||uid(),
      custId, items:items.filter(it=>it.svcId),
      extraQ:parseInt(extraQ)||0,
      total, tips:order?.tips||0,
      status, notes,
      date: order?.date||today(),
      time: order?.time||now(),
    });
  };

  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet">
        <div className="drag"/>
        <div className="mh">{isEdit?"Sửa đơn ✏️":"Tạo đơn mới 🐸"}</div>

        {/* Khách */}
        <div className="f">
          <label>Khách hàng</label>
          <select value={custId} onChange={e=>setCustId(e.target.value)}>
            <option value="">Chọn khách...</option>
            {customers.map(c=><option key={c.id} value={c.id}>{c.ava} {c.name} – {c.nick}</option>)}
          </select>
        </div>

        {/* Dịch vụ items */}
        <div className="f">
          <label>Gói dịch vụ đã xem</label>
          {items.map((it,i)=>{
            const svc=services.find(s=>s.id===it.svcId);
            return(
              <div key={i} style={{background:P.greenbg,borderRadius:12,border:`1.5px solid ${P.border}`,padding:12,marginBottom:8}}>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
                  <select style={{flex:1,padding:"9px 10px",borderRadius:10,border:`2px solid ${P.ink}`,background:P.card,fontFamily:"Nunito Sans",fontSize:13,fontWeight:600,outline:"none"}}
                    value={it.svcId} onChange={e=>updItem(i,"svcId",e.target.value)}>
                    <option value="">Chọn dịch vụ...</option>
                    {services.filter(s=>s.active).map(s=>(
                      <option key={s.id} value={s.id}>{s.ico} {s.name} — {s.type==="fixed"?vnd(s.price):`${s.price/1000}k/câu`}</option>
                    ))}
                  </select>
                  {items.length>1&&<button className="btn-xs btn" style={{background:"#FFE4E4",padding:"8px 10px"}} onClick={()=>delItem(i)}>✕</button>}
                </div>
                {svc&&svc.type==="per_q"&&(
                  <input type="number" placeholder="Số câu hỏi" min="1" value={it.qty}
                    onChange={e=>updItem(i,"qty",e.target.value)}
                    style={{width:"100%",padding:"9px 12px",borderRadius:10,border:`2px solid ${P.ink}`,background:P.card,fontFamily:"Nunito Sans",fontSize:13,fontWeight:600,outline:"none",marginBottom:8}}/>
                )}
                <select style={{width:"100%",padding:"9px 10px",borderRadius:10,border:`2px solid ${P.ink}`,background:P.card,fontFamily:"Nunito Sans",fontSize:13,fontWeight:600,outline:"none"}}
                  value={it.group} onChange={e=>updItem(i,"group",e.target.value)}>
                  <option value="">Chủ đề câu hỏi...</option>
                  {GROUPS.map(g=><option key={g}>{g}</option>)}
                </select>
                {svc&&it.qty&&svc.type==="per_q"&&(
                  <div style={{fontSize:12,fontWeight:800,color:P.green,marginTop:6,textAlign:"right"}}>
                    → {vnd(calcQ(it.qty,svc.price,svc.price6))}
                  </div>
                )}
                {svc&&svc.type==="fixed"&&(
                  <div style={{fontSize:12,fontWeight:800,color:P.green,marginTop:6,textAlign:"right"}}>→ {vnd(svc.price)}</div>
                )}
              </div>
            );
          })}
          <button className="btn-xs btn btn-s" onClick={addItem} style={{marginTop:4}}>+ Thêm gói / dịch vụ</button>
        </div>

        {/* Câu lẻ thêm */}
        <div className="f">
          <label>Câu hỏi lẻ thêm (ngoài gói) — 20k/câu (từ câu 6: 15k)</label>
          <input type="number" min="0" placeholder="0 = không có" value={extraQ||""} onChange={e=>setExtraQ(e.target.value)}/>
          {extraQ>0&&<div style={{fontSize:12,fontWeight:800,color:P.orange,marginTop:4}}>+ {vnd(calcQ(extraQ,20000,15000))} câu lẻ</div>}
        </div>

        {/* Chủ đề tổng */}
        <div className="f">
          <label>Ghi chú</label>
          <textarea placeholder="Ghi chú thêm về buổi xem..." value={notes} onChange={e=>setNotes(e.target.value)}/>
        </div>

        {isEdit&&(
          <div className="f">
            <label>Trạng thái</label>
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              {STATUS_FLOW.map(s=>{
                const[t,c]=STATUS_MAP[s];
                return(
                  <button key={s} onClick={()=>setStatus(s)}
                    style={{padding:"7px 12px",borderRadius:10,border:`2px solid ${P.ink}`,fontFamily:"Nunito",fontWeight:800,fontSize:11,cursor:"pointer",
                      background:status===s?P.ink:P.card,color:status===s?"#fff":P.ink,
                      boxShadow:status===s?`2px 2px 0 ${P.green}`:`2px 2px 0 ${P.ink}`}}>
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tổng tiền preview */}
        {total>0&&(
          <div className="box box-greenbg" style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",fontFamily:"Nunito",fontWeight:900,fontSize:20,color:P.ink}}>
              <span>TỔNG</span><span style={{color:P.green}}>{vnd(total)}</span>
            </div>
          </div>
        )}

        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <button className="btn btn-g" style={{flex:2}} onClick={save}>{isEdit?"💾 Lưu thay đổi":"📋 Tạo đơn"}</button>
          <button className="btn btn-gh" style={{flex:1}} onClick={onClose}>Huỷ</button>
        </div>
      </div>
    </div>
  );
}

// ── ORDER DETAIL ──────────────────────────────────────────────────────────────
function OrderDetail({order, customers, services, onUpdate, onClose, toast}) {
  const [tipsInput, setTipsInput] = useState("");
  const [showTipsEdit, setShowTipsEdit] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [editing, setEditing] = useState(false);

  const cust = customers.find(c=>c.id===order.custId);

  const nextStatus = () => {
    const idx = STATUS_FLOW.indexOf(order.status);
    const next = STATUS_FLOW[Math.min(idx+1, STATUS_FLOW.length-2)];
    onUpdate({...order, status:next});
    toast(`✅ Đã chuyển sang: ${STATUS_MAP[next][0]}`);
  };

  const addTips = () => {
    const t = parseInt(tipsInput)||0;
    if(!t) return;
    onUpdate({...order, tips:(order.tips||0)+t});
    setTipsInput(""); setShowTipsEdit(false);
    toast(`💜 Đã ghi nhận tips ${vnd(t)}!`);
  };

  const cancelOrder = () => {
    onUpdate({...order, status:"cancel"});
    toast("🗑 Đã huỷ đơn!"); onClose();
  };

  if(editing) return(
    <OrderForm order={order} customers={customers} services={services}
      onSave={o=>{onUpdate(o);setEditing(false);toast("✅ Đã cập nhật đơn!");}}
      onClose={()=>setEditing(false)}/>
  );

  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet">
        <div className="drag"/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div className="mh" style={{marginBottom:0}}>Chi tiết đơn</div>
          <div style={{display:"flex",gap:6}}>
            <button className="btn-xs btn btn-y" onClick={()=>setEditing(true)}>✏️ Sửa</button>
            {order.status!=="cancel"&&order.status!=="paid"&&(
              <button className="btn-xs btn" style={{background:"#FFE4E4"}} onClick={cancelOrder}>🗑 Huỷ</button>
            )}
          </div>
        </div>

        {/* Khách */}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,background:P.cloud,borderRadius:14,border:`2px solid ${P.ink}`,padding:12}}>
          <div style={{fontSize:32}}>{cust?.ava||"👤"}</div>
          <div>
            <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:16}}>{cust?.name}</div>
            <div style={{fontSize:12,fontWeight:600,color:P.muted}}>{cust?.nick} · {cust?.phone}</div>
          </div>
          <div style={{marginLeft:"auto"}}><Badge s={order.status}/></div>
        </div>

        {/* Items */}
        {order.items.map((it,i)=>{
          const svc=services.find(s=>s.id===it.svcId);
          return svc?(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"8px 0",borderBottom:`1.5px dashed ${P.border}`}}>
              <div>
                <div style={{fontSize:14,fontWeight:700}}>{svc.ico} {svc.name}</div>
                {svc.type==="per_q"&&<div style={{fontSize:11,fontWeight:600,color:P.muted}}>{it.qty} câu</div>}
                {it.group&&<div style={{fontSize:11,fontWeight:600,color:P.purple}}>📌 {it.group}</div>}
              </div>
              <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:14,color:P.green}}>
                {svc.type==="fixed"?vnd(svc.price):vnd(calcQ(it.qty,svc.price,svc.price6))}
              </div>
            </div>
          ):null;
        })}
        {order.extraQ>0&&(
          <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1.5px dashed ${P.border}`}}>
            <div style={{fontSize:14,fontWeight:700}}>💬 {order.extraQ} câu lẻ thêm</div>
            <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:14,color:P.orange}}>{vnd(calcQ(order.extraQ,20000,15000))}</div>
          </div>
        )}

        {/* Tổng */}
        <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0 8px",borderTop:`2.5px solid ${P.ink}`}}>
          <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:16}}>TỔNG XEM BÀI</div>
          <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:20,color:P.green}}>{vnd(order.total)}</div>
        </div>

        {/* Tips */}
        <div style={{background:order.tips>0?P.yellowbg:P.greenbg,borderRadius:12,border:`1.5px solid ${P.border}`,padding:12,marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:14}}>💜 Tips</div>
              <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:20,color:P.purple}}>{order.tips>0?vnd(order.tips):"Chưa có"}</div>
            </div>
            <button className="btn-xs btn" style={{background:P.purple,color:"#fff",borderColor:P.ink}}
              onClick={()=>setShowTipsEdit(v=>!v)}>
              {showTipsEdit?"Đóng":"+ Tips"}
            </button>
          </div>
          {showTipsEdit&&(
            <div style={{marginTop:10,display:"flex",gap:8}}>
              <input type="number" placeholder="Số tiền tips..." value={tipsInput}
                onChange={e=>setTipsInput(e.target.value)}
                style={{flex:1,padding:"9px 12px",borderRadius:10,border:`2px solid ${P.ink}`,background:P.card,fontFamily:"Nunito Sans",fontSize:14,fontWeight:600,outline:"none"}}/>
              <button className="btn-xs btn" style={{background:P.purple,color:"#fff"}} onClick={addTips}>Ghi</button>
            </div>
          )}
        </div>

        {/* Tổng cộng */}
        <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:`2.5px solid ${P.ink}`,marginBottom:14}}>
          <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:14}}>TỔNG CỘNG (+ tips)</div>
          <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:22,color:P.ink}}>{vnd(order.total+(order.tips||0))}</div>
        </div>

        {order.notes&&(
          <div style={{background:P.cloud,borderRadius:10,padding:10,marginBottom:12,fontSize:13,fontWeight:600,color:P.inkmid}}>
            📝 {order.notes}
          </div>
        )}

        {/* Actions */}
        <div style={{fontSize:11,fontWeight:700,color:P.muted,marginBottom:8}}>{order.date} · {order.time}</div>

        {order.status!=="paid"&&order.status!=="cancel"&&(
          <button className="btn btn-g" style={{marginBottom:8}} onClick={nextStatus}>
            {order.status==="new"?"▶ Bắt đầu xem bài":order.status==="view"?"✅ Xem xong":order.status==="done"?"💰 Đánh dấu đã thanh toán":""}
          </button>
        )}

        <button className="btn btn-s" style={{marginBottom:8}} onClick={()=>setShowInvoice(true)}>
          🧾 Xem & xuất hóa đơn
        </button>

        <button className="btn btn-gh" onClick={onClose}>Đóng</button>

        {showInvoice&&(
          <InvoiceView order={order} cust={cust} services={services} toast={toast} onClose={()=>setShowInvoice(false)}/>
        )}
      </div>
    </div>
  );
}

// ── INVOICE VIEW ──────────────────────────────────────────────────────────────
function InvoiceView({order, cust, services, toast, onClose}) {
  const [qr, setQr] = useState("acb");
  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet">
        <div className="drag"/>
        <div className="mh">🧾 Hóa Đơn</div>
        <div className="inv">
          <div className="inv-hdr">
            <div style={{fontSize:32,marginBottom:4}}>🐸</div>
            <div style={{fontFamily:"Nunito",fontSize:20,fontWeight:900,color:P.ink}}>Mitchi Tarot</div>
            <div style={{fontSize:11,fontWeight:700,color:P.inkmid}}>{order.date} · {order.time}</div>
          </div>
          <div className="inv-body">
            <div className="inv-row">
              <span style={{fontSize:12,fontWeight:700,color:P.muted}}>Khách hàng</span>
              <span style={{fontSize:13,fontWeight:700}}>{cust?.name}</span>
            </div>
            {order.items.map((it,i)=>{
              const svc=services.find(s=>s.id===it.svcId);
              if(!svc) return null;
              const amt=svc.type==="fixed"?svc.price:calcQ(it.qty,svc.price,svc.price6);
              return(
                <div key={i} className="inv-row">
                  <span style={{fontSize:12,fontWeight:700,color:P.muted}}>
                    {svc.ico} {svc.name}{svc.type==="per_q"?` (${it.qty} câu)`:""}
                    {it.group&&<span style={{display:"block",fontSize:10,color:P.muted}}>📌 {it.group}</span>}
                  </span>
                  <span style={{fontFamily:"Nunito",fontWeight:900,fontSize:14,color:P.green}}>{vnd(amt)}</span>
                </div>
              );
            })}
            {order.extraQ>0&&(
              <div className="inv-row">
                <span style={{fontSize:12,fontWeight:700,color:P.muted}}>💬 {order.extraQ} câu lẻ thêm</span>
                <span style={{fontFamily:"Nunito",fontWeight:900,fontSize:14,color:P.orange}}>{vnd(calcQ(order.extraQ,20000,15000))}</span>
              </div>
            )}
            <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0 4px",borderTop:`2.5px solid ${P.ink}`}}>
              <span style={{fontFamily:"Nunito",fontWeight:900,fontSize:14}}>TỔNG CỘNG</span>
              <span style={{fontFamily:"Nunito",fontWeight:900,fontSize:22,color:P.green}}>{vnd(order.total)}</span>
            </div>

            {/* QR selector */}
            <div style={{marginTop:12}}>
              <div style={{fontSize:11,fontWeight:800,color:P.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Ngân hàng QR</div>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                {["acb","vcb"].map(b=>(
                  <button key={b} onClick={()=>setQr(b)}
                    style={{flex:1,padding:10,borderRadius:12,border:`2.5px solid ${qr===b?P.ink:P.border}`,background:qr===b?P.yellow:P.card,fontFamily:"Nunito",fontWeight:800,fontSize:13,cursor:"pointer",boxShadow:qr===b?`2px 2px 0 ${P.ink}`:"none"}}>
                    {b==="acb"?"🏦 ACB":"🏦 VCB"}
                  </button>
                ))}
              </div>
              <div style={{background:P.bg,borderRadius:12,border:`2px solid ${P.ink}`,padding:14,textAlign:"center"}}>
                <div style={{fontSize:56,marginBottom:6}}>📱</div>
                <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:13}}>{qr==="acb"?"ACB – Nguyễn Thị Mitchi":"Vietcombank – Nguyễn Thị Mitchi"}</div>
                <div style={{fontSize:11,fontWeight:700,color:P.muted,marginTop:4}}>Quét mã QR để chuyển khoản</div>
              </div>
            </div>
            <div style={{textAlign:"center",fontSize:12,fontWeight:700,color:P.muted,padding:"10px 0 4px"}}>🐸 Cảm ơn bạn đã tin tưởng Mitchi Tarot! 🐸</div>
          </div>
        </div>
        <div style={{height:12}}/>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <button className="btn btn-y" style={{flex:1}} onClick={()=>toast("📸 Đã xuất PNG!")}>📸 PNG</button>
          <button className="btn btn-g" style={{flex:1}} onClick={()=>toast("📄 Đã xuất PDF!")}>📄 PDF</button>
        </div>
        <button className="btn btn-s" onClick={()=>{
          const lines=order.items.map(it=>{const svc=services.find(s=>s.id===it.svcId);return svc?`${svc.ico} ${svc.name}${svc.type==="per_q"?` (${it.qty} câu)`:""}: ${svc.type==="fixed"?vnd(svc.price):vnd(calcQ(it.qty,svc.price,svc.price6))}`:""}).filter(Boolean).join("\n");
          const txt=`🧾 HÓA ĐƠN MITCHI TAROT\n📅 ${order.date} · ${order.time}\n👤 ${cust?.name}\n\n${lines}${order.extraQ>0?`\n💬 ${order.extraQ} câu lẻ: ${vnd(calcQ(order.extraQ,20000,15000))}`:""}`;
          navigator.clipboard?.writeText(txt+`\n\n💰 TỔNG: ${vnd(order.total)}\n🏦 ${qr==="acb"?"ACB":"VCB"} – Nguyễn Thị Mitchi\n\n🐸 Cảm ơn bạn đã tin tưởng Mitchi!`);
          toast("📋 Đã copy text hóa đơn!");
        }}>📋 Copy text gửi Zalo/Messenger</button>
        <div style={{height:8}}/>
        <button className="btn btn-gh" onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
}

// ── ORDERS PAGE ───────────────────────────────────────────────────────────────
function Orders({orders,setOrders,customers,services,toast}) {
  const [filter,setFilter]=useState("all");
  const [showNew,setShowNew]=useState(false);
  const [selOrder,setSelOrder]=useState(null);

  const shown=filter==="all"?orders:orders.filter(o=>o.status===filter);

  const saveNew=(o)=>{setOrders(p=>[o,...p]);setShowNew(false);toast("🐸 Đã tạo đơn mới!");};
  const updateOrder=(o)=>{setOrders(p=>p.map(x=>x.id===o.id?o:x));setSelOrder(o);};

  const cName=(id)=>customers.find(c=>c.id===id)?.name||"?";
  const cAva=(id)=>customers.find(c=>c.id===id)?.ava||"👤";

  return(
    <div className="scroll-body">
      <div className="hdr">
        <div className="hdr-deco">📋</div>
        <div className="hdr-eye">Quản lý</div>
        <div className="hdr-h1">Đơn Xem Bói</div>
        <div className="hdr-sub">{orders.length} đơn · Hôm nay: {vnd(orders.filter(o=>o.date===today()&&o.status==="paid").reduce((s,o)=>s+o.total,0))}</div>
      </div>
      <input className="sb" placeholder="Tìm khách hàng..."/>
      <div className="sec" style={{paddingTop:10}}>
        <div className="pill-row">
          {[{k:"all",l:"Tất cả"},{k:"new",l:"Mới"},{k:"view",l:"Đang xem"},{k:"done",l:"Xong"},{k:"paid",l:"Đã TT"}].map(x=>(
            <button key={x.k} className={`pill ${filter===x.k?"on":""}`} onClick={()=>setFilter(x.k)}>{x.l}</button>
          ))}
        </div>
        {shown.length===0&&<div style={{textAlign:"center",padding:24,color:P.muted,fontWeight:700}}>Không có đơn nào</div>}
        {shown.map(o=>(
          <div key={o.id} className="row" onClick={()=>setSelOrder(o)}>
            <div className="ava" style={{background:P.cloud,fontSize:22,borderRadius:"50%"}}>{cAva(o.custId)}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:700,color:P.ink}}>{cName(o.custId)}</div>
              <div style={{fontSize:11,fontWeight:600,color:P.muted,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                {o.items.map(it=>services.find(s=>s.id===it.svcId)?.name).filter(Boolean).join(" + ")}
                {o.extraQ>0&&` + ${o.extraQ}câu lẻ`}
              </div>
              <div style={{fontSize:10,fontWeight:700,color:P.muted}}>{o.date} · {o.time}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:14,color:P.ink}}>{vnd(o.total)}</div>
              {o.tips>0&&<div style={{fontSize:10,fontWeight:800,color:P.purple}}>+{vnd(o.tips)} tips</div>}
              <Badge s={o.status}/>
            </div>
          </div>
        ))}
      </div>

      <button className="fab" onClick={()=>setShowNew(true)}>{I.plus}</button>

      {showNew&&<OrderForm customers={customers} services={services} onSave={saveNew} onClose={()=>setShowNew(false)}/>}
      {selOrder&&(
        <OrderDetail
          order={orders.find(o=>o.id===selOrder.id)||selOrder}
          customers={customers} services={services}
          onUpdate={updateOrder}
          onClose={()=>setSelOrder(null)}
          toast={toast}/>
      )}
    </div>
  );
}

// ── CUSTOMERS PAGE ────────────────────────────────────────────────────────────
function Customers({customers,setCustomers,orders,services,toast,navToOrders}) {
  const [sel,setSel]=useState(null);
  const [modal,setModal]=useState(false);
  const [editData,setEditData]=useState(null);
  const [form,setForm]=useState({name:"",nick:"",phone:"",social:"",notes:"",ava:"🐸"});
  const [delConfirm,setDelConfirm]=useState(false);
  const AVAS=["🐸","🌸","⭐","🌙","🦋","🌺","🌊","💫","🔮","🌈"];

  const openNew=()=>{ setForm({name:"",nick:"",phone:"",social:"",notes:"",ava:"🐸"}); setEditData(null); setModal(true); };
  const openEdit=(c)=>{ setForm({name:c.name,nick:c.nick,phone:c.phone,social:c.social||"",notes:c.notes||"",ava:c.ava}); setEditData(c); setModal(true); };

  const save=()=>{
    if(!form.name.trim()){alert("Nhập tên khách!");return;}
    if(editData){
      setCustomers(p=>p.map(c=>c.id===editData.id?{...c,...form}:c));
      toast("✅ Đã cập nhật khách hàng!");
    } else {
      setCustomers(p=>[{id:uid(),...form,tags:["new"],created:today()},...p]);
      toast("🐸 Đã thêm khách mới!");
    }
    setModal(false);
  };

  const del=(id)=>{ setCustomers(p=>p.filter(c=>c.id!==id)); setSel(null); toast("🗑 Đã xoá khách!"); };

  const custOrders=(id)=>orders.filter(o=>o.custId===id);
  const totalSpent=(id)=>custOrders(id).filter(o=>o.status==="paid").reduce((s,o)=>s+o.total,0);
  const totalTips=(id)=>custOrders(id).reduce((s,o)=>s+(o.tips||0),0);

  const autoTags=(c)=>{
    const tags=[...c.tags.filter(t=>!["vip","tip"].includes(t))];
    if(totalSpent(c.id)>500000||custOrders(c.id).length>=5) { if(!tags.includes("vip")) tags.push("vip"); }
    if(totalTips(c.id)>0) { if(!tags.includes("tip")) tags.push("tip"); }
    return tags;
  };

  if(sel){
    const c=customers.find(x=>x.id===sel);
    if(!c){setSel(null);return null;}
    const co=custOrders(c.id);
    const ts=totalSpent(c.id);
    const tt=totalTips(c.id);
    const tags=autoTags(c);
    return(
      <div className="scroll-body">
        <div className="hdr" style={{paddingTop:40}}>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
            <button onClick={()=>setSel(null)} style={{background:"rgba(255,255,255,.3)",border:`2px solid ${P.ink}`,borderRadius:12,padding:"6px 12px",fontFamily:"Nunito",fontWeight:900,fontSize:14,cursor:"pointer",boxShadow:`2px 2px 0 ${P.ink}`}}>← Back</button>
            <div>
              <div className="hdr-h1">{c.nick||c.name}</div>
              <div className="hdr-sub">{c.name} · {c.phone}</div>
            </div>
          </div>
        </div>
        <div className="sec">
          <div className="box" style={{textAlign:"center",padding:"20px 16px",marginBottom:12}}>
            <div style={{fontSize:52,marginBottom:8}}>{c.ava}</div>
            <div style={{fontFamily:"Nunito",fontSize:20,fontWeight:900}}>{c.nick||c.name}</div>
            <div style={{fontSize:12,fontWeight:700,color:P.muted,margin:"4px 0 8px"}}>{c.phone}{c.social&&` · ${c.social}`}</div>
            <div style={{marginBottom:8}}>
              {tags.map(t=>{const[l,cl]=TAG_MAP[t]||[t,"tg-new"];return<span key={t} className={`tg ${cl}`}>{l}</span>;})}
            </div>
            {c.notes&&<div style={{fontSize:12,fontWeight:600,color:P.muted,background:P.bg,borderRadius:8,padding:"6px 10px"}}>{c.notes}</div>}
          </div>

          <div className="sg" style={{padding:0,marginBottom:14}}>
            {[
              {i:"🔮",n:co.length,  l:"Lần xem",   bg:P.cloud},
              {i:"💰",n:vnd(ts),    l:"Đã chi",     bg:P.greenbg},
              {i:"💜",n:vnd(tt),    l:"Tổng tips",  bg:"#F3E8FF"},
              {i:"📋",n:co.filter(o=>o.status==="paid").length, l:"Đơn hoàn thành", bg:P.yellowbg},
            ].map(s=>(
              <div key={s.l} className="sc" style={{background:s.bg,textAlign:"center"}}>
                <div className="sc-i">{s.i}</div>
                <div className="sc-n" style={{fontSize:16}}>{s.n}</div>
                <div className="sc-l">{s.l}</div>
              </div>
            ))}
          </div>

          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <button className="btn btn-y" style={{flex:1}} onClick={()=>openEdit(c)}>✏️ Sửa thông tin</button>
            <button className="btn btn-g" style={{flex:1}} onClick={()=>{setSel(null);navToOrders(c.id);}}>📋 Tạo đơn</button>
          </div>

          <div className="sec-t" style={{marginBottom:10}}>📋 Lịch sử đơn</div>
          {co.length===0&&<div style={{textAlign:"center",padding:16,color:P.muted,fontWeight:700}}>Chưa có đơn nào</div>}
          {co.map(o=>(
            <div key={o.id} className="row" style={{cursor:"default"}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700}}>{o.items.map(it=>services.find(s=>s.id===it.svcId)?.name).filter(Boolean).join(" + ")}</div>
                <div style={{fontSize:11,fontWeight:600,color:P.muted}}>{o.date} · {o.time}</div>
                {o.items.map((it,i)=>it.group?<div key={i} style={{fontSize:10,color:P.purple,fontWeight:700}}>📌 {it.group}</div>:null)}
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:14}}>{vnd(o.total)}</div>
                {o.tips>0&&<div style={{fontSize:10,fontWeight:800,color:P.purple}}>+{vnd(o.tips)} 💜</div>}
                <Badge s={o.status}/>
              </div>
            </div>
          ))}

          <div style={{height:12}}/>
          <button className="btn" style={{background:P.card,color:P.red,border:`2.5px solid ${P.red}`,boxShadow:`3px 3px 0 ${P.red}`,fontFamily:"Nunito",fontWeight:900}}
            onClick={()=>setDelConfirm(true)}>🗑 Xoá khách hàng</button>
          {delConfirm&&(
            <div style={{marginTop:10,background:"#FFE4E4",borderRadius:12,border:`2px solid ${P.red}`,padding:14}}>
              <div style={{fontWeight:700,marginBottom:10,color:P.red}}>Xoá khách "{c.name}"? Không thể hoàn tác!</div>
              <div style={{display:"flex",gap:8}}>
                <button className="btn btn-r" style={{flex:1}} onClick={()=>del(c.id)}>Xoá luôn</button>
                <button className="btn btn-gh" style={{flex:1}} onClick={()=>setDelConfirm(false)}>Huỷ</button>
              </div>
            </div>
          )}
        </div>

        {modal&&(
          <div className="overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
            <div className="sheet">
              <div className="drag"/>
              <div className="mh">Sửa khách hàng ✏️</div>
              <div className="f"><label>Avatar</label>
                <div className="ico-pick">{AVAS.map(a=>(
                  <button key={a} className="ico-btn" onClick={()=>setForm(p=>({...p,ava:a}))}
                    style={{border:`2.5px solid ${form.ava===a?P.ink:P.border}`,background:form.ava===a?P.yellow:P.card,boxShadow:form.ava===a?`2px 2px 0 ${P.ink}`:"none"}}>{a}</button>
                ))}</div>
              </div>
              {[{l:"Tên đầy đủ",k:"name",p:"Nguyễn Văn A"},{l:"Nickname",k:"nick",p:"Bé A"},{l:"Số điện thoại",k:"phone",p:"0912345678",t:"tel"},{l:"Facebook / Zalo",k:"social",p:"Tên hoặc link"}].map(x=>(
                <div className="f" key={x.k}><label>{x.l}</label>
                  <input type={x.t||"text"} placeholder={x.p} value={form[x.k]} onChange={e=>setForm(p=>({...p,[x.k]:e.target.value}))}/>
                </div>
              ))}
              <div className="f"><label>Ghi chú</label>
                <textarea placeholder="Ghi chú về khách..." value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/>
              </div>
              <button className="btn btn-g" onClick={save} style={{marginBottom:8}}>💾 Lưu</button>
              <button className="btn btn-gh" onClick={()=>setModal(false)}>Huỷ</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return(
    <div className="scroll-body">
      <div className="hdr">
        <div className="hdr-deco">👥</div>
        <div className="hdr-eye">Danh sách</div>
        <div className="hdr-h1">Khách Hàng</div>
        <div className="hdr-sub">{customers.length} khách · {customers.filter(c=>autoTags(c).includes("vip")).length} VIP</div>
      </div>
      <input className="sb" placeholder="Tìm tên, số điện thoại..."/>
      <div className="sec" style={{paddingTop:10}}>
        <div className="pill-row">
          {["Tất cả","👑 VIP","✨ Mới","📌 Follow-up","💜 Tips"].map(f=>(
            <button key={f} className={`pill ${f==="Tất cả"?"on":""}`}>{f}</button>
          ))}
        </div>
        {customers.map(c=>{
          const co=custOrders(c.id);
          const ts=totalSpent(c.id);
          const tt=totalTips(c.id);
          const tags=autoTags(c);
          return(
            <div key={c.id} className="row" onClick={()=>setSel(c.id)}>
              <div className="ava" style={{background:P.cloud,borderRadius:"50%",fontSize:22}}>{c.ava}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:700}}>{c.nick||c.name}</div>
                <div style={{fontSize:11,fontWeight:600,color:P.muted}}>{c.phone}</div>
                <div>{tags.map(t=>{const[l,cl]=TAG_MAP[t]||[t,"tg-new"];return<span key={t} className={`tg ${cl}`}>{l}</span>;})}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:14,color:P.green}}>{vnd(ts)}</div>
                {tt>0&&<div style={{fontSize:10,fontWeight:800,color:P.purple}}>+{vnd(tt)} 💜</div>}
                <div style={{fontSize:10,fontWeight:700,color:P.muted}}>{co.length} lần</div>
              </div>
            </div>
          );
        })}
      </div>
      <button className="fab" onClick={openNew}>{I.plus}</button>
      {modal&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="sheet">
            <div className="drag"/>
            <div className="mh">Thêm Khách Mới 🐸</div>
            <div className="f"><label>Avatar</label>
              <div className="ico-pick">{AVAS.map(a=>(
                <button key={a} className="ico-btn" onClick={()=>setForm(p=>({...p,ava:a}))}
                  style={{border:`2.5px solid ${form.ava===a?P.ink:P.border}`,background:form.ava===a?P.yellow:P.card,boxShadow:form.ava===a?`2px 2px 0 ${P.ink}`:"none"}}>{a}</button>
              ))}</div>
            </div>
            {[{l:"Tên đầy đủ",k:"name",p:"Nguyễn Văn A"},{l:"Nickname",k:"nick",p:"Bé A"},{l:"Số điện thoại",k:"phone",p:"0912345678",t:"tel"},{l:"Facebook / Zalo",k:"social",p:"Tên hoặc link"}].map(x=>(
              <div className="f" key={x.k}><label>{x.l}</label>
                <input type={x.t||"text"} placeholder={x.p} value={form[x.k]} onChange={e=>setForm(p=>({...p,[x.k]:e.target.value}))}/>
              </div>
            ))}
            <div className="f"><label>Ghi chú</label>
              <textarea placeholder="Ghi chú về khách..." value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/>
            </div>
            <button className="btn btn-g" onClick={save} style={{marginBottom:8}}>🐸 Thêm khách</button>
            <button className="btn btn-gh" onClick={()=>setModal(false)}>Huỷ</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── BOOKING PAGE ──────────────────────────────────────────────────────────────
function Booking({bookings,setBookings,customers,services,toast}) {
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({custId:"",svc:"",date:today(),time:"",notes:"",status:"pending"});
  const today2=new Date().getDate();
  const fd=new Date(new Date().getFullYear(),new Date().getMonth(),1).getDay();
  const dim=new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate();
  const cells=Array(fd).fill(null).concat(Array.from({length:dim},(_,i)=>i+1));
  const hasBk=(d)=>bookings.some(b=>b.date.startsWith(`${String(d).padStart(2,"0")}/${String(new Date().getMonth()+1).padStart(2,"0")}`));
  const todayBks=bookings.filter(b=>b.date===today());
  const cName=(id)=>customers.find(c=>c.id===id)?.name||"?";
  const cAva=(id)=>customers.find(c=>c.id===id)?.ava||"👤";
  const addBk=()=>{
    if(!form.custId||!form.svc||!form.time){alert("Điền đầy đủ thông tin!");return;}
    setBookings(p=>[...p,{id:uid(),...form}]);
    setModal(false); toast("📅 Đã tạo booking mới!");
  };
  const toggleStatus=(id)=>setBookings(p=>p.map(b=>b.id===id?{...b,status:b.status==="pending"?"confirmed":b.status==="confirmed"?"cancel":"pending"}:b));

  return(
    <div className="scroll-body">
      <div className="hdr">
        <div className="hdr-deco">📅</div>
        <div className="hdr-eye">Lịch làm việc</div>
        <div className="hdr-h1">Booking</div>
        <div className="hdr-sub">{new Date().toLocaleDateString("vi-VN",{month:"long",year:"numeric"})}</div>
      </div>
      <div className="sec" style={{paddingTop:16}}>
        <div className="cal-hd">{["CN","T2","T3","T4","T5","T6","T7"].map(d=><div key={d} className="cal-dh">{d}</div>)}</div>
        <div className="cal-g">
          {cells.map((d,i)=>(
            <div key={i} className={`cd ${d===today2?"today":""} ${hasBk(d)?"has":""}`}>{d||""}</div>
          ))}
        </div>
      </div>
      <div className="sec">
        <div className="sec-h">
          <div className="sec-t">📌 Hôm nay · {today()}</div>
          <button className="btn-xs btn btn-g" onClick={()=>setModal(true)}>+ Booking</button>
        </div>
        {todayBks.length===0&&<div style={{textAlign:"center",padding:16,color:P.muted,fontWeight:700}}>Chưa có booking hôm nay</div>}
        {todayBks.map(b=>(
          <div key={b.id} className="row" style={{borderLeft:`4px solid ${b.status==="confirmed"?P.green:b.status==="cancel"?P.red:P.yellow}`}}>
            <div style={{fontSize:24}}>{cAva(b.custId)}</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:17,color:P.ink}}>{b.time}</div>
              <div style={{fontSize:14,fontWeight:700}}>{cName(b.custId)}</div>
              <div style={{fontSize:11,fontWeight:600,color:P.muted}}>{b.svc}{b.notes&&` · ${b.notes}`}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
              <span className={`bd ${b.status==="confirmed"?"bd-paid":b.status==="cancel"?"bd-can":"bd-pend"}`}>
                {b.status==="confirmed"?"XÁC NHẬN":b.status==="cancel"?"HỦY":"CHỜ"}
              </span>
              {b.status!=="cancel"&&<button className="btn-xs btn btn-y" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>toggleStatus(b.id)}>
                {b.status==="pending"?"✅ Xác nhận":"❌ Huỷ"}
              </button>}
            </div>
          </div>
        ))}
        <div style={{height:14}}/>
        <div className="sec-t" style={{marginBottom:10}}>📅 Tất cả booking</div>
        {bookings.filter(b=>b.date!==today()).map(b=>(
          <div key={b.id} className="row" style={{borderLeft:`4px solid ${b.status==="confirmed"?P.green:P.yellow}`}}>
            <div style={{fontSize:20}}>{cAva(b.custId)}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700}}>{b.date} · {b.time}</div>
              <div style={{fontSize:12,fontWeight:600,color:P.muted}}>{cName(b.custId)} · {b.svc}</div>
            </div>
            <span className={`bd ${b.status==="confirmed"?"bd-paid":"bd-pend"}`}>{b.status==="confirmed"?"XÁC NHẬN":"CHỜ"}</span>
          </div>
        ))}
      </div>
      <button className="fab" onClick={()=>setModal(true)}>{I.plus}</button>
      {modal&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="sheet">
            <div className="drag"/>
            <div className="mh">Tạo Booking Mới 📅</div>
            <div className="f"><label>Khách hàng</label>
              <select value={form.custId} onChange={e=>setForm(p=>({...p,custId:e.target.value}))}>
                <option value="">Chọn khách...</option>
                {customers.map(c=><option key={c.id} value={c.id}>{c.ava} {c.name} – {c.nick}</option>)}
              </select>
            </div>
            <div className="f"><label>Dịch vụ</label>
              <select value={form.svc} onChange={e=>setForm(p=>({...p,svc:e.target.value}))}>
                <option value="">Chọn dịch vụ...</option>
                {services.filter(s=>s.active).map(s=><option key={s.id} value={s.name}>{s.ico} {s.name}</option>)}
              </select>
            </div>
            <div style={{display:"flex",gap:8}}>
              <div className="f" style={{flex:1}}><label>Ngày</label>
                <input type="text" placeholder="DD/MM/YYYY" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))}/>
              </div>
              <div className="f" style={{flex:1}}><label>Giờ</label>
                <input type="time" value={form.time} onChange={e=>setForm(p=>({...p,time:e.target.value}))}/>
              </div>
            </div>
            <div className="f"><label>Ghi chú</label>
              <textarea placeholder="Ghi chú..." value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/>
            </div>
            <button className="btn btn-g" onClick={addBk} style={{marginBottom:8}}>📅 Tạo booking</button>
            <button className="btn btn-gh" onClick={()=>setModal(false)}>Huỷ</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MESSAGES PAGE ─────────────────────────────────────────────────────────────
function Messages({toast}) {
  return(
    <div className="scroll-body">
      <div className="hdr">
        <div className="hdr-deco">💬</div>
        <div className="hdr-eye">Copy 1 chạm</div>
        <div className="hdr-h1">Tin Nhắn Mẫu</div>
        <div className="hdr-sub">{REPLIES.length} mẫu · Nhấn COPY là xong</div>
      </div>
      <div className="sec">
        {REPLIES.map(r=>(
          <div key={r.id} className="row" style={{cursor:"default",alignItems:"flex-start"}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:15,color:P.red,marginBottom:3}}>{r.hash}</div>
              <div style={{fontSize:13,fontWeight:700,color:P.ink}}>{r.title}</div>
              <div style={{fontSize:11,fontWeight:600,color:P.muted,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.body.split("\n")[0]}</div>
            </div>
            <button className="btn-xs btn btn-y" style={{flexShrink:0,marginLeft:8}}
              onClick={()=>{navigator.clipboard?.writeText(r.body);toast("📋 Đã copy!");}}>COPY</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── REPORT PAGE ───────────────────────────────────────────────────────────────
function Report({orders,customers,services}) {
  const mx=Math.max(...WEEK.map(w=>w.v));
  const COLS=[P.sky,P.green,P.yellow,P.orange,P.skydk,P.green,P.red];
  const paidOrders=orders.filter(o=>o.status==="paid");
  const totalRev=paidOrders.reduce((s,o)=>s+o.total,0);
  const totalTips=orders.reduce((s,o)=>s+(o.tips||0),0);
  const tipLeaders=[...customers].map(c=>({
    ...c,
    tips:orders.filter(o=>o.custId===c.id).reduce((s,o)=>s+(o.tips||0),0),
    spent:orders.filter(o=>o.custId===c.id&&o.status==="paid").reduce((s,o)=>s+o.total,0),
  })).filter(c=>c.tips>0).sort((a,b)=>b.tips-a.tips);

  const svcStats=services.map(s=>({
    ...s,
    rev:paidOrders.filter(o=>o.items.some(it=>it.svcId===s.id)).reduce((sum,o)=>{
      const it=o.items.find(i=>i.svcId===s.id);
      return sum+(it?(s.type==="fixed"?s.price:calcQ(it.qty,s.price,s.price6)):0);
    },0),
  })).filter(s=>s.rev>0).sort((a,b)=>b.rev-a.rev);
  const maxRev=svcStats[0]?.rev||1;

  const groupStats=[];
  orders.forEach(o=>o.items.forEach(it=>{
    if(!it.group) return;
    const ex=groupStats.find(g=>g.n===it.group);
    if(ex) ex.c++; else groupStats.push({n:it.group,c:1});
  }));
  groupStats.sort((a,b)=>b.c-a.c);
  const maxG=groupStats[0]?.c||1;

  return(
    <div className="scroll-body">
      <div className="hdr">
        <div className="hdr-deco">📊</div>
        <div className="hdr-eye">Thống kê</div>
        <div className="hdr-h1">Báo Cáo</div>
        <div className="hdr-sub">Tháng {new Date().getMonth()+1}/{new Date().getFullYear()}</div>
      </div>

      <div className="sg">
        {[
          {i:"💰",n:vnd(totalRev),  l:"Doanh thu xem bói",bg:P.greenbg},
          {i:"💜",n:vnd(totalTips), l:"Tổng tiền tips",    bg:"#F3E8FF"},
          {i:"📋",n:paidOrders.length,l:"Đơn hoàn thành",  bg:P.cloud},
          {i:"🔄",n:customers.filter(c=>orders.filter(o=>o.custId===c.id).length>1).length,l:"Khách quay lại",bg:P.yellowbg},
        ].map(s=><div key={s.l} className="sc" style={{background:s.bg}}><div className="sc-i">{s.i}</div><div className="sc-n">{s.n}</div><div className="sc-l">{s.l}</div></div>)}
      </div>

      {/* Revenue vs Tips */}
      <div className="sec">
        <div className="sec-t" style={{marginBottom:10}}>💰 Doanh thu vs Tips</div>
        <div className="box">
          {[{l:"Xem bói",v:totalRev,c:P.green},{l:"Tips",v:totalTips,c:P.purple}].map((r,i)=>(
            <div key={i} className="rb-row" style={{marginBottom:i===0?12:0}}>
              <div className="rb-lbl">{r.l}</div>
              <div className="rb-track"><div className="rb-fill" style={{width:`${Math.round(r.v/Math.max(totalRev,totalTips,1)*100)}%`,background:r.c}}/></div>
              <div className="rb-val">{vnd(r.v)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips leaderboard */}
      {tipLeaders.length>0&&(
        <div className="sec">
          <div className="sec-t" style={{marginBottom:10}}>💜 Top khách tips nhiều</div>
          {tipLeaders.slice(0,5).map((c,i)=>(
            <div key={c.id} className="row" style={{cursor:"default"}}>
              <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:20,color:[P.yellow,P.muted,P.orange][i]||P.muted,minWidth:28}}>#{i+1}</div>
              <div className="ava" style={{background:P.cloud,borderRadius:"50%",fontSize:20}}>{c.ava}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700}}>{c.nick||c.name}</div>
                <div style={{fontSize:11,fontWeight:700,color:P.muted}}>Xem bói: {vnd(c.spent)}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:15,color:P.purple}}>+{vnd(c.tips)}</div>
                <div style={{fontSize:10,fontWeight:700,color:P.muted}}>tips</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service stats */}
      <div className="sec">
        <div className="sec-t" style={{marginBottom:10}}>🏆 Dịch vụ doanh thu cao</div>
        <div className="box">
          {svcStats.map((s,i)=>(
            <div key={s.id} className="rb-row" style={{marginBottom:i<svcStats.length-1?12:0}}>
              <div className="rb-lbl">{s.ico} {s.name.replace("Tarot ","").replace("Lenormand ","")}</div>
              <div className="rb-track"><div className="rb-fill" style={{width:`${Math.round(s.rev/maxRev*100)}%`,background:COLS[i]}}/></div>
              <div className="rb-val">{vnd(s.rev)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Question groups */}
      {groupStats.length>0&&(
        <div className="sec">
          <div className="sec-t" style={{marginBottom:10}}>❓ Chủ đề câu hỏi</div>
          <div className="box">
            {groupStats.slice(0,5).map((g,i)=>(
              <div key={g.n} className="rb-row" style={{marginBottom:i<Math.min(groupStats.length,5)-1?10:0}}>
                <div className="rb-lbl" style={{fontSize:11}}>{g.n}</div>
                <div className="rb-track"><div className="rb-fill" style={{width:`${Math.round(g.c/maxG*100)}%`,background:COLS[i]}}/></div>
                <div className="rb-val">{g.c} đơn</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="sec">
        <div className="sec-t" style={{marginBottom:10}}>📊 Doanh thu 7 ngày</div>
        <div className="box">
          <div className="bc">
            {WEEK.map((w,i)=><div key={w.d} className="bcol"><div className="bbar" style={{height:`${(w.v/mx)*74}px`,background:COLS[i]}}/><div className="blbl">{w.d}</div></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SERVICE MANAGER ───────────────────────────────────────────────────────────
function ServiceManager({services,setServices,toast}) {
  const [modal,setModal]=useState(false);
  const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({name:"",ico:"💜",type:"per_q",price:"",price6:"",dur:"60",active:true});
  const [del,setDel]=useState(null);
  const openNew=()=>{setForm({name:"",ico:"💜",type:"per_q",price:"",price6:"",dur:"60",active:true});setEditing(null);setModal(true);};
  const openEdit=(s)=>{setForm({name:s.name,ico:s.ico,type:s.type,price:String(s.price),price6:String(s.price6||""),dur:String(s.dur||60),active:s.active});setEditing(s.id);setModal(true);};
  const save=()=>{
    if(!form.name.trim()||!form.price){toast("⚠️ Điền đủ tên và giá!");return;}
    const d={...form,price:Number(form.price),price6:Number(form.price6)||0,dur:Number(form.dur)||60};
    if(editing){setServices(p=>p.map(s=>s.id===editing?{...s,...d}:s));toast("✅ Đã cập nhật!");}
    else{setServices(p=>[...p,{id:uid(),...d,sold:0}]);toast("✅ Đã thêm dịch vụ!");}
    setModal(false);
  };
  const p1=Number(form.price)||0;const p6=Number(form.price6)||p1;
  return(
    <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{fontFamily:"Nunito",fontWeight:800,fontSize:12,color:P.muted,textTransform:"uppercase",letterSpacing:1}}>Dịch vụ ({services.length})</div>
        <button className="btn-xs btn btn-g" onClick={openNew}>+ Thêm dịch vụ</button>
      </div>
      {services.map(s=>(
        <div key={s.id} style={{background:P.card,borderRadius:15,border:`2px solid ${P.ink}`,boxShadow:`3px 3px 0 ${P.ink}`,padding:"12px 14px",marginBottom:9}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div className="ava" style={{background:P.cloud,opacity:s.active?1:.5}}>{s.ico}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:s.active?P.ink:P.muted}}>{s.name}</div>
              <div style={{fontSize:11,fontWeight:600,color:P.muted}}>
                {s.type==="fixed"?vnd(s.price):`${(s.price/1000).toFixed(0)}k/câu (1-5)${s.price6?` · ${(s.price6/1000).toFixed(0)}k (6+)`:""}`}
                {s.dur?` · ${s.dur}p`:""}
              </div>
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <button className="btn-xs btn" style={{background:P.yellowbg,padding:"6px 10px"}} onClick={()=>openEdit(s)}>✏️</button>
              <button className="btn-xs btn" style={{background:"#FFE4E4",padding:"6px 10px"}} onClick={()=>setDel(s.id===del?null:s.id)}>🗑</button>
              <button className={`tog ${s.active?"on":"off"}`} onClick={()=>setServices(p=>p.map(x=>x.id===s.id?{...x,active:!x.active}:x))}/>
            </div>
          </div>
          {del===s.id&&(
            <div style={{marginTop:10,background:"#FFE4E4",borderRadius:10,padding:"10px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",border:`1.5px solid ${P.red}`}}>
              <span style={{fontSize:12,fontWeight:700,color:P.red}}>Xoá "{s.name}"?</span>
              <div style={{display:"flex",gap:6}}>
                <button className="btn-xs btn" style={{background:P.red,color:"#fff"}} onClick={()=>{setServices(p=>p.filter(x=>x.id!==s.id));setDel(null);toast("🗑 Đã xoá!");}}>Xoá</button>
                <button className="btn-xs btn btn-gh" onClick={()=>setDel(null)}>Huỷ</button>
              </div>
            </div>
          )}
        </div>
      ))}
      {modal&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="sheet">
            <div className="drag"/>
            <div className="mh">{editing?"Sửa dịch vụ ✏️":"Thêm dịch vụ 🐸"}</div>
            <div className="f"><label>Icon</label>
              <div className="ico-pick">{ICOS.map(ic=>(
                <button key={ic} className="ico-btn" onClick={()=>setForm(p=>({...p,ico:ic}))}
                  style={{border:`2.5px solid ${form.ico===ic?P.ink:P.border}`,background:form.ico===ic?P.yellow:P.card,boxShadow:form.ico===ic?`2px 2px 0 ${P.ink}`:"none"}}>{ic}</button>
              ))}</div>
            </div>
            <div className="f"><label>Tên dịch vụ</label><input placeholder="VD: Tarot Tình Yêu" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
            <div className="f"><label>Loại giá</label>
              <div style={{display:"flex",gap:8}}>
                {[{k:"per_q",l:"💬 Theo câu"},{k:"fixed",l:"📦 Trọn gói"}].map(t=>(
                  <button key={t.k} onClick={()=>setForm(p=>({...p,type:t.k}))}
                    style={{flex:1,padding:11,borderRadius:12,border:`2.5px solid ${form.type===t.k?P.ink:P.border}`,background:form.type===t.k?P.yellow:P.card,fontFamily:"Nunito",fontWeight:800,fontSize:13,cursor:"pointer",boxShadow:form.type===t.k?`2px 2px 0 ${P.ink}`:"none"}}>{t.l}</button>
                ))}
              </div>
            </div>
            {form.type==="per_q"?(
              <>
                <div className="f"><label>Giá câu 1-5 (VND/câu)</label><input type="number" placeholder="20000" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))}/></div>
                <div className="f"><label>Giá câu 6+ (để trống = cùng giá)</label><input type="number" placeholder="15000" value={form.price6} onChange={e=>setForm(p=>({...p,price6:e.target.value}))}/></div>
                {form.price&&(
                  <div className="box box-greenbg" style={{marginBottom:12}}>
                    {[3,5,7,10].map(q=>{const amt=q<=5?q*p1:5*p1+(q-5)*p6;return(
                      <div key={q} style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:700,padding:"4px 0",borderBottom:`1px dashed ${P.border}`}}>
                        <span style={{color:P.muted}}>{q} câu</span>
                        <span style={{color:P.green,fontFamily:"Nunito",fontWeight:900}}>{vnd(amt)}</span>
                      </div>
                    );})}
                  </div>
                )}
              </>
            ):(
              <div className="f"><label>Giá trọn gói (VND)</label><input type="number" placeholder="100000" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))}/></div>
            )}
            <div className="f"><label>Thời lượng (phút)</label><input type="number" placeholder="60" value={form.dur} onChange={e=>setForm(p=>({...p,dur:e.target.value}))}/></div>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <button className="btn btn-g" style={{flex:2}} onClick={save}>{editing?"💾 Lưu":"➕ Thêm"}</button>
              <button className="btn btn-gh" style={{flex:1}} onClick={()=>setModal(false)}>Huỷ</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── SETTINGS PAGE ─────────────────────────────────────────────────────────────
function Settings({logout,toast,services,setServices}) {
  return(
    <div className="scroll-body">
      <div className="hdr">
        <div className="hdr-deco">⚙️</div>
        <div className="hdr-eye">Tùy chỉnh</div>
        <div className="hdr-h1">Cài Đặt</div>
      </div>
      <div className="sec">
        <ServiceManager services={services} setServices={setServices} toast={toast}/>
        <div style={{fontFamily:"Nunito",fontWeight:800,fontSize:12,color:P.muted,textTransform:"uppercase",letterSpacing:1,margin:"20px 0 8px"}}>Shop & tài khoản</div>
        {[
          {ico:"🏪",t:"Thông tin shop",s:"Mitchi Tarot · Tên, logo"},
          {ico:"💳",t:"Tài khoản ngân hàng",s:"ACB · Vietcombank"},
          {ico:"🔔",t:"Thông báo",s:"Nhắc booking & chưa TT"},
          {ico:"📱",t:"Cài như app (PWA)",s:"Thêm vào màn hình chính"},
          {ico:"☁️",t:"Sao lưu & đồng bộ",s:"Kết nối Supabase · Real-time"},
        ].map(x=>(
          <div key={x.t} className="row" onClick={()=>toast("✏️ Tính năng sắp ra mắt!")}>
            <div style={{fontSize:22}}>{x.ico}</div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>{x.t}</div><div style={{fontSize:11,fontWeight:600,color:P.muted,marginTop:2}}>{x.s}</div></div>
            <div style={{fontWeight:800,fontSize:18,color:P.muted}}>›</div>
          </div>
        ))}
        <div style={{height:16}}/>
        <button className="btn" style={{background:P.card,color:P.red,border:`2.5px solid ${P.red}`,boxShadow:`3px 3px 0 ${P.red}`,fontFamily:"Nunito",fontWeight:900}} onClick={logout}>Đăng xuất</button>
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({nav,orders,customers,services,bookings,toast}) {
  const mx=Math.max(...WEEK.map(w=>w.v));
  const COLS=[P.sky,P.green,P.yellow,P.orange,P.skydk,P.green,P.red];
  const paidToday=orders.filter(o=>o.date===today()&&o.status==="paid");
  const revToday=paidToday.reduce((s,o)=>s+o.total,0);
  const tipsToday=paidToday.reduce((s,o)=>s+(o.tips||0),0);
  const unpaid=orders.filter(o=>["new","view","done"].includes(o.status));
  const todayBks=bookings.filter(b=>b.date===today());
  const topSvcs=[...services].filter(s=>s.active).sort((a,b)=>b.sold-a.sold).slice(0,3);
  return(
    <div className="scroll-body">
      <div className="hdr">
        <div className="hdr-deco">🔮</div>
        <div className="hdr-eye">🐸 Xin chào Mitchi!</div>
        <div className="hdr-h1">Hôm nay</div>
        <div className="hdr-sub">{new Date().toLocaleDateString("vi-VN",{weekday:"long",day:"numeric",month:"long"})}</div>
      </div>

      {/* Revenue banner */}
      <div style={{margin:"14px 16px 0",background:P.green,borderRadius:20,border:`2.5px solid ${P.ink}`,boxShadow:`4px 4px 0 ${P.ink}`,padding:"18px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,color:"rgba(255,255,255,.7)",marginBottom:3}}>Doanh thu hôm nay</div>
            <div style={{fontFamily:"Nunito",fontSize:34,fontWeight:900,color:"#fff",lineHeight:1}}>{vnd(revToday)}</div>
            {tipsToday>0&&<div style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,.8)",marginTop:4}}>+ {vnd(tipsToday)} tips 💜</div>}
          </div>
          <div style={{fontSize:48,opacity:.2}}>💰</div>
        </div>
      </div>

      <div className="sg">
        {[
          {i:"📋",n:orders.filter(o=>o.date===today()).length,l:"Đơn hôm nay",bg:P.sky},
          {i:"⏳",n:unpaid.length,l:"Chưa thu tiền",bg:unpaid.length>0?"#FFE4E4":P.yellowbg,alert:unpaid.length>0},
          {i:"👤",n:customers.filter(c=>c.created===today()).length,l:"Khách mới",bg:P.greenbg},
          {i:"📅",n:todayBks.length,l:"Booking hôm nay",bg:P.cloud},
        ].map(s=>(
          <div key={s.l} className="sc" style={{background:s.bg,position:"relative"}}>
            {s.alert&&<div style={{position:"absolute",top:10,right:10,width:8,height:8,borderRadius:"50%",background:P.red,border:`1.5px solid ${P.ink}`}}/>}
            <div className="sc-i">{s.i}</div>
            <div className="sc-n">{s.n}</div>
            <div className="sc-l">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="sec">
        <div className="sec-h"><div className="sec-t">⚡ Thao tác nhanh</div></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[
            {ico:"👤",l:"Thêm Khách",  s:"Tạo khách mới",  bg:P.sky,    fn:()=>nav("customers")},
            {ico:"📋",l:"Tạo Đơn",     s:"Sau khi xem bài", bg:P.yellow, fn:()=>nav("orders")},
            {ico:"📅",l:"Tạo Booking", s:"Đặt lịch trước",  bg:P.greenbg,fn:()=>nav("booking")},
            {ico:"📋",l:"Tin Mẫu",     s:"Copy 1 chạm",      bg:P.cloud,  fn:()=>nav("messages")},
          ].map(q=>(
            <div key={q.l} style={{background:q.bg,borderRadius:16,border:`2.5px solid ${P.ink}`,boxShadow:`3px 3px 0 ${P.ink}`,padding:16,cursor:"pointer",textAlign:"center",transition:"all .1s"}}
              onClick={q.fn} onMouseDown={e=>e.currentTarget.style.transform="translate(2px,2px)"} onMouseUp={e=>e.currentTarget.style.transform=""}>
              <div style={{fontSize:28,marginBottom:7}}>{q.ico}</div>
              <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:13,color:P.ink}}>{q.l}</div>
              <div style={{fontSize:10,fontWeight:700,color:P.muted,marginTop:2}}>{q.s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Unpaid alert */}
      {unpaid.length>0&&(
        <div className="sec">
          <div className="box" style={{background:"#FFE4E4",borderColor:P.red,display:"flex",alignItems:"center",gap:14}}>
            <div style={{fontSize:26}}>⚠️</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:14}}>{unpaid.length} đơn chưa thu tiền</div>
              <div style={{fontSize:11,fontWeight:700,color:P.muted,marginTop:2}}>Nhắc khách để không bị quên</div>
            </div>
            <button className="btn-xs btn btn-y" onClick={()=>{navigator.clipboard?.writeText(REPLIES[3].body);toast("📋 Đã copy tin nhắn nhắc TT!");}}>Copy</button>
          </div>
        </div>
      )}

      {/* Today bookings */}
      {todayBks.length>0&&(
        <div className="sec">
          <div className="sec-h"><div className="sec-t">🗓 Lịch hôm nay</div><span className="sec-a" onClick={()=>nav("booking")}>Xem tất cả</span></div>
          {todayBks.map(b=>{
            const c=customers.find(x=>x.id===b.custId);
            return(
              <div key={b.id} className="row" style={{borderLeft:`4px solid ${b.status==="confirmed"?P.green:P.yellow}`}}>
                <div style={{fontFamily:"Nunito",fontWeight:900,fontSize:18,minWidth:48,textAlign:"center"}}>{b.time}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700}}>{c?.name||"?"}</div>
                  <div style={{fontSize:11,fontWeight:600,color:P.muted}}>{b.svc}{b.notes&&` · ${b.notes}`}</div>
                </div>
                <span className={`bd ${b.status==="confirmed"?"bd-paid":"bd-pend"}`}>{b.status==="confirmed"?"XÁC NHẬN":"CHỜ"}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Top services */}
      <div className="sec">
        <div className="sec-h"><div className="sec-t">🏆 Dịch vụ bán chạy</div><span className="sec-a" onClick={()=>nav("report")}>Chi tiết</span></div>
        <div className="box">
          {topSvcs.map((s,i)=>(
            <div key={s.id} className="rb-row" style={{marginBottom:i<topSvcs.length-1?12:0}}>
              <div className="rb-lbl">{s.ico} {s.name.replace("Tarot ","").replace("Lenormand ","")}</div>
              <div className="rb-track"><div className="rb-fill" style={{width:`${Math.round(s.sold/topSvcs[0].sold*100)}%`,background:COLS[i]}}/></div>
              <div className="rb-val">{s.sold} đơn</div>
            </div>
          ))}
        </div>
      </div>

      {/* Week chart */}
      <div className="sec">
        <div className="sec-h"><div className="sec-t">📊 Doanh thu tuần</div></div>
        <div className="box">
          <div className="bc">
            {WEEK.map((w,i)=><div key={w.d} className="bcol"><div className="bbar" style={{height:`${(w.v/mx)*74}px`,background:COLS[i]}}/><div className="blbl">{w.d}</div></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
const NAV=[
  {id:"dashboard",l:"Home",   ico:()=>I.home},
  {id:"orders",   l:"Đơn",   ico:()=>I.order},
  {id:"customers",l:"Khách",  ico:()=>I.users},
  {id:"booking",  l:"Lịch",  ico:()=>I.cal},
  {id:"messages", l:"Mẫu",   ico:()=>I.msg},
  {id:"report",   l:"Báo cáo",ico:()=>I.chart},
  {id:"settings", l:"Cài đặt",ico:()=>I.cog},
];

export default function App() {
  const [auth,setAuth]=useState(false);
  const [page,setPage]=useState("dashboard");
  const [toastMsg,setToast]=useState("");
  const [services,setServices]=useState(SEED_SVCS);
  const [customers,setCustomers]=useState(SEED_CUSTS);
  const [orders,setOrders]=useState(SEED_ORDERS);
  const [bookings,setBookings]=useState(SEED_BOOKINGS);
  const [newOrderCustId,setNewOrderCustId]=useState(null);

  const toast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2400);};
  const nav=id=>setPage(id);

  const navToOrders=(custId)=>{
    setNewOrderCustId(custId);
    setPage("orders");
    setTimeout(()=>setNewOrderCustId(null),100);
  };

  const pages={
    dashboard:<Dashboard nav={nav} orders={orders} customers={customers} services={services} bookings={bookings} toast={toast}/>,
    orders:<Orders orders={orders} setOrders={setOrders} customers={customers} services={services} toast={toast}/>,
    customers:<Customers customers={customers} setCustomers={setCustomers} orders={orders} services={services} toast={toast} navToOrders={navToOrders}/>,
    booking:<Booking bookings={bookings} setBookings={setBookings} customers={customers} services={services} toast={toast}/>,
    messages:<Messages toast={toast}/>,
    report:<Report orders={orders} customers={customers} services={services}/>,
    settings:<Settings logout={()=>setAuth(false)} toast={toast} services={services} setServices={setServices}/>,
  };

  return(
    <>
      <style>{CSS}</style>
      {!auth?(
        <Login onLogin={()=>setAuth(true)}/>
      ):(
        <div className="app">
          {toastMsg&&<div className="toast">{toastMsg}</div>}
          {pages[page]||pages.dashboard}
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
