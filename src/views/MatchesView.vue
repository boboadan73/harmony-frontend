<template>
  <div class="matches-page" :dir="isRtl ? 'rtl' : 'ltr'">
    <TopNav :lang="lang" :pid="participantId()" />

    <div class="matches-shell">
      <div class="header-row">
        <div class="titles">
          <h1 class="page-title">{{ t.title }}</h1>
          <p class="page-subtitle">{{ t.subtitle }}</p>
        </div>

        <div class="language-box">
          <span class="language-icon">🌐</span>
          <select class="language-select" v-model="lang">
            <option value="en">English</option>
            <option value="ar">Arabic</option>
            <option value="he">Hebrew</option>
          </select>
        </div>
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="state-box">
        <div class="state-icon">⏳</div>
        <div>
          <div class="state-title">{{ t.loadingTitle }}</div>
          <div class="state-sub">{{ t.loadingSub }}</div>
        </div>
      </div>

      <!-- ERROR -->
      <div v-else-if="errorMsg" class="state-box">
        <div class="state-icon">⚠️</div>
        <div>
          <div class="state-title">{{ t.errorTitle }}</div>
          <div class="state-sub">{{ errorMsg }}</div>
        </div>
      </div>

      <!-- EMPTY -->
      <div v-else-if="sortedMatches.length === 0" class="state-box">
        <div class="state-icon">✨</div>
        <div>
          <div class="state-title">{{ t.emptyTitle }}</div>
          <div class="state-sub">{{ t.emptySub }}</div>
        </div>
      </div>

      <!-- LIST -->
      <div v-else class="matches-list">
        <div
          v-for="(m, idx) in sortedMatches"
          :key="m.id"
          class="match-card"
        >
          <div class="card-top">
            <div class="card-main">
              <div class="name-row">
                <h2 class="match-name">{{ getName(m) }}</h2>

                <span v-if="idx === 0" class="best-badge">
                  {{ t.bestMatch }}
                </span>
              </div>

              <div class="divider"></div>

              <div class="why-section">
                <div class="why-title">{{ t.why }}</div>
                <div class="why-text">{{ getWhy(m) }}</div>
              </div>

              <div class="status-row" v-if="m.saved || m.met">
                <span v-if="m.saved" class="status-pill">{{ t.saved }}</span>
                <span v-if="m.met" class="status-pill">{{ t.met }}</span>
              </div>
            </div>

            <div class="avatar-side">
              <div class="avatar-wrap">
                <img
                  class="avatar"
                  :src="m.avatar"
                  alt="avatar"
                  loading="lazy"
                  @error="onAvatarError"
                />
                <div class="percent-badge ltrNum">
                  {{ m.matchPercent }}% {{ t.matchSuffix }}
                </div>
              </div>
            </div>
          </div>

          <div class="divider card-divider"></div>

          <div class="actions-row">
            <button class="action-btn" @click="save(m)">
              {{ m.saved ? t.unsave : t.save }}
            </button>

            <button class="action-btn" @click="markMet(m)">
              {{ m.met ? t.unmetBtn : t.metBtn }}
            </button>

            <button class="action-btn" @click="skip(m)">
              {{ t.skip }}
            </button>
          </div>
        </div>

        <div class="refresh-row">
          <button class="refresh-btn" @click="fetchMatches()">
            {{ t.refresh }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import TopNav from '@/components/TopNav.vue'
import { buildApiUrl, buildMatchApiUrl } from '@/services/api'
import defaultAvatar from '@/assets/default-avatar.png'

const route = useRoute()

const LANG_KEY = 'harmony_lang'
const lang = ref(localStorage.getItem(LANG_KEY) || 'en')

watch(lang, (v) => {
  localStorage.setItem(LANG_KEY, v)
})

const TEXTS = {
  en: {
    title: 'Matches',
    subtitle: 'People you may want to meet',
    emptyTitle: 'No more matches',
    emptySub: 'Try again later or come back after new participants join.',
    loadingTitle: 'Loading matches…',
    loadingSub: 'Please wait a moment.',
    errorTitle: 'Could not load matches',
    why: 'Why matched:',
    saved: '⭐ Saved',
    met: '🤝 Met',
    save: 'Save',
    unsave: 'Unsave',
    metBtn: 'Met',
    unmetBtn: 'Unmet',
    skip: 'Skip',
    matchSuffix: 'match',
    bestMatch: '⭐ BEST MATCH',
    refresh: 'Refresh',
  },
  ar: {
    title: 'المطابقات',
    subtitle: 'أشخاص قد ترغب بلقائهم',
    emptyTitle: 'لا توجد مطابقات أخرى',
    emptySub: 'جرّب لاحقاً أو عد بعد انضمام مشاركين جدد.',
    loadingTitle: 'جارٍ تحميل المطابقات…',
    loadingSub: 'انتظر لحظة من فضلك.',
    errorTitle: 'تعذّر تحميل المطابقات',
    why: 'لماذا تم التطابق:',
    saved: '⭐ محفوظ',
    met: '🤝 تم اللقاء',
    save: 'حفظ',
    unsave: 'إلغاء الحفظ',
    metBtn: 'تم اللقاء',
    unmetBtn: 'إلغاء تم اللقاء',
    skip: 'تخطي',
    matchSuffix: 'تطابق',
    bestMatch: '⭐ أفضل تطابق',
    refresh: 'تحديث',
  },
  he: {
    title: 'התאמות',
    subtitle: 'אנשים שאולי תרצי/תרצה לפגוש',
    emptyTitle: 'אין עוד התאמות',
    emptySub: 'נסי/נסה שוב מאוחר יותר או חזרי/חזור כשמצטרפים משתתפים חדשים.',
    loadingTitle: 'טוען התאמות…',
    loadingSub: 'רק רגע.',
    errorTitle: 'לא הצלחנו לטעון התאמות',
    why: 'למה הותאמתם:',
    saved: '⭐ נשמר',
    met: '🤝 נפגשנו',
    save: 'שמור',
    unsave: 'בטל שמירה',
    metBtn: 'נפגשנו',
    unmetBtn: 'בטל נפגשנו',
    skip: 'דלג',
    matchSuffix: 'התאמה',
    bestMatch: '⭐ ההתאמה הטובה ביותר',
    refresh: 'רענן',
  },
}

const t = computed(() => TEXTS[lang.value] ?? TEXTS.en)
const isRtl = computed(() => lang.value === 'ar' || lang.value === 'he')

const loading = ref(false)
const errorMsg = ref('')
const matches = ref([])

const placeholderAvatar = defaultAvatar

function participantId() {
  return String(route.params.id || '').trim()
}

function normalizeResponse(data) {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.matches)) return data.matches
  return []
}

function getWhy(m) {
  if (!m) return ''

  if (lang.value === 'en') {
    return m.whyMatched_en || m.whyMatched || m.whyMatched_he || ''
  }

  if (lang.value === 'he') {
    return m.whyMatched_he || m.whyMatched || m.whyMatched_en || ''
  }

  return m.whyMatched || m.whyMatched_en || m.whyMatched_he || ''
}

function getName(m) {
  if (!m) return ''

  const mn = m.match_name

  if (!mn) return m.name || ''
  if (typeof mn === 'string') return mn

  const original = mn.original || m.name || ''
  const en = mn.en || ''
  const he = mn.he || ''

  if (lang.value === 'en') return en || original || he || ''
  if (lang.value === 'he') return he || original || en || ''
  return original || en || he || ''
}

function toUiMatch(raw) {
  const score = Number(raw?.score)
  const matchPercent = Number.isFinite(score) ? Math.round(score * 100) : 0

  return {
    id: raw?.id ?? Math.random().toString(16).slice(2),
    name: raw?.name ?? '',
    match_name: raw?.match_name ?? null,
    role: '',
    matchPercent,
    whyMatched: raw?.reason ?? '',
    whyMatched_en: raw?.reason_en ?? '',
    whyMatched_he: raw?.reason_he ?? '',
    avatar: (raw?.imageUrl && String(raw.imageUrl).trim()) ? raw.imageUrl : placeholderAvatar,
    saved: false,
    met: false,
  }
}

async function fetchMatches() {
  const pid = participantId()
  if (!pid) return

  loading.value = true
  errorMsg.value = ''

  try {
    const [matchRes, savedRes, metRes] = await Promise.all([
      fetch(buildMatchApiUrl(`/api/match/${pid}`)),
      fetch(buildApiUrl(`/api/saved/${pid}`)),
      fetch(buildApiUrl(`/api/met/${pid}`)),
    ])

    if (!matchRes.ok) throw new Error(`API error: ${matchRes.status}`)
    if (!savedRes.ok) throw new Error(`API error: ${savedRes.status}`)
    if (!metRes.ok) throw new Error(`API error: ${metRes.status}`)

    const [matchData, savedIdsRaw, metIdsRaw] = await Promise.all([
      matchRes.json(),
      savedRes.json(),
      metRes.json(),
    ])

    const savedIds = new Set((savedIdsRaw || []).map(String))
    const metIds = new Set((metIdsRaw || []).map(String))

    const rawMatches = normalizeResponse(matchData)
    console.log('RAW MATCHES:', rawMatches)

    matches.value = rawMatches.map(raw => {
      const m = toUiMatch(raw)
      return {
        ...m,
        saved: savedIds.has(String(m.id)),
        met: metIds.has(String(m.id)),
      }
    })
  } catch (e) {
    errorMsg.value = e?.message || 'Failed to fetch'
    matches.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchMatches)

watch(
  () => route.params.id,
  () => fetchMatches()
)

const sortedMatches = computed(() =>
  [...matches.value].sort((a, b) => (b.matchPercent ?? 0) - (a.matchPercent ?? 0))
)

async function save(m) {
  const pid = participantId()

  try {
    const res = await fetch(buildApiUrl('/api/save'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: pid,
        targetId: String(m.id),
        remove: !!m.saved,
      })
    })

    if (!res.ok) throw new Error(`API error: ${res.status}`)

    m.saved = !m.saved
  } catch (e) {
    errorMsg.value = e?.message || 'Save failed'
  }
}

async function markMet(m) {
  const pid = participantId()

  try {
    const res = await fetch(buildApiUrl('/api/met'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: pid,
        targetId: String(m.id),
        remove: !!m.met,
      })
    })

    if (!res.ok) throw new Error(`API error: ${res.status}`)

    m.met = !m.met
  } catch (e) {
    errorMsg.value = e?.message || 'Met failed'
  }
}

function skip(m) {
  matches.value = matches.value.filter(x => x.id !== m.id)
}

function onAvatarError(e) {
  e.target.src = placeholderAvatar
}
</script>

<style scoped>
.matches-page {
  min-height: 100vh;
  background: #f4f4f2;
  font-family: Arial, sans-serif;
  color: #31443b;
}

.matches-shell {
  max-width: 980px;
  margin: 0 auto;
  padding: 18px 14px 40px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  margin: 14px 0 18px;
}

.titles {
  min-width: 0;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 500;
  color: #42554b;
}

.page-subtitle {
  margin: 6px 0 0;
  font-size: 15px;
  color: #7c8c84;
}

.language-box {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #d7ddd9;
  border-radius: 22px;
  padding: 10px 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  white-space: nowrap;
}

.language-icon {
  font-size: 15px;
  line-height: 1;
}

.language-select {
  border: none;
  background: transparent;
  font-size: 14px;
  color: #53665d;
  outline: none;
  cursor: pointer;
}

.matches-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.match-card {
  background: #ffffff;
  border: 1px solid #d9dfdb;
  border-radius: 16px;
  padding: 14px 14px 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
}

.card-main {
  flex: 1;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.match-name {
  margin: 0;
  font-size: 19px;
  font-weight: 700;
  color: #45584f;
}

.best-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background: #86b08f;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
}

.divider {
  height: 1px;
  background: #e5e9e6;
  margin: 10px 0;
}

.why-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.why-title {
  font-size: 16px;
  font-weight: 700;
  color: #5a7567;
}

.why-text {
  font-size: 15px;
  line-height: 1.5;
  color: #5b6c64;
  white-space: normal;
  word-break: break-word;
}

.avatar-side {
  flex-shrink: 0;
}

.avatar-wrap {
  position: relative;
  width: 92px;
  padding-bottom: 26px;
}

.avatar {
  width: 78px;
  height: 78px;
  object-fit: cover;
  border-radius: 50%;
  display: block;
  margin-inline-start: auto;
  border: 3px solid #f3f5f3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.percent-badge {
  position: absolute;
  bottom: 0;
  inset-inline-end: 0;
  background: #6f9f78;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  border-radius: 999px;
  padding: 6px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.status-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.status-pill {
  background: #eef3ef;
  color: #51635a;
  border: 1px solid #d5ddd8;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
}

.card-divider {
  margin-top: 8px;
  margin-bottom: 10px;
}

.actions-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border: 1px solid #d6ddd9;
  border-radius: 999px;
  overflow: hidden;
  background: #f7f8f7;
  max-width: 310px;
}

.action-btn {
  border: none;
  background: transparent;
  padding: 10px 8px;
  font-size: 15px;
  font-weight: 600;
  color: #5a6b63;
  cursor: pointer;
  transition: background 0.15s ease;
}

.action-btn:not(:last-child) {
  border-inline-end: 1px solid #d6ddd9;
}

.action-btn:hover {
  background: #edf2ee;
}

.refresh-row {
  display: flex;
  justify-content: center;
  margin-top: 4px;
}

.refresh-btn {
  border: 1px solid #cfd8d2;
  background: #ffffff;
  color: #53665d;
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.state-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #d9dfdb;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
}

.state-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #eef3ef;
  font-size: 18px;
}

.state-title {
  font-size: 16px;
  font-weight: 700;
  color: #46594f;
}

.state-sub {
  margin-top: 4px;
  font-size: 14px;
  color: #6f8077;
}

.ltrNum {
  direction: ltr;
  unicode-bidi: plaintext;
}

:dir(rtl) .header-row {
  flex-direction: row-reverse;
}

:dir(rtl) .card-top {
  flex-direction: row-reverse;
}

:dir(rtl) .name-row {
  flex-direction: row-reverse;
  justify-content: flex-start;
}

:dir(rtl) .actions-row {
  direction: rtl;
}

@media (max-width: 640px) {
  .header-row {
    flex-direction: column;
    align-items: stretch;
  }

  .language-box {
    align-self: flex-end;
  }

  :dir(rtl) .language-box {
    align-self: flex-start;
  }

  .card-top {
    gap: 10px;
  }

  .avatar-wrap {
    width: 82px;
  }

  .avatar {
    width: 70px;
    height: 70px;
  }

  .percent-badge {
    font-size: 11px;
    padding: 5px 10px;
  }

  .actions-row {
    max-width: 100%;
  }
}
</style>
