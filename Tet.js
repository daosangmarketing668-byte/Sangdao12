/**
 * File: Tet.js
 * Hiệu ứng: Pháo hoa, cánh hoa rơi cho Tiệc Tất Niên
 * Mục tiêu: Tạo trải nghiệm Tết theo mẫu thiết kế
 */

// Khởi tạo sau khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  setupFireworks();
  setupPetals();
});

/**
 * Pháo hoa bằng Canvas: hạt nổ, trọng lực, mờ dần
 */
function setupFireworks() {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Điều chỉnh kích thước khi thay đổi viewport
  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Bảng màu Tết truyền thống
  const palette = [
    "#FFD700", // gold
    "#DAA520", // gold-soft
    "#DC143C", // vivid-red
    "#8B0000", // deep-red
    "#FF6347", // tomato
    "#FFA500", // orange
  ];

  // Danh sách hạt pháo hoa
  const particles = [];
  const gravity = 0.08;
  const drag = 0.98;

  // Tạo vụ nổ tại (x, y)
  function burst(x, y, count = 80, power = 5) {
    const color = palette[Math.floor(Math.random() * palette.length)];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const speed = power + Math.random() * power * 0.8;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 100 + Math.random() * 50,
        alpha: 1,
        color,
        sparkle: Math.random() < 0.4,
        size: 2 + Math.random() * 3,
      });
    }
  }

  // Vẽ hạt
  function drawParticle(p) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Hiệu ứng lóe sáng (sparkle)
    if (p.sparkle && Math.random() < 0.15) {
      ctx.globalAlpha = p.alpha * 0.8;
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.arc(p.x + (Math.random() - 0.5) * 6, p.y + (Math.random() - 0.5) * 6, p.size * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Vòng lặp animation
  function tick() {
    ctx.clearRect(0, 0, width, height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vx *= drag;
      p.vy *= drag;
      p.vy += gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      p.alpha = Math.max(0, p.life / 120);
      drawParticle(p);
      if (p.life <= 0 || p.alpha <= 0 || p.y > height + 50) {
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(tick);
  }

  // Tạo pháo hoa ngẫu nhiên định kỳ
  const autoTimer = setInterval(() => {
    const x = 100 + Math.random() * (width - 200);
    const y = 100 + Math.random() * (height * 0.4);
    const count = 60 + Math.floor(Math.random() * 60);
    const power = 4 + Math.random() * 3;
    burst(x, y, count, power);
  }, 1500);

  // Lưu tham chiếu vào element để dùng ở handler bên ngoài
  canvas._burst = burst;
  tick();
}

/**
 * Tạo cánh hoa rơi: sinh phần tử và gán animation CSS
 */
function setupPetals() {
  const petalsContainer = document.querySelector(".petals");
  if (!petalsContainer) return;

  // Thiết lập animation cho mỗi cánh hoa
  const petals = petalsContainer.querySelectorAll("span");
  petals.forEach((petal, index) => {
    // Thiết lập thời gian rơi ngẫu nhiên
    const duration = 10 + Math.random() * 15;
    const delay = Math.random() * 3;
    
    petal.style.setProperty("--duration", `${duration}s`);
    
    // Thêm hiệu ứng xoay và scale ngẫu nhiên
    const rotation = Math.random() * 360;
    const scale = 0.8 + Math.random() * 0.4;
    petal.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    
    // Thêm hiệu ứng hover cho desktop
    petal.addEventListener('mouseenter', () => {
      petal.style.transform = `rotate(${rotation + 180}deg) scale(${scale * 1.2})`;
      petal.style.transition = 'transform 0.3s ease';
    });
    
    petal.addEventListener('mouseleave', () => {
      petal.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    });
  });
}

// Bắn pháo hoa khi click vào màn hình
document.addEventListener("click", (evt) => {
  const canvas = document.getElementById("fireworks");
  if (canvas && canvas._burst) {
    const count = 80 + Math.floor(Math.random() * 40);
    const power = 5 + Math.random() * 3;
    canvas._burst(evt.clientX, evt.clientY, count, power);
  }
});

// Bắn pháo hoa khi touch trên màn hình di động
document.addEventListener("touchstart", (evt) => {
  const canvas = document.getElementById("fireworks");
  if (canvas && canvas._burst && evt.touches && evt.touches[0]) {
    const count = 80 + Math.floor(Math.random() * 40);
    const power = 5 + Math.random() * 3;
    canvas._burst(evt.touches[0].clientX, evt.touches[0].clientY, count, power);
  }
}, { passive: true });

// Thêm hiệu ứng âm thanh mô phỏng (visual feedback)
function createVisualFeedback(x, y) {
  const feedback = document.createElement('div');
  feedback.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: radial-gradient(circle, #FFD700 0%, transparent 70%);
    pointer-events: none;
    z-index: 1000;
    animation: feedbackPulse 0.6s ease-out forwards;
  `;
  document.body.appendChild(feedback);
  
  setTimeout(() => feedback.remove(), 600);
}

// Thêm CSS animation cho feedback
const style = document.createElement('style');
style.textContent = `
  @keyframes feedbackPulse {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(3); opacity: 0; }
  }
`;
document.head.appendChild(style);

