import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import React from "react";

const SERVICES = [
  { id: 1, icon: "🌐", title: "موقع إلكتروني", category: "Web", description: "موقع احترافي متجاوب", price: 8000 },
  { id: 2, icon: "📱", title: "تطبيق موبايل", category: "Apps", description: "تطبيق Android و iOS", price: 12000 },
  { id: 3, icon: "🎨", title: "UI / UX", category: "Design", description: "تصميم واجهة وتجربة مستخدم", price: 4000 },
  { id: 4, icon: "🛒", title: "متجر إلكتروني", category: "Web", description: "متجر متكامل للبيع", price: 15000 },
  { id: 5, icon: "⚙️", title: "نظام إدارة", category: "Systems", description: "لوحة تحكم وإدارة بيانات", price: 10000 },
  { id: 6, icon: "🚀", title: "تحسين أداء", category: "Systems", description: "سرعة وأداء أفضل", price: 5000 },
  { id: 7, icon: "🔐", title: "حماية وأمان", category: "Systems", description: "أساسيات الحماية وتأمين المشروع", price: 6500 },
  { id: 8, icon: "📊", title: "تحليلات", category: "Marketing", description: "تقارير ومؤشرات أداء", price: 4500 }
];

function Navbar({ page, setPage, count, dark, setDark }) {
  return (
    <header className="navbar">
      <div className="nav-inner">
        <button className="logo" onClick={() => setPage("home")}>NOVA</button>
        <nav>
          {[
            ["home", "الرئيسية"],
            ["services", "الخدمات"],
            ["checkout", `المحاسبة${count ? ` (${count})` : ""}`],
            ["contact", "تواصل معنا"]
          ].map(([key, label]) => (
            <button key={key} className={page === key ? "active" : ""} onClick={() => setPage(key)}>{label}</button>
          ))}
          <button className="theme-btn" onClick={() => setDark(v => !v)}>{dark ? "☀️" : "🌙"}</button>
        </nav>
      </div>
    </header>
  );
}

function ServiceCard({ service, onAdd, selected, onDragStart, onDragEnd, favorite, toggleFavorite }) {
  return (
    <article
  className="service-card draggable-card"
  draggable
  onDragStart={(e) => onDragStart(e, service)}
  onDragEnd={onDragEnd}
>
  <div className="service-icon">{service.icon}</div>

  <button
    className="favorite"
    onClick={() => toggleFavorite(service.id)}
    aria-label="favorite"
  >
    {favorite ? "♥" : "♡"}
  </button>

  <span className="tag">{service.category}</span>

  <h3>{service.title}</h3>

  <p>{service.description}</p>

  <strong>{service.price.toLocaleString()} جنيه</strong>

  <button disabled={selected} onClick={() => onAdd(service)}>
    {selected ? "موجود في اللوحة ✓" : "أضف إلى اللوحة"}
  </button>

  <small className="drag-hint">
    اسحب البطاقة إلى اللوحة ↙
  </small>
</article>
  );
}

