"use client"

import unitsData from '../data/units.json'
import { ReactNode, useMemo, useState } from 'react'
import { Search, MessageCircle, Building2, Home, Banknote, Ruler, X, Sparkles, MapPin, Layers3 } from 'lucide-react'

type Unit = {
  project: string
  floor: number
  unit: string
  unitType: string
  unitTypeRaw: string
  netSqft: number | null
  netSqm: number | null
  grossSqft: number | null
  priceAed: number | null
  priceUsd: number | null
  cashAed: number | null
  cashUsd: number | null
  status: 'Available' | 'Booking' | 'Reserved' | 'Sold'
  statusRaw: string
}

const units = unitsData as Unit[]
const whatsappPhone = '971501234567' // ЗАМЕНИ НА СВОЙ НОМЕР БЕЗ +

const statusStyle: Record<Unit['status'], { label: string; dot: string; soft: string; ring: string; text: string }> = {
  Available: { label: 'Доступна', dot: 'bg-emerald-400', soft: 'bg-emerald-400/10', ring: 'ring-emerald-400/40', text: 'text-emerald-200' },
  Booking: { label: 'Бронь', dot: 'bg-amber-400', soft: 'bg-amber-400/10', ring: 'ring-amber-400/40', text: 'text-amber-200' },
  Reserved: { label: 'Резерв', dot: 'bg-zinc-400', soft: 'bg-zinc-400/10', ring: 'ring-zinc-400/35', text: 'text-zinc-200' },
  Sold: { label: 'Продана', dot: 'bg-red-500', soft: 'bg-red-500/10', ring: 'ring-red-500/40', text: 'text-red-200' },
}

function money(v: number | null | undefined, currency: 'AED' | 'USD') {
  if (!v) return '—'
  return `${Math.round(v).toLocaleString('en-US')} ${currency}`
}

function area(v: number | null | undefined, suffix: string) {
  if (!v) return '—'
  return `${Math.round(v).toLocaleString('en-US')} ${suffix}`
}

function unitShortType(type: string) {
  if (type === 'Studio') return 'ST'
  if (type === '1BR') return '1BR'
  if (type === '2BR') return '2BR'
  if (type === '2BR + Laundry') return '2L'
  return type
}

export default function Page() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('Все')
  const [status, setStatus] = useState('Все')
  const [selected, setSelected] = useState<Unit | null>(null)

  const types = useMemo(() => ['Все', ...Array.from(new Set(units.map(u => u.unitType))).sort()], [])
  const floors = useMemo(() => Array.from(new Set(units.map(u => u.floor))).sort((a, b) => b - a), [])

  const filtered = useMemo(() => units.filter(u => {
    const q = query.trim().toLowerCase()
    const matchQuery = !q || u.unit.toLowerCase().includes(q) || String(u.floor).includes(q) || u.unitType.toLowerCase().includes(q)
    const matchType = type === 'Все' || u.unitType === type
    const matchStatus = status === 'Все' || u.status === status
    return matchQuery && matchType && matchStatus
  }), [query, type, status])

  const stats = useMemo(() => ({
    total: units.length,
    available: units.filter(u => u.status === 'Available').length,
    booking: units.filter(u => u.status === 'Booking').length,
    reserved: units.filter(u => u.status === 'Reserved').length,
    sold: units.filter(u => u.status === 'Sold').length,
  }), [])

  const floorsWithUnits = useMemo(() => floors.map(f => ({
    floor: f,
    units: filtered.filter(u => u.floor === f).sort((a, b) => Number(a.unit) - Number(b.unit))
  })).filter(row => row.units.length > 0), [filtered, floors])

  const whatsappText = selected ? encodeURIComponent(`Здравствуйте. Интересует квартира ${selected.unit}, этаж ${selected.floor}, ${selected.unitType}, Rock Hill Tower.`) : ''

  return (
    <main className="min-h-screen overflow-hidden bg-[#070707] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,164,90,.20),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,.08),transparent_26%),linear-gradient(180deg,#101010_0%,#070707_42%,#050505_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:44px_44px]" />

      <section className="relative mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f3d58b] via-[#c8a45a] to-[#8f6b24] text-black shadow-[0_0_40px_rgba(200,164,90,.28)]">
                  <Building2 size={24} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.32em] text-[#c8a45a]">Ajman · Live Availability</p>
                  <p className="text-sm text-white/55">Updated sales inventory dashboard</p>
                </div>
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
                Rock Hill <span className="bg-gradient-to-r from-[#f4dfaa] via-[#c8a45a] to-[#8e6724] bg-clip-text text-transparent">Tower</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/58 sm:text-lg">
                Премиальная шахматка доступности: статусы, цены в AED / USD, этажи и быстрый запрос по WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 lg:min-w-[520px]">
              <Stat label="Всего" value={stats.total} />
              <Stat label="Доступно" value={stats.available} tone="emerald" />
              <Stat label="Бронь" value={stats.booking} tone="amber" />
              <Stat label="Резерв" value={stats.reserved} tone="zinc" />
              <Stat label="Продано" value={stats.sold} tone="red" />
            </div>
          </div>
        </header>

        <section className="sticky top-3 z-20 mt-5 rounded-[1.75rem] border border-white/10 bg-[#0b0b0b]/82 p-3 shadow-2xl shadow-black/50 backdrop-blur-2xl">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 ring-1 ring-white/5">
              <Search size={18} className="text-[#c8a45a]" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Поиск: юнит, этаж, тип..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              {types.map(t => <Chip key={t} active={type === t} onClick={() => setType(t)}>{t}</Chip>)}
            </div>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {(['Все', 'Available', 'Booking', 'Reserved', 'Sold'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition ${status === s ? 'border-[#c8a45a] bg-[#c8a45a] text-black shadow-[0_0_28px_rgba(200,164,90,.25)]' : 'border-white/10 bg-white/[0.04] text-white/62 hover:border-white/20 hover:bg-white/[0.07]'}`}
              >
                {s === 'Все' ? 'Все статусы' : statusStyle[s].label}
              </button>
            ))}
          </div>
        </section>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-white/55">
          <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2"><Sparkles size={14} className="text-[#c8a45a]" /> {filtered.length} юнитов найдено</span>
          <Legend status="Available" />
          <Legend status="Booking" />
          <Legend status="Reserved" />
          <Legend status="Sold" />
        </div>

        <section className="mt-6 space-y-4">
          {floorsWithUnits.map(row => (
            <div key={row.floor} className="group rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-4 shadow-xl shadow-black/25 backdrop-blur-xl transition hover:border-[#c8a45a]/25 hover:bg-white/[0.055]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#c8a45a]/25 bg-[#c8a45a]/10 text-[#f4dfaa]">
                    <Layers3 size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold tracking-[-0.03em]">Floor {row.floor}</h2>
                    <p className="text-xs text-white/42">{row.units.length} units available in current filter</p>
                  </div>
                </div>
                <div className="hidden rounded-full border border-white/10 px-3 py-1 text-xs text-white/45 sm:block">Rock Hill Tower</div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-11">
                {row.units.map(u => {
                  const s = statusStyle[u.status]
                  return (
                    <button
                      key={u.unit}
                      onClick={() => setSelected(u)}
                      className={`relative overflow-hidden rounded-2xl border border-white/10 ${s.soft} p-3 text-left ring-1 ${s.ring} transition duration-200 hover:-translate-y-1 hover:border-[#c8a45a]/50 hover:bg-white/[0.09] hover:shadow-2xl hover:shadow-black/40`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className={`h-2.5 w-2.5 rounded-full ${s.dot} shadow-[0_0_18px_currentColor]`} />
                        <span className="text-[10px] font-semibold text-white/42">{unitShortType(u.unitType)}</span>
                      </div>
                      <div className="text-base font-semibold tracking-[-0.04em]">{u.unit}</div>
                      <div className={`mt-1 text-[10px] ${s.text}`}>{s.label}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </section>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 backdrop-blur-md sm:items-center" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b0b] shadow-2xl shadow-black/60" onClick={e => e.stopPropagation()}>
            <div className="relative border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(200,164,90,.24),transparent_45%),linear-gradient(135deg,rgba(255,255,255,.08),rgba(255,255,255,.02))] p-5">
              <button onClick={() => setSelected(null)} className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/30 p-2 text-white/70 hover:text-white">
                <X size={18} />
              </button>
              <p className="text-[11px] uppercase tracking-[0.32em] text-[#c8a45a]">Unit {selected.unit}</p>
              <h2 className="mt-2 text-4xl font-semibold tracking-[-0.06em]">{selected.unitType}</h2>
              <div className={`mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 ${statusStyle[selected.status].soft} px-3 py-1 text-xs ${statusStyle[selected.status].text}`}>
                <span className={`h-2 w-2 rounded-full ${statusStyle[selected.status].dot}`} />
                {statusStyle[selected.status].label}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-5">
              <Info icon={<Home size={17} />} label="Этаж" value={`${selected.floor}`} />
              <Info icon={<Ruler size={17} />} label="Площадь" value={area(selected.netSqft, 'sqft')} />
              <Info icon={<Banknote size={17} />} label="Цена AED" value={money(selected.priceAed, 'AED')} />
              <Info icon={<Banknote size={17} />} label="Цена USD" value={money(selected.priceUsd, 'USD')} />
              <Info icon={<Banknote size={17} />} label="Cash AED" value={money(selected.cashAed, 'AED')} />
              <Info icon={<MapPin size={17} />} label="Проект" value="Rock Hill Tower" />
            </div>

            <div className="px-5 pb-5">
              <a href={`https://wa.me/${whatsappPhone}?text=${whatsappText}`} target="_blank" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-4 font-semibold text-black shadow-[0_0_30px_rgba(37,211,102,.22)] transition hover:scale-[1.01]">
                <MessageCircle size={20} />
                Отправить в WhatsApp
              </a>
              <p className="mt-4 text-center text-xs leading-relaxed text-white/38">Перед бронью статус и цену нужно подтвердить у офиса продаж.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function Stat({ label, value, tone = 'gold' }: { label: string; value: number; tone?: 'gold' | 'emerald' | 'amber' | 'zinc' | 'red' }) {
  const toneClass = {
    gold: 'text-[#f4dfaa]', emerald: 'text-emerald-200', amber: 'text-amber-200', zinc: 'text-zinc-200', red: 'text-red-200'
  }[tone]
  return (
    <div className="rounded-2xl border border-white/10 bg-black/28 p-4 ring-1 ring-white/5 backdrop-blur-xl">
      <div className={`text-2xl font-semibold tracking-[-0.05em] ${toneClass}`}>{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/38">{label}</div>
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button onClick={onClick} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition ${active ? 'border-[#c8a45a] bg-[#c8a45a] text-black shadow-[0_0_28px_rgba(200,164,90,.25)]' : 'border-white/10 bg-white/[0.04] text-white/62 hover:border-white/20 hover:bg-white/[0.07]'}`}>
      {children}
    </button>
  )
}

function Legend({ status }: { status: Unit['status'] }) {
  const s = statusStyle[status]
  return <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2"><span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />{s.label}</span>
}

function Info({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 ring-1 ring-white/5">
      <div className="flex items-center gap-2 text-white/38">{icon}<span className="text-xs">{label}</span></div>
      <div className="mt-2 text-sm font-semibold text-white">{value}</div>
    </div>
  )
}
