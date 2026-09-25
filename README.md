# Browser UI Preview — Tailwind

Preview mandiri untuk styling cepat. Tidak memakai Tauri, Rust, Zustand, atau browser engine. Behavior di sini mock agar hot reload cepat.

## Jalankan

```bash
cd browser-ui-preview
npm install
npm run dev
```

## Styling

Styling utama sekarang langsung ada sebagai Tailwind utility class di:

```text
src/App.jsx
```

Cari komentar section berikut:

```jsx
{/* LEFT: refresh, back, forward, search */}
{/* CENTER: tabs */}
{/* RIGHT: profile placeholder and native window buttons */}
```

Bagian yang paling sering diubah:

| Bagian | Lokasi di `src/App.jsx` | Class utama |
|---|---|---|
| Background chrome | `<header>` | `bg-[linear-gradient(...)]` |
| Tombol refresh/back/forward | `IconButton` + section LEFT | `h-[42px] w-[38px] bg-transparent` |
| Search button | section LEFT | `h-[30px] w-[30px] rounded-[9px] bg-white` |
| Tab tengah | section CENTER | `h-[30px] w-[126px] rounded-t-[9px] bg-white/85` |
| Plus new tab | section CENTER | `h-[30px] w-[34px] rounded-r-[9px]` |
| Profile placeholder | section RIGHT | `h-[30px] w-[30px] rounded-[9px] bg-white` |
| Window controls | section RIGHT | `iconButton` constant dan button close |
| Isi area browser | `<section>` | `bg-[#eef1f4]` |

Contoh ganti background chrome:

```jsx
<header className="flex h-[42px] ... bg-[#8e9aa8]">
```

Contoh ganti ukuran tab:

```jsx
className="flex h-[34px] w-[160px] ..."
```

Contoh ganti warna profile:

```jsx
className="mr-[17px] h-[30px] w-[30px] rounded-[9px] bg-transparent"
```

`src/styles.css` sekarang hanya berisi Tailwind import, font theme, ukuran minimum viewport, dan scrollbar. Hampir semua visual styling dilakukan langsung lewat class Tailwind di `App.jsx`.

## Saat desain sudah final

Pindahkan class dan struktur dari `src/App.jsx` ke komponen Tauri asli. Handler mock seperti `notify`, `addTab`, `closeTab`, dan `submitUrl` nanti diganti dengan handler/state dari browser engine lo.
