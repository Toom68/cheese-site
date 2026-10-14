import { createContext, useContext, useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, Check, CircleCheck, Clock3, Compass, CreditCard,
  Camera, Globe2, Heart, Leaf, LockKeyhole, Mail, MapPin, Menu, Milk, Minus, Navigation,
  Package, PackageCheck, Plus, Quote, Search, ShieldCheck, ShoppingBag, Sparkles, Star, Trash2,
  Truck, X,
} from 'lucide-react'
import './App.css'

type Product = {
  id: string
  name: string
  eyebrow: string
  description: string
  longDescription: string
  image: string
  price: number
  category: 'box' | 'cheese'
  badge?: string
  origin: string
  weight: string
  tasting: string[]
  includes?: string[]
}

type CartItem = { product: Product; quantity: number }

const products: Product[] = [
  {
    id: 'the-taster', name: 'The Taster', eyebrow: '3 cheeses · Monthly', price: 58, category: 'box', badge: 'A gentle beginning',
    origin: 'A new region monthly', weight: '600–750g', image: '/img/wedges-2.jpg', tasting: ['Seasonal', 'Approachable', 'Surprising'],
    description: 'Three characterful cheeses, hand-cut and wrapped with a guide to every maker.',
    longDescription: 'A generous introduction to the world beyond the supermarket shelf. The Taster pairs three small-batch cheeses with maker stories, tasting notes and thoughtful accompaniments.',
    includes: ['3 hand-cut artisan cheeses', 'Tasting & maker story cards', 'One seasonal pairing', 'Carbon-conscious chilled delivery'],
  },
  {
    id: 'the-courier', name: 'The Courier', eyebrow: '5 cheeses · Monthly', price: 89, category: 'box', badge: 'Most loved',
    origin: 'A new region monthly', weight: '1.0–1.2kg', image: '/img/cheese-assortment.jpg', tasting: ['Balanced', 'Adventurous', 'Generous'],
    description: 'Our signature journey through five exceptional cheeses and the hands that shaped them.',
    longDescription: 'The complete Cheese Couriers experience. Five contrasting cheeses arrive at their perfect ripeness, accompanied by two pantry pairings and a field journal dedicated to the month’s region.',
    includes: ['5 hand-cut artisan cheeses', 'Two small-batch pairings', 'Collector’s field journal', 'Priority chilled delivery'],
  },
  {
    id: 'the-cellar', name: 'The Cellar', eyebrow: '7 cheeses · Monthly', price: 139, category: 'box', badge: 'For the devoted',
    origin: 'Rare finds worldwide', weight: '1.5–1.8kg', image: '/img/cheese-shelves.jpg', tasting: ['Rare', 'Complex', 'Celebratory'],
    description: 'Seven rare farmhouse selections, including limited wheels usually reserved for chefs.',
    longDescription: 'Our deepest monthly dive. The Cellar brings together seven remarkable cheeses in peak condition, rare pantry finds and access to a live online tasting with one of our makers.',
    includes: ['7 rare farmhouse cheeses', 'Three premium pairings', 'Live maker tasting access', 'Complimentary express delivery'],
  },
  {
    id: 'combe-hay', name: 'Combe Hay', eyebrow: 'Clothbound cheddar', price: 18, category: 'cheese', badge: 'New arrival',
    origin: 'Somerset, England', weight: '200g', image: '/img/wedges-1.jpg', tasting: ['Hazelnut', 'Meadow', 'Broth'],
    description: 'A deeply savoury clothbound cheddar with a long, warm finish.',
    longDescription: 'Made from the morning milk of a single pasture-fed herd, Combe Hay is clothbound by hand and matured for eighteen months in a cool stone cellar.',
  },
  {
    id: 'montelupo', name: 'Montelupo', eyebrow: 'Raw sheep’s milk', price: 24, category: 'cheese',
    origin: 'Tuscany, Italy', weight: '180g', image: '/img/wheels-salting.jpg', tasting: ['Honey', 'Wild herbs', 'Walnut'],
    description: 'A floral, full-flavoured pecorino made high in the Tuscan hills.',
    longDescription: 'Montelupo captures the rugged spring pastures surrounding a tiny hill farm. Its natural rind gives way to a dense, golden paste and lingering sweetness.',
  },
  {
    id: 'bleu-des-causses', name: 'Bleu des Causses', eyebrow: 'Cave-aged blue', price: 21, category: 'cheese', badge: 'Cellar pick',
    origin: 'Aveyron, France', weight: '200g', image: '/img/wedges-3.jpg', tasting: ['Mushroom', 'Cocoa', 'Salt'],
    description: 'Velvet-soft blue, cave-aged until mellow, mineral and beautifully balanced.',
    longDescription: 'A quiet masterpiece from limestone caves in southern France. Slow maturation creates fine blue veining and a finish that is creamy rather than sharp.',
  },
  {
    id: 'alpine-dawn', name: 'Alpine Dawn', eyebrow: 'Washed-rind cow’s milk', price: 23, category: 'cheese',
    origin: 'Bernese Oberland, Switzerland', weight: '200g', image: '/img/shop-hero.jpg', tasting: ['Brown butter', 'Onion', 'Caramel'],
    description: 'A supple alpine wheel with brothy depth and a burnished rind.',
    longDescription: 'Made in a copper vat with milk collected at altitude, this expressive mountain cheese is washed, turned and brushed throughout its twelve-month maturation.',
  },
  {
    id: 'little-orchard', name: 'Little Orchard', eyebrow: 'Bloomy goat’s milk', price: 17, category: 'cheese',
    origin: 'Victoria, Australia', weight: '160g', image: '/img/cheese-pattern.jpg', tasting: ['Citrus', 'Cream', 'White pepper'],
    description: 'Luminous goat’s cheese with a fine wrinkled rind and citrus lift.',
    longDescription: 'A tiny lactic-set wheel made by a husband-and-wife team using milk from their own small herd. Bright when young, it becomes rich and spoonable with age.',
  },
  {
    id: 'smoked-glen', name: 'Smoked Glen', eyebrow: 'Oak-smoked gouda', price: 19, category: 'cheese',
    origin: 'Otago, New Zealand', weight: '200g', image: '/img/cheese-aging.jpg', tasting: ['Toffee', 'Oak', 'Roasted nuts'],
    description: 'Gently smoked over local oak for sweetness, warmth and remarkable length.',
    longDescription: 'A six-month farmstead gouda, cold-smoked in small batches for just enough woodsmoke to complement its supple, caramel-rich paste.',
  },
]

