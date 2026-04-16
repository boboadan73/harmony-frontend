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
/* ========= BASE GREEN PALETTE ========= */
:root {
  --green-very-light: #f3faf6;
  --green-light: #e6f4ec;
  --green-soft: #d7eee3;
  --green-main: #5f9f7f;
  --green-deep: #2f6b4f;
  --green-text: #1f3f32;
}

/* LOGOUT */
.logoutBtn {
  margin-bottom: 12px;
  padding: 11px 16px;
  border-radius: 14px;
  background: linear-gradient(135deg, #e8f6ee, #dff2e8);
  border: 1px solid rgba(95, 159, 127, 0.25);
  color: var(--green-text);
  font-weight: 800;
  box-shadow: 0 10px 24px rgba(47, 107, 79, 0.08);
}

.logoutBtn:hover {
  background: #eefaf3;
}

/* NAVBAR */
.topNav {
  position: sticky;
  top: 12px;
  z-index: 120;

  display: grid;
  grid-template-columns: 56px 1fr 56px;
  align-items: center;
  padding: 10px 14px;
  border-radius: 24px;

  background: linear-gradient(135deg, #eaf7f0, #dff2e8);
  border: 1px solid rgba(95, 159, 127, 0.25);

  box-shadow: 0 18px 45px rgba(47, 107, 79, 0.10);

  backdrop-filter: blur(12px);
}

/* MENU BUTTON */
.menuBtn {
  width: 56px;
  height: 44px;
  border-radius: 14px;

  background: linear-gradient(135deg, #5f9f7f, #7bbd9c);
  border: none;

  display: grid;
  place-content: center;
  gap: 5px;

  box-shadow: 0 12px 24px rgba(47, 107, 79, 0.25);
}

.menuBtn span {
  width: 22px;
  height: 3px;
  background: white;
}

/* LOGO */
.logoWrap {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 58px;
  height: 58px;
  border-radius: 50%;
  padding: 3px;

  background: linear-gradient(135deg, #cde9da, #ffffff);
}

.logo {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

/* OVERLAY */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(40, 80, 60, 0.35);
  backdrop-filter: blur(6px);
}

/* DRAWER */
.drawer {
  position: absolute;
  top: 0;
  left: 0;

  width: min(360px, 88vw);
  height: 100vh;

  padding: 18px;
  display: flex;
  flex-direction: column;

  background: linear-gradient(180deg, #f4fbf7, #e6f4ec);

  box-shadow: 20px 0 50px rgba(47, 107, 79, 0.15);
}

.drawer.right {
  left: auto;
  right: 0;
}

/* TOP */
.drawerTop {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 14px;
  border-radius: 20px;

  background: linear-gradient(135deg, #ffffff, #eaf7f0);
  border: 1px solid rgba(95, 159, 127, 0.2);
}

/* CLOSE */
.closeBtn {
  width: 42px;
  height: 42px;
  border-radius: 12px;

  background: #e8f6ee;
  border: 1px solid #cfe8db;

  font-weight: bold;
}

/* NAV ITEMS */
.drawerNav {
  margin-top: 18px;
  display: grid;
  gap: 12px;
}

/* ITEM */
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 16px;
  border-radius: 18px;

  background: linear-gradient(135deg, #ffffff, #edf8f2);
  border: 1px solid rgba(95, 159, 127, 0.15);

  color: var(--green-text);
  font-weight: 800;

  box-shadow: 0 10px 24px rgba(47, 107, 79, 0.06);
}

.item:hover {
  background: linear-gradient(135deg, #ffffff, #e6f4ec);
}

/* SECONDARY */
.item.secondary {
  background: linear-gradient(135deg, #f2faf6, #e8f5ee);
}

/* ARROW */
.itemArrow {
  font-size: 22px;
  color: #6ea889;
}

/* MOBILE */
@media (max-width: 420px) {
  .topNav {
    grid-template-columns: 48px 1fr 48px;
  }

  .menuBtn {
    width: 48px;
    height: 38px;
  }

  .logoWrap {
    width: 50px;
    height: 50px;
  }
}
