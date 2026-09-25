import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Maximize2,
  Minus,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  Shield,
  X,
} from "lucide-react";

const initialTabs = [{ id: 1, title: "New Tab", url: "brwsr://ntp" }];

const iconButton = "grid h-[42px] w-[38px] place-items-center bg-transparent text-white/80 opacity-80 transition hover:bg-white/10 hover:opacity-100 disabled:cursor-default disabled:opacity-25";
const iconStyle = "h-[17px] w-[17px] stroke-[1.65]";

export default function App() {
  const [tabs, setTabs] = useState(initialTabs);
  const [activeId, setActiveId] = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);
  const [url, setUrl] = useState("brwsr://ntp");
  const [history, setHistory] = useState({ back: false, forward: false });
  const [toast, setToast] = useState("");
  const activeTab = useMemo(() => tabs.find((tab) => tab.id === activeId) || tabs[0], [tabs, activeId]);

  useEffect(() => setUrl(activeTab?.url || ""), [activeTab]);

  useEffect(() => {
    const linkId = "instrument-sans-font";
    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(window.__previewToast);
    window.__previewToast = window.setTimeout(() => setToast(""), 1400);
  };

  const addTab = () => {
    const id = Date.now();
    setTabs((current) => [...current, { id, title: "New Tab", url: "brwsr://ntp" }]);
    setActiveId(id);
    notify("New tab");
  };

  const closeTab = (id) => {
    if (tabs.length === 1) return addTab();
    const index = tabs.findIndex((tab) => tab.id === id);
    const nextTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(nextTabs);
    if (id === activeId) setActiveId(nextTabs[Math.max(0, index - 1)]?.id || nextTabs[0].id);
  };

  const submitUrl = (event) => {
    event.preventDefault();
    const nextUrl = url.trim() || "brwsr://ntp";
    setTabs((current) => current.map((tab) => tab.id === activeId
      ? { ...tab, title: nextUrl.replace(/^https?:\/\//, "").split("/")[0] || "New Tab", url: nextUrl }
      : tab));
    setSearchOpen(false);
    setHistory({ back: true, forward: false });
    notify(`Navigate: ${nextUrl}`);
  };

  return (
    <main className="h-full w-full overflow-hidden bg-[#eef1f4] font-sans text-[#26313a]">
      <header className="flex h-[50px] w-full select-none items-center bg-black text-white/90">
        {/* LEFT: refresh, back, forward, search */}
        <div className="flex h-full shrink-0 items-center pl-0.5">
          <IconButton label="Refresh" onClick={() => notify("Refresh")}><RefreshCw className={iconStyle} /></IconButton>
          <IconButton label="Back" disabled={!history.back} onClick={() => notify("Back")}><ArrowLeft className={iconStyle} /></IconButton>
          <IconButton label="Forward" disabled={!history.forward} onClick={() => notify("Forward")}><ArrowRight className={iconStyle} /></IconButton>
          <div className="relative ml-[3px] mt-2.5 h-full w-[37px]">
            {searchOpen && (
              <form onSubmit={submitUrl} className="absolute left-0 top-0 z-30 flex h-[30px] w-[270px] items-center gap-2 rounded-[10px] bg-white/95 px-3 text-[#68727d] shadow-[0_5px_18px_rgba(0,0,0,.2)]">
                <Shield size={14} />
                <input autoFocus value={url} onChange={(event) => setUrl(event.target.value)} onBlur={() => setSearchOpen(false)} className="min-w-0 flex-1 bg-transparent text-xs text-[#26313a] outline-none" aria-label="Search or enter URL" />
              </form>
            )}
            <button className={`absolute left-0 top-1.5 z-40 grid h-[30px] w-[30px] place-items-center rounded-[9px] bg-white text-[#5c6671] shadow-[0_1px_4px_rgba(0,0,0,.09)] transition hover:-translate-y-px ${searchOpen ? "left-auto right-0 bg-transparent shadow-none" : ""}`} onClick={() => setSearchOpen(true)} aria-label="Search"><Search size={14} /></button>
          </div>
        </div>

        {/* CENTER: tabs */}
        <div className="flex h-full min-w-0 flex-1 items-center justify-center px-16">
          <div className="flex h-[36px] min-w-[140px] max-w-[min(650px,75vw)] items-center justify-center gap-0.5 rounded-xl bg-[#E8E8E8] p-1">
            {tabs.map((tab, index) => (
              <div key={tab.id} className="flex items-center">
                <button
                  className={`flex items-center gap-1.5 h-[28px] w-[120px] px-2.5 rounded-lg font-bold whitespace-nowrap shrink-0 cursor-pointer transition-all duration-150 ${
                    tab.id === activeId
                      ? "bg-white text-[#1a1a1a] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08)]"
                      : "bg-transparent text-[#5c5c5c] hover:bg-black/5 hover:text-[#3a3a3a]"
                  }`}
                  style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "12px", fontWeight: "600" }}
                  onClick={() => setActiveId(tab.id)}
                >
                  <span className="ml-1 flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-[3px] bg-[#c4c4c4]" />

                  <span className="max-w-[140px] truncate text-left">{tab.title}</span>

                  <span
                    className="ml-auto flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full text-[#888] hover:bg-black/10 hover:text-[#555] transition-colors"
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation();
                      closeTab(tab.id);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") closeTab(tab.id);
                    }}
                    aria-label={`Close ${tab.title}`}
                  >
                    <X size={9} strokeWidth={2.5} />
                  </span>
                </button>

                {index < tabs.length - 1 && (
                  <div className="w-px h-[16px] bg-[#d0d0d0] mx-0.5 shrink-0" />
                )}
              </div>
            ))}

            <button
              className="flex items-center justify-center w-[28px] h-[28px] rounded-lg ml-1 text-[#666] bg-white hover:bg-black/10 hover:text-[#333] shrink-0 transition-colors"
              onClick={addTab}
              aria-label="New tab"
            >
              <Plus size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* RIGHT: profile placeholder and native window buttons */}
        <div className="ml-auto flex h-full shrink-0 items-center">
          <button className="mr-[17px] h-[30px] w-[30px] rounded-[9px] bg-white shadow-[0_1px_4px_rgba(0,0,0,.08)]" onClick={() => notify("Profile placeholder")} aria-label="Profile placeholder" />
          <IconButton label="Minimize" onClick={() => notify("Minimize")}><Minus className={iconStyle} /></IconButton>
          <IconButton label="Maximize" onClick={() => notify("Maximize")}><Maximize2 className={iconStyle} /></IconButton>
          <button className={`${iconButton} hover:bg-[#b94f5d]`} onClick={() => notify("Close")} title="Close" aria-label="Close"><X className={iconStyle} /></button>
        </div>
      </header>

      <section className="grid h-[calc(100%-42px)] place-items-center bg-[#eef1f4]">
        <div className="w-[min(410px,80vw)] rounded-[18px] border border-[#dce2e7] bg-white/80 p-[30px] text-center shadow-[0_18px_50px_rgba(56,67,77,.1)]">
          <div className="mx-auto mb-3.5 grid h-[42px] w-[42px] place-items-center rounded-xl bg-[#dce9ed] text-[#587481]"><Settings2 size={20} /></div>
          <p className="m-0 mb-1.5 text-[15px] font-bold">React browser chrome preview</p>
          <span className="text-xs text-[#73808a]">Edit <code className="rounded bg-[#e3ecef] px-1.5 py-0.5 text-[#425b64]">src/App.jsx</code> untuk styling cepat.</span>
          <button className="mt-[18px] inline-flex items-center gap-1.5 rounded-lg bg-[#547a84] px-3 py-2 text-xs text-white hover:bg-[#456b75]" onClick={() => setSearchOpen(true)}><Search size={15} /> Try search</button>
        </div>
      </section>

      {toast && <div className="fixed bottom-[18px] right-[18px] rounded-lg bg-[rgba(28,38,46,.92)] px-[13px] py-2 text-xs text-white shadow-[0_8px_22px_rgba(0,0,0,.18)]">{toast}</div>}
    </main>
  );
}

function IconButton({ children, label, onClick, disabled = false }) {
  return <button className={iconButton} onClick={onClick} disabled={disabled} title={label} aria-label={label}>{children}</button>;
}