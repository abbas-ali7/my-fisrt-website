class ShatterEffect {
  constructor(wrapper) {
    this.wrapper = wrapper;
    this.img = wrapper.querySelector('img');
    this.canvas = wrapper.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });


    this.pSize = 4;
    this.particles = [];
    this.mouse = { x: null, y: null };
    this.radius = 80;
    this.force = 6;

    this.animate = this.animate.bind(this);

    this.bindEvents();

    // ✅ Load handlers
    this.img.onload = () => this.setup();
    this.img.onerror = () => {
      console.error('❌ Image failed to load:', this.img.src);
      this.canvas.remove(); // remove canvas if image is broken
    };

    // ✅ Handle cached image already loaded
    if (this.img.complete && this.img.naturalWidth !== 0) {
      this.setup();
    }
  }

  bindEvents() {
    this.wrapper.addEventListener('mousemove', e => {
      const rect = this.wrapper.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.wrapper.addEventListener('mouseleave', () => {
      this.mouse.x = this.mouse.y = null;
    });

    window.addEventListener('resize', () => this.setup());

    this.wrapper.addEventListener('touchmove', e => {
      const rect = this.wrapper.getBoundingClientRect();
      const touch = e.touches[0];
      this.mouse.x = touch.clientX - rect.left;
      this.mouse.y = touch.clientY - rect.top;
    });

    this.wrapper.addEventListener('touchend', () => {
      this.mouse.x = this.mouse.y = null;
    });
  }

  setup() {
    this.canvas.width = this.img.clientWidth;
    this.canvas.height = this.img.clientHeight;
    this.pSize = this.canvas.width > 400 ? 6 : 4;
    this.makeParticles();
    requestAnimationFrame(this.animate);
  }

  makeParticles() {
    const w = this.canvas.width, h = this.canvas.height;
    this.particles = [];

    try {
      this.ctx.drawImage(this.img, 0, 0, w, h);
    } catch (e) {
      console.warn('❌ drawImage failed:', e);
      return;
    }

    const imageData = this.ctx.getImageData(0, 0, w, h, { willReadFrequently: true }).data;
    this.ctx.clearRect(0, 0, w, h);

    for (let y = 0; y < h; y += this.pSize) {
      for (let x = 0; x < w; x += this.pSize) {
        const i = (y * w + x) * 4;
        this.particles.push({
          x, y,
          ox: x, oy: y,
          r: imageData[i],
          g: imageData[i + 1],
          b: imageData[i + 2]
        });
      }
    }
  }

  animate() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let p of this.particles) {
      if (this.mouse.x !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < this.radius) {
          const force = (this.radius - dist) / this.radius;
          const angle = Math.atan2(dy, dx);
          p.x += Math.cos(angle) * force * this.force;
          p.y += Math.sin(angle) * force * this.force;
        }
      }

      p.x += (p.ox - p.x) * 0.05;
      p.y += (p.oy - p.y) * 0.05;

      ctx.fillStyle = `rgb(${p.r}, ${p.g}, ${p.b})`;
      ctx.fillRect(p.x, p.y, this.pSize, this.pSize);
    }

    requestAnimationFrame(this.animate);
  }
}

// ✅ Activate on all image-wrapper elements
document.querySelectorAll('.image-wrapper')
  .forEach(wrapper => new ShatterEffect(wrapper));

  window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  loader.style.transition = 'opacity 0.6s ease';
  loader.style.opacity = 0;
  setTimeout(() => loader.style.display = 'none', 600);
});

  document.querySelectorAll('.gallery-item').forEach((item, index) => {
  setTimeout(() => {
    const caption = item.querySelector('.caption');
    caption.classList.add('visible');
  }, 400 * index); // staggered reveal
});