const CartContext = createContext<{
  items: CartItem[]
  add: (product: Product, quantity?: number) => void
  update: (id: string, quantity: number) => void
  clear: () => void
  count: number
  total: number
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
} | null>(null)

function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const add = (product: Product, quantity = 1) => {
    setItems((current) => {
      const found = current.find((item) => item.product.id === product.id)
      return found
        ? current.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
        : [...current, { product, quantity }]
    })
    setCartOpen(true)
  }
  const update = (id: string, quantity: number) => setItems((current) =>
    quantity <= 0 ? current.filter((item) => item.product.id !== id) : current.map((item) => item.product.id === id ? { ...item, quantity } : item),
  )
  const clear = () => setItems([])
  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  return <CartContext.Provider value={{ items, add, update, clear, count, total, cartOpen, setCartOpen }}>{children}</CartContext.Provider>
}

function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error('Cart context unavailable')
  return value
}

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-70px' },
  transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] as const },
}

function Logo() {
  return (
    <Link to="/" className="logo" aria-label="The Cheese Couriers home">
      <img src="/brand/wordmark-red.png" alt="The Cheese Couriers" />
    </Link>
  )
}

function Mountain({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 344 150" fill="currentColor" aria-hidden="true">
      <path d="M0 148 32 118l10-2h4l20-32 4-1 4 10 12-14 16-10 18-21 3 1 9 27 6 3 5-2 5-14 7-3 15-29 13-10L198 0l22 31 10-3 4 1 16 30 18 14 14 22 5-4 6-2 50 60Z" />
    </svg>
  )
}

function Tagline() {
  return <div className="tagline"><span>A fair share to those who made it</span><i aria-hidden="true" /></div>
}