function SmartBoard({ items, total, onRemove, onClear, onCheckout, onDrop, onReorder }) {
  const [over, setOver] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [touchId, setTouchId] = useState(null);

  function handleDrop(e) {
    e.preventDefault();
    setOver(false);
    const raw = e.dataTransfer.getData("service");
    if (!raw) return;
    try { onDrop(JSON.parse(raw)); } catch {}
  }

  function handleTouchStart(id) {
    setTouchId(id);
  }

  function handleTouchEnd(e) {
    if (!touchId) return;
    const target = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    const board = target?.closest(".smart-board");
    if (board) {
      const service = SERVICES.find(s => s.id === touchId);
      if (service) onDrop(service);
    }
    setTouchId(null);
  }

  function moveItem(fromId, toId) {
    if (fromId === toId) return;
    onReorder(fromId, toId);
  }

  return (
    <section
      className={`smart-board ${over ? "board-over" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={handleDrop}
      onTouchEnd={handleTouchEnd}
    >
      <div className="board-title">
        <div>
          <span className="eyebrow">SMART BOARD · DRAG & DROP</span>
          <h2>لوحتك الذكية 🧠</h2>
        </div>
        {items.length > 0 && <button className="ghost danger" onClick={onClear}>مسح الكل</button>}
      </div>

      <p className="drop-zone-note">
        اسحبي أي بطاقة خدمة بالماوس أو اللمس وأسقطيها هنا
      </p>

      {items.length === 0 ? (
        <div className="empty-board">
          <div className="empty-icon">＋</div>
          <h3>اللوحة فارغة</h3>
          <p>يمكنك أيضًا استخدام زر «أضف إلى اللوحة».</p>
        </div>
      ) : (
        <>
          <div className="board-grid">
            {items.map((service) => (
              <div
                className={`board-item ${draggedId === service.id ? "dragging-item" : ""}`}
                key={service.id}
                draggable
                onDragStart={(e) => { setDraggedId(service.id); e.dataTransfer.setData("boardId", String(service.id)); }}
                onDragEnd={() => setDraggedId(null)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const raw = e.dataTransfer.getData("boardId");
                  if (raw) moveItem(Number(raw), service.id);
                }}
                onTouchStart={() => handleTouchStart(service.id)}
              >
                <span className="board-item-icon">{service.icon}</span>
                <div className="board-item-text">
                  <strong>{service.title}</strong>
                  <small>{service.price.toLocaleString()} جنيه</small>
                </div>
                <button className="remove" onClick={() => onRemove(service.id)}>×</button>
              </div>
            ))}
          </div>
          <div className="total-row">
            <span>الإجمالي</span>
            <strong>{total.toLocaleString()} جنيه</strong>
          </div>
          <button className="primary full" onClick={onCheckout}>الانتقال إلى المحاسبة</button>
        </>
      )}
    </section>
  );
}

function Home({ selectedIds, onAdd, goServices, favorites, toggleFavorite }) {
  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">DIGITAL SOLUTIONS</span>
          <h1>ابنِ مشروعك<br /><span>بذكاء.</span></h1>
          <p>اختاري الخدمات التي يحتاجها مشروعك، واسحبيها إلى اللوحة الذكية أو أضيفيها بزر واحد.</p>
          <button className="primary" onClick={goServices}>استكشفي الخدمات</button>
        </div>
        <div className="hero-art"><div>🧠</div></div>
      </section>
      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">FEATURED</span>
          <h2>ابدئي من هنا</h2>
        </div>
        <div className="services-grid">
          {SERVICES.slice(0, 3).map(s =>
            <ServiceCard key={s.id} service={s} onAdd={onAdd} selected={selectedIds.has(s.id)}
              onDragStart={(e, service) => {
                e.dataTransfer.setData("service", JSON.stringify(service));
                e.dataTransfer.effectAllowed = "copy";
              }}
              onDragEnd={() => {}}
              favorite={favorites.includes(s.id)} toggleFavorite={toggleFavorite}
            />
          )}
        </div>
      </section>
    </>
  );
}

function Services({ selectedIds, onAdd, favorites, toggleFavorite }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(SERVICES.map(s => s.category))];

  const filtered = SERVICES.filter(s => {
    const q = `${s.title} ${s.description}`.toLowerCase();
    return q.includes(query.toLowerCase()) && (category === "All" || s.category === category);
  });

  function startDrag(e, service) {
    e.dataTransfer.setData("service", JSON.stringify(service));
    e.dataTransfer.effectAllowed = "copy";
  }

  return (
    <section className="section page-section">
      <div className="section-heading">
        <span className="eyebrow">OUR SERVICES</span>
        <h1>كل الخدمات</h1>
        <p>اسحبي أي بطاقة مباشرة إلى الـ Smart Board.</p>
      </div>
      <div className="filters">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحثي عن خدمة..." />
        <div className="chips">
          {categories.map(c =>
            <button key={c} className={category === c ? "chip active-chip" : "chip"} onClick={() => setCategory(c)}>{c}</button>
          )}
        </div>
      </div>
      <div className="services-grid">
        {filtered.map(s =>
          <ServiceCard key={s.id} service={s} onAdd={onAdd} selected={selectedIds.has(s.id)}
            onDragStart={startDrag} onDragEnd={() => {}} favorite={favorites.includes(s.id)} toggleFavorite={toggleFavorite}
          />
        )}
      </div>
      {!filtered.length && <div className="empty-box">لا توجد نتائج مطابقة.</div>}
    </section>
  );
}

function Checkout({ items, total, onRemove, onClear }) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (submitted) return (
    <section className="section page-section center">
      <div className="success">
        <div>✓</div><h1>تم إرسال الطلب</h1>
        <p>هذه محاسبة تجريبية وليست عملية دفع حقيقية.</p>
      </div>
    </section>
  );

  return (
    <section className="section page-section">
      <div className="section-heading">
        <span className="eyebrow">CHECKOUT</span><h1>مراجعة الطلب</h1>
      </div>
      {items.length === 0 ? <div className="empty-box"><h2>لا توجد خدمات بعد.</h2><p>أضيفي الخدمات إلى اللوحة أولًا.</p></div> :
        <div className="checkout-box">
          {items.map(s => <div className="checkout-item" key={s.id}>
            <div><span>{s.icon}</span><strong>{s.title}</strong></div>
            <div><span>{s.price.toLocaleString()} جنيه</span><button className="remove-text" onClick={() => onRemove(s.id)}>حذف</button></div>
          </div>)}
          <div className="total-row large"><span>الإجمالي</span><strong>{total.toLocaleString()} جنيه</strong></div>
          <form className="checkout-form" onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
            <input required value={name} onChange={e => setName(e.target.value)} placeholder="الاسم" />
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="البريد الإلكتروني" />
            <div className="checkout-actions">
              <button type="button" className="ghost" onClick={onClear}>إفراغ الطلب</button>
              <button className="primary" type="submit">تأكيد الطلب التجريبي</button>
            </div>
          </form>
        </div>}
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section className="section page-section">
      <div className="section-heading"><span className="eyebrow">CONTACT</span><h1>تواصل معنا</h1></div>
      {sent ? <div className="success small-success">تم إرسال رسالتك بنجاح ✓</div> :
        <form className="contact-form" onSubmit={e => { e.preventDefault(); setSent(true); }}>
          <input required placeholder="الاسم" /><input required type="email" placeholder="البريد الإلكتروني" />
          <textarea required rows="6" placeholder="اكتبي رسالتك..." /><button className="primary" type="submit">إرسال الرسالة</button>
        </form>}
    </section>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [dark, setDark] = useState(() => localStorage.getItem("nova-dark") === "1");
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("nova-favorites") || "[]"));
  const [selectedServices, setSelectedServices] = useState(() => JSON.parse(localStorage.getItem("nova-board") || "[]"));

  useEffect(() => localStorage.setItem("nova-board", JSON.stringify(selectedServices)), [selectedServices]);
  useEffect(() => localStorage.setItem("nova-favorites", JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem("nova-dark", dark ? "1" : "0"), [dark]);

  const selectedIds = useMemo(() => new Set(selectedServices.map(s => s.id)), [selectedServices]);
  const total = selectedServices.reduce((sum, s) => sum + s.price, 0);

  function addService(service) {
    setSelectedServices(current => current.some(s => s.id === service.id) ? current : [...current, service]);
  }
  function removeService(id) {
    setSelectedServices(current => current.filter(s => s.id !== id));
  }
  function reorder(fromId, toId) {
    setSelectedServices(current => {
      const from = current.findIndex(s => s.id === fromId);
      const to = current.findIndex(s => s.id === toId);
      if (from < 0 || to < 0) return current;
      const copy = [...current];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  }
  function toggleFavorite(id) {
    setFavorites(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
  }
  function clearBoard() { setSelectedServices([]); }

  function renderPage() {
    if (page === "home") return <Home selectedIds={selectedIds} onAdd={addService} goServices={() => setPage("services")} favorites={favorites} toggleFavorite={toggleFavorite} />;
    if (page === "services") return <Services selectedIds={selectedIds} onAdd={addService} favorites={favorites} toggleFavorite={toggleFavorite} />;
    if (page === "checkout") return <Checkout items={selectedServices} total={total} onRemove={removeService} onClear={clearBoard} />;
    return <Contact />;
  }

  return (
    <div className={dark ? "app dark" : "app"}>
      <Navbar page={page} setPage={setPage} count={selectedServices.length} dark={dark} setDark={setDark} />
      <main>{renderPage()}
        <SmartBoard items={selectedServices} total={total} onRemove={removeService} onClear={clearBoard}
          onCheckout={() => setPage("checkout")} onDrop={addService} onReorder={reorder} />
      </main>
      <footer><strong>NOVA</strong><span>Digital Solutions · 2026</span></footer>
    </div>
  );
}