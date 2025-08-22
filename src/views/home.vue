<template>
  <div id="rich-book-navigation">
    <!-- 背景层 -->
    <div class="background-layer">
      <div class="floating-particles" v-for="(particle, index) in particles" :key="index" 
           :style="getParticleStyle(particle)"></div>
      <div class="glowing-orbs" v-for="(orb, index) in orbs" :key="'orb'+index" 
           :style="getOrbStyle(orb)"></div>
    </div>

    <!-- 书本装饰 -->
    <div class="book-decoration">
      <div class="decor-book" v-for="n in 5" :key="'decor'+n" :style="getDecorBookStyle(n)">
        <div class="decor-book-spine"></div>
        <div class="decor-book-pages"></div>
      </div>
    </div>

    <!-- 主书本 -->
    <div class="main-book-container" :style="bookContainerStyle">
      <div class="book-3d" :style="{ transform: `rotateY(${currentRotation}deg) rotateX(${tiltAngle}deg)` }">
        <!-- 书脊 -->
        <div class="book-spine-rich">
          <div class="spine-title-rich">导航</div>
          <div class="spine-glow"></div>
          <div class="spine-ribs">
            <div class="spine-rib" v-for="n in 3" :key="'rib'+n"></div>
          </div>
        </div>

        <!-- 书页 -->
        <div 
          v-for="(route, index) in routes" 
          :key="route.path"
          class="book-page-rich"
          :class="{
            'current-page': index === currentPageIndex,
            'prev-page': index === currentPageIndex - 1,
            'next-page': index === currentPageIndex + 1
          }"
          :style="getPageStyle(index)"
          @click="goToPage(index)"
        >
          <!-- 页面内容 -->
          <div class="page-content-rich" :style="getPageBackground(route.name)">
            <!-- 页眉 -->
            <div class="page-header-rich">
              <div class="header-pattern"></div>
              <h2 class="page-title-rich">
                <span class="title-text">{{ route.name }}</span>
                <span class="title-underline"></span>
              </h2>
              <div class="page-icon-rich">{{ getRouteIcon(route.name) }}</div>
            </div>
            
            <!-- 页面主体 -->
            <div class="page-body-rich">
              <div class="decorative-element"></div>
              <p class="page-description-rich">{{ getRouteDescription(route.name) }}</p>
              
              <div class="feature-list">
                <div class="feature-item" v-for="(feature, fi) in getRouteFeatures(route.name)" :key="fi">
                  <span class="feature-icon">✦</span>
                  <span class="feature-text">{{ feature }}</span>
                </div>
              </div>

              <button 
                class="navigate-btn-rich"
                @click.stop="navigateTo(route)"
              >
                <span class="btn-icon">🚀</span>
                <span class="btn-text">探索页面</span>
                <span class="btn-glow"></span>
              </button>
            </div>

            <!-- 页脚 -->
            <div class="page-footer-rich">
              <div class="footer-pattern"></div>
              <div class="page-number-rich">{{ index + 1 }}</div>
              <div class="page-category">{{ getRouteCategory(route.name) }}</div>
            </div>
          </div>

          <!-- 页面边缘效果 -->
          <div class="page-edge"></div>
          <div class="page-glow"></div>
        </div>
      </div>
    </div>

    <!-- 控制界面 -->
    <div class="controls-rich">
      <button class="control-btn-rich prev-btn" @click="prevPage" :disabled="currentPageIndex === 0">
        <span class="control-icon">📖</span>
        <span class="control-text">上一页</span>
      </button>
      
      <div class="page-indicator-rich">
        <div class="indicator-progress">
          <div class="progress-bar" :style="{ width: `${(currentPageIndex + 1) / routes.length * 100}%` }"></div>
        </div>
        <div class="indicator-text">
          第 {{ currentPageIndex + 1 }} 页 / 共 {{ routes.length }} 页
        </div>
      </div>
      
      <button class="control-btn-rich next-btn" @click="nextPage" :disabled="currentPageIndex === routes.length - 1">
        <span class="control-text">下一页</span>
        <span class="control-icon">📖</span>
      </button>
    </div>

    <!-- 快速导航 -->
    <div class="quick-nav-rich">
      <div 
        v-for="(route, index) in routes" 
        :key="route.path"
        class="nav-item-rich"
        :class="{ 'active': index === currentPageIndex }"
        @click="goToPage(index)"
        :style="getNavItemStyle(index)"
      >
        <div class="nav-icon-container">
          <span class="nav-icon-rich">{{ getRouteIcon(route.name) }}</span>
          <div class="nav-glow"></div>
        </div>
        <span class="nav-text-rich">{{ route.name }}</span>
        <div class="nav-dot" :class="{ 'active': index === currentPageIndex }"></div>
      </div>
    </div>

    <!-- 环境光效 -->
    <div class="ambient-lights">
      <div class="ambient-light" v-for="n in 4" :key="'light'+n" :style="getLightStyle(n)"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import router from '@/router'

// 状态管理
const currentPageIndex = ref(0)
const currentRotation = ref(0)
const tiltAngle = ref(5)
const isAnimating = ref(false)

// 粒子效果
const particles = ref(Array(20).fill().map(() => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  delay: Math.random() * 5,
  duration: Math.random() * 10 + 10
})))

const orbs = ref(Array(3).fill().map(() => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 100 + 50,
  delay: Math.random() * 3
})))

// 获取路由信息
const routes = computed(() => {
  return router.getRoutes()
    .filter(route => route.name && !route.meta?.hidden)
    .map((route, index) => ({
      ...route,
      index,
      color: getRouteColor(route.name),
      icon: getRouteIcon(route.name),
      description: getRouteDescription(route.name)
    }))
})

// 书本容器样式
const bookContainerStyle = computed(() => ({
  perspective: `${1200 + currentPageIndex.value * 100}px`
}))

// 获取路由颜色
const getRouteColor = (name) => {
  const colors = {
    'Home': '#FF6B6B',
    'About': '#4ECDC4',
    'Contact': '#45B7D1',
    'Settings': '#F9A826',
    'Profile': '#A363D9',
    'Dashboard': '#6C5CE7',
    'Projects': '#00B894',
    'Team': '#FD79A8',
    'Calendar': '#FDCB6E',
    'Messages': '#74B9FF',
    'Files': '#55EFC4',
    'Tasks': '#FFEAA7',
    'Analytics': '#D63031',
    'Notifications': '#E17055'
  }
  return colors[name] || '#636E72'
}

// 获取路由图标
const getRouteIcon = (name) => {
  const icons = {
    'Home': '🏠',
    'About': '📖',
    'Contact': '📞',
    'Settings': '⚙️',
    'Profile': '👤',
    'Dashboard': '📊',
    'Projects': '📁',
    'Team': '👥',
    'Calendar': '📅',
    'Messages': '✉️',
    'Files': '📂',
    'Tasks': '✅',
    'Analytics': '📈',
    'Notifications': '🔔'
  }
  return icons[name] || '🔗'
}

// 获取路由描述
const getRouteDescription = (name) => {
  const descriptions = {
    'Home': '温馨的起点，一切从这里开始。探索无限可能，发现精彩内容。',
    'About': '深入了解我们的故事，感受品牌魅力与文化底蕴。',
    'Contact': '建立联系桥梁，随时为您提供专业服务与支持。',
    'Settings': '个性化定制空间，打造专属的完美使用体验。',
    'Profile': '展示独特个性，管理个人信息的智能空间。',
    'Dashboard': '数据可视化中心，洞察趋势，把握全局动态。',
    'Projects': '创意项目集合，见证想法变为现实的旅程。',
    'Team': '精英团队展示，协作共赢的专业伙伴网络。',
    'Calendar': '时间管理大师，规划日程，高效安排生活。',
    'Messages': '沟通无界限，即时交流的智能消息中心。'
  }
  return descriptions[name] || '探索未知领域，发现更多精彩功能与内容。'
}

// 获取页面样式
const getPageStyle = (index) => {
  const rotation = (index - currentPageIndex.value) * 180
  const zIndex = routes.value.length - Math.abs(index - currentPageIndex.value)
  const isVisible = Math.abs(index - currentPageIndex.value) <= 2
  
  return {
    transform: `rotateY(${rotation}deg)`,
    zIndex: zIndex,
    opacity: isVisible ? 1 : 0,
    transition: isAnimating.value ? 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none'
  }
}