function Announcement() {
  return <div className="announcement"><Sparkles size={13} /> This month: hidden dairies of the Tuscan hills <span>·</span> Complimentary delivery on your first box <ArrowRight size={14} /></div>
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { count, setCartOpen } = useCart()
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <>
      <Announcement />
      <header className={scrolled ? 'header scrolled' : 'header'}>
        <div className="nav-shell">
          <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu /></button>
          <Logo />
          <nav className="desktop-nav">
            <NavLink to="/shop">Shop the boxes</NavLink>
            <NavLink to="/about">Our purpose</NavLink>
            <NavLink to="/track">Track a box</NavLink>
          </nav>
          <div className="nav-actions">
            <Link to="/shop" className="nav-search" aria-label="Search products"><Search size={19} /></Link>
            <button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`Open bag with ${count} items`}>
              <ShoppingBag size={20} /><span className="cart-label">Bag</span><span className="cart-count">{count}</span>
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mobile-panel" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 28, stiffness: 250 }}>
            <div className="mobile-panel-top"><Logo /><button onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button></div>
            <nav><NavLink to="/shop" onClick={() => setMenuOpen(false)}>Shop the boxes <ArrowUpRight /></NavLink><NavLink to="/about" onClick={() => setMenuOpen(false)}>Our purpose <ArrowUpRight /></NavLink><NavLink to="/track" onClick={() => setMenuOpen(false)}>Track a box <ArrowUpRight /></NavLink></nav>
            <div className="mobile-panel-foot"><span>Small makers. Grand flavours.</span><p>Delivering good cheese and a fairer future.</p></div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function CartDrawer() {
  const { items, total, cartOpen, setCartOpen, update } = useCart()
  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.button className="drawer-backdrop" aria-label="Close bag" onClick={() => setCartOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside className="cart-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 250 }}>
            <div className="drawer-head"><div><span className="eyebrow">Your selection</span><h2>The courier bag</h2></div><button onClick={() => setCartOpen(false)}><X /></button></div>
            {items.length === 0 ? (
              <div className="empty-cart"><div className="empty-icon"><ShoppingBag /></div><h3>Your bag is still light</h3><p>Fill it with remarkable cheese from remarkable people.</p><Link className="button button-dark" to="/shop" onClick={() => setCartOpen(false)}>Explore the collection <ArrowRight /></Link></div>
            ) : (
              <>
                <div className="cart-lines">
                  {items.map(({ product, quantity }) => (
                    <div className="cart-line" key={product.id}>
                      <img src={product.image} alt={product.name} />
                      <div className="cart-line-main"><span>{product.eyebrow}</span><h3>{product.name}</h3><div className="qty"><button onClick={() => update(product.id, quantity - 1)}>{quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}</button><b>{quantity}</b><button onClick={() => update(product.id, quantity + 1)}><Plus size={14} /></button></div></div>
                      <strong>${product.price * quantity}</strong>
                    </div>
                  ))}
                </div>
                <div className="drawer-impact"><Heart size={18} /> <span><b>${Math.round(total * .25)}</b> from this order supports independent makers.</span></div>
                <div className="drawer-total"><div><span>Subtotal</span><b>${total.toFixed(2)} AUD</b></div><p>Chilled shipping calculated at checkout.</p><Link to="/checkout" className="button button-primary full" onClick={() => setCartOpen(false)}>Continue to checkout <ArrowRight /></Link><small><ShieldCheck size={14} /> Secure simulated checkout</small></div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <Mountain className="footer-motif" />
      <div className="footer-top">
        <div className="footer-intro"><Link to="/" className="footer-logo" aria-label="The Cheese Couriers home"><img src="/brand/wordmark-cream.png" alt="The Cheese Couriers" /></Link><Tagline /><p>Extraordinary cheese, delivered with its story—and a fairer share returned to the hands that made it.</p><div className="socials"><a href="#instagram" aria-label="Instagram"><Camera /></a><a href="mailto:hello@thecheesecouriers.com" aria-label="Email"><Mail /></a></div></div>
        <div className="footer-links"><div><span>Discover</span><Link to="/shop">Monthly boxes</Link><Link to="/shop">Cheese counter</Link><Link to="/about">Our makers</Link></div><div><span>Help</span><Link to="/track">Track a box</Link><a href="#delivery">Delivery & care</a><a href="mailto:hello@thecheesecouriers.com">Contact us</a></div><div><span>Visit the counter</span><p>Friday–Sunday<br />10:00–16:00</p><p>82 Myrtle Lane<br />Melbourne, VIC</p></div></div>
      </div>
      <div className="footer-bottom"><span>© 2026 The Cheese Couriers</span><span>Made carefully, like good cheese.</span><div><a href="#privacy">Privacy</a><a href="#terms">Terms</a></div></div>
    </footer>
  )
}

function Page({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return <><Header /><main>{children}</main><Footer /><CartDrawer /></>
}

function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add } = useCart()
  return (
    <motion.article className="product-card" {...fadeUp} transition={{ ...fadeUp.transition, delay: index * .08 }}>
      <Link to={`/product/${product.id}`} className="product-image">
        <img src={product.image} alt={product.name} />
        {product.badge && <span className="badge">{product.badge}</span>}
        <span className="view-product">View details <ArrowUpRight size={17} /></span>
      </Link>
      <div className="product-info"><div><span>{product.eyebrow}</span><Link to={`/product/${product.id}`}><h3>{product.name}</h3></Link><p>{product.description}</p></div><div className="product-buy"><strong>${product.price}<small>{product.category === 'box' ? ' / month' : ' AUD'}</small></strong><button onClick={() => add(product)} aria-label={`Add ${product.name} to bag`}><Plus /></button></div></div>
    </motion.article>
  )
}

function Home() {
  const { add } = useCart()
  return (
    <>
      <section className="hero-section">
        <Mountain className="hero-motif" />
        <div className="hero-copy">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }} className="hero-kicker"><span /> Cheese with a passport</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .75, delay: .08 }}>The world’s best cheese,<br /><em>sent with purpose.</em></motion.h1>
          <motion.p initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .16 }}>A monthly collection of small-batch cheeses from overlooked makers. Hand-cut, beautifully packed, and delivered at just the right moment.</motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .24 }}><Link className="button button-dark" to="/shop">Choose your box <ArrowRight /></Link><Link className="text-link" to="/about">Meet the makers <ArrowUpRight /></Link></motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .4 }}><Tagline /></motion.div>
          <motion.div className="hero-proof" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .55 }}><div className="avatar-stack"><img src="/img/farmer-son.jpg" alt="" /><img src="/img/cheesemaker.jpg" alt="" /><img src="/img/cow-field.jpg" alt="" /></div><div><div className="stars"><Star /><Star /><Star /><Star /><Star /></div><span>Loved by 2,400+ curious eaters</span></div></motion.div>
        </div>
        <motion.div className="hero-visual" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, ease: [0.25, 1, 0.5, 1] }}>
          <img className="hero-photo" src="/img/cheese-aging.jpg" alt="Rows of artisan cheese wheels maturing in a cellar" />
          <div className="hero-photo-label"><span>01 / Source</span><p>Maturing slowly in Somerset</p></div>
          <motion.div className="box-mock" animate={{ y: [0, -7, 0], rotate: [-2, -1, -2] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}><div className="box-top"><img src="/brand/wordmark-red.png" alt="The Cheese Couriers" /><Mountain className="box-motif" /></div><div className="box-strip">Field notes · No. 08</div></motion.div>
          <div className="hero-stamp"><span>25%</span><small>back to<br />makers</small></div>
        </motion.div>
        <div className="scroll-note"><span /> Scroll to discover</div>
      </section>

      <div className="marquee"><div>{['RAW MILK', 'SMALL HERDS', 'SLOW MATURATION', 'FAIRER PRICES', 'WORLDWIDE FINDS', 'LESS WASTE', 'RAW MILK', 'SMALL HERDS', 'SLOW MATURATION'].map((item, i) => <span key={i}>{item}<b>◆</b></span>)}</div></div>

      <section className="section intro-section">
        <motion.div className="section-tag" {...fadeUp}>01 · This month’s edit</motion.div>
        <motion.div className="section-heading" {...fadeUp}><div><span className="eyebrow">The August dispatch</span><h2>A taste of Tuscany,<br /><em>without the airfare.</em></h2></div><div><p>Three generations, high hill pastures, and cheeses that rarely leave the valley. This month, we bring their table to yours.</p><Link className="text-link" to="/shop">Explore the full collection <ArrowRight /></Link></div></motion.div>
        <div className="product-grid featured-grid">{products.slice(0, 3).map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}</div>
      </section>

      <section className="story-section">
        <motion.div className="story-image" {...fadeUp}><img src="/img/farmer-son.jpg" alt="An independent dairy farmer with his son" /><div className="image-note"><span>Meet the maker</span><p>The Harris family<br />Gippsland, Australia</p></div></motion.div>
        <motion.div className="story-copy" {...fadeUp}><span className="eyebrow">A better way to buy cheese</span><h2>More than a good wedge.<br /><em>A fairer food chain.</em></h2><p>Small rural cheesemakers create extraordinary things, but too often struggle to reach the people who would cherish them. We make that distance disappear.</p><p>By buying thoughtfully, cutting only what is needed, and returning <strong>25% of every sale</strong> to farming and maker communities, each box does tangible good.</p><Link className="button button-outline" to="/about">Why we started <ArrowRight /></Link><div className="signature">Tom & Reuben <span>Founders & cheese obsessives</span></div></motion.div>
      </section>

      <section className="section how-section">
        <motion.div className="center-heading" {...fadeUp}><span className="eyebrow">From their cellar to your table</span><h2>Good things take a little time.</h2><p>We handle everything between the maker’s shelf and your front door.</p></motion.div>
        <div className="steps">
          {[
            { n: '01', icon: <Compass />, title: 'We seek', text: 'We travel, taste and build direct relationships with independent makers.' },
            { n: '02', icon: <Milk />, title: 'They make', text: 'Cheese is made in tiny batches, with local milk and time-honoured methods.' },
            { n: '03', icon: <Package />, title: 'We curate', text: 'Every wedge is hand-cut, wrapped and paired at peak ripeness.' },
            { n: '04', icon: <Truck />, title: 'You savour', text: 'Your chilled box arrives with stories, tasting notes and a new place to discover.' },
          ].map((step, i) => <motion.div className="step" key={step.n} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * .1 }}><span>{step.n}</span><div className="step-icon">{step.icon}</div><h3>{step.title}</h3><p>{step.text}</p>{i < 3 && <div className="step-line" />}</motion.div>)}
        </div>
      </section>

      <section className="impact-section">
        <Mountain className="impact-motif" />
        <motion.div {...fadeUp}><span className="eyebrow light">The good we’ve delivered so far</span><h2>Every box moves<br />the dial.</h2><p>We exist to keep rural cheesemaking vibrant, valuable and on the map.</p><Link to="/about" className="button button-light">Read our 2026 impact note <ArrowRight /></Link></motion.div>
        <motion.div className="impact-numbers" {...fadeUp}><div><strong>42</strong><span>Independent makers<br />in our community</span></div><div><strong>25%</strong><span>Of earnings returned<br />to makers & farmers</span></div><div><strong>8.2t</strong><span>Of beautiful cheese<br />kept from waste</span></div></motion.div>
      </section>

      <section className="section quote-section">
        <motion.div {...fadeUp}><Quote className="quote-mark" /><blockquote>“The box feels like opening a letter from somewhere wonderful. The cheese is exceptional, but knowing exactly who made it is what stays with you.”</blockquote><div className="quote-person"><img src="/img/cow-field.jpg" alt="" /><div><strong>Maya R.</strong><span>Courier member since 2024 · Sydney</span></div></div></motion.div>
      </section>

      <section className="journal-section">
        <motion.div className="journal-image" {...fadeUp}><img src="/img/cheesemaker.jpg" alt="Cheesemaker among aging wheels" /><span>Field journal · No. 08</span></motion.div>
        <motion.div className="journal-copy" {...fadeUp}><span className="eyebrow">Postcards from the road</span><h2>The quiet work<br /><em>behind a great rind.</em></h2><p>Inside a limestone cellar where every wheel is turned, washed and listened to by hand.</p><a href="#journal" className="text-link">Read the field note <ArrowUpRight /></a></motion.div>
        <motion.div className="newsletter" {...fadeUp}><span className="eyebrow">A good note, occasionally</span><h3>Join the cheese letter.</h3><p>New makers, field notes and first dibs on rare wheels. No filler.</p><form onSubmit={(e) => e.preventDefault()}><input type="email" placeholder="Your email address" aria-label="Email address" /><button aria-label="Subscribe"><ArrowRight /></button></form></motion.div>
      </section>

      <section className="final-cta"><Mountain className="final-motif" /><motion.div {...fadeUp}><span className="eyebrow">Your next favourite cheese is waiting</span><h2>Send your tastebuds<br />somewhere new.</h2><p>Cancel or pause anytime. No cheese snobbery required.</p><div><Link to="/shop" className="button button-dark">Choose your box <ArrowRight /></Link><button className="button button-cream" onClick={() => add(products[1])}>Add our favourite <Plus /></button></div></motion.div></section>
    </>
  )
}

