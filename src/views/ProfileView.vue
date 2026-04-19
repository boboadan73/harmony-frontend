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
  <label class="fieldLabel">
    {{ t.name }} <span class="required">*</span>
  </label>

  <template v-if="isEditing">
    <input
      v-model="form.name"
      :class="['input', errors.name && 'error']"
      type="text"
      dir="auto"
    />
    <div v-if="errors.name" class="errorField">
      {{ errors.name }}
    </div>
  </template>

  <div v-else class="fieldValue" dir="auto">
    {{ profile.name || t.empty }}
  </div>
</div>
          

        <div class="fieldBlock">
  <label class="fieldLabel">
    {{ t.phone }} <span class="required">*</span>
  </label>

  <template v-if="isEditing">
    <input
      v-model="form.phone"
      :class="['input ltrNum', errors.phone && 'error']"
      type="text"
    />
    <div v-if="errors.phone" class="errorField">
      {{ errors.phone }}
    </div>
  </template>

  <div v-else class="fieldValue ltrNum">
    {{ profile.phone || t.empty }}
  </div>
</div>
          <div class="fieldBlock">
  <label class="fieldLabel">
    {{ t.job }} <span class="required">*</span>
  </label>

  <template v-if="isEditing">
    <input
      v-model="form.job"
      :class="['input', errors.job && 'error']"
      type="text"
      dir="auto"
    />
    <div v-if="errors.job" class="errorField">
      {{ errors.job }}
    </div>
  </template>

  <div v-else class="fieldValue" dir="auto">
    {{ profile.job || t.empty }}
  </div>
</div>
            <div class="fieldBlock">
              <label class="fieldLabel">{{ t.image }}</label>
              <input
                v-if="isEditing"
                v-model="form.image"
                class="input ltrNum"
                type="text"
                dir="auto"
              />
              <div v-else class="fieldValue breakAll ltrNum">{{ profile.image || t.empty }}</div>
            </div>
<div class="fieldBlock fullWidth">
  <label class="fieldLabel">
    {{ t.academic }} <span class="required">*</span>
  </label>

  <template v-if="isEditing">
    <textarea
      v-model="form.academic"
      :class="['textarea mixedInput', errors.academic && 'error']"
      rows="5"
      dir="auto"
    />></textarea>
    <div v-if="errors.academic" class="errorField">
      {{ errors.academic }}
    </div>
  </template>

  <div v-else class="fieldValue multiline mixedText" dir="auto">
    {{ formatMixedText(profile.academic || t.empty) }}
  </div>
</div>

<div class="fieldBlock fullWidth">
  <label class="fieldLabel">
    {{ t.professional }} <span class="required">*</span>
  </label>

  <template v-if="isEditing">
    <textarea
      v-model="form.professional"
      :class="['textarea mixedInput', errors.professional && 'error']"
      rows="5"
      dir="auto"
    />></textarea>
    <div v-if="errors.professional" class="errorField">
      {{ errors.professional }}
    </div>
  </template>

  <div v-else class="fieldValue multiline mixedText" dir="auto">
    {{ formatMixedText(profile.professional || t.empty) }}
  </div>
</div>
<div class="fieldBlock fullWidth">
  <label class="fieldLabel">
    {{ t.personal }} <span class="required">*</span>
  </label>

  <template v-if="isEditing">
    <textarea
      v-model="form.personal"
      :class="['textarea mixedInput', errors.personal && 'error']"
      rows="5"
      dir="auto"
    />></textarea>
    <div v-if="errors.personal" class="errorField">
      {{ errors.personal }}
    </div>
  </template>

  <div v-else class="fieldValue multiline mixedText" dir="auto">
    {{ formatMixedText(profile.personal || t.empty) }}
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
const errors = ref({
  name: '',
  phone: '',
  job: '',
  academic: '',
  professional: '',
  personal: '',
})

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
    required: 'is required',
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
    required: 'مطلوب',
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
    required: 'שדה חובה',
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
function isFormValid() {
  return (
    name.value.trim() &&
    job.value.trim() &&
    academicResume.value.trim() &&
    professionalResume.value.trim() &&
    personalResume.value.trim()
  )
}

function validateForm() {
  errors.value = {
    name: '',
    phone: '',
    job: '',
    academic: '',
    professional: '',
    personal: '',
  }

  let isValid = true

  if (!form.value.name.trim()) {
    errors.value.name = `${t.value.name} ${t.value.required}`
    isValid = false
  }

  if (!form.value.phone.trim()) {
    errors.value.phone = `${t.value.phone} ${t.value.required}`
    isValid = false
  }

  if (!form.value.job.trim()) {
    errors.value.job = `${t.value.job} ${t.value.required}`
    isValid = false
  }

  if (!form.value.academic.trim()) {
    errors.value.academic = `${t.value.academic} ${t.value.required}`
    isValid = false
  }

  if (!form.value.professional.trim()) {
    errors.value.professional = `${t.value.professional} ${t.value.required}`
    isValid = false
  }

  if (!form.value.personal.trim()) {
    errors.value.personal = `${t.value.personal} ${t.value.required}`
    isValid = false
  }

  return isValid
}
function onAvatarError(event) {
  event.target.src = defaultAvatar
}
function formatMixedText(value) {
  if (!value) return ''

  return String(value).replace(
    /([A-Za-z0-9][A-Za-z0-9\s.,:;()\-_/#+&]*[A-Za-z0-9]|[A-Za-z0-9])/g,
    '\u2068$1\u2069'
  )
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
 const isValid = validateForm()
      if (!isValid) return
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
  display: inline-flex;
  align-items: center;
  gap: 10px;

  margin: 0;
  font-size: 25px; /* כמו MATCHES */
  font-weight: 800;
  color: #355f4a;
  letter-spacing: 0.2px;

  position: relative;
}

.page-title::after {
  content: "";
  position: absolute;
  bottom: -10px;

  left: 0;
  width: 80%;
  height: 4px;

  border-radius: 999px;
  background: linear-gradient(90deg, #8fb89c, #5f8d70);
  opacity: 0.95;
}

:dir(rtl) .page-title::after {
  left: auto;
  right: 0;
}

.page-subtitle {
  margin: 10px 0 0;
  font-size: 15px;
  color: #7c8b84;
  font-weight: 600;
}

.language-box {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(95, 159, 127, 0.18);
  background: linear-gradient(135deg, #eef8f2 0%, #e3f2e8 100%);
  box-shadow:
    0 8px 20px rgba(47, 107, 79, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
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
  font-weight: 700;
  color: #355f4a;
  cursor: pointer;
  font-family: inherit;
  padding-inline-end: 4px;
}

/* ===== PROFILE CARD ===== */

.card {
  background: #ffffff;
  border: 1px solid #d8ddd8;
  border-radius: 16px;
  padding: 18px 18px 14px;
  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.06);
}

.cardGlow {
  display: none;
}
.required {
  color: #d93025;
  margin-left: 4px;
  font-weight: 700;
}

:dir(rtl) .required {
  margin-left: 0;
  margin-right: 4px;
}

.topProfileRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}

.profileAvatarWrap {
  width: 132px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profileAvatar {
  width: 92px;
  height: 92px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #f2f2ef;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
}

.actionsWrap {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
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
  gap: 8px;
}

.fullWidth {
  grid-column: 1 / -1;
}

.fieldLabel {
  font-size: 15px;
  font-weight: 700;
  color: #6c8778;
}

.fieldValue,
.input,
.textarea {
  border-radius: 12px;
  background: #fafbf9;
  border: 1px solid #d7ddd8;
  padding: 12px;
  color: #5c6a6f;
  font-size: 15px;

  
  line-height: 1.8;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;


  box-sizing: border-box;
}
.input,
.textarea {
  width: 100%;
  outline: none;
  font-family: inherit;
}

.input:focus,
.textarea:focus {
  border-color: #8fb89c;
  background: #ffffff;
}

.textarea {
  min-height: 120px;
  resize: vertical;
}
.errorField {
  color: #d93025;
  font-size: 12px;
  margin-top: 4px;
  font-weight: 600;
}

.textarea.error {
  border-color: #d93025;
  background: #fff5f5;
}

.multiline {
  white-space: pre-wrap;
  line-height: 1.6;
}
.mixedText {
  direction: inherit;
  text-align: start;
  unicode-bidi: plaintext;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
  line-height: 1.8;
}

.mixedInput {
  direction: inherit;
  text-align: start;
  unicode-bidi: plaintext;
}

.breakAll {
  word-break: break-all;
}

.ltrNum {
  direction: ltr;
  unicode-bidi: embed;
}

/* ===== PRIVACY ===== */

.privacyCard {
  margin-top: 18px;
  padding: 18px;
  background: #ffffff;
  border: 1px solid #d8ddd8;
  border-radius: 16px;
  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.05);
}

.privacyTitle {
  font-size: 16px;
  font-weight: 700;
  color: #506066;
  margin-bottom: 8px;
}

.privacyText {
  margin-bottom: 12px;
  color: #6f7d82;
  line-height: 1.55;
}

.privacyActions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* ===== STATUS ===== */

.statusText {
  margin-top: 12px;
  font-weight: 700;
}

.successText {
  color: #355f4a;
}

.errorText {
  color: #a12626;
}

/* ===== BUTTONS ===== */

.btn,
.btnOutline {
  min-width: 120px;
  height: 36px;
  padding: 0 16px;
  border: 1px solid #cfd6cf;
  background: #ffffff;
  color: #58666b;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 999px;
}

.btn:hover,
.btnOutline:hover {
  background: #eef3ee;
}

.btnDanger {
  min-width: 140px;
  height: 36px;
  padding: 0 16px;
  border: 1px solid #e0b4b4;
  background: #ffffff;
  color: #a12626;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 999px;
}

.btnDanger:hover {
  background: #f9f1f1;
}

.btn:disabled,
.btnOutline:disabled,
.btnDanger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== POPUP ===== */

.spacerBottom {
  height: 10px;
}

.popupOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.popupCard {
  width: 100%;
  max-width: 360px;
  background: #ffffff;
  border: 1px solid #d8ddd8;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
  text-align: center;
}

.popupTitle {
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 800;
  color: #355f4a;
}

.popupText {
  margin: 0 0 20px;
  color: #6f7d82;
  line-height: 1.6;
}

.generateBtn {
  min-width: 180px;
  height: 44px;
  padding: 0 24px;
  border: 1px solid #cfd6cf;
  background: #eef3ee;
  color: #56656a;
  font-size: 16px;
  font-weight: 700;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.generateBtn:hover {
  background: #e3ebe3;
  transform: translateY(-1px);
}

.generateBtn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* ===== MOBILE ===== */
@media (max-width: 700px) {

  .matches-wrap {
    max-width: 100%;
    padding: 10px 10px 24px;
  }

  /* ===== HEADER ===== */
  .page-head {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    margin: 10px 0 12px;
    padding-bottom: 10px;
  }

.page-title {
  font-size: 20px;
  padding-bottom: 10px;
  line-height: 1.3;
}

.page-title::after {
  bottom: 0;
  height: 3px;
  width: 58%;
}

.page-subtitle {
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.4;
}

  /* שפה */
 .language-box {
  align-self: flex-end;
  padding: 6px 12px;
}

:dir(rtl) .language-box {
  align-self: flex-start;
}

.language-select {
  font-size: 13px;
}

  /* ===== CARD ===== */
  .card {
    padding: 12px;
    border-radius: 14px;
  }

  /* ===== PROFILE TOP ===== */
  .topProfileRow {
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }

  .profileAvatarWrap {
    width: 90px;
  }

  .profileAvatar {
    width: 70px;
    height: 70px;
  }

  .actionsWrap {
    width: 100%;
    justify-content: center;
  }

  /* ===== FIELDS ===== */
  .fieldsGrid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .fieldLabel {
    font-size: 13px;
  }

  .input,
  .textarea,
  .fieldValue {
    font-size: 14px;
    padding: 10px;
  }

  .textarea {
    min-height: 90px;
  }

  /* ===== BUTTONS ===== */
  .btn,
  .btnOutline,
  .btnDanger {
    width: 100%;
    min-width: unset;
    height: 34px;
    font-size: 13px;
  }

  /* ===== PRIVACY ===== */
  .privacyCard {
    padding: 12px;
  }

  .privacyActions {
    flex-direction: column;
  }

  /* ===== POPUP ===== */
  .popupCard {
    max-width: 90%;
    padding: 18px;
  }

  .popupTitle {
    font-size: 18px;
  }

  .popupText {
    font-size: 13px;
  }

  .generateBtn {
    width: 100%;
    height: 40px;
    font-size: 14px;
  }
}
</style>