// 获取路由特性
const getRouteFeatures = (name) => {
  const features = {
    'Home': ['实时数据概览', '快捷入口', '个性化推荐', '动态更新'],
    'Dashboard': ['数据可视化', '实时监控', '趋势分析', '报表导出'],
    'Projects': ['进度跟踪', '团队协作', '文档管理', '时间线视图'],
    'Settings': ['主题定制', '通知设置', '隐私控制', '账户管理']
  }
  return features[name] || ['智能导航', '流畅体验', '个性化设计', '高效操作']
}

// 获取路由分类
const getRouteCategory = (name) => {
  const categories = {
    'Home': '主要',
    'Dashboard': '数据',
    'Projects': '工作',
    'Team': '协作',
    'Settings': '系统',
    'Profile': '个人'
  }
  return categories[name] || '功能'
}

// 获取页面背景
const getPageBackground = (name) => {
  const color = getRouteColor(name)
  return {
    background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%), 
                radial-gradient(circle at 20% 80%, ${color}20 0%, transparent 50%)`
  }
}

// 获取粒子样式
const getParticleStyle = (particle) => ({
  left: `${particle.x}%`,
  top: `${particle.y}%`,
  width: `${particle.size}px`,
  height: `${particle.size}px`,
  animationDelay: `${particle.delay}s`,
  animationDuration: `${particle.duration}s`
})

// 获取光球样式
const getOrbStyle = (orb) => ({
  left: `${orb.x}%`,
  top: `${orb.y}%`,
  width: `${orb.size}px`,
  height: `${orb.size}px`,
  animationDelay: `${orb.delay}s`
})

// 获取装饰书籍样式
const getDecorBookStyle = (n) => {
  const rotations = [-15, -8, 0, 8, 15]
  const colors = ['#8b4513', '#654321', '#a0522d', '#cd853f', '#d2b48c']
  return {
    transform: `rotate(${rotations[n-1]}deg) translateY(${(n-2) * 20}px)`,
    backgroundColor: colors[n-1]
  }
}

// 获取导航项样式
const getNavItemStyle = (index) => {
  const color = getRouteColor(routes.value[index].name)
  return {
    '--item-color': color
  }
}

// 获取光线样式
const getLightStyle = (n) => {
  const positions = ['10% 20%', '90% 30%', '20% 80%', '80% 70%']
  return {
    background: `radial-gradient(circle at ${positions[n-1]}, 
                rgba(255,255,255,0.1) 0%, transparent 70%)`
  }
}

// 页面导航
const goToPage = (index) => {
  if (isAnimating.value || index === currentPageIndex.value) return
  
  isAnimating.value = true
  currentPageIndex.value = index
  
  // 计算书本整体旋转角度
  const targetRotation = -index * 8
  currentRotation.value = targetRotation
  
  setTimeout(() => {
    isAnimating.value = false
  }, 800)
}

const nextPage = () => {
  if (currentPageIndex.value < routes.value.length - 1) {
    goToPage(currentPageIndex.value + 1)
  }
}

const prevPage = () => {
  if (currentPageIndex.value > 0) {
    goToPage(currentPageIndex.value - 1)
  }
}

// 路由导航
const navigateTo = (route) => {
  const button = event?.currentTarget
  if (button) {
    button.style.transform = 'scale(0.95)'
    setTimeout(() => {
      button.style.transform = ''
      router.push(route.path)
    }, 150)
  } else {
    router.push(route.path)
  }
}

// 键盘导航
const handleKeyPress = (event) => {
  if (event.key === 'ArrowRight') nextPage()
  else if (event.key === 'ArrowLeft') prevPage()
  else if (event.key >= '1' && event.key <= '9') {
    const pageNum = parseInt(event.key) - 1
    if (pageNum < routes.value.length) goToPage(pageNum)
  }
}

// 生命周期
onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyPress)
})
</script>

<style scoped>
#rich-book-navigation {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 100%);
  overflow: hidden;
  perspective: 1000px;
}

/* 背景层 */
.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.floating-particles {
  position: absolute;
  background: linear-gradient(45deg, #4fc3f7, #29b6f6);
  border-radius: 50%;
  opacity: 0.6;
  animation: floatParticle linear infinite;
  filter: blur(1px);
}

@keyframes floatParticle {
  0% { transform: translateY(100vh) rotate(0deg); }
  100% { transform: translateY(-100px) rotate(360deg); }
}

.glowing-orbs {
  position: absolute;
  background: radial-gradient(circle, rgba(79, 195, 247, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulseOrb 8s ease-in-out infinite;
  filter: blur(20px);
}

@keyframes pulseOrb {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.2); }
}

/* 书本装饰 */
.book-decoration {
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 40px;
  z-index: 2;
  opacity: 0.7;
}

.decor-book {
  position: relative;
  width: 60px;
  height: 120px;
  border-radius: 4px;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
}

.decor-book-spine {
  position: absolute;
  left: -8px;
  top: 0;
  width: 8px;
  height: 100%;
  background: linear-gradient(90deg, #00000030, #00000060);
  border-radius: 4px 0 0 4px;
}

.decor-book-pages {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f8f9fa, #ffffff);
  border-radius: 0 4px 4px 0;
  box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
}

/* 主书本 */
.main-book-container {
  width: 900px;
  height: 625px;
  position: relative;
  transform-style: preserve-3d;
  margin-bottom: 3rem;
  z-index: 10;
}

.book-3d {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* 书脊样式 */
.book-spine-rich {
  position: absolute;
  left: -50px;
  top: 0;
  width: 50px;
  height: 100%;
  background: linear-gradient(90deg, #2c3e50 0%, #34495e 100%);
  border-radius: 12px 0 0 12px;
  transform: rotateY(90deg) translateZ(-25px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: -8px 0 30px rgba(0,0,0,0.6);
  overflow: hidden;
}

.spine-title-rich {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  /* transform: rotate(180deg); */
  color: #ecf0f1;
  font-weight: bold;
  font-size: 1.4rem;
  letter-spacing: 4px;
  text-shadow: 0 4px 8px rgba(0,0,0,0.4);
  z-index: 2;
}

.spine-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
  animation: spineGlow 3s ease-in-out infinite;
}

@keyframes spineGlow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}

.spine-ribs {
  position: absolute;
  top: 20px;
  left: 10px;
  right: 10px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.spine-rib {
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%);
}

/* 书页样式 */
.book-page-rich {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 15px;
  box-shadow: 
    0 10px 50px rgba(0,0,0,0.2),
    inset 0 0 0 1px rgba(255,255,255,0.8),
    inset 0 0 20px rgba(0,0,0,0.1);
  backface-visibility: hidden;
  transform-style: preserve-3d;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.page-content-rich {
  padding: 2.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

/* 页眉 */
.page-header-rich {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

.header-pattern {
  position: absolute;
  top: -2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 4px;
  background: linear-gradient(90deg, transparent 0%, #e74c3c 50%, transparent 100%);
  opacity: 0.6;
}

.page-title-rich {
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 1.5rem 0;
  text-shadow: 3px 3px 6px rgba(0,0,0,0.1);
  position: relative;
}

.title-underline {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #3498db, #2980b9);
  border-radius: 2px;
}

.page-icon-rich {
  font-size: 5rem;
  margin: 1.5rem 0;
  filter: drop-shadow(0 6px 12px rgba(0,0,0,0.2));
  animation: floatIcon 3s ease-in-out infinite;
}

@keyframes floatIcon {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* 页面主体 */
.page-body-rich {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  position: relative;
}

.decorative-element {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(52, 152, 219, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  z-index: -1;
}

.page-description-rich {
  color: #5a6c7d;
  font-size: 1.2rem;
  text-align: center;
  max-width: 80%;
  line-height: 1.8;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  max-width: 80%;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  background: rgba(236, 240, 241, 0.8);
  border-radius: 12px;
  border-left: 4px solid #3498db;
}

.feature-icon {
  color: #e74c3c;
  font-size: 1.2rem;
  font-weight: bold;
}

.feature-text {
  color: #2c3e50;
  font-size: 0.9rem;
  font-weight: 500;
}

.navigate-btn-rich {
  position: relative;
  padding: 1.2rem 2.5rem;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(52, 152, 219, 0.4);
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.navigate-btn-rich:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 35px rgba(52, 152, 219, 0.6);
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: left 0.5s ease;
}

.navigate-btn-rich:hover .btn-glow {
  left: 100%;
}

/* 页脚 */
.page-footer-rich {
  margin-top: auto;
  text-align: center;
  position: relative;
}

.footer-pattern {
  position: absolute;
  bottom: -1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, #95a5a6 50%, transparent 100%);
  opacity: 0.5;
}

.page-number-rich {
  color: #7f8c8d;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.page-category {
  color: #bdc3c7;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 页面边缘效果 */
.page-edge {
  position: absolute;
  right: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(to bottom, 
    rgba(0,0,0,0.1) 0%, 
    rgba(0,0,0,0.3) 50%, 
    rgba(0,0,0,0.1) 100%);
}

.page-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at right center, rgba(255,255,255,0.2) 0%, transparent 50%);
  pointer-events: none;
}

/* 控制界面 */
.controls-rich {
  display: flex;
  align-items: center;
  gap: 3rem;
  margin-bottom: 2rem;
  z-index: 10;
}

.control-btn-rich {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.1));
  backdrop-filter: blur(20px);
  color: white;
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.control-btn-rich:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.15));
  border-color: rgba(255,255,255,0.4);
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.3);
}

.control-btn-rich:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-indicator-rich {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  min-width: 200px;
}

.indicator-progress {
  width: 100%;
  height: 6px;
  background: rgba(255,255,255,0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4fc3f7, #29b6f6);
  border-radius: 3px;
  transition: width 0.8s ease;
}

.indicator-text {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

/* 快速导航 */
.quick-nav-rich {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 90%;
  z-index: 10;
}

.nav-item-rich {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  padding: 1.2rem 1.5rem;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-item-rich:hover,
.nav-item-rich.active {
  background: linear-gradient(135deg, 
    rgba(255,255,255,0.2), 
    rgba(255,255,255,0.15));
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}

.nav-item-rich::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--item-color, #3498db);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-item-rich.active::before {
  opacity: 1;
}

.nav-icon-container {
  position: relative;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.nav-item-rich:hover .nav-icon-container {
  transform: scale(1.2) rotate(10deg);
}

.nav-icon-rich {
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.nav-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, var(--item-color, #3498db)20 0%, transparent 70%);
  border-radius: 50%;
  animation: pulseGlow 2s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.2); }
}

.nav-text-rich {
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.nav-dot {
  width: 8px;
  height: 8px;
  background: rgba(255,255,255,0.3);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.nav-dot.active {
  background: var(--item-color, #3498db);
  transform: scale(1.5);
  box-shadow: 0 0 10px var(--item-color, #3498db);
}

/* 环境光效 */
.ambient-lights {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.ambient-light {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  animation: rotateLight 20s linear infinite;
  filter: blur(50px);
  opacity: 0.1;
}

@keyframes rotateLight {
  from { transform: rotate(0deg) translateX(200px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(200px) rotate(-360deg); }
}

/* 响应式设计 */
@media (max-width: 1000px) {
  .main-book-container {
    width: 90%;
    height: 450px;
  }
  
  .page-content-rich {
    padding: 2rem;
  }
  
  .page-title-rich {
    font-size: 2rem;
  }
  
  .page-icon-rich {
    font-size: 4rem;
  }
  
  .feature-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main-book-container {
    height: 400px;
  }
  
  .controls-rich {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .quick-nav-rich {
    max-width: 95%;
    gap: 1rem;
  }
  
  .nav-item-rich {
    padding: 1rem;
  }
  
  .nav-text-rich {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .main-book-container {
    height: 350px;
  }
  
  .page-content-rich {
    padding: 1.5rem;
  }
  
  .page-title-rich {
    font-size: 1.6rem;
  }
  
  .page-icon-rich {
    font-size: 3rem;
  }
  
  .page-description-rich {
    font-size: 1rem;
  }
}
</style>