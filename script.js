document.getElementById('year').textContent = new Date().getFullYear();

  // Scroll progress bar
  const progressBar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  });

  // Count-up animation for hero stat number
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const duration = 1200;
    const start = performance.now();
    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  });

  // Nav goes glassy after scrolling past the hero
  const headerEl = document.querySelector('header');
  window.addEventListener('scroll', () => {
    headerEl.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Fade-up reveal for each section as it scrolls into view
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinksEl = document.getElementById('navLinks');
  if (menuToggle && navLinksEl){
    menuToggle.addEventListener('click', () => navLinksEl.classList.toggle('mobile-open'));
    navLinksEl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinksEl.classList.remove('mobile-open')));
  }

  // Hero rotating banner
  const heroSlides = document.querySelectorAll('.hero-slide');
  let heroIdx = 0;
  if (heroSlides.length > 1){
    setInterval(() => {
      heroSlides[heroIdx].classList.remove('active');
      heroIdx = (heroIdx + 1) % heroSlides.length;
      heroSlides[heroIdx].classList.add('active');
    }, 4500);
  }

  // Get Quote modal
  function openQuoteModal(productName){
    document.getElementById('quoteProduct').value = productName;
    document.getElementById('quoteModal').classList.add('open');
  }
  function closeQuoteModal(){
    document.getElementById('quoteModal').classList.remove('open');
  }
  function sendQuoteWA(){
    const product = document.getElementById('quoteProduct').value;
    const name = document.getElementById('quoteName').value;
    const phone = document.getElementById('quotePhone').value;
    const msg = document.getElementById('quoteMessage').value;
    if(!name || !phone){ alert('Please enter your name and phone number.'); return; }
    const text = `Hi, I want a quote for: ${product}\nName: ${name}\nPhone: ${phone}\nMessage: ${msg}`;
    window.open(`https://wa.me/919999999999?text=${encodeURIComponent(text)}`, '_blank');
    closeQuoteModal();
  }

  // "img" = path to the actual photo (put photos in an /images folder in your repo and
  // match the filename here exactly, e.g. images/dell-optiplex-7010.jpg).
  // If the image is missing or fails to load, the icon shows automatically instead.
  const products = [
    {name:"Dell Optiplex 7010 Desktop", cat:"Desktop", specs:"Intel i5, 8GB RAM, 256GB SSD · Grade A refurbished", price:"₹11,999", img:"images/dell-optiplex-7010.jpg"},
    {name:"HP EliteBook 840 G3 Laptop", cat:"Laptop", specs:"Intel i5 6th gen, 8GB RAM, 256GB SSD, 14\" · Grade A", price:"₹14,499", img:"images/hp-elitebook-840-g3.jpg"},
    {name:"Lenovo ThinkPad T460 Laptop", cat:"Laptop", specs:"Intel i5, 8GB RAM, 500GB HDD, 14\" · Grade B", price:"₹12,999", img:"images/lenovo-thinkpad-t460.jpg"},
    {name:"HP LaserJet Pro M126nw", cat:"Printer", specs:"Mono laser, Wi-Fi, scan/copy · Refurbished, tested", price:"₹6,499", img:"images/hp-laserjet-m126nw.jpg"},
    {name:"Lenovo M700 Tiny Desktop", cat:"Desktop", specs:"Intel i5, 8GB RAM, 128GB SSD · Compact form factor", price:"₹9,999", img:"images/lenovo-m700-tiny.jpg"},
    {name:"TP-Link 24-Port Network Switch", cat:"Networking", specs:"Gigabit unmanaged switch · New, sealed", price:"₹3,999", img:"images/tplink-24port-switch.jpg"},
    {name:"Dell Latitude E7450 Laptop", cat:"Laptop", specs:"Intel i7, 8GB RAM, 256GB SSD, 14\" · Grade A", price:"₹16,999", img:"images/dell-latitude-e7450.jpg"},
    {name:"Canon G3010 All-in-One Printer", cat:"Printer", specs:"Ink tank, Wi-Fi, print/scan/copy · Refurbished", price:"₹7,999", img:"images/canon-g3010.jpg"},
    {name:"Barcode Scanner (USB)", cat:"Networking", specs:"1D/2D wired scanner · New", price:"₹1,799", img:"images/barcode-scanner-usb.jpg"},
  ];

  const iconMap = {
    Laptop: '<path d="M4 5h16v10H4z"/><path d="M2 18h20l-2 3H4z"/>',
    Desktop:'<rect x="3" y="4" width="18" height="12" rx="1"/><path d="M8 20h8M12 16v4"/>',
    Printer:'<path d="M6 9V3h12v6"/><rect x="4" y="9" width="16" height="8" rx="1"/><path d="M6 17h12v5H6z"/>',
    Networking:'<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v6M12 13l-7 4M12 13l7 4"/>'
  };

  const grid = document.getElementById('productGrid');
  const noResults = document.getElementById('noResults');
  let activeCat = 'All';

  function render(){
    const q = document.getElementById('searchInput').value.trim().toLowerCase();
    const filtered = products.filter(p =>
      (activeCat === 'All' || p.cat === activeCat) &&
      (p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q))
    );
    grid.innerHTML = filtered.map(p => `
      <div class="product-card">
        <div class="product-thumb">
          <img src="${p.img}" alt="${p.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="thumb-fallback">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" style="width:56px;height:56px;color:var(--teal);">${iconMap[p.cat] || ''}</svg>
          </div>
        </div>
        <div class="product-body">
          <div class="product-cat">${p.cat.toUpperCase()}</div>
          <h3>${p.name}</h3>
          <div class="product-specs">${p.specs}</div>
          <div class="product-footer">
            <span class="price">${p.price}</span>
            <button class="enquire-btn" onclick="openQuoteModal('${p.name.replace(/'/g, "\\'")}')">Get Quote</button>
          </div>
        </div>
      </div>
    `).join('');
    noResults.style.display = filtered.length ? 'none' : 'block';
  }

  document.getElementById('searchInput').addEventListener('input', render);
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCat = chip.dataset.cat;
      render();
    });
  });
  render();

  // Contact form: opens email client with prefilled details (no backend needed).
  // To collect submissions directly to your inbox instead, sign up free at formspree.io
  // and replace this handler with a fetch() POST to your Formspree endpoint.
  document.getElementById('contactForm').addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    const body = `Name: ${name}%0APhone: ${phone}%0AMessage: ${message}`;
    window.location.href = `mailto:info@a2net.in?subject=Website%20Enquiry&body=${body}`;
  });
