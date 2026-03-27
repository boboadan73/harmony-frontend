<template>
  <div
    class="matches-page"
    :class="{ rtl: isRtl, ltr: !isRtl }"
    :dir="isRtl ? 'rtl' : 'ltr'"
  >
    <TopNav :lang="lang" :pid="participantId()" />

    <div class="matches-shell">
      <div class="header-row">
        <div class="titles">
          <h1 class="page-title">{{ t.title }}</h1>
          <p class="page-subtitle">{{ t.subtitle }}</p>
        </div>

        <div class="language-box">
          🌐
          <select v-model="lang">
            <option value="en">English</option>
            <option value="ar">Arabic</option>
            <option value="he">Hebrew</option>
          </select>
        </div>
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="state-box">
        ⏳ {{ t.loadingTitle }}
      </div>

      <!-- ERROR -->
      <div v-else-if="errorMsg" class="state-box">
        ⚠️ {{ errorMsg }}
      </div>

      <!-- EMPTY -->
      <div v-else-if="sortedMatches.length === 0" class="state-box">
        ✨ {{ t.emptyTitle }}
      </div>

      <!-- MATCHES -->
      <div v-else class="matches-list">
        <div
          v-for="(m, idx) in sortedMatches"
          :key="m.id"
          class="match-card"
        >
          <div class="card-top">
            <div class="card-main">
              <div class="name-row">
                <h2>{{ getName(m) }}</h2>
                <span v-if="idx === 0" class="best">
                  {{ t.bestMatch }}
                </span>
              </div>

              <!-- ✅ WHY MATCH FIX -->
              <div class="why-section" v-if="getWhy(m)">
                <div class="why-title">{{ t.why }}</div>
                <div class="why-text">{{ getWhy(m) }}</div>
              </div>

              <div v-if="m.saved">⭐ {{ t.saved }}</div>
              <div v-if="m.met">🤝 {{ t.met }}</div>
            </div>

            <div>
              <img
                :src="m.avatar"
                class="avatar"
                @error="onAvatarError"
              />
              <div class="percent ltrNum">
                {{ m.matchPercent }}%
              </div>
            </div>
          </div>

          <div class="actions">
            <button @click="save(m)">
              {{ m.saved ? t.unsave : t.save }}
            </button>

            <button @click="markMet(m)">
              {{ m.met ? t.unmetBtn : t.metBtn }}
            </button>

            <button @click="skip(m)">
              {{ t.skip }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import TopNav from '@/components/TopNav.vue'
import { buildApiUrl, buildMatchApiUrl } from '@/services/api'
import defaultAvatar from '@/assets/default-avatar.png'

const route = useRoute()

const lang = ref(localStorage.getItem('harmony_lang') || 'en')

watch(lang, v => localStorage.setItem('harmony_lang', v))

const TEXTS = {
  en: {
    title: 'Matches',
    subtitle: 'People you may want to meet',
    loadingTitle: 'Loading...',
    emptyTitle: 'No matches',
    why: 'Why matched:',
    saved: 'Saved',
    met: 'Met',
    save: 'Save',
    unsave: 'Unsave',
    metBtn: 'Met',
    unmetBtn: 'Unmet',
    skip: 'Skip',
    bestMatch: 'BEST MATCH'
  },
  ar: {
    title: 'المطابقات',
    subtitle: 'أشخاص قد ترغب بلقائهم',
    loadingTitle: 'جارٍ التحميل',
    emptyTitle: 'لا يوجد مطابقات',
    why: 'لماذا تم التطابق:',
    saved: 'محفوظ',
    met: 'تم اللقاء',
    save: 'حفظ',
    unsave: 'إلغاء الحفظ',
    metBtn: 'تم اللقاء',
    unmetBtn: 'إلغاء',
    skip: 'تخطي',
    bestMatch: 'أفضل تطابق'
  },
  he: {
    title: 'התאמות',
    subtitle: 'אנשים שכדאי להכיר',
    loadingTitle: 'טוען...',
    emptyTitle: 'אין התאמות',
    why: 'למה הותאמתם:',
    saved: 'נשמר',
    met: 'נפגשנו',
    save: 'שמור',
    unsave: 'בטל',
    metBtn: 'נפגשנו',
    unmetBtn: 'בטל',
    skip: 'דלג',
    bestMatch: 'הכי מתאים'
  }
}

const t = computed(() => TEXTS[lang.value])
const isRtl = computed(() => lang.value === 'ar' || lang.value === 'he')

const matches = ref([])
const loading = ref(false)
const errorMsg = ref('')

function participantId() {
  return route.params.id
}

function pickText(...vals) {
  for (const v of vals) {
    if (v && String(v).trim()) return v
  }
  return ''
}

/* ✅ WHY FIX */
function getWhy(m) {
  if (lang.value === 'en') {
    return pickText(m.reason_en, m.reason, m.reason_he)
  }
  if (lang.value === 'he') {
    return pickText(m.reason_he, m.reason, m.reason_en)
  }
  return pickText(m.reason, m.reason_en, m.reason_he)
}

/* ✅ NAME FIX */
function getName(m) {
  const mn = m.match_name

  if (!mn) return m.name || ''
  if (typeof mn === 'string') return mn

  if (lang.value === 'en') {
    return pickText(mn.en, mn.original, mn.he)
  }
  if (lang.value === 'he') {
    return pickText(mn.he, mn.original, mn.en)
  }
  return pickText(mn.original, mn.en, mn.he)
}

function toUiMatch(raw) {
  return {
    ...raw,
    matchPercent: Math.round((raw.score || 0) * 100),
    avatar: raw.imageUrl || defaultAvatar,
    saved: false,
    met: false
  }
}

async function fetchMatches() {
  loading.value = true
  try {
    const res = await fetch(buildMatchApiUrl(`/api/match/${participantId()}`))
    const data = await res.json()

    matches.value = data.map(toUiMatch)
  } catch (e) {
    errorMsg.value = 'Failed to load'
  } finally {
    loading.value = false
  }
}

onMounted(fetchMatches)

const sortedMatches = computed(() =>
  [...matches.value].sort((a, b) => b.matchPercent - a.matchPercent)
)

function save(m) {
  m.saved = !m.saved
}

function markMet(m) {
  m.met = !m.met
}

function skip(m) {
  matches.value = matches.value.filter(x => x.id !== m.id)
}

function onAvatarError(e) {
  e.target.src = defaultAvatar
}
</script>

<style scoped>
.matches-page.rtl {
  direction: rtl;
}

.matches-page.ltr {
  direction: ltr;
}

.header-row {
  display: flex;
  justify-content: space-between;
}

.matches-page.rtl .header-row {
  flex-direction: row-reverse;
}

.match-card {
  background: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 10px;
}

.matches-page.rtl .match-card {
  text-align: right;
}

.matches-page.ltr .match-card {
  text-align: left;
}

.why-text {
  line-height: 1.6;
  word-break: break-word;
}

.avatar {
  width: 70px;
  border-radius: 50%;
}

.percent {
  background: green;
  color: white;
  padding: 5px;
  border-radius: 10px;
}

.actions {
  display: flex;
  gap: 10px;
}

.ltrNum {
  direction: ltr;
}
</style>
