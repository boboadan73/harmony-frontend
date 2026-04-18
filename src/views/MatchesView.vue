<template>
  <div class="matches-page" :dir="isRtl ? 'rtl' : 'ltr'">
    <TopNav :lang="lang" :pid="participantId()" />

    <main class="matches-wrap">
       <section class="page-head">
 <div class="title-box modern-title-box">
  <h1 class="page-title modern-page-title">
    {{ t.title }}
  </h1>
  <p class="page-subtitle modern-page-subtitle">{{ t.subtitle }}</p>
</div>
   
<div class="head-actions">
  <div class="filters-bar">
    <button class="filters-toggle" @click="showFilters = !showFilters">
      {{ t.filters }}
    </button>

<div v-if="showFilters" class="filters-dropdown">
  <div class="filters-top">
    <select v-model="filterType" class="filters-select">
      <option value="name">{{ t.searchByName }}</option>
      <option value="freeText">{{ t.freeSearch }}</option>
    </select>

    <button class="filters-close" @click="showFilters = false">
      ✕
    </button>
  </div>

  <input
    v-model="filterValue"
    class="filters-input"
    type="text"
    :placeholder="filterType === 'name' ? t.typeNameHere : t.typeHere"
  />

  <div class="filters-actions">
    <button class="filters-submit" @click="showFilters = false">
      {{ t.searchBtn }}
    </button>

    <button class="filters-clear" @click="clearFilters">
      {{ t.clearFilters }}
    </button>
  </div>
</div>
  </div>

  <div class="language-box">
    <span class="language-icon" aria-hidden="true">🌐</span>
    <select class="language-select" v-model="lang">
      <option value="en">English</option>
      <option value="ar">Arabic</option>
      <option value="he">Hebrew</option>
    </select>
  </div>
</div>
      </section>

      <div v-if="loading" class="state-box">
        <div class="state-icon" aria-hidden="true">⏳</div>
        <div>
          <div class="state-title">{{ t.loadingTitle }}</div>
          <div class="state-sub">{{ t.loadingSub }}</div>
        </div>
      </div>

      <div v-else-if="errorMsg" class="state-box">
        <div class="state-icon" aria-hidden="true">⚠️</div>
        <div>
          <div class="state-title">{{ t.errorTitle }}</div>
          <div class="state-sub">{{ errorMsg }}</div>
        </div>
      </div>

<div v-else-if="filteredMatches.length === 0" 
class="state-box">
          <div class="state-icon" aria-hidden="true">✨</div>
        <div>
          <div class="state-title">{{ t.emptyTitle }}</div>
          <div class="state-sub">{{ t.emptySub }}</div>
        </div>
      </div>

      <section v-else class="matches-list">
        <article
v-for="(m, idx) in filteredMatches"
          :key="m.id"
          class="match-card"
        >
          <div class="match-top">
            <div class="match-main">
              <div class="name-row">
                <h2 class="match-name">{{ getName(m) }}</h2>

                <span v-if="idx === 0" class="best-badge">
                   <span class="best-badge-star">★ </span>
                  {{ t.bestMatch }}
                </span>
              </div>

              <div v-if="getWhy(m)" class="why-section">
                <div class="why-title">{{ t.why }}</div>
                <div class="why-text">{{ getWhy(m) }}</div>
              </div>
            </div>

            <div class="avatar-side">
              <img
                class="match-avatar"
                :src="m.avatar"
                alt="avatar"
                loading="lazy"
                @error="onAvatarError"
              />

       <div class="match-score ltrNum">
          <span>{{ m.matchPercent }}% {{ t.matchSuffix }}</span>
              </div>
          </div>
            </div>

          <div v-if="m.saved || m.met" class="status-row">
            <span v-if="m.saved" class="status-pill">{{ t.saved }}</span>
            <span v-if="m.met" class="status-pill">{{ t.met }}</span>
          </div>

          <div class="actions-row">
            <button class="action-btn save-btn" @click="save(m)">
              {{ m.saved ? t.unsave : t.save }}
            </button>

            <button class="action-btn met-btn" @click="markMet(m)">
              {{ m.met ? t.unmetBtn : t.metBtn }}
            </button>

            <button class="action-btn skip-btn" @click="skip(m)">
              {{ t.skip }}
            </button>
          </div>
        </article>

        <div class="refresh-row">
          <button class="refresh-btn" @click="fetchMatches()">
            {{ t.refresh }}
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import TopNav from '@/components/TopNav.vue'
import { buildApiUrl, buildMatchApiUrl } from '@/services/api'
import defaultAvatar from '@/assets/default-avatar.png'

const route = useRoute()
const eventId = computed(() =>
  String(route.params.eventId || localStorage.getItem('harmony_eventId') || '').trim()
)
const showFilters = ref(false)

const filterType = ref('name') // name | freeText
const filterValue = ref('')
const LANG_KEY = 'harmony_lang'
const lang = ref(localStorage.getItem(LANG_KEY) || 'en')


watch(
  lang,
  (v, prev) => {
    localStorage.setItem(LANG_KEY, v)

    if (v !== prev) {
      fetchMatches()
    }
  },
  { immediate: true }
)
  watch(
  eventId,
  v => {
    if (v) localStorage.setItem('harmony_eventId', v)
  },
  { immediate: true }
)

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
    bestMatch: 'BEST MATCH',
    refresh: 'Refresh',
   filtersTitle: 'Filters',
searchByName: 'Search by name',
freeSearch: 'Search by interests or keywords',
clearFilters: 'Clear filters',
filters: 'Filters',
typeHere: 'Search by interests or keywords',
typeNameHere: 'Type a name...',
typeHere: 'Type here...',
    searchBtn: 'Search',
    
    
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
    bestMatch: 'أفضل تطابق',
    refresh: 'تحديث',
    filtersTitle: 'عوامل التصفية',
    searchByName: 'ابحث بالاسم',
    freeSearch: 'ابحث حسب الاهتمامات أو الكلمات المفتاحية',
    clearFilters: 'مسح عوامل التصفية',
    filters: 'عوامل التصفية',
    typeHere: 'ابحث حسب الاهتمامات أو الكلمات المفتاحية',
    typeNameHere: 'اكتب الاسم هنا...',
    typeHere: 'اكتب هنا...',
    searchBtn: 'بحث',
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
    bestMatch: 'ההתאמה הטובה ביותר',
    refresh: 'רענן',
   filtersTitle: 'סינון',
searchByName: 'חיפוש לפי שם',
freeSearch: 'חיפוש לפי תחומי עניין או מילות מפתח',
clearFilters: 'נקה סינון',
filters: 'סינון',
typeHere: 'חיפוש לפי תחומי עניין או מילות מפתח',
typeNameHere: 'הקלד/י שם...',
typeHere: 'הקלד/י כאן...',
    searchBtn: 'חפש',
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
function clearFilters() {
  filterType.value = 'name'
  filterValue.value = ''
}

function getWhy(m) {
  if (!m) return ''
  if (lang.value === 'en') return m.whyMatched_en || m.whyMatched || m.whyMatched_he || ''
  if (lang.value === 'he') return m.whyMatched_he || m.whyMatched_en || m.whyMatched || ''
  return m.whyMatched || m.whyMatched_en || m.whyMatched_he || ''
}

function getName(m) {
  if (!m) return ''

  const mn = m.match_name || {}

  const ar = mn.ar || ''
  const en = mn.en || ''
  const he = mn.he || ''
  const original = mn.original || m.name || ''

  if (lang.value === 'ar') return ar || en || original || he || ''
  if (lang.value === 'en') return en || ar || original || he || ''
  if (lang.value === 'he') return he || en || original || ar || ''

  return original || en || he || ar || ''
}

function toUiMatch(raw) {
  const score = Number(raw?.score)
  const matchPercent = Number.isFinite(score) ? Math.round(score * 100) : 0

  const explanation = raw?.explanation || {}
  const actualId = raw?.matchId ?? raw?.id

  return {
    id: actualId ?? Math.random().toString(16).slice(2),
    name: raw?.name ?? '',
    match_name: raw?.match_name ?? null,
    role: '',
    company: raw?.company ?? raw?.job ?? raw?.jobTitle ?? '',
    skills: raw?.skills ?? raw?.professional ?? '',
    interests: raw?.interests ?? raw?.personal ?? '',
    languages: raw?.languages ?? '',
    matchPercent,

    whyMatched:
      raw?.reason ||
      explanation?.ar ||
      explanation?.en ||
      explanation?.he ||
      explanation?.text ||
      '',

    whyMatched_en:
      raw?.reason_en ||
      explanation?.en ||
      '',

    whyMatched_he:
      raw?.reason_he ||
      explanation?.he ||
      '',

    avatar:
      (raw?.image && String(raw.image).trim()) ||
      (raw?.photoUrl && String(raw.photoUrl).trim()) ||
      (raw?.imageUrl && String(raw.imageUrl).trim()) ||
      placeholderAvatar,

    saved: false,
    met: false,
    skipped: false,
  }
}

async function fetchMatches() {
  const pid = participantId()
  if (!pid || !eventId.value) return

  loading.value = true
  errorMsg.value = ''

  try {
    const matchUrl = buildMatchApiUrl(`/api/match/${eventId.value}/${pid}`)
    const savedUrl = buildApiUrl(`/api/eventParticipants/${pid}/saved?eventId=${eventId.value}`)
    const metUrl = buildApiUrl(`/api/eventParticipants/${pid}/met?eventId=${eventId.value}`)
    const skippedUrl = buildApiUrl(`/api/eventParticipants/${pid}/skipped?eventId=${eventId.value}`)
    

    console.log("matchUrl:", matchUrl)
    console.log("savedUrl:", savedUrl)
    console.log("metUrl:", metUrl)
    console.log("skippedUrl:", skippedUrl)

    const matchRes = await fetch(matchUrl)
    console.log("matchRes status:", matchRes.status)
    if (!matchRes.ok) {
      const txt = await matchRes.text()
      throw new Error(`match failed: ${matchRes.status} - ${txt}`)
    }

    const savedRes = await fetch(savedUrl)
    console.log("savedRes status:", savedRes.status)
    if (!savedRes.ok) {
      const txt = await savedRes.text()
      throw new Error(`saved failed: ${savedRes.status} - ${txt}`)
    }

    const metRes = await fetch(metUrl)
    console.log("metRes status:", metRes.status)
    if (!metRes.ok) {
      const txt = await metRes.text()
      throw new Error(`met failed: ${metRes.status} - ${txt}`)
    }

    const skippedRes = await fetch(skippedUrl)
    console.log("skippedRes status:", skippedRes.status)
    if (!skippedRes.ok) {
      const txt = await skippedRes.text()
      throw new Error(`skipped failed: ${skippedRes.status} - ${txt}`)
    }

    const [matchData, savedData, metData, skippedData] = await Promise.all([
      matchRes.json(),
      savedRes.json(),
      metRes.json(),
      skippedRes.json(),
    ])

    const savedIds = new Set(((savedData?.saved) || []).map(String))
    const metIds = new Set(((metData?.met) || []).map(String))
    const skippedIds = new Set(((skippedData?.skipped) || []).map(String))

    const rawMatches = normalizeResponse(matchData)

const filteredRawMatches = rawMatches.filter(
  raw => String(raw?.matchId || raw?.id) !== String(pid)
  
)
      console.log("rawMatches:", rawMatches)
console.log("filteredRawMatches:", filteredRawMatches)
console.log("first shown match:", filteredRawMatches[0])
console.log("first shown explanation:", filteredRawMatches[0]?.explanation)

    matches.value = filteredRawMatches.map(raw => {
      const m = toUiMatch(raw)
      return {
        ...m,
        saved: savedIds.has(String(m.id)),
        met: metIds.has(String(m.id)),
        skipped: skippedIds.has(String(m.id)),
      }
    })
  } catch (e) {
    console.error("fetchMatches error:", e)
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
  [...matches.value]
    .filter(m => !m.skipped)
    .sort((a, b) => (b.matchPercent ?? 0) - (a.matchPercent ?? 0))
)

const filteredMatches = computed(() => {
  if (!filterValue.value.trim()) return sortedMatches.value

  const q = filterValue.value.toLowerCase().trim()

  return sortedMatches.value.filter((m) => {
    if (filterType.value === 'name') {
      return getName(m).toLowerCase().includes(q)
    }

    if (filterType.value === 'freeText') {
      return getWhy(m).toLowerCase().includes(q)
    }

    return true
  })
})

async function save(m) {
  const pid = participantId()

  try {
 const url = buildApiUrl(`/api/eventParticipants/${pid}/save/${m.id}?eventId=${eventId.value}`)

    const res = await fetch(url, {
      method: m.saved ? 'DELETE' : 'POST'
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
 const url = buildApiUrl(`/api/eventParticipants/${pid}/met/${m.id}?eventId=${eventId.value}`)
    const res = await fetch(url, {
      method: m.met ? 'DELETE' : 'POST'
    })

    if (!res.ok) throw new Error(`API error: ${res.status}`)

    m.met = !m.met
  } catch (e) {
    errorMsg.value = e?.message || 'Met failed'
  }
}

async function skip(m) {
  const pid = participantId()

  try {
    const url = buildApiUrl(`/api/eventParticipants/${pid}/skipped/${m.id}?eventId=${eventId.value}`)

    const res = await fetch(url, {
      method: m.skipped ? 'DELETE' : 'POST'
    })

    if (!res.ok) throw new Error(`API error: ${res.status}`)

    m.skipped = !m.skipped

    if (m.skipped) {
      matches.value = matches.value.filter(x => x.id !== m.id)
    }
  } catch (e) {
    errorMsg.value = e?.message || 'Skip failed'
  }
}

function onAvatarError(e) {
  e.target.src = placeholderAvatar
}
</script>

<style scoped>
.matches-page {
  min-height: 100vh;
  background: #f5f6f4;
  color: #45545a;
  font-family: Arial, sans-serif;
}

.matches-wrap {
  max-width: 920px;
  margin: 0 auto;
  padding: 18px 18px 40px;
}

.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 18px 0 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid #d9ddd9;
}



:dir(rtl) .page-head {
  text-align: right;
}

.title-box {
  min-width: 0;
}
.head-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-inline-start: auto;
  position: relative;
}

:dir(rtl) .head-actions {
  flex-direction: row-reverse;
}

.modern-title-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modern-page-title {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 25px;
  font-weight: 800;
  color: #355f4a;
  letter-spacing: 0.2px;
  position: relative;
}

.modern-page-title::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 11%;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, #8fb89c, #5f8d70);
  opacity: 0.95;
}

:dir(rtl) .modern-page-title::after {
  left: auto;
  right: 0;
}

.title-icon {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: linear-gradient(135deg, #eef6f0, #dceadf);
  box-shadow: 0 8px 20px rgba(80, 120, 96, 0.14);
  font-size: 18px;
  flex-shrink: 0;
}

.modern-page-subtitle {
  margin: 10px 0 0;
  font-size: 15px;
  color: #7c8b84;
  font-weight: 600;
}

.language-box {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  background: linear-gradient(135deg, #eef8f2 0%, #e3f2e8 100%);
  border: 1px solid rgba(95, 159, 127, 0.25);

  border-radius: 999px;
  padding: 7px 12px;

  box-shadow:
    0 4px 10px rgba(47, 107, 79, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);

  transition: all 0.2s ease;
}

.language-icon {
  font-size: 15px;
  line-height: 1;
}

.language-select {
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 14px;
  color: #5a666b;
  cursor: pointer;
}
.filters-bar {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-bottom: 0;
}

.filters-toggle {
  border: 1px solid rgba(95, 159, 127, 0.25);
  background: linear-gradient(135deg, #eef8f2 0%, #e3f2e8 100%);
  color: #355f4a;

  border-radius: 999px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 700;

  box-shadow:
    0 4px 10px rgba(47, 107, 79, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);

  cursor: pointer;
  transition: all 0.2s ease;
}

.filters-toggle:hover {
  background: #eef3ee;
}
  .filters-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
}

.filters-submit {
  border: 1px solid #8fb89c;
  background: #8fb89c;
  color: #ffffff;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.filters-submit:hover {
  background: #7aa889;
  border-color: #7aa889;
}

.filters-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  width: 320px;
  background: #ffffff;
  border: 1px solid #d8ddd8;
  border-radius: 16px;
  padding: 14px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  z-index: 20;
  box-sizing: border-box;
}

:dir(rtl) .filters-dropdown {
  left: auto;
  right: 0;
}

.filters-select,
.filters-input {
  display: block;
  width: 100%;
  max-width: 100%;
  height: 42px;
  border: 1px solid #d3d9d3;
  border-radius: 12px;
  padding: 0 30px 0 10px;
  font-size: 14px;
  color: #4f5f65;
  background: #fafbf9;
  margin-bottom: 10px;
  outline: none;
  box-sizing: border-box;
}

.filters-select:focus,
.filters-input:focus {
  border-color: #8fb89c;
  background: #ffffff;
}

.filters-actions {
  display: flex;
  justify-content: flex-end;
}

.filters-clear {
  border: 1px solid #cfd6cf;
  background: #ffffff;
  color: #56656a;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.filters-clear:hover {
  background: #eef3ee;
}
.matches-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.match-card {
  background: #ffffff;
  border: 1px solid #d8ddd8;
  border-radius: 16px;
  padding: 18px 18px 14px;
  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.06);
}

.match-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

:dir(rtl) .match-top {
  flex-direction: row-reverse;
}
.avatar-side {
  width: 80px;
  min-width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.match-avatar {
  width: 60px;
  height: 60px;
}

.match-score {
  margin-top: -6px;
  font-size: 11px;
  padding: 5px 8px;
}


.match-main {
  flex: 1;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

:dir(rtl) .name-row {
  justify-content: flex-start;
}

.match-name {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #4f5f65;
}

.best-badge {
  display: inline-flex;
  align-items: center;
  background: #8fb89c;
  color: #ffffff;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
}


.why-title {
  margin-bottom: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #6c8778;
}

  .why-section {
  width: 100%;
  min-width: 0;
}

.why-text {
  width: 100%;
  max-width: 100%;
}

.avatar-side {
  width: 132px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2px;
}

.match-avatar {
  width: 92px;
  height: 92px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #f2f2ef;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
}

.match-score {
  margin-top: -8px;
  background: #6f9979;
  color: #ffffff;
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.16);
}

.ltrNum {
  direction: ltr;
  unicode-bidi: embed;
}

.status-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #e3e7e2;
}

.status-pill {
  background: #f3f6f3;
  border: 1px solid #d7ddd8;
  color: #536268;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 13px;
  font-weight: 600;
}

.actions-row {
  display: flex;
  justify-content: center;
  margin-top: 14px;
  border-top: 1px solid #e3e7e2;
  padding-top: 12px;
  gap: 0;
}

.action-btn {
  min-width: 96px;
  height: 34px;
  padding: 0 16px;
  border: 1px solid #cfd6cf;
  background: #ffffff;
  color: #58666b;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.action-btn:first-child {
  border-radius: 999px 0 0 999px;
}

.action-btn:last-child {
  border-radius: 0 999px 999px 0;
}

:dir(rtl) .action-btn:first-child {
  border-radius: 0 999px 999px 0;
}

:dir(rtl) .action-btn:last-child {
  border-radius: 999px 0 0 999px;
}

.action-btn + .action-btn {
  border-inline-start: 0;
}

.save-btn {
  background: #dfe9df;
}

.met-btn,
.skip-btn {
  background: #fafaf8;
}

.action-btn:hover {
  background: #eef3ee;
}

.refresh-row {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.refresh-btn {
  border: 1px solid #cfd6cf;
  background: #ffffff;
  color: #56656a;
  border-radius: 999px;
  padding: 9px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.refresh-btn:hover {
  background: #eef3ee;
}

.state-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #d8ddd8;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.05);
}

.state-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #eef3ee;
  font-size: 18px;
}

.state-title {
  font-size: 16px;
  font-weight: 700;
  color: #506066;
}

.state-sub {
  margin-top: 4px;
  font-size: 14px;
  color: #6f7d82;
}
.filters-top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filters-top .filters-select {
  margin-bottom: 10px;
  flex: 1;
}

.filters-close {
  width: 38px;
  height: 38px;
  margin-bottom: 10px;
  border: 1px solid #d3d9d3;
  border-radius: 12px;
  background: #ffffff;
  color: #56656a;
  font-size: 18px;
  cursor: pointer;
  flex-shrink: 0;
}

.filters-close:hover {
  background: #eef3ee;
}
@media (max-width: 700px) {
  .matches-wrap {
    max-width: 100%;
    padding: 8px 8px 20px;
  }

  .page-head {
    align-items: stretch;
    flex-direction: column;
    gap: 10px;
    margin: 10px 0 12px;
    padding-bottom: 10px;
  }

  .modern-page-title {
    font-size: 20px;
  }

  .modern-page-subtitle {
    margin-top: 6px;
    font-size: 12px;
  }

  .head-actions {
    width: 100%;
    justify-content: space-between;
    margin-inline-start: 0;
    gap: 8px;
  }

  .filters-toggle {
    min-height: 38px;
    padding: 8px 12px;
    font-size: 13px;
  }

  .language-box {
    min-height: 38px;
    padding: 6px 10px;
    gap: 6px;
  }

  .language-select {
    font-size: 13px;
  }

  .filters-dropdown {
    width: 100%;
    min-width: 0;
    left: 0;
    right: auto;
    padding: 12px;
    border-radius: 14px;
  }

  :dir(rtl) .filters-dropdown {
    right: 0;
    left: auto;
  }

  .filters-select,
  .filters-input {
    height: 38px;
    font-size: 13px;
    padding: 0 10px;
  }

  .filters-clear {
    padding: 7px 12px;
    font-size: 12px;
  }

  .matches-list {
    gap: 12px;
  }

  .match-card {
    padding: 12px 10px 10px;
    border-radius: 14px;
  }

  .match-top {
    align-items: flex-start;
    gap: 8px;
  }

  :dir(rtl) .match-top {
    flex-direction: row-reverse;
  }

  .match-main {
    flex: 1;
    min-width: 0;
  }

  .name-row {
    margin-bottom: 8px;
    gap: 5px;
  }

  .match-name {
    font-size: 15px;
    line-height: 1.25;
  }

  .best-badge {
    font-size: 9px;
    padding: 3px 7px;
  }

  .why-section {
    width: 100%;
    text-align: start;
  }

  .why-title {
    margin-bottom: 4px;
    font-size: 13px;
  }

  .why-text {
    width: 100%;
    max-width: none;
    font-size: 12px;
    line-height: 1.55;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .avatar-side {
    width: 68px;
    min-width: 68px;
    padding-top: 0;
    gap: 4px;
  }

  .match-avatar {
    width: 54px;
    height: 54px;
    border-width: 2px;
  }

  .match-score {
    margin-top: -4px;
    font-size: 10px;
    padding: 5px 8px;
    white-space: nowrap;
  }

  .status-row {
    margin-top: 10px;
    padding-top: 8px;
    gap: 5px;
  }

  .status-pill {
    font-size: 11px;
    padding: 4px 7px;
  }

  .actions-row {
    margin-top: 10px;
    padding-top: 8px;
  }

  .action-btn {
    min-width: 0;
    flex: 1;
    height: 34px;
    padding: 0 6px;
    font-size: 12px;
  }

  .refresh-row {
    margin-top: 4px;
  }

  .refresh-btn {
    width: 100%;
    max-width: 180px;
    padding: 8px 12px;
    font-size: 13px;
  }

  .state-box {
    padding: 12px 10px;
    border-radius: 12px;
  }

  .state-icon {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .state-title {
    font-size: 14px;
  }

  .state-sub {
    font-size: 12px;
  }
}
  /* הקטנת השורה של שפה + פילטר */
.head-actions {
  width: 100%;
  display: flex;
  gap: 6px;
}

/* הפילטר */
.filters-toggle {
  padding: 6px 10px;
  font-size: 12px;
  height: 34px;
}

.language-box {
  padding: 3px 6px;
  gap: 3px;
  height: 30px;
}

.language-select {
  font-size: 11px;
}

.language-icon {
  font-size: 11px;
}
  .head-actions {
  display: flex;
}

.head-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* ===== LTR (אנגלית) ===== */
:dir(ltr) .filters-bar {
  order: 1; /* שמאל */
}

:dir(ltr) .language-box {
  order: 2; /* ימין */
}

/* ===== RTL (עברית / ערבית) ===== */
:dir(rtl) .filters-bar {
  order: 2; /* ימין */
}

:dir(rtl) .language-box {
  order: 1; /* שמאל */
}
.filters-close {
  width: 36px;
  height: 36px;
  font-size: 16px;
}


</style>
