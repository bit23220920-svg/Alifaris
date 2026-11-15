import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { ChevronDown, LogOut, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { isAdminSignedIn } from '@/lib/admin-auth'
import { listCars, listCategories, listOrders, listSpares, type AdminOrder } from '@/lib/catalog-repository'
import { formatPrice, type Car } from '@/lib/cars-data'
import { spareCategories, type Spare } from '@/lib/spares-data'
import { isTursoConfigured } from '@/lib/turso'
import { deleteCarAction, deleteSpareAction, importSparesCsvAction, loginAdminAction, logoutAdminAction, saveCarAction, saveSpareAction, updateOrderStatusAction } from '@/app/admin/actions'

interface AdminPageProps {
  searchParams: Promise<{ section?: string; editCar?: string; editSpare?: string; q?: string; notice?: string; error?: string }>
}

function Field({ label, name, defaultValue = '', type = 'text', required = false, min, step, placeholder }: {
  label: string
  name: string
  defaultValue?: string | number
  type?: string
  required?: boolean
  min?: number
  step?: number
  placeholder?: string
}) {
  return (
    <label className="block space-y-1.5 text-sm font-medium">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        min={min}
        step={step}
        placeholder={placeholder}
        className="min-h-11 w-full rounded-lg border border-border bg-background px-3 font-normal"
      />
    </label>
  )
}

function TextArea({ label, name, defaultValue = '', hint, required = false }: {
  label: string
  name: string
  defaultValue?: string
  hint?: string
  required?: boolean
}) {
  return (
    <label className="block space-y-1.5 text-sm font-medium">
      {label}
      <textarea name={name} defaultValue={defaultValue} required={required} rows={4} className="w-full rounded-lg border border-border bg-background px-3 py-2 font-normal" />
      {hint && <span className="block text-xs font-normal text-muted-foreground">{hint}</span>}
    </label>
  )
}

function carImages(car?: Car): string {
  return car?.images.join('\n') || ''
}

function spareImages(spare?: Spare): string {
  return spare?.images.join('\n') || ''
}

function compatibilityLines(spare?: Spare): string {
  return spare?.compatibility.map((fit) => `${fit.make} | ${fit.model} | ${fit.yearFrom} | ${fit.yearTo}`).join('\n') || ''
}

function categoryKey(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function matchesSearch(query: string, values: (string | number | undefined)[]): boolean {
  const normalizedQuery = query.trim().toLowerCase()
  return !normalizedQuery || values.some((value) => String(value ?? '').toLowerCase().includes(normalizedQuery))
}

const notices: Record<string, string> = {
  'signed-in': 'You are signed in.',
  'signed-out': 'You are signed out.',
  'car-saved': 'Car saved. The public catalog now uses your changes.',
  'car-deleted': 'Car deleted from the catalog.',
  'spare-saved': 'Spare saved. The public catalog now uses your changes.',
  'spare-deleted': 'Spare deleted from the catalog.',
  'order-updated': 'Order status updated.',
}

const errors: Record<string, string> = {
  'invalid-login': 'That email or password did not match.',
  'login-not-configured': 'Admin sign-in is not configured yet. Follow ADMIN_SETUP.txt.',
  'sign-in-required': 'Please sign in again to continue.',
  'car-fields': 'Check the car fields. A valid category, price, year, and at least one valid image URL are required.',
  'spare-fields': 'Check the spare fields, image URLs, stock, price, category, condition, and compatibility lines.',
  'spare-grade': 'Used parts need a grade or condition note.',
  'spare-confirmation': 'Confirm the spare details are real before saving. Sample listings must be replaced with actual information.',
  'spare-sample-details': 'Enter verified part details and remove any pending identifiers or unverified fitment.',
  'save-failed': 'The item could not be saved. Check the server log and Turso connection, then try again.',
  'delete-failed': 'The item could not be deleted. Check the server log and try again.',
  'invalid-id': 'The selected item was not valid.',
  'invalid-order': 'The selected order or status was not valid.',
  'order-update-failed': 'The order status could not be updated. Check the server log and try again.',
  'csv-file': 'Choose a CSV file smaller than 1 MB.',
  'csv-format': 'Use the provided CSV template, with 1–500 valid item rows.',
  'csv-duplicates': 'The CSV contains duplicate part numbers. Fix them and try again.',
  'csv-import-failed': 'The CSV could not be imported. Check each row and the server log, then try again.',
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const search = await searchParams
  const isSignedIn = await isAdminSignedIn()
  const section = search.section === 'spares' || search.section === 'orders' ? search.section : 'cars'
  const selectedCarId = search.editCar
  const selectedSpareId = search.editSpare
  const searchQuery = search.q?.trim() ?? ''
  const notice = search.notice?.startsWith('csv-imported-')
    ? `Imported ${search.notice.slice('csv-imported-'.length)} spares from the CSV file.`
    : search.notice ? notices[search.notice] : undefined
  const error = search.error ? errors[search.error] : undefined

  if (!isSignedIn) {
    return (
      <main className="admin-theme min-h-screen bg-background text-foreground">
        <header className="border-b border-slate-800 bg-slate-950 text-white">
          <div className="container mx-auto flex min-h-16 items-center justify-between gap-4">
            <Link href="/" aria-label="ALIFARIS Auto" className="relative h-14 w-52 shrink-0 overflow-hidden">
              <Image src="/assets/alifaris-logo-dark.png" alt="ALIFARIS Auto" fill sizes="208px" className="object-contain" />
            </Link>
            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800">Staff portal</span>
          </div>
        </header>
        <section className="container mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-10">
          <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-xl sm:p-7">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-700">ALIFARIS Auto</p>
            <h1 className="mt-2 text-2xl font-black">Admin sign in</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to manage the cars and spares shown on the website.</p>
            {error && <p role="alert" className="mt-5 rounded-lg border border-red-500/30 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
            <form action={loginAdminAction} className="mt-6 space-y-4">
              <Field label="Admin email" name="email" type="email" required />
              <label className="block space-y-1.5 text-sm font-medium">
                Password
                <input name="password" type="password" required autoComplete="current-password" className="min-h-11 w-full rounded-lg border border-border bg-background px-3 font-normal" />
              </label>
              <Button type="submit" className="min-h-12 w-full bg-red-600 font-bold text-white hover:bg-red-700">Sign in</Button>
            </form>
            <p className="mt-5 text-xs text-muted-foreground">This private area is for authorized ALIFARIS staff only.</p>
          </div>
        </section>
        <footer className="border-t border-border bg-card py-4 text-center text-xs text-muted-foreground">
          ALIFARIS Auto · Private staff portal
        </footer>
      </main>
    )
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim() || 'Administrator'

  if (!isTursoConfigured()) {
    return (
      <AdminShell adminEmail={adminEmail}>
        {notice && <Notice>{notice}</Notice>}
        <AdminSetupNotice />
      </AdminShell>
    )
  }

  let cars: Car[]
  let spares: Spare[]
  let orders: AdminOrder[]
  let categories: { id: string; name: string; description: string }[]
  try {
    ;[cars, spares, categories, orders] = await Promise.all([listCars(), listSpares(), listCategories(), listOrders()])
  } catch (databaseError) {
    console.error('Unable to load the admin catalog from Turso:', databaseError)
    return (
      <AdminShell adminEmail={adminEmail}>
        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-50 p-4 text-sm text-red-800">
          Could not load the catalog. Check the Turso connection and confirm the migration and seed steps in ADMIN_SETUP.txt have completed.
        </p>
      </AdminShell>
    )
  }

  const editCar = cars.find((car) => car.id === selectedCarId)
  const editSpare = spares.find((spare) => spare.id === selectedSpareId)
  const spareTab = section === 'spares'
  const orderTab = section === 'orders'
  const visibleCars = cars.filter((car) => matchesSearch(searchQuery, [
    car.name, car.brand, categories.find((category) => category.id === car.category)?.name, car.category,
    car.price, car.year, car.fuelType, car.transmission, car.engine, car.color, car.description, ...car.features,
  ]))
  const visibleSpares = spares.filter((spare) => matchesSearch(searchQuery, [
    spare.name, spare.partNumber,
    spareCategories.find((category) => categoryKey(category) === categoryKey(spare.category)), spare.category,
    spare.condition, spare.grade, spare.price, spare.stock, spare.description,
    ...spare.compatibility.flatMap((fitment) => [fitment.make, fitment.model, fitment.yearFrom, fitment.yearTo]),
  ]))
  const carGroups = categories
    .map((category) => ({
      id: category.id,
      name: category.name,
      items: visibleCars.filter((car) => car.category === category.id),
    }))
    .filter((group) => group.items.length > 0)
  const uncategorizedCars = visibleCars.filter((car) => !categories.some((category) => category.id === car.category))
  if (uncategorizedCars.length > 0) carGroups.push({ id: 'other', name: 'Other', items: uncategorizedCars })
  const spareGroups = spareCategories
    .map((category) => ({
      name: category,
      items: visibleSpares.filter((spare) => categoryKey(spare.category) === categoryKey(category)),
    }))
    .filter((group) => group.items.length > 0)
  const uncategorizedSpares = visibleSpares.filter((spare) => !spareCategories.some((category) => categoryKey(category) === categoryKey(spare.category)))
  if (uncategorizedSpares.length > 0) spareGroups.push({ name: 'Other', items: uncategorizedSpares })

  return (
    <AdminShell adminEmail={adminEmail}>
      {notice && <Notice>{notice}</Notice>}
      {error && <p role="alert" className="mb-5 rounded-lg border border-red-500/30 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <div className="mb-7">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-700">Management</p>
          <h1 className="mt-1 text-3xl font-black">Your showroom catalog</h1>
          <p className="mt-2 text-sm text-muted-foreground">Changes you save here are stored and shown on the public website.</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <Link href="/admin?section=cars" className={`flex min-h-14 items-center justify-center gap-2 rounded-xl border font-semibold ${!spareTab ? 'border-red-500 bg-red-50 text-red-800' : 'border-border text-muted-foreground'}`}>
          Cars ({cars.length})
        </Link>
        <Link href="/admin?section=spares" className={`flex min-h-14 items-center justify-center gap-2 rounded-xl border font-semibold ${spareTab ? 'border-red-500 bg-red-50 text-red-800' : 'border-border text-muted-foreground'}`}>
          Spares ({spares.length})
        </Link>
        <Link href="/admin?section=orders" className={`col-span-2 flex min-h-14 items-center justify-center gap-2 rounded-xl border font-semibold sm:col-span-1 ${orderTab ? 'border-red-500 bg-red-50 text-red-800' : 'border-border text-muted-foreground'}`}>
          Orders ({orders.length})
        </Link>
      </div>

      {orderTab ? (
        <OrdersPanel orders={orders} />
      ) : spareTab ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,.7fr)]">
          <section className="rounded-2xl border border-border bg-card/50 p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div><h2 className="text-xl font-bold">Spares</h2><p className="text-sm text-muted-foreground">Edit a listing or add a new part.</p></div>
              <Link href="/admin?section=spares" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-bold text-white hover:bg-red-700"><Plus className="h-4 w-4" />Add spare</Link>
            </div>
            <form action={importSparesCsvAction} className="mb-5 rounded-xl border border-border p-3">
              <p className="mb-2 text-sm font-semibold">Add or update multiple parts</p>
              <a href="/assets/spares-import-template.csv" download className="text-sm text-red-700 underline">Download CSV template</a>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input type="file" name="file" accept=".csv,text/csv" required className="min-h-11 min-w-0 flex-1 text-sm file:mr-3 file:min-h-11 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:text-foreground" />
                <Button type="submit" variant="outline" className="min-h-11">Import CSV</Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Rows with an existing part number update that part; new part numbers add a listing. Replace every placeholder before importing.</p>
            </form>
            <form method="get" action="/admin" role="search" className="mb-5 flex flex-col gap-2 sm:flex-row">
              <input type="hidden" name="section" value="spares" />
              <input id="spare-search" name="q" type="search" defaultValue={searchQuery} placeholder="Search name, part number, or vehicle..." aria-label="Search spares" className="min-h-11 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm" />
              <Button type="submit" variant="outline" className="min-h-11"><Search className="mr-2 h-4 w-4" />Search</Button>
              {searchQuery && <Link href="/admin?section=spares" className="inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm text-red-700 hover:bg-secondary">Clear</Link>}
            </form>
            {spareGroups.length ? (
              <div className="space-y-3">
                {spareGroups.map((group) => (
                  <details key={group.name} open={Boolean(searchQuery)} className="group rounded-xl border border-border bg-background/40">
                    <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 p-4 [&::-webkit-details-marker]:hidden">
                      <div><h3 className="font-semibold">{group.name}</h3><p className="text-xs text-muted-foreground">{group.items.length} {group.items.length === 1 ? 'part' : 'parts'}</p></div>
                      <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="space-y-2 border-t border-border p-3">
                      {group.items.map((spare) => <SpareCard key={spare.id} spare={spare} category={group.name} />)}
                    </div>
                  </details>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">{searchQuery ? 'No spares match your search.' : 'No spares have been added yet.'}</p>
            )}
          </section>
          <SpareEditor spare={editSpare} categories={spareCategories} />
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,.7fr)]">
          <section className="rounded-2xl border border-border bg-card/50 p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div><h2 className="text-xl font-bold">Cars</h2><p className="text-sm text-muted-foreground">Edit vehicle details or add a new car.</p></div>
              <Link href="/admin?section=cars" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-bold text-white hover:bg-red-700"><Plus className="h-4 w-4" />Add car</Link>
            </div>
            <form method="get" action="/admin" role="search" className="mb-5 flex flex-col gap-2 sm:flex-row">
              <input type="hidden" name="section" value="cars" />
              <input id="car-search" name="q" type="search" defaultValue={searchQuery} placeholder="Search make, model, year, or category..." aria-label="Search cars" className="min-h-11 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm" />
              <Button type="submit" variant="outline" className="min-h-11"><Search className="mr-2 h-4 w-4" />Search</Button>
              {searchQuery && <Link href="/admin?section=cars" className="inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm text-red-700 hover:bg-secondary">Clear</Link>}
            </form>
            {carGroups.length ? (
              <div className="space-y-3">
                {carGroups.map((group) => (
                  <details key={group.id} open={Boolean(searchQuery)} className="group rounded-xl border border-border bg-background/40">
                    <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 p-4 [&::-webkit-details-marker]:hidden">
                      <div><h3 className="font-semibold">{group.name}</h3><p className="text-xs text-muted-foreground">{group.items.length} {group.items.length === 1 ? 'car' : 'cars'}</p></div>
                      <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="space-y-2 border-t border-border p-3">
                      {group.items.map((car) => <CarCard key={car.id} car={car} category={group.name} />)}
                    </div>
                  </details>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">{searchQuery ? 'No cars match your search.' : 'No cars have been added yet.'}</p>
            )}
          </section>
          <CarEditor car={editCar} categories={categories} />
        </div>
      )}
      <div className="mt-8 flex justify-end border-t border-border pt-5">
        <form action={logoutAdminAction}><Button variant="outline" type="submit" className="min-h-11"><LogOut className="mr-2 h-4 w-4" />Sign out</Button></form>
      </div>
    </AdminShell>
  )
}

function AdminShell({ children, adminEmail }: { children: React.ReactNode; adminEmail: string }) {
  return (
    <main className="admin-theme min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950 text-white shadow-sm backdrop-blur">
        <div className="container mx-auto flex min-h-16 items-center justify-between gap-4">
          <Link href="/admin" aria-label="Admin dashboard" className="relative h-14 w-52 shrink-0 overflow-hidden">
            <Image src="/assets/alifaris-logo-dark.png" alt="ALIFARIS Auto" fill sizes="208px" className="object-contain" />
          </Link>
          <div className="border-l-2 border-blue-500 pl-3 text-right">
            <p className="text-xs font-bold leading-tight text-white">Admin profile</p>
            <p className="max-w-40 truncate text-xs leading-tight text-slate-300 sm:max-w-none">{adminEmail}</p>
          </div>
        </div>
      </header>
      <section className="container mx-auto min-h-[70vh] max-w-7xl px-4 py-8 sm:py-10">{children}</section>
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto flex flex-col gap-1 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>ALIFARIS Auto · Admin workspace</span>
          <span>Authorized staff access only</span>
        </div>
      </footer>
    </main>
  )
}

function AdminSetupNotice() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
      <h1 className="text-2xl font-black">Admin setup needed</h1>
      <p className="mt-2 text-muted-foreground">The private dashboard is ready, but Turso is not connected yet. Follow the setup steps in <code>ADMIN_SETUP.txt</code>. No database account has been created for you.</p>
    </div>
  )
}

function Notice({ children }: { children: React.ReactNode }) {
  return <p role="status" className="mb-5 rounded-lg border border-emerald-500/30 bg-emerald-50 p-3 text-sm text-emerald-800">{children}</p>
}

function OrdersPanel({ orders }: { orders: AdminOrder[] }) {
  return (
    <section className="rounded-2xl border border-border bg-card/50 p-4 sm:p-6">
      <h2 className="text-xl font-bold">Customer orders</h2>
      <p className="mb-5 mt-1 text-sm text-muted-foreground">Review orders and update their status.</p>
      {orders.length ? (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="rounded-xl border border-border p-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div>
                  <p className="font-bold">{order.customerName}</p>
                  <p className="text-sm text-muted-foreground">{order.phone} · {order.email}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{order.fulfilment} · {new Date(`${order.createdAt.replace(' ', 'T')}Z`).toLocaleString()}</p>
                </div>
                <p className="font-bold text-red-700">{formatPrice(order.total)}</p>
              </div>
              <ul className="my-4 space-y-1 border-y border-border py-3 text-sm text-muted-foreground">
                {order.items.map((item, index) => <li key={`${order.id}-${index}`}>{item.type === 'car' ? 'Vehicle' : 'Part'}: {item.name}{item.partNumber ? ` (${item.partNumber})` : ''} × {item.quantity} · {formatPrice(item.unitPrice)}</li>)}
              </ul>
              <form action={updateOrderStatusAction} className="flex flex-wrap items-center gap-3">
                <input type="hidden" name="id" value={order.id} />
                <label className="flex min-h-11 items-center gap-2 text-sm">Status
                  <select name="status" defaultValue={order.status} className="min-h-11 rounded-lg border border-border bg-background px-3">
                    <option value="requested">Requested</option><option value="confirmed">Confirmed</option><option value="fulfilled">Fulfilled</option><option value="cancelled">Cancelled</option>
                  </select>
                </label>
                <Button type="submit" variant="outline" className="min-h-11">Update status</Button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No customer orders yet.</p>
      )}
    </section>
  )
}

function DetailField({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-sm">{value === '' ? 'Not set' : value}</dd>
    </div>
  )
}

function CarCard({ car, category }: { car: Car; category: string }) {
  return (
    <details className="group rounded-xl border border-border bg-background/50">
      <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 p-3 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <p className="truncate font-semibold">{car.year} {car.brand} {car.name}</p>
          <p className="text-xs text-muted-foreground">{formatPrice(car.price)} · {category}</p>
        </div>
        <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-4 border-t border-border p-4">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailField label="Make / brand" value={car.brand} />
          <DetailField label="Category" value={category} />
          <DetailField label="Price" value={formatPrice(car.price)} />
          <DetailField label="Year" value={car.year} />
          <DetailField label="Mileage" value={car.mileage} />
          <DetailField label="Fuel type" value={car.fuelType} />
          <DetailField label="Transmission" value={car.transmission} />
          <DetailField label="Engine" value={car.engine} />
          <DetailField label="Horsepower" value={car.horsepower} />
          <DetailField label="Color" value={car.color} />
        </dl>
        <div>
          <h4 className="text-xs font-medium text-muted-foreground">Description</h4>
          <p className="mt-1 whitespace-pre-wrap text-sm">{car.description || 'Not set'}</p>
        </div>
        <div>
          <h4 className="text-xs font-medium text-muted-foreground">Features</h4>
          {car.features.length ? <ul className="mt-1 flex flex-wrap gap-2">{car.features.map((feature) => <li key={feature} className="rounded-full border border-border px-2.5 py-1 text-xs">{feature}</li>)}</ul> : <p className="mt-1 text-sm">Not set</p>}
        </div>
        <div>
          <h4 className="mb-2 text-xs font-medium text-muted-foreground">Photos</h4>
          {car.images.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {car.images.map((image, index) => (
                <a key={`${image}-${index}`} href={image} target="_blank" rel="noreferrer" className="overflow-hidden rounded-lg border border-border">
                  <Image src={image} alt={`${car.name}, photo ${index + 1}`} width={320} height={200} className="h-32 w-full object-cover" />
                  <span className="block truncate px-2 py-1 text-xs text-red-700">Open photo {index + 1}</span>
                </a>
              ))}
            </div>
          ) : <p className="text-sm">No photos</p>}
        </div>
        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          <Link href={`/admin?section=cars&editCar=${encodeURIComponent(car.id)}`} className="flex min-h-11 items-center gap-2 rounded-lg border border-border px-3 text-sm hover:border-red-500"><Pencil className="h-4 w-4" />Edit</Link>
          <form action={deleteCarAction}><input type="hidden" name="id" value={car.id} /><button type="submit" aria-label={`Delete ${car.name}`} className="flex min-h-11 items-center gap-2 rounded-lg border border-red-500/30 px-3 text-sm text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" />Delete</button></form>
        </div>
      </div>
    </details>
  )
}

function SpareCard({ spare, category }: { spare: Spare; category: string }) {
  return (
    <details className="group rounded-xl border border-border bg-background/50">
      <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 p-3 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <p className="truncate font-semibold">{spare.name}</p>
          <p className="text-xs text-muted-foreground">{spare.partNumber} · {formatPrice(spare.price)} · Stock {spare.stock}</p>
        </div>
        <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-4 border-t border-border p-4">
        {spare.isSample && <p className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">Details pending verification; customers cannot order this item yet.</p>}
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailField label="Part number" value={spare.partNumber} />
          <DetailField label="Category" value={category} />
          <DetailField label="Condition" value={spare.condition} />
          <DetailField label="Grade" value={spare.grade ?? ''} />
          <DetailField label="Price" value={formatPrice(spare.price)} />
          <DetailField label="Stock" value={spare.stock} />
        </dl>
        <div>
          <h4 className="text-xs font-medium text-muted-foreground">Description</h4>
          <p className="mt-1 whitespace-pre-wrap text-sm">{spare.description || 'Not set'}</p>
        </div>
        <div>
          <h4 className="mb-2 text-xs font-medium text-muted-foreground">Photos</h4>
          {spare.images.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {spare.images.map((image, index) => (
                <a key={`${image}-${index}`} href={image} target="_blank" rel="noreferrer" className="overflow-hidden rounded-lg border border-border">
                  <Image src={image} alt={`${spare.name}, photo ${index + 1}`} width={320} height={200} className="h-32 w-full object-cover" />
                  <span className="block truncate px-2 py-1 text-xs text-red-700">Open photo {index + 1}</span>
                </a>
              ))}
            </div>
          ) : <p className="text-sm">No photos</p>}
        </div>
        <div>
          <h4 className="text-xs font-medium text-muted-foreground">Compatible vehicles</h4>
          {spare.compatibility.length ? (
            <ul className="mt-1 space-y-1 text-sm">
              {spare.compatibility.map((fitment) => <li key={`${fitment.make}-${fitment.model}-${fitment.yearFrom}-${fitment.yearTo}`}>{fitment.make} {fitment.model} · {fitment.yearFrom}–{fitment.yearTo}</li>)}
            </ul>
          ) : <p className="mt-1 text-sm">Not specified</p>}
        </div>
        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          <Link href={`/admin?section=spares&editSpare=${encodeURIComponent(spare.id)}`} className="flex min-h-11 items-center gap-2 rounded-lg border border-border px-3 text-sm hover:border-red-500"><Pencil className="h-4 w-4" />Edit</Link>
          <form action={deleteSpareAction}><input type="hidden" name="id" value={spare.id} /><button type="submit" aria-label={`Delete ${spare.name}`} className="flex min-h-11 items-center gap-2 rounded-lg border border-red-500/30 px-3 text-sm text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" />Delete</button></form>
        </div>
      </div>
    </details>
  )
}

function CarEditor({ car, categories }: { car?: Car; categories: { id: string; name: string }[] }) {
  return (
    <section className="h-fit rounded-2xl border border-red-200 bg-card/60 p-4 sm:p-6">
      <h2 className="text-xl font-bold">{car ? 'Edit car' : 'Add a car'}</h2>
      <p className="mb-5 mt-1 text-sm text-muted-foreground">Enter the vehicle details shown to customers.</p>
      <form action={saveCarAction} className="space-y-4">
        <input type="hidden" name="id" value={car?.id ?? ''} />
        <Field label="Car name / model" name="name" defaultValue={car?.name} required />
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Make / brand" name="brand" defaultValue={car?.brand} required /><label className="block space-y-1.5 text-sm font-medium">Vehicle type<select name="category" defaultValue={car?.category ?? categories[0]?.id} required className="min-h-11 w-full rounded-lg border border-border bg-background px-3">{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label></div>
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Price" name="price" type="number" min={0} step={1} defaultValue={car?.price} required /><Field label="Year" name="year" type="number" min={1886} defaultValue={car?.year} required /></div>
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Mileage" name="mileage" type="number" min={0} defaultValue={car?.mileage ?? 0} required /><Field label="Horsepower" name="horsepower" type="number" min={0} defaultValue={car?.horsepower ?? 0} required /></div>
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Fuel type" name="fuelType" defaultValue={car?.fuelType} /><Field label="Transmission" name="transmission" defaultValue={car?.transmission} /></div>
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Engine" name="engine" defaultValue={car?.engine} /><Field label="Color" name="color" defaultValue={car?.color} /></div>
        <TextArea label="Description" name="description" defaultValue={car?.description} />
        <TextArea label="Features (one per line)" name="features" defaultValue={car?.features.join('\n')} />
        <TextArea label="Photo URLs (one per line; first is the main photo)" name="images" defaultValue={carImages(car)} required hint="Use an https:// image link or a path such as /assets/car.jpg. Uploading image files is not enabled yet." />
        <Button type="submit" className="min-h-12 w-full bg-red-600 font-bold text-white hover:bg-red-700">{car ? 'Save car changes' : 'Add car to website'}</Button>
      </form>
    </section>
  )
}

function SpareEditor({ spare, categories }: { spare?: Spare; categories: readonly string[] }) {
  return (
    <section className="h-fit rounded-2xl border border-red-200 bg-card/60 p-4 sm:p-6">
      <h2 className="text-xl font-bold">{spare ? 'Edit spare' : 'Add a spare'}</h2>
      <p className="mb-5 mt-1 text-sm text-muted-foreground">Set its price, stock, photos, and supported vehicles.</p>
      <form action={saveSpareAction} className="space-y-4">
        <input type="hidden" name="id" value={spare?.id ?? ''} />
        {spare?.isSample && <p className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">Details are pending verification and this item cannot be ordered. Enter verified product information before saving.</p>}
        <Field label="Part name" name="name" defaultValue={spare?.name} required />
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Part number" name="partNumber" defaultValue={spare?.partNumber} required /><label className="block space-y-1.5 text-sm font-medium">Category<select name="category" defaultValue={spare?.category ?? categories[0]} required className="min-h-11 w-full rounded-lg border border-border bg-background px-3">{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label></div>
        <div className="grid gap-4 sm:grid-cols-2"><label className="block space-y-1.5 text-sm font-medium">Condition<select name="condition" defaultValue={spare?.condition ?? 'new'} className="min-h-11 w-full rounded-lg border border-border bg-background px-3"><option value="new">New</option><option value="used">Used</option></select></label><Field label="Grade (required for used items)" name="grade" defaultValue={spare?.grade} /></div>
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Price" name="price" type="number" min={0} step={1} defaultValue={spare?.price} required /><Field label="Stock" name="stock" type="number" min={0} step={1} defaultValue={spare?.stock ?? 0} required /></div>
        <TextArea label="Description" name="description" defaultValue={spare?.description} />
        <TextArea label="Photo URLs (one per line; first is the main photo)" name="images" defaultValue={spareImages(spare)} required hint="Use an https:// image link or a path such as /assets/part.jpg. Uploading image files is not enabled yet." />
        <TextArea label="Compatible vehicles (one per line)" name="compatibility" defaultValue={compatibilityLines(spare)} hint="Format: Make | Model | year from | year to. Example: Toyota | Hilux | 2018 | 2024" />
        <label className="flex min-h-11 items-start gap-3 text-sm text-muted-foreground"><input type="checkbox" name="confirmRealData" required className="mt-1 h-4 w-4 accent-red-600" />I confirm the name, price, photos, stock, and fitment are accurate for a real part.</label>
        <Button type="submit" className="min-h-12 w-full bg-red-600 font-bold text-white hover:bg-red-700">{spare ? 'Save spare changes' : 'Add spare to website'}</Button>
      </form>
    </section>
  )
}
