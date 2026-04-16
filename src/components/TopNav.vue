<template>
  <button class="logoutBtn" @click="logout">
    {{ t.logout }}
  </button>

  <header class="topNav" :dir="isRtl ? 'rtl' : 'ltr'">
    <!-- Hamburger -->
    <button class="menuBtn" type="button" @click="open = true" aria-label="Open menu">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- LOGO CENTER -->
    <div class="logoWrap">
      <img class="logo" :src="logoSrc" alt="Harmony logo" />
    </div>

    <!-- spacer -->
    <div class="spacer"></div>

    <!-- Overlay + Drawer -->
    <transition name="fade">
      <div v-if="open" class="overlay" @click.self="open = false">
        <aside class="drawer" :class="{ right: isRtl }" @click.stop>
          <div class="drawerGlow"></div>

          <div class="drawerTop">
            <div class="brandMini">
              <div class="drawerLogoWrap">
                <img class="drawerLogo" :src="logoSrc" alt="Harmony" />
              </div>
              <div class="brandText">
                <p class="brandEyebrow">Harmony</p>
                <h3 class="brandTitle">Navigation</h3>
              </div>
            </div>

            <button class="closeBtn" @click="open = false" aria-label="Close menu">✕</button>
          </div>

          <nav class="drawerNav">
            <router-link
              :to="pidStr ? `/event/${eventId}/matches/${pidStr}` : `/event/${eventId}/login`"
              class="item"
              @click="open = false"
            >
              <span class="itemLabel">{{ t.matches }}</span>
              <span class="itemArrow">›</span>
            </router-link>

            <router-link
              :to="pidStr ? `/event/${eventId}/profile/${pidStr}` : `/event/${eventId}/login`"
              class="item"
              @click="open = false"
            >
              <span class="itemLabel">{{ t.profile }}</span>
              <span class="itemArrow">›</span>
            </router-link>

            <router-link
              :to="pidStr ? `/event/${eventId}/met/${pidStr}` : `/event/${eventId}/login`"
              class="item"
              @click="open = false"
            >
              <span class="itemLabel">{{ t.met }}</span>
              <span class="itemArrow">›</span>
            </router-link>

            <router-link
              :to="pidStr ? `/event/${eventId}/saved/${pidStr}` : `/event/${eventId}/login`"
              class="item"
              @click="open = false"
            >
              <span class="itemLabel">{{ t.saved }}</span>
              <span class="itemArrow">›</span>
            </router-link>

            <router-link
              :to="`/event/${eventId}/privacy`"
              class="item secondary"
              @click="open = false"
            >
              <span class="itemLabel">{{ t.privacy }}</span>
              <span class="itemArrow">›</span>
            </router-link>

            <router-link
              :to="`/event/${eventId}/terms`"
              class="item secondary"
              @click="open = false"
            >
              <span class="itemLabel">{{ t.terms }}</span>
              <span class="itemArrow">›</span>
            </router-link>
          </nav>
        </aside>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logoSrc from '../assets/harmony-logo.png'

const props = defineProps({
  lang: { type: String, default: 'en' },
  pid: { type: [String, Number], default: '' },
})

const route = useRoute()
const router = useRouter()

const eventId = computed(() =>
  String(route.params.eventId || localStorage.getItem('harmony_eventId') || '').trim()
)

watch(
  () => route.params.eventId,
  (v) => {
    const eid = String(v || '').trim()
    if (eid) localStorage.setItem('harmony_eventId', eid)
  },
  { immediate: true }
)

const open = ref(false)

function logout() {
  localStorage.removeItem('harmony_pid')
  open.value = false
  router.push(`/event/${eventId.value}/login`)
}

const isRtl = computed(() => props.lang === 'he' || props.lang === 'ar')

const pidStr = computed(() => {
  const pid =
    String(props.pid || route.params.id || localStorage.getItem('harmony_pid') || '').trim()
  return pid
})

watch(
  () => route.params.id,
  (v) => {
    const pid = String(v || '').trim()
    if (pid) localStorage.setItem('harmony_pid', pid)
  },
  { immediate: true }
)

const t = computed(() => {
  if (props.lang === 'he') {
    return {
      matches: 'התאמות',
      profile: 'פרופיל',
      met: 'נפגשנו',
      saved: 'שמורים',
      logout: 'התנתק',
      privacy: 'מדיניות פרטיות',
      terms: 'תנאי שימוש',
    }
  }

  if (props.lang === 'ar') {
    return {
      matches: 'المطابقات',
      profile: 'الملف الشخصي',
      met: 'تم اللقاء',
      saved: 'المحفوظات',
      logout: 'تسجيل الخروج',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الاستخدام',
    }
  }

  return {
    matches: 'Matches',
    profile: 'Profile',
    met: 'Met',
    saved: 'Saved',
    logout: 'Logout',
    privacy: 'Privacy Policy',
    terms: 'Terms of Use',
  }
})
</script>

<style scoped>
.logoutBtn {
  margin-bottom: 12px;
  padding: 11px 16px;
  border: 1px solid rgba(47, 107, 79, 0.18);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.78);
  color: #244636;
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 10px 28px rgba(31, 63, 50, 0.08);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.logoutBtn:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 14px 32px rgba(31, 63, 50, 0.12);
}

.topNav {
  position: sticky;
  top: 12px;
  z-index: 120;
  display: grid;
  grid-template-columns: 56px 1fr 56px;
  align-items: center;
  padding: 10px 14px;
  border-radius: 24px;
  background:
    linear-gradient(135deg, rgba(255,255,255,0.88), rgba(244,250,246,0.78));
  border: 1px solid rgba(111, 153, 121, 0.18);
  box-shadow:
    0 18px 50px rgba(31, 63, 50, 0.10),
    inset 0 1px 0 rgba(255,255,255,0.6);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.menuBtn {
  width: 56px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #2f6b4f, #4f8a69);
  border: 1px solid rgba(255,255,255,0.16);
  display: grid;
  place-content: center;
  gap: 5px;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(47, 107, 79, 0.22);
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}

.menuBtn:hover {
  transform: translateY(-1px) scale(1.01);
  box-shadow: 0 16px 30px rgba(47, 107, 79, 0.28);
  filter: brightness(1.03);
}

.menuBtn span {
  width: 22px;
  height: 2.8px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 999px;
}

.logoWrap {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 58px;
  height: 58px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, rgba(47,107,79,0.18), rgba(255,255,255,0.92));
  box-shadow: 0 10px 26px rgba(31, 63, 50, 0.10);
}

.logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
  background: #fff;
}

.spacer {
  width: 56px;
  height: 44px;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(16, 24, 20, 0.46);
  z-index: 9999;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.drawer {
  position: absolute;
  top: 0;
  left: 0;
  width: min(360px, 88vw);
  height: 100vh;
  overflow-y: auto;
  padding: 18px;
  display: flex;
  flex-direction: column;
  background:
    linear-gradient(180deg, rgba(248,252,249,0.96) 0%, rgba(235,244,238,0.96) 100%);
  border-right: 1px solid rgba(90, 129, 104, 0.16);
  box-shadow: 24px 0 60px rgba(20, 41, 31, 0.14);
}

.drawer.right {
  left: auto;
  right: 0;
  border-right: none;
  border-left: 1px solid rgba(90, 129, 104, 0.16);
  box-shadow: -24px 0 60px rgba(20, 41, 31, 0.14);
}

.drawerGlow {
  position: absolute;
  top: -80px;
  left: -60px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: rgba(88, 153, 117, 0.14);
  filter: blur(38px);
  pointer-events: none;
}

.drawerTop {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  border-radius: 22px;
  background: rgba(255,255,255,0.78);
  border: 1px solid rgba(111, 153, 121, 0.14);
  box-shadow:
    0 14px 34px rgba(31, 63, 50, 0.08),
    inset 0 1px 0 rgba(255,255,255,0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.brandMini {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.drawerLogoWrap {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  padding: 3px;
  background: linear-gradient(135deg, rgba(47,107,79,0.16), rgba(255,255,255,0.9));
  flex-shrink: 0;
}

.drawerLogo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 13px;
  display: block;
  background: #fff;
}

.brandText {
  min-width: 0;
}

.brandEyebrow {
  margin: 0;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6c8a79;
}

.brandTitle {
  margin: 4px 0 0;
  font-size: 19px;
  line-height: 1.1;
  font-weight: 900;
  color: #1f3f32;
}

.closeBtn {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  border: 1px solid rgba(47, 107, 79, 0.14);
  background: rgba(255,255,255,0.86);
  color: #244636;
  font-size: 18px;
  font-weight: 900;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.18s ease, background 0.18s ease;
}

.closeBtn:hover {
  transform: scale(1.03);
  background: #ffffff;
}

.drawerNav {
  position: relative;
  z-index: 1;
  margin-top: 18px;
  display: grid;
  gap: 12px;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 18px;
  text-decoration: none;
  background: rgba(255,255,255,0.82);
  border: 1px solid rgba(111, 153, 121, 0.14);
  color: #1f3f32;
  box-shadow:
    0 12px 28px rgba(31, 63, 50, 0.07),
    inset 0 1px 0 rgba(255,255,255,0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.item:hover {
  transform: translateY(-2px);
  background: rgba(255,255,255,0.96);
  box-shadow:
    0 18px 32px rgba(31, 63, 50, 0.10),
    inset 0 1px 0 rgba(255,255,255,0.76);
}

.item.secondary {
  background: rgba(246, 250, 247, 0.88);
}

.itemLabel {
  font-size: 15px;
  font-weight: 800;
  line-height: 1.2;
}

.itemArrow {
  font-size: 24px;
  line-height: 1;
  color: #6b8f7a;
  flex-shrink: 0;
  transform: translateY(-1px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 420px) {
  .logoutBtn {
    padding: 10px 14px;
    border-radius: 13px;
    font-size: 13px;
  }

  .topNav {
    grid-template-columns: 48px 1fr 48px;
    padding: 8px 10px;
    border-radius: 20px;
    top: 10px;
  }

  .menuBtn {
    width: 48px;
    height: 38px;
    border-radius: 12px;
  }

  .menuBtn span {
    width: 20px;
    height: 2.6px;
  }

  .spacer {
    width: 48px;
    height: 38px;
  }

  .logoWrap {
    width: 50px;
    height: 50px;
  }

  .drawer {
    padding: 14px;
    width: min(340px, 90vw);
  }

  .drawerTop {
    padding: 12px;
    border-radius: 18px;
  }

  .drawerLogoWrap {
    width: 46px;
    height: 46px;
    border-radius: 14px;
  }

  .brandTitle {
    font-size: 17px;
  }

  .item {
    padding: 14px 15px;
    border-radius: 16px;
  }

  .itemLabel {
    font-size: 14px;
  }
}
</style>
