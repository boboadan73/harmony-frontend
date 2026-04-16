<template>
  <div class="matches-page" :dir="isRtl ? 'rtl' : 'ltr'">
    <TopNav :lang="lang" :pid="pid || 'new'" />

    <main class="matches-wrap">
      <section class="page-head">
        <div class="title-box">
          <h1 class="page-title">{{ t.title }}</h1>
          <p class="page-subtitle">{{ t.subtitle }}</p>
        </div>

        <div class="language-box">
          <span class="language-icon" aria-hidden="true">🌐</span>
          <select class="language-select" v-model="lang">
            <option value="en">English</option>
            <option value="ar">Arabic</option>
            <option value="he">Hebrew</option>
          </select>
        </div>
      </section>

      <div class="card">
        <div class="cardGlow" aria-hidden="true"></div>

        <div class="topProfileRow">
          <div class="profileAvatarWrap">
            <img
              class="profileAvatar"
              :src="profileAvatar"
              alt="Profile avatar"
              @error="onAvatarError"
            />
          </div>

          <div class="actionsWrap">
            <button v-if="!isEditing" class="btn" @click="startEdit">
              {{ t.edit }}
            </button>

            <template v-else>
              <button class="btn" :disabled="saving" @click="saveProfile">
                {{ saving ? t.saving : t.save }}
              </button>
              <button class="btnOutline" :disabled="saving" @click="cancelEdit">
                {{ t.cancel }}
              </button>
            </template>
          </div>
        </div>

        <div v-if="loading" class="statusText">{{ t.loading }}</div>
        <div v-else-if="errorMsg" class="statusText errorText">{{ errorMsg }}</div>

        <template v-else>
          <div class="fieldsGrid">
            <div class="fieldBlock">
              <label class="fieldLabel">{{ t.name }}</label>
              <input
                v-if="isEditing"
                v-model="form.name"
                class="input"
                type="text"
              />
              <div v-else class="fieldValue">{{ profile.name || t.empty }}</div>
            </div>

            <div class="fieldBlock">
              <label class="fieldLabel">{{ t.phone }}</label>
              <input
                v-if="isEditing"
                v-model="form.phone"
                class="input ltrNum"
                type="text"
              />
              <div v-else class="fieldValue ltrNum">{{ profile.phone || t.empty }}</div>
            </div>

            <div class="fieldBlock">
              <label class="fieldLabel">{{ t.job }}</label>
              <input
                v-if="isEditing"
                v-model="form.job"
                class="input"
                type="text"
              />
              <div v-else class="fieldValue">{{ profile.job || t.empty }}</div>
            </div>

            <div class="fieldBlock">
              <label class="fieldLabel">{{ t.image }}</label>
              <input
                v-if="isEditing"
                v-model="form.image"
                class="input ltrNum"
                type="text"
              />
              <div v-else class="fieldValue breakAll">{{ profile.image || t.empty }}</div>
            </div>

            <div class="fieldBlock fullWidth">
              <label class="fieldLabel">{{ t.academic }}</label>
              <textarea
                v-if="isEditing"
                v-model="form.academic"
                class="textarea"
                rows="5"
              />
              <div v-else class="fieldValue multiline">{{ profile.academic || t.empty }}</div>
            </div>

            <div class="fieldBlock fullWidth">
              <label class="fieldLabel">{{ t.professional }}</label>
              <textarea
                v-if="isEditing"
                v-model="form.professional"
                class="textarea"
                rows="5"
              />
              <div v-else class="fieldValue multiline">{{ profile.professional || t.empty }}</div>
            </div>

            <div class="fieldBlock fullWidth">
              <label class="fieldLabel">{{ t.personal }}</label>
              <textarea
                v-if="isEditing"
                v-model="form.personal"
                class="textarea"
                rows="5"
              />
              <div v-else class="fieldValue multiline">{{ profile.personal || t.empty }}</div>
            </div>
          </div>

          <div v-if="!isNewParticipant" class="privacyCard">
            <div class="privacyTitle">{{ t.privacyTitle }}</div>
            <div class="privacyText">
              {{ profile.hidden ? t.hiddenNow : t.visibleNow }}
            </div>

            <div class="privacyActions">
              <button class="btnOutline" :disabled="savingPrivacy" @click="togglePrivacy">
                {{
                  savingPrivacy
                    ? t.saving
                    : profile.hidden
                    ? t.unhideProfile
                    : t.hideProfile
                }}
              </button>

              <button class="btnDanger" :disabled="deleting" @click="deleteMyData">
                {{ deleting ? t.deleting : t.deleteMyData }}
              </button>
            </div>
          </div>

          <div v-if="successMsg" class="statusText successText">
            {{ successMsg }}
          </div>
        </template>
      </div>

      <div class="spacerBottom"></div>
    </main>

    <div v-if="showGeneratePopup" class="popupOverlay">
      <div class="popupCard">
        <h3 class="popupTitle">{{ t.generateRequiredTitle }}</h3>
        <p class="popupText">{{ t.generateRequiredText }}</p>

        <button
          class="generateBtn"
          :disabled="generating"
          @click="generateMatches"
        >
          {{ generating ? t.generating : t.generateNow }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { buildSystemApiUrl, buildMatchApiUrl } from '@/services/api'

import defaultAvatar from '@/assets/default-avatar.png'
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import TopNav from '@/components/TopNav.vue'
                  
const route = useRoute()

const eventId = computed(() =>
  String(route.params.eventId || localStorage.getItem('harmony_eventId') || '').trim()
)
const isNewParticipant = computed(() => String(route.params.id || '').trim() === 'new')
const pid = computed(() => {
  const routeId = String(route.params.id || '').trim()

  if (routeId === 'new') return ''

  return String(routeId || localStorage.getItem('harmony_pid') || '').trim()
})

watch(
  pid,
  v => {
    if (v) localStorage.setItem('harmony_pid', v)
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

const LANG_KEY = 'harmony_lang'
const lang = ref(localStorage.getItem(LANG_KEY) || 'en')
watch(lang, v => localStorage.setItem(LANG_KEY, v), { immediate: true })

const TEXTS = {
  en: {
    title: 'Profile',
    subtitle: 'View and edit your personal information',
    loading: 'Loading profile...',
    edit: 'Edit',
    save: 'Save',
    saving: 'Saving...',
    cancel: 'Cancel',
    deleting: 'Deleting...',
    name: 'Name',
    phone: 'Phone',
    job: 'Job',
    image: 'Image URL',
    academic: 'Academic Background',
    professional: 'Professional Background',
    personal: 'Personal Background',
    empty: 'No data',
    privacyTitle: 'Privacy Controls',
    visibleNow: 'Your profile is currently visible to others.',
    hiddenNow: 'Your profile is currently hidden from others.',
    hideProfile: 'Hide Profile',
    unhideProfile: 'Show Profile',
    deleteMyData: 'Delete My Data',
    deleteConfirm: 'Are you sure you want to remove your information?',
    saveSuccess: 'Profile updated successfully.',
    privacyUpdated: 'Privacy updated successfully.',
    deleteSuccess: 'Your data was removed successfully.',
    loadError: 'Failed to load profile.',
    generate: 'Generate Matches',
    generating: 'Generating...',
    generateRequiredTitle: 'Generate Matches Required',
    generateRequiredText: 'Your profile was saved successfully. You must now generate matches to update your recommendations.',
    generateNow: 'Generate Now',
    generateSuccess: 'Matches generated successfully.',
    generateError: 'Failed to generate matches.',
              
  },
  ar: {
    title: 'الملف الشخصي',
    subtitle: 'عرض وتعديل معلوماتك الشخصية',
    loading: 'جاري تحميل الملف...',
    edit: 'تعديل',
    save: 'حفظ',
    saving: 'جارٍ الحفظ...',
    cancel: 'إلغاء',
    deleting: 'جارٍ الحذف...',
    name: 'الاسم',
    phone: 'رقم الهاتف',
    job: 'العمل',
    image: 'رابط الصورة',
    academic: 'الخلفية الأكاديمية',
    professional: 'الخلفية المهنية',
    personal: 'نبذة شخصية',
    empty: 'لا توجد بيانات',
    privacyTitle: 'إعدادات الخصوصية',
    visibleNow: 'ملفك الشخصي ظاهر للآخرين حالياً.',
    hiddenNow: 'ملفك الشخصي مخفي عن الآخرين حالياً.',
    hideProfile: 'إخفاء الملف',
    unhideProfile: 'إظهار الملف',
    deleteMyData: 'حذف بياناتي',
    deleteConfirm: 'هل أنت متأكد أنك تريد حذف معلوماتك؟',
    saveSuccess: 'تم تحديث الملف بنجاح.',
    privacyUpdated: 'تم تحديث الخصوصية بنجاح.',
    deleteSuccess: 'تم حذف بياناتك بنجاح.',
    loadError: 'فشل تحميل الملف.',
     generate: 'إنشاء المطابقات',
    generating: 'جارٍ إنشاء المطابقات...',
    generateRequiredTitle: 'يجب إنشاء المطابقات',
   generateRequiredText: 'تم حفظ الملف بنجاح. يجب الآن إنشاء المطابقات لتحديث التوصيات.',
   generateNow: 'إنشاء الآن',
   generateSuccess: 'تم إنشاء المطابقات بنجاح.',
   generateError: 'فشل إنشاء المطابقات.',
  },
  he: {
    title: 'פרופיל',
    subtitle: 'צפייה ועריכה של המידע האישי שלך',
    loading: 'טוען פרופיל...',
    edit: 'עריכה',
    save: 'שמור',
    saving: 'שומר...',
    cancel: 'ביטול',
    deleting: 'מוחק...',
    name: 'שם',
    phone: 'טלפון',
    job: 'תפקיד',
    image: 'קישור לתמונה',
    academic: 'רקע אקדמי',
    professional: 'רקע מקצועי',
    personal: 'רקע אישי',
    empty: 'אין נתונים',
    privacyTitle: 'בקרות פרטיות',
    visibleNow: 'הפרופיל שלך כרגע גלוי לאחרים.',
    hiddenNow: 'הפרופיל שלך כרגע מוסתר מאחרים.',
    hideProfile: 'הסתר פרופיל',
    unhideProfile: 'הצג פרופיל',
    deleteMyData: 'מחק את המידע שלי',
    deleteConfirm: 'בטוחה שברצונך למחוק את המידע שלך?',
    saveSuccess: 'הפרופיל עודכן בהצלחה.',
    privacyUpdated: 'הפרטיות עודכנה בהצלחה.',
    deleteSuccess: 'המידע שלך נמחק בהצלחה.',
    loadError: 'טעינת הפרופיל נכשלה.',
    generate: 'צור התאמות מחדש',
    generating: 'מחשב התאמות...',
   generateRequiredTitle: 'חובה ליצור התאמות מחדש',
  generateRequiredText: 'הפרופיל נשמר בהצלחה. עכשיו חייבים ליצור התאמות מחדש כדי לעדכן את ההמלצות.',
  generateNow: 'צור עכשיו',
  generateSuccess: 'ההתאמות נוצרו בהצלחה.',
   generateError: 'יצירת ההתאמות נכשלה.',
  },
}

const t = computed(() => TEXTS[lang.value] ?? TEXTS.en)
const isRtl = computed(() => lang.value === 'ar' || lang.value === 'he')

const loading = ref(false)
const saving = ref(false)
const savingPrivacy = ref(false)
const deleting = ref(false)
const isEditing = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const imageVersion = ref(Date.now())
const generating = ref(false)
const showGeneratePopup = ref(false)

const profile = ref({
  id: '',
  name: '',
  phone: '',
  job: '',
  academic: '',
  professional: '',
  personal: '',
  image: '',
  hidden: false,
})

const form = ref({
  name: '',
  phone: '',
  job: '',
  academic: '',
  professional: '',
  personal: '',
  image: '',
})

const profileAvatar = computed(() => {
  const imageUrl = isEditing.value
    ? (form.value.image || profile.value.image)
    : profile.value.image

  if (!imageUrl) return defaultAvatar

  return `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}t=${imageVersion.value}`
})

function onAvatarError(event) {
  event.target.src = defaultAvatar
}

function fillFormFromProfile() {
  form.value = {
    name: profile.value.name || '',
    phone: profile.value.phone || '',
    job: profile.value.job || '',
    academic: profile.value.academic || '',
    professional: profile.value.professional || '',
    personal: profile.value.personal || '',
    image: profile.value.image || '',
  }
}
async function loadProfile() {
  if (isNewParticipant.value) {
    profile.value = {
      id: '',
      name: '',
      phone: '',
      job: '',
      academic: '',
      professional: '',
      personal: '',
      image: '',
      hidden: false,
    }

    fillFormFromProfile()
    imageVersion.value = Date.now()
    isEditing.value = true
    loading.value = false
    errorMsg.value = ''
    successMsg.value = ''
    return
  }

  if (!pid.value) return

  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const res = await fetch(
  buildSystemApiUrl(`/api/eventParticipants/${pid.value}?eventId=${eventId.value}`)
)
    if (!res.ok) throw new Error('load failed')

    const data = await res.json()
    profile.value = {
      id: data.id || '',
      name: data.name || '',
      phone: data.phoneNumber || '',
      job: data.jobTitle || '',
      academic: data.academicResume || '',
      professional: data.professionalResume || '',
      personal: data.personalResume || '',
      image: data.photoUrl || '',
      hidden: Boolean(data.hidden),
    }

    fillFormFromProfile()
    imageVersion.value = Date.now()
  } catch (error) {
    errorMsg.value = t.value.loadError
  } finally {
    loading.value = false
  }
}
function startEdit() {
  successMsg.value = ''
  errorMsg.value = ''
  fillFormFromProfile()
  imageVersion.value = Date.now()
  isEditing.value = true
}

function cancelEdit() {
  fillFormFromProfile()
  imageVersion.value = Date.now()
  isEditing.value = false
}

watch(
  () => form.value.image,
  () => {
    imageVersion.value = Date.now()
  }
)
async function saveProfile() {
  saving.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    if (!form.value.name.trim() || !form.value.phone.trim()) {
      throw new Error('Name and phone are required')
    }

    const isNew = isNewParticipant.value

  const url = isNew
  ? buildSystemApiUrl('/api/eventParticipants')
  : buildSystemApiUrl(`/api/eventParticipants/${pid.value}?eventId=${eventId.value}`)

    const method = isNew ? 'POST' : 'PUT'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({
  eventId: eventId.value,
  name: form.value.name,
  phoneNumber: form.value.phone,
  jobTitle: form.value.job,
  academicResume: form.value.academic,
  professionalResume: form.value.professional,
  personalResume: form.value.personal,
  photoUrl: form.value.image,
}),
    })

    const text = await res.text()

    if (!res.ok) {
      throw new Error(`Save failed: ${res.status} ${text}`)
    }

    const data = text ? JSON.parse(text) : {}
    const participant = data.participant || data || {}

    profile.value = {
      id: participant.id || '',
      name: participant.name || '',
      phone: participant.phoneNumber || '',
job: participant.jobTitle || '',
academic: participant.academicResume || '',
professional: participant.professionalResume || '',
personal: participant.personalResume || '',
image: participant.photoUrl || '',
      hidden: Boolean(participant.hidden),
    }

   fillFormFromProfile()
imageVersion.value = Date.now()
isEditing.value = false
successMsg.value = t.value.saveSuccess

localStorage.setItem('harmony_profile_updated_at', String(Date.now()))
localStorage.setItem('harmony_matches_refresh_needed', '1')

showGeneratePopup.value = true

    if (participant.id) {
  const cleanId = String(participant.id).replace(/^p/, '')
  localStorage.setItem('harmony_pid', cleanId)
}
  } catch (error) {
    errorMsg.value = error?.message || 'Save failed'
  } finally {
    saving.value = false
  }
}
async function generateMatches() {
  generating.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const currentEventId = String(eventId.value || '').trim()
    const participantDocId = String(profile.value.id || '').trim()

    if (!currentEventId) {
      throw new Error('Missing eventId')
    }

    if (!participantDocId) {
      throw new Error('Missing participant id')
    }

    const route = isNewParticipant.value
      ? `/api/match/add/${currentEventId}/${participantDocId}`
      : `/api/match/update/${currentEventId}/${participantDocId}`

    const res = await fetch(buildMatchApiUrl(route), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    const text = await res.text()
    const data = text ? JSON.parse(text) : {}

    if (!res.ok) {
      throw new Error(data?.error || data?.message || `Generate failed: ${res.status}`)
    }

    successMsg.value = t.value.generateSuccess
    showGeneratePopup.value = false
    localStorage.setItem('harmony_matches_refresh_needed', '1')

    const cleanId = participantDocId.replace(/^p/, '')
    localStorage.setItem('harmony_pid', cleanId)
    window.location.href = `/event/${currentEventId}/matches/${cleanId}`
  } catch (error) {
    errorMsg.value = error?.message || t.value.generateError
  } finally {
    generating.value = false
  }
}
async function togglePrivacy() {
  savingPrivacy.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const res = await fetch(buildSystemApiUrl(`/api/eventParticipants/${pid.value}/privacy?eventId=${eventId.value}`), {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    hidden: !profile.value.hidden,
    eventId: eventId.value
  }),
})

    if (!res.ok) throw new Error('privacy failed')

    const data = await res.json()
    profile.value = {
      ...profile.value,
      ...(data.participant || {}),
    }

    successMsg.value = t.value.privacyUpdated
  } catch (error) {
    errorMsg.value = error?.message || 'Privacy update failed'
  } finally {
    savingPrivacy.value = false
  }
}

async function deleteMyData() {
  const ok = window.confirm(t.value.deleteConfirm)
  if (!ok) return

  deleting.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const res = await fetch(buildSystemApiUrl(`/api/eventParticipants/${pid.value}?eventId=${eventId.value}`), {
  method: 'DELETE',
})

    if (!res.ok) throw new Error('delete failed')

    const data = await res.json()
    profile.value = {
      ...profile.value,
      ...(data.participant || {}),
    }

    fillFormFromProfile()
    imageVersion.value = Date.now()
    isEditing.value = false
    successMsg.value = t.value.deleteSuccess
    localStorage.setItem('harmony_matches_refresh_needed', '1')
  } catch (error) {
    errorMsg.value = error?.message || 'Delete failed'
  } finally {
    deleting.value = false
  }
}

onMounted(loadProfile)
watch(pid, loadProfile, { immediate: true })
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

.page-title {
  margin: 0 0 16px 0;
  font-size: 34px;
  font-weight: 700;
  color: #3b5d5a;
  position: relative;
}

.page-title::after {
  content: "";
  display: block;
  width: 70px;
  height: 5px;
  margin-top: 10px;
  border-radius: 3px;
  background: #7fb49a;
}

.page-subtitle {
  margin: 10px 0 0;
  font-size: 15px;
  font-weight: 500;
  color: #7f8c91;
}

.language-box {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f8f8f6;
  border: 1px solid #d7dbd6;
  border-radius: 999px;
  padding: 7px 12px;
}

.language-icon {
  font-size: 15px;
}

.language-select {
  border: none;
  background: transparent;
  font-size: 14px;
  cursor: pointer;
}

/* ===== CARD ===== */

.card {
  border-radius: 16px;
  padding: 18px;
  background: #ffffff;
  border: 1px solid #d8ddd8;
  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.06);
}

.cardGlow {
  display: none;
}

/* ===== PROFILE TOP ===== */

.topProfileRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

.profileAvatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.actionsWrap {
  display: flex;
  gap: 10px;
}

/* ===== FIELDS ===== */

.fieldsGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.fieldBlock {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fullWidth {
  grid-column: 1 / -1;
}

.fieldLabel {
  font-weight: 700;
}

.fieldValue,
.input,
.textarea {
  border-radius: 10px;
  background: #f3f6f3;
  border: 1px solid #d7ddd8;
  padding: 10px;
  font-size: 14px;
}

.textarea {
  min-height: 100px;
  resize: vertical;
}

/* ===== BUTTONS ===== */

.btn,
.btnOutline {
  min-width: 120px;
  height: 36px;
  border: 1px solid #cfd6cf;
  background: #ffffff;
  color: #58666b;
  font-size: 14px;
  border-radius: 999px;
  cursor: pointer;
}

.btn:hover,
.btnOutline:hover {
  background: #eef3ee;
}

.btnDanger {
  border: 1px solid #e0b4b4;
  color: #a12626;
  background: #fff;
}

/* ===== PRIVACY ===== */

.privacyCard {
  margin-top: 18px;
  padding: 14px;
  border-radius: 12px;
  background: #f3f6f3;
  border: 1px solid #d7ddd8;
}

.privacyTitle {
  font-weight: 700;
  margin-bottom: 6px;
}

.privacyText {
  margin-bottom: 10px;
}

/* ===== STATUS ===== */

.statusText {
  margin-top: 10px;
  font-weight: 600;
}

.successText {
  color: #2f7d55;
}

.errorText {
  color: #c0392b;
}

/* ===== POPUP ===== */

.popupOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}

.popupCard {
  background: white;
  padding: 24px;
  border-radius: 16px;
  text-align: center;
  max-width: 360px;
}

.generateBtn {
  margin-top: 10px;
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid #cfd6cf;
  background: #eef3ee;
  cursor: pointer;
}

/* ===== MOBILE ===== */

@media (max-width: 700px) {
  .fieldsGrid {
    grid-template-columns: 1fr;
  }

  .topProfileRow {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
