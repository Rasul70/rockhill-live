"use client"

import unitsData from '../data/units.json'
import { useMemo, useState } from 'react'
import { Search, MessageCircle, Building2, Filter, Home, Banknote, Ruler, X } from 'lucide-react'

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

const statusStyle: Record<string, { label: string; bg: string; text: string; border: string }> = {
  Available: { label: 'Доступна', bg: 'bg-sky-500', text: 'text-sky-200', border: 'border-sky-500/40' },
  Booking: { label: 'Бронь', bg: 'bg-orange-500', text: 'text-orange-200', border: 'border-orange-500/40' },
  Reserved: { label: 'Резерв', bg: 'bg-slate-500', text: 'text-slate-200', border: 'border-slate-500/40' },
  Sold: { label: 'Продана', bg: 'bg-red-600', text: 'text-red-200', border: 'border-red-600/40' },
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
  if (type === 'Studio') return 'S'
  if (type === '1BR') return '1'
  if (type === '2BR') return '2'
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

  const filtered = useMemo(() => {
    return units.filter(u => {
      const q = query.trim().toLowerCase()
      const matchQuery = !q || u.unit.toLowerCase().includes(q) || String(u.floor).includes(q) || u.unitType.toLowerCase().includes(q)
      const matchType = type === 'Все' || u.unitType === type
      const matchStatus = status === 'Все' || u.status === status
      return matchQuery && matchType && matchStatus
    })
  }, [query, type, status])

  const stats = useMemo(() => {
    const total = units.length
    const available = units.filter(u => u.status === 'Available').length
    const booking = units.filter(u => u.status === 'Booking').length
    const sold = units.filter(u => u.status === 'Sold').length
    return { total, available, booking, sold }
  }, [])

  const floorsWithUnits = useMemo(() => {
    return floors.map(f => ({
      floor: f,
      units: filtered.filter(u => u.floor === f).sort((a, b) => Number(a.unit) - Number(b.unit))
    })).filter(row => row.units.length > 0)
  }, [filtered, floors])

  const whatsappText = selected
    ? encodeURIComponent(`Здравствуйте. Интересует квартира ${selected.unit}, этаж ${selected.floor}, ${selected.unitType}, Rock Hill Tower.`)
    : ''

  return (
    <main className="min-h-screen pb-24">
      <section className="sticky top-0 z-20 border-b border-white/10 bg-[#0b1110]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d7a437] to-[#7b5714] text-black shadow-lg">
              <Building2 size={24} />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[#c9972e]">Ajman · Live Availability</div>
              <h1 className="text-xl font-semibold leading-tight sm:text-2xl">Rock Hill Tower</h1>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2">
            <Stat label="Всего" value={stats.total} />
            <Stat label="Доступно" value={stats.available} accent="text-sky-300" />
            <Stat label="Бронь" value={stats.booking} accent="text-orange-300" />
            <Stat label="Продано" value={stats.sold} accent="text-red-300" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-5">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-3 shadow-2xl">
          <div className="flex items-center gap-2 rounded-2xl bg-black/30 px-3 py-3">
            <Search size={18} className="text-white/50" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Поиск: номер юнита, этаж, тип..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
            />
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {types.map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
                  type === t ? 'border-[#c9972e] bg-[#c9972e] text-black' : 'border-white/10 bg-white/[0.04] text-white/75'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {['Все', 'Available', 'Booking', 'Sold'].map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
                  status === s ? 'border-white bg-white text-black' : 'border-white/10 bg-white/[0.04] text-white/75'
                }`}
              >
                {s === 'Все' ? 'Все статусы' : statusStyle[s]?.label || s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 text-xs text-white/70">
          <Legend status="Available" />
          <Legend status="Booking" />
          <Legend status="Reserved" />
          <Legend status="Sold" />
        </div>

        <div className="mt-5 space-y-3">
          {floorsWithUnits.map(row => (
            <div key={row.floor} className="rounded-3xl border border-white/10 bg-white/[0.035] p-3">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-white/90">{row.floor} этаж</div>
                <div className="text-xs text-white/40">{row.units.length} юнитов</div>
              </div>
              <div className="floor-row flex gap-2 overflow-x-auto pb-1">
                {row.units.map(u => (
                  <button
                    key={u.unit}
                    onClick={() => setSelected(u)}
                    className={`min-w-[68px] rounded-2xl border ${statusStyle[u.status]?.border} bg-black/25 p-2 text-left transition hover:-translate-y-0.5 hover:bg-white/10`}
                  >
                    <div className={`mb-1 h-2 w-2 rounded-full ${statusStyle[u.status]?.bg}`} />
                    <div className="text-sm font-bold">{u.unit}</div>
                    <div className="text-[11px] text-white/50">{unitShortType(u.unitType)}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-40 bg-black/70 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div
            className="mx-auto mt-10 max-w-md rounded-3xl border border-white/10 bg-[#111a18] p-5 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-[#c9972e]">Unit {selected.unit}</div>
                <h2 className="mt-1 text-2xl font-bold">{selected.unitType}</h2>
                <div className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs ${statusStyle[selected.status]?.border} ${statusStyle[selected.status]?.text}`}>
                  {statusStyle[selected.status]?.label || selected.status}
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-full bg-white/10 p-2">
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Info icon={<Home size={17} />} label="Этаж" value={`${selected.floor}`} />
              <Info icon={<Ruler size={17} />} label="Площадь" value={area(selected.netSqft, 'sqft')} />
              <Info icon={<Banknote size={17} />} label="Цена AED" value={money(selected.priceAed, 'AED')} />
              <Info icon={<Banknote size={17} />} label="Цена USD" value={money(selected.priceUsd, 'USD')} />
              <Info icon={<Banknote size={17} />} label="Cash AED" value={money(selected.cashAed, 'AED')} />
              <Info icon={<Banknote size={17} />} label="Cash USD" value={money(selected.cashUsd, 'USD')} />
            </div>

            <a
              href={`https://wa.me/${whatsappPhone}?text=${whatsappText}`}
              target="_blank"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-4 font-semibold text-black"
            >
              <MessageCircle size={20} />
              Отправить в WhatsApp
            </a>

            <p className="mt-4 text-xs leading-relaxed text-white/45">
              Данные взяты из текущей базы наличия. Перед бронью нужно подтвердить статус у офиса продаж.
            </p>
          </div>
        </div>
      )}
    </main>
  )
}

function Stat({ label, value, accent = 'text-white' }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
      <div className={`text-lg font-bold ${accent}`}>{value}</div>
      <div className="text-[11px] text-white/45">{label}</div>
    </div>
  )
}

function Legend({ status }: { status: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded ${statusStyle[status]?.bg}`} />
      <span>{statusStyle[status]?.label}</span>
    </div>
  )
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
      <div className="flex items-center gap-2 text-white/45">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="mt-2 text-sm font-semibold">{value}</div>
    </div>
  )
}