function Shop() {
  const [filter, setFilter] = useState<'all' | 'box' | 'cheese'>('all')
  const filtered = filter === 'all' ? products : products.filter((product) => product.category === filter)
  return (
    <>
      <section className="page-hero shop-hero"><div><motion.span className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>The cheese counter</motion.span><motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>Small batches.<br /><em>Big places.</em></motion.h1><motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}>Boxes to keep the journey going, and individual finds for right now.</motion.p></div><motion.div className="page-hero-image" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}><img src="/img/shop-hero.jpg" alt="Artisan cheese wheels on cellar shelves" /><span>Current dispatch · August 2026</span></motion.div></section>
      <section className="shop-section">
        <div className="shop-toolbar"><div className="filter-tabs"><button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Everything <span>{products.length}</span></button><button className={filter === 'box' ? 'active' : ''} onClick={() => setFilter('box')}>Monthly boxes <span>3</span></button><button className={filter === 'cheese' ? 'active' : ''} onClick={() => setFilter('cheese')}>Cheese counter <span>6</span></button></div><p><Leaf /> All orders directly support small makers</p></div>
        <AnimatePresence mode="popLayout"><motion.div className="product-grid shop-grid" layout>{filtered.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}</motion.div></AnimatePresence>
      </section>
      <section className="shop-banner"><div><span className="eyebrow light">Not sure where to begin?</span><h2>Let us choose for you.</h2><p>The Courier is our perfectly balanced monthly edit: five cheeses, two pairings, countless stories.</p><Link to="/product/the-courier" className="button button-light">Meet The Courier <ArrowRight /></Link></div><img src="/img/cheese-assortment.jpg" alt="A selection of artisan cheeses" /></section>
    </>
  )
}

