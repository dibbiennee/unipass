# CLAUDE.md — UniPass

## Identità Progetto

Sei il lead developer del progetto **UniPass** (https://unipass-virid.vercel.app), una piattaforma e-commerce italiana che vende materiali di studio universitari (riassunti, ebook, schemi) in formato PDF. Il traffico arriva al 100% da TikTok, quindi l'esperienza è **esclusivamente mobile-first**. Ogni decisione tecnica e di design deve essere ottimizzata per conversione da mobile.

---

## Stack Tecnologico

- **Framework:** Next.js 14+ con App Router e TypeScript
- **Styling:** Tailwind CSS
- **Database & Auth:** Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Pagamenti:** Stripe Checkout (modalità hosted)
- **Email transazionali:** Resend
- **Deploy:** Vercel
- **Analytics:** Google Analytics 4 + TikTok Pixel + Meta Pixel
- **Validazione form:** React Hook Form + Zod
- **State management:** Zustand (carrello client-side)
- **Animazioni:** Framer Motion (solo dove aggiunge valore, mai decorativo)

---

## Architettura Progetto

```
/unipass
├── /app
│   ├── layout.tsx                  # Layout globale (navbar + footer + providers)
│   ├── page.tsx                    # Homepage
│   ├── /catalogo
│   │   ├── page.tsx                # Lista prodotti con filtri
│   │   └── /[slug]
│   │       └── page.tsx            # Pagina singolo prodotto
│   ├── /checkout
│   │   ├── page.tsx                # Riepilogo carrello + redirect Stripe
│   │   ├── /success
│   │   │   └── page.tsx            # Conferma acquisto + link download
│   │   └── /cancel
│   │       └── page.tsx            # Acquisto annullato
│   ├── /api
│   │   ├── /products
│   │   │   └── route.ts            # GET lista prodotti (con filtri e search)
│   │   ├── /checkout
│   │   │   └── route.ts            # POST crea sessione Stripe Checkout
│   │   ├── /webhooks
│   │   │   └── /stripe
│   │   │       └── route.ts        # POST gestione eventi Stripe
│   │   ├── /download
│   │   │   └── /[token]
│   │   │       └── route.ts        # GET scarica PDF con token valido
│   │   └── /reviews
│   │       └── route.ts            # POST crea recensione verificata
│   ├── /chi-siamo
│   │   └── page.tsx
│   ├── /contatti
│   │   └── page.tsx
│   ├── /privacy
│   │   └── page.tsx
│   ├── /termini
│   │   └── page.tsx
│   └── not-found.tsx               # Pagina 404 custom
├── /components
│   ├── /ui                         # Design system atomico
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx               # Bottom sheet su mobile
│   │   ├── Skeleton.tsx
│   │   ├── Toast.tsx
│   │   ├── StarRating.tsx
│   │   ├── PriceDisplay.tsx
│   │   └── Icon.tsx                # Wrapper SVG icons
│   ├── /layout
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── MobileBottomBar.tsx     # Sticky cart bar
│   ├── /home
│   │   ├── Hero.tsx
│   │   ├── StatsBar.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Testimonials.tsx
│   │   ├── TrustSignals.tsx
│   │   ├── FAQ.tsx
│   │   └── FinalCTA.tsx
│   ├── /catalog
│   │   ├── CategoryFilter.tsx      # Pill orizzontali scrollabili
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── SearchBar.tsx
│   │   └── SortDropdown.tsx
│   ├── /product
│   │   ├── ProductHeader.tsx
│   │   ├── ProductDetails.tsx
│   │   ├── PdfPreview.tsx          # Anteprima prime pagine
│   │   ├── ReviewSection.tsx
│   │   └── RelatedProducts.tsx
│   ├── /checkout
│   │   ├── CartSummary.tsx
│   │   ├── CheckoutForm.tsx
│   │   └── SuccessContent.tsx
│   └── /shared
│       ├── SectionHeader.tsx
│       ├── EmptyState.tsx
│       └── CookieBanner.tsx
├── /lib
│   ├── supabase
│   │   ├── client.ts               # Browser client
│   │   ├── server.ts               # Server client (per server components)
│   │   └── admin.ts                # Service role client (per webhooks)
│   ├── stripe.ts                   # Stripe instance + helpers
│   ├── resend.ts                   # Email client + templates
│   └── utils.ts                    # Funzioni utility generiche
├── /hooks
│   ├── useCart.ts                  # Zustand store per carrello
│   ├── useProducts.ts             # Data fetching prodotti
│   └── useMediaQuery.ts           # Responsive breakpoints
├── /types
│   ├── product.ts
│   ├── order.ts
│   ├── review.ts
│   └── database.ts                # Tipi generati da Supabase
└── /public
    ├── /images
    │   └── /brand
    └── /fonts
```

---

## Database Schema (Supabase PostgreSQL)

```sql
-- Categorie (facoltà)
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT,
  icon_name TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Prodotti (materiali di studio)
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  category_id UUID REFERENCES categories(id),
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  file_path TEXT NOT NULL,           -- path nel bucket Supabase Storage
  preview_path TEXT,                 -- PDF anteprima (prime 3-5 pagine)
  cover_image_url TEXT,
  pages INT,
  format TEXT DEFAULT 'PDF',
  university TEXT,
  professor TEXT,
  tag TEXT,                          -- 'bestseller', 'novità', 'consigliato'
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INT DEFAULT 0,
  download_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ordini
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
  total DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'eur',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Dettaglio ordine (prodotti acquistati)
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  price_paid DECIMAL(10,2) NOT NULL
);

-- Token di download (accesso sicuro ai PDF)
CREATE TABLE download_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '72 hours'),
  download_count INT DEFAULT 0,
  max_downloads INT DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Recensioni
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  name TEXT NOT NULL,
  university TEXT,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indici per performance
CREATE INDEX idx_products_category ON products(category_id) WHERE is_active = true;
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active, created_at DESC);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_stripe ON orders(stripe_checkout_session_id);
CREATE INDEX idx_download_tokens_token ON download_tokens(token);
CREATE INDEX idx_reviews_product ON reviews(product_id) WHERE is_visible = true;

-- RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy: chiunque può leggere prodotti e categorie attive
CREATE POLICY "Prodotti pubblici" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Categorie pubbliche" ON categories FOR SELECT USING (true);
CREATE POLICY "Recensioni visibili" ON reviews FOR SELECT USING (is_visible = true);
```

---

## Flusso di Pagamento (Stripe Checkout)

```
STEP 1 — Frontend: utente clicca "Acquista ora"
         → aggiungi al carrello (Zustand store, client-side)
         → utente va su /checkout
         → inserisce email
         → clicca "Paga ora"
         → frontend chiama POST /api/checkout con { email, items: [{productId, price}] }

STEP 2 — API /api/checkout:
         → valida i dati con Zod
         → verifica che i prodotti esistano e i prezzi corrispondano (anti-tampering)
         → crea Stripe Checkout Session:
            - payment_method_types: ['card']
            - line_items: dal carrello
            - mode: 'payment'
            - customer_email: email utente
            - success_url: /checkout/success?session_id={CHECKOUT_SESSION_ID}
            - cancel_url: /checkout/cancel
            - metadata: { product_ids: JSON.stringify([...]) }
         → ritorna { url: session.url }
         → frontend fa redirect a Stripe

STEP 3 — Utente paga su Stripe hosted checkout

STEP 4 — Stripe invia webhook "checkout.session.completed" a POST /api/webhooks/stripe:
         → verifica firma webhook (stripe.webhooks.constructEvent)
         → estrai session con line_items e metadata
         → crea record in tabella orders (status: 'completed')
         → crea record in order_items per ogni prodotto
         → genera download_tokens per ogni prodotto (scadenza 72h, max 5 download)
         → invia email con Resend:
            - oggetto: "Il tuo ordine UniPass è pronto"
            - body: riepilogo + link download per ogni prodotto
              (link formato: https://unipass.it/api/download/{token})

STEP 5 — Utente atterra su /checkout/success?session_id=xxx
         → pagina fetcha i dettagli dell'ordine tramite session_id
         → mostra riepilogo con bottoni download diretti

STEP 6 — Download:
         → GET /api/download/[token]
         → verifica: token esiste, non scaduto, download_count < max_downloads
         → incrementa download_count
         → genera Supabase Storage signed URL (scade 60 secondi)
         → redirect al signed URL → utente scarica il PDF
```

---

## Regole di Sviluppo

### Generali
- **TypeScript strict** su tutto il progetto. Mai `any`, mai `@ts-ignore`.
- **Server Components di default.** Usa `"use client"` solo quando serve interattività (form, state, eventi click).
- **Nessuna dipendenza superflua.** Prima di installare un pacchetto, valuta se puoi farlo con codice nativo.
- **Gestione errori robusta.** Try-catch su ogni operazione asincrona, error boundaries per il frontend, risposte API sempre con status code corretti e messaggi leggibili.
- **Logging strutturato.** Console.error con contesto: `console.error('[stripe-webhook]', error)`.

### Frontend
- **Mobile-first ASSOLUTO.** Scrivi CSS/Tailwind per mobile, poi aggiungi `md:` e `lg:` se servono. Il 95%+ degli utenti è su telefono.
- **Touch target minimo 44x44px** su ogni elemento cliccabile. Mai bottoni piccoli, mai link troppo vicini.
- **Nessun hover state critico.** Gli hover sono enhancement visivo, mai l'unico modo per accedere a informazioni o azioni.
- **Performance:** LCP < 2.5s, nessun layout shift, immagini con next/image, font con next/font/google.
- **Nessuna emoji nel sito.** Il design è professionale e serio. Usa icone SVG (Lucide React) quando serve comunicazione visiva.
- **Skeleton loading** per ogni componente che fetcha dati. Mai schermate vuote o spinner generici.
- **Colori, font e spacing dal design system Tailwind.** Mai valori hardcoded inline.

### Backend / API
- **Validazione Zod** su ogni input di ogni API route. Mai fidarsi del frontend.
- **Stripe webhook: SEMPRE verificare la firma.** Usa `stripe.webhooks.constructEvent()`. Mai processare eventi non verificati.
- **Download token: mai esporre URL diretti ai file.** Sempre tramite signed URL con scadenza breve (60 secondi).
- **Rate limiting** su API checkout e download (considera upstash/ratelimit o middleware custom).
- **CORS e headers di sicurezza** configurati in next.config.js.

### SEO
- **Metadata dinamici** su ogni pagina (generateMetadata in App Router).
- **JSON-LD Product schema** su ogni pagina prodotto (prezzo, rating, disponibilità).
- **Sitemap.xml dinamica** generata da app/sitemap.ts.
- **URL parlanti:** /catalogo/diritto-privato-riassunto-completo (mai ID nell'URL).
- **Open Graph image** per ogni prodotto (per condivisione social).
- **Tag canonical** su ogni pagina.

### Sicurezza
- **Variabili ambiente** per TUTTE le chiavi. Mai committare secrets.
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `RESEND_API_KEY`
  - `NEXT_PUBLIC_GA_ID`
  - `NEXT_PUBLIC_TIKTOK_PIXEL_ID`
- **Content Security Policy** restrittiva.
- **Input sanitization** ovunque si accetti testo dall'utente (recensioni, form contatti).

---

## Design e UI — Riferimenti

Il sito attuale è live su https://unipass-virid.vercel.app. Mantieni coerenza con il design esistente.

**Principi di design:**
- Sfondo chiaro, superfici bianche con bordi sottili
- Colore primario: blu
- Colore accento per CTA e successo: verde
- Tipografia: font pulito e moderno, pesi variabili da 400 a 900
- Border radius generoso (12-16px) su card e bottoni
- Ombre minime e sottili
- Spacing generoso, niente affollamento
- Animazioni fade-in on scroll, subtle, mai invadenti
- Icone SVG line-style (Lucide React), MAI emoji

**Componenti chiave già presenti nel sito:**
- Navbar con logo UniPass
- Hero con headline "Studia smart, passa gli esami" + doppia CTA
- Barra statistiche (200+ appunti, 5000+ studenti, 4.8 rating, 15000+ download)
- Sezione "I più richiesti" (featured products)
- Testimonianze studenti (carousel)
- Sezione "Come funziona" (3 step: cerca, acquista, scarica)
- Trust signals (qualità verificata, pagamento sicuro, download immediato, prezzi accessibili)
- FAQ accordion
- CTA finale
- Footer con link legali

---

## Tracking & Analytics — Implementazione

```typescript
// Wrapper unico per tracciare su tutti i pixel

type EventName = 'view_content' | 'add_to_cart' | 'initiate_checkout' | 'purchase';

function trackEvent(event: EventName, data: Record<string, any>) {
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, data);
  }

  // TikTok Pixel
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track(mapToTikTokEvent(event), data);
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', mapToMetaEvent(event), data);
  }
}
```

**Eventi da tracciare:**
- `view_content` → visita pagina prodotto
- `add_to_cart` → aggiunta al carrello
- `initiate_checkout` → inizio checkout
- `purchase` → acquisto completato (con valore in EUR)

---

## Comandi Utili

```bash
# Sviluppo locale
npm run dev

# Build di produzione
npm run build

# Generare tipi Supabase
npx supabase gen types typescript --project-id <PROJECT_ID> > types/database.ts

# Test Stripe webhook in locale
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Deploy
git push origin main  # Vercel auto-deploy
```

---

## Priorità di Sviluppo

Segui questo ordine. Non passare al punto successivo finché il precedente non è completo e testato.

1. **Database e seed data** — crea le tabelle se non esistono, inserisci 15-20 prodotti di test con dati realistici
2. **API prodotti** — GET /api/products con filtri per categoria, ricerca full-text, paginazione
3. **Pagina catalogo** — connetti a dati reali da Supabase, implementa filtri e ricerca funzionanti
4. **Pagina singolo prodotto** — /catalogo/[slug] con tutti i dettagli, anteprima PDF, recensioni, prodotti correlati
5. **Carrello client-side** — Zustand store con add/remove/clear, badge counter in navbar, sticky bottom bar
6. **Checkout Stripe** — flusso completo: form email → creazione session → redirect → webhook → ordine in DB
7. **Sistema download** — generazione token, API download con validazione, signed URL, incremento contatore
8. **Email post-acquisto** — template HTML responsive con Resend, riepilogo ordine + link download
9. **SEO** — generateMetadata dinamici, JSON-LD, sitemap.xml, robots.txt, Open Graph
10. **Analytics** — GA4 + TikTok Pixel + Meta Pixel con eventi e-commerce su ogni step del funnel