function ProductDetail() {
  const { id } = useParams()
  const product = products.find((item) => item.id === id) || products[0]
  const { add } = useCart()
  const [quantity, setQuantity] = useState(1)
  return (
    <>
      <section className="detail-section">
        <motion.div className="detail-image" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}><img src={product.image} alt={product.name} />{product.badge && <span className="badge">{product.badge}</span>}<div className="detail-origin"><MapPin /><span>Made in<br /><b>{product.origin}</b></span></div></motion.div>
        <motion.div className="detail-copy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}><Link to="/shop" className="back-link">← Back to the counter</Link><span className="eyebrow">{product.eyebrow}</span><h1>{product.name}</h1><div className="detail-price">${product.price}<small>{product.category === 'box' ? ' AUD / month' : ' AUD'}</small></div><p className="detail-lead">{product.longDescription}</p><div className="taste-notes"><span>Tastes like</span>{product.tasting.map((note) => <b key={note}>{note}</b>)}</div>{product.includes && <div className="includes"><span>Inside your dispatch</span>{product.includes.map((item) => <p key={item}><Check /> {item}</p>)}</div>}<div className="detail-buy"><div className="qty large"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus /></button><b>{quantity}</b><button onClick={() => setQuantity(quantity + 1)}><Plus /></button></div><button className="button button-primary" onClick={() => add(product, quantity)}>Add to your bag · ${product.price * quantity} <ShoppingBag /></button></div><div className="detail-assurance"><span><PackageCheck /> Chilled & carefully packed</span><span><Heart /> 25% goes back to makers</span></div></motion.div>
      </section>
      <section className="product-story"><motion.div {...fadeUp}><span className="section-tag">At the right moment</span><h2>Cut fresh. Wrapped by hand.<br /><em>Delivered in its prime.</em></h2></motion.div><motion.div {...fadeUp}><p>Cheese is alive, and timing matters. Our affineurs monitor each wheel, choosing your cut only when texture, aroma and flavour are in perfect conversation.</p><p>Every delivery travels chilled in recyclable wool insulation, with a simple care card so your cheese arrives—and stays—at its best.</p></motion.div></section>
      <section className="recommend-section"><div className="section-heading"><div><span className="eyebrow">Keep exploring</span><h2>You may also like.</h2></div><Link to="/shop" className="text-link">See everything <ArrowRight /></Link></div><div className="product-grid">{products.filter((item) => item.id !== product.id).slice(0, 3).map((item, i) => <ProductCard key={item.id} product={item} index={i} />)}</div></section>
    </>
  )
}

function About() {
  return (
    <>
      <section className="about-hero"><motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}><span className="eyebrow">Why we’re here</span><h1>Saving good cheese<br /><em>from a quiet ending.</em></h1><p>Cheesemakers shouldn’t have to be famous to thrive. Remarkable food shouldn’t go to waste. And knowing who made your dinner should be ordinary.</p></motion.div><motion.div className="about-collage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .1 }}><img src="/img/farmer-son.jpg" alt="Farmer and son" /><img src="/img/cow-field.jpg" alt="Cow in a green field" /><span>Founded in Australia<br />Travelling everywhere</span></motion.div></section>
      <section className="manifesto"><motion.div {...fadeUp}><span>50,000 tonnes</span><h2>of cheese is wasted by Australians every year.</h2></motion.div><motion.p {...fadeUp}>Meanwhile, independent dairies face rising costs, shrinking routes to market and pressure to scale beyond what their land—or craft—can sustain. We saw two problems that could help solve each other.</motion.p></section>
      <section className="founders-section"><motion.div className="founder-photo" {...fadeUp}><img src="/img/cheese-aging.jpg" alt="Traditional cheese cellar" /><div>The first cellar that started it all<br /><b>Somerset · 2025</b></div></motion.div><motion.div className="founder-copy" {...fadeUp}><span className="eyebrow">Hello, we’re Tom & Reuben</span><h2>Two friends, one<br /><em>fairly serious appetite.</em></h2><p>The Cheese Couriers began with a simple question: why was it so hard for small, rural cheesemakers to reach the people who would love their work?</p><p>We started travelling, listening and tasting. What we found was a world of ambitious makers, incredible cheeses, and far too many barriers between them and your table. So we built the route ourselves.</p><div className="signature">Tom & Reuben <span>Co-founders</span></div></motion.div></section>
      <section className="values-section"><motion.div className="center-heading" {...fadeUp}><span className="eyebrow">What guides the route</span><h2>Our promises, in plain English.</h2></motion.div><div className="values-grid">{[
        { icon: <Heart />, title: 'Maker first', text: '25% of all earnings goes directly back into the farms and cheesemakers who need it most.' },
        { icon: <Leaf />, title: 'Waste less', text: 'We forecast, buy whole wheels and hand-cut to order—making useful portions, not forgotten leftovers.' },
        { icon: <Globe2 />, title: 'Look further', text: 'We seek overlooked places and underrepresented traditions, not just familiar names.' },
        { icon: <Sparkles />, title: 'Never ordinary', text: 'Every box must bring genuine delight: beautiful flavour, useful stories and impeccable care.' },
      ].map((value, i) => <motion.div key={value.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * .08 }}><span>{value.icon}</span><h3>{value.title}</h3><p>{value.text}</p></motion.div>)}</div></section>
      <section className="about-impact"><img src="/img/cow-field.jpg" alt="Cow grazing in a field" /><motion.div {...fadeUp}><span className="eyebrow light">Our promise</span><h2>Twenty-five percent.<br />Every sale. Always.</h2><p>Not a once-a-year donation or a marketing line. A quarter of earnings is reinvested directly into producer partnerships, equipment grants and fair purchasing.</p><div><span><b>$84k</b> returned to date</span><span><b>17</b> equipment grants</span></div><Link to="/shop" className="button button-light">Make your box count <ArrowRight /></Link></motion.div></section>
    </>
  )
}

function TrackingMap() {
  return (
    <div className="tracking-map">
      <svg viewBox="0 0 720 390" role="img" aria-label="Map showing parcel travelling from Melbourne depot to Fitzroy">
        <path className="map-road" d="M-20 95 C110 60 130 150 245 130 S390 55 500 115 S630 220 750 165" />
        <path className="map-road thin" d="M80 -20 C115 90 78 180 142 410M330 -20 C305 80 362 200 302 410M590 -20 C630 80 570 270 655 410" />
        <path className="map-water" d="M-30 325 C120 250 210 370 350 300 S580 240 760 335 L760 420 L-30 420Z" />
        <path className="route-line" d="M130 245 C225 205 260 258 355 196 S505 150 580 95" />
        <circle cx="130" cy="245" r="8" className="route-dot" /><circle cx="580" cy="95" r="8" className="route-dot end" />
      </svg>
      <motion.div className="moving-pin" initial={{ left: '18%', top: '60%' }} animate={{ left: ['18%', '36%', '50%', '67%', '78%'], top: ['60%', '54%', '48%', '36%', '25%'] }} transition={{ duration: 7, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }}><div><Truck /></div><span>CC-28471</span></motion.div>
      <span className="map-label depot">Melbourne Depot</span><span className="map-label home">Your place</span><div className="map-live"><span /> Live simulation</div>
    </div>
  )
}

function Track() {
  const [code, setCode] = useState('CC-28471')
  const [active, setActive] = useState(true)
  const submit = (e: FormEvent) => { e.preventDefault(); setActive(Boolean(code)) }
  return (
    <>
      <section className="track-hero"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><span className="eyebrow">Follow the flavour</span><h1>Where’s my<br /><em>cheese?</em></h1><p>Enter your courier number for a live look at your box’s journey.</p><form onSubmit={submit}><div><Package /><input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. CC-28471" aria-label="Courier number" /></div><button className="button button-primary">Track my box <ArrowRight /></button></form><small>Try the demo number <button onClick={() => { setCode('CC-28471'); setActive(true) }}>CC-28471</button></small></motion.div><Mountain className="track-motif" /></section>
      {active && <section className="tracking-section"><motion.div className="tracking-head" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}><div><span className="status-pill"><span /> In transit</span><h2>Your August dispatch</h2><p>Courier no. {code.toUpperCase()}</p></div><div className="eta"><Clock3 /><span>Estimated arrival<b>Today, 2:40–4:10 PM</b></span></div></motion.div><div className="tracking-grid"><motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}><TrackingMap /></motion.div><motion.div className="tracking-timeline" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }}><div className="timeline-progress"><span /></div>{[
        { icon: <CircleCheck />, title: 'Packed at peak ripeness', meta: 'Myrtle Lane · Yesterday, 9:14 AM', done: true },
        { icon: <CircleCheck />, title: 'Collected by our chilled courier', meta: 'Yesterday, 4:42 PM', done: true },
        { icon: <Truck />, title: 'On the road to you', meta: 'Fitzroy North · 1:18 PM', active: true },
        { icon: <PackageCheck />, title: 'Delivered to your door', meta: 'Expected today', done: false },
      ].map((event) => <div className={`timeline-event ${event.done ? 'done' : ''} ${event.active ? 'active' : ''}`} key={event.title}><div className="timeline-icon">{event.icon}</div><div><h3>{event.title}</h3><p>{event.meta}</p>{event.active && <span>Cool and moving · 6.2°C</span>}</div></div>)}</motion.div></div><div className="tracking-help"><ShieldCheck /><div><b>Your cheese is travelling chilled.</b><span>Wool insulation keeps every wedge safely cool for 36+ hours.</span></div><a href="mailto:hello@thecheesecouriers.com">Need a hand? <ArrowUpRight /></a></div></section>}
    </>
  )
}

function Checkout() {
  const { items, total, clear } = useCart()
  const navigate = useNavigate()
  const [processing, setProcessing] = useState(false)
  const [card, setCard] = useState('')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!items.length) return
    setProcessing(true)
    window.setTimeout(() => { clear(); navigate('/order-confirmation') }, 1600)
  }
  const shipping = total >= 100 ? 0 : 12
  return (
    <section className="checkout-page">
      <div className="checkout-brand"><Logo /><span><LockKeyhole /> Secure simulated checkout</span></div>
      <div className="checkout-layout">
        <motion.form className="checkout-form" onSubmit={submit} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/shop" className="back-link">← Continue shopping</Link><h1>Almost at your table.</h1><p className="checkout-sub">No real payment will be taken—this is a complete checkout simulation.</p>
          <fieldset><legend><span>1</span> Contact</legend><label>Email address<input required type="email" placeholder="you@example.com" /></label><label className="checkbox"><input type="checkbox" /> Send me occasional field notes and rare releases</label></fieldset>
          <fieldset><legend><span>2</span> Delivery</legend><div className="field-grid"><label className="wide">Full name<input required placeholder="Tom Maynard" /></label><label className="wide">Street address<input required placeholder="42 Myrtle Lane" /></label><label>City<input required placeholder="Melbourne" /></label><label>State<select defaultValue="VIC"><option>VIC</option><option>NSW</option><option>QLD</option><option>SA</option><option>WA</option><option>TAS</option></select></label><label>Postcode<input required inputMode="numeric" placeholder="3000" /></label><label>Country<select><option>Australia</option></select></label></div></fieldset>
          <fieldset><legend><span>3</span> Payment</legend><div className="payment-card"><div className="payment-card-head"><span><CreditCard /> Card</span><div><b>VISA</b><b>MC</b><b>AMEX</b></div></div><label>Card number<div className="input-icon"><input required value={card} onChange={(e) => setCard(e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())} placeholder="4242 4242 4242 4242" /><LockKeyhole /></div></label><div className="field-grid"><label>Expiry<input required placeholder="MM / YY" /></label><label>Security code<input required placeholder="CVC" /></label></div></div><p className="test-note"><Sparkles /> Try the test card <button type="button" onClick={() => setCard('4242 4242 4242 4242')}>4242 4242 4242 4242</button></p></fieldset>
          <button className="button button-primary pay-button" disabled={processing || !items.length}>{processing ? <><span className="spinner" /> Preparing your order…</> : <>Pay ${(total + shipping).toFixed(2)} AUD <ArrowRight /></>}</button><small className="checkout-safe"><ShieldCheck /> Encrypted-style demo · No payment data is stored</small>
        </motion.form>
        <aside className="checkout-summary"><span className="eyebrow">Your dispatch</span>{items.length === 0 ? <div className="checkout-empty"><ShoppingBag /><p>Your bag is empty.</p><Link to="/shop">Choose some cheese</Link></div> : <>{items.map(({ product, quantity }) => <div className="summary-line" key={product.id}><div><img src={product.image} alt="" /><span>{quantity}</span></div><p><b>{product.name}</b><small>{product.eyebrow}</small></p><strong>${product.price * quantity}</strong></div>)}<div className="summary-totals"><p><span>Subtotal</span><b>${total.toFixed(2)}</b></p><p><span>Chilled delivery</span><b>{shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}</b></p><p className="grand-total"><span>Total <small>AUD</small></span><b>${(total + shipping).toFixed(2)}</b></p></div><div className="summary-impact"><Heart /><p><b>Your order gives back ${Math.round(total * .25)}</b><span>Directly supporting our independent makers.</span></p></div></>}</aside>
      </div>
    </section>
  )
}

function OrderConfirmation() {
  return <section className="confirmation"><motion.div initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }}><div className="success-icon"><Check /></div><span className="eyebrow">Order CC-28471 confirmed</span><h1>Your cheese is<br /><em>on the itinerary.</em></h1><p>We’ve sent a simulated confirmation to your inbox. Our team is selecting your cheeses and packing them chilled.</p><div className="confirmation-card"><div><PackageCheck /><span>Estimated dispatch<b>Monday, 31 August</b></span></div><div><Navigation /><span>Track with<b>CC-28471</b></span></div></div><div className="confirmation-actions"><Link className="button button-dark" to="/track">Track your box <ArrowRight /></Link><Link className="text-link" to="/">Back to home</Link></div></motion.div><Mountain className="confirm-motif" /></section>
}

function NotFound() {
  return <section className="confirmation"><div><span className="eyebrow">404 · Lost in the cellar</span><h1>This wheel has<br /><em>rolled away.</em></h1><p>Let’s get you back to the cheese counter.</p><Link className="button button-dark" to="/shop">Browse the collection <ArrowRight /></Link></div></section>
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="*" element={<Page><Routes><Route path="/" element={<Home />} /><Route path="/shop" element={<Shop />} /><Route path="/product/:id" element={<ProductDetail />} /><Route path="/about" element={<About />} /><Route path="/track" element={<Track />} /><Route path="*" element={<NotFound />} /></Routes></Page>} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
