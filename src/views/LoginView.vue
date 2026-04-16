<template>
  <div class="container">
    <div class="loginPage" :dir="isRtl ? 'rtl' : 'ltr'">
      <div class="loginCard">
        <!-- BRAND -->
        <div class="brand">
          <img class="brandLogo" src="@/assets/harmony-logo.png" alt="Harmony" />
          <h1 class="title">Harmony</h1>
        </div>

        <p class="subtitle">{{ t.subtitle }}</p>

        <!-- LANGUAGE -->
        <label class="label">{{ t.language }}</label>
        <div class="field">
          <select class="input selectInput" v-model="lang">
            <option value="en">English</option>
            <option value="ar">Arabic</option>
            <option value="he">Hebrew</option>
          </select>
          <span class="arrow">▾</span>
        </div>

        <!-- PHONE / ID -->
        <label class="label">{{ t.phone }}</label>
        <div class="field">
          <input
            v-model="phone"
            class="input phoneInput ltrNum"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            :placeholder="t.phonePlaceholder"
            @input="onPhoneInput"
            @keyup.enter="continueLogin"
          />
        </div>
        <p v-if="errorMessage" class="errorText">
  {{ errorMessage }}
</p>

        <p v-if="phoneTouched && phone.trim() && !isIdValid" class="errorText">
          {{ t.phoneError }}
        </p>

      <div class="policyBox">
  <div class="policyRow">
    <label class="checkboxWrapper">
      <input type="checkbox" v-model="acceptedPolicy" />
      <span class="customCheck"></span>
    </label>

    <span class="policyText">
      {{ t.agree }}
      <button type="button" class="linkBtn" @click.stop="openPrivacy">
        {{ t.privacy }}
      </button>
      &
      <button type="button" class="linkBtn" @click.stop="openTerms">
        {{ t.terms }}
      </button>
    </span>
  </div>
</div>

        <!-- BUTTONS -->
        <div class="btnBar">
  <button class="primaryBtn" :disabled="!phone || !acceptedPolicy" @click="continueLogin">
    {{ t.continue }}
  </button>

  <button class="secondaryBtn" type="button" @click="goToRegister">
    {{ t.newParticipant }}
  </button>
</div>
        <div v-if="showPolicyModal" class="modalOverlay" @click.self="closePolicyModal">
  <div class="modalCard" :dir="isRtl ? 'rtl' : 'ltr'">
    <div class="modalHeader">
      <h2 class="modalTitle">{{ modalTitle }}</h2>
      <button type="button" class="modalClose" @click="closePolicyModal">✕</button>
    </div>

    <div class="modalBody">
      <div
        v-for="section in modalContent.sections"
        :key="section.heading"
        class="modalSection"
      >
        <h3>{{ section.heading }}</h3>
        <p>{{ section.text }}</p>
      </div>
    </div>
  </div>
</div>

      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authStore } from '@/store/authStore'
import { buildApiUrl } from '@/services/api'
  import { userPrivacyPolicy } from '@/content/userPrivacyPolicy'
import { userTermsOfUse } from '@/content/userTermsOfUse'



const acceptedPolicy = ref(false)
const router = useRouter()
const route = useRoute()
const eventId = computed(() =>
  String(
    route.params.eventId ||
    localStorage.getItem('harmony_eventId') ||
    ''
  ).trim()
)
const phone = ref('')
const phoneTouched = ref(false)
const errorMessage = ref('')



const LANG_KEY = 'harmony_lang'
const lang = ref(localStorage.getItem(LANG_KEY) || 'en')
watch(lang, v => localStorage.setItem(LANG_KEY, v), { immediate: true })
watch(
  eventId,
  (v) => {
    if (v) {
      localStorage.setItem('harmony_eventId', v)
    }
  },
  { immediate: true }
)

const privacyText = {
  en: 'By continuing, you agree to the Privacy Policy. Your data will only be used for networking recommendations during the event.',
  he: 'בהמשך השימוש במערכת, את/ה מסכימ/ה למדיניות הפרטיות. המידע שלך ישמש רק ליצירת התאמות נטוורקינג במהלך האירוע.',
  ar: 'بالمتابعة، أنت توافق/ين على سياسة الخصوصية. سيتم استخدام بياناتك فقط لتقديم توصيات للتواصل خلال الفعالية.',
}

const TEXTS = {
  en: {
    subtitle: 'Sign in to discover your matches',
    language: 'Language',
    phone: 'Participant Phone Number',
    phonePlaceholder: '',
    phoneError: 'Please enter a valid phone number.',
    loginError: 'Login failed. Please check the phone number and try again.',
    continue: 'Continue',
    newParticipant: 'New participant',
    agree: 'I agree to the',
privacy: 'Privacy Policy',
terms: 'Terms of Use',
  },
  ar: {
    subtitle: 'سجّل الدخول لاكتشاف التطابقات الخاصة بك',
    language: 'اللغة',
    phone: 'رقم الهاتف',
    phonePlaceholder: '',
    phoneError: 'يرجى إدخال رقم هاتف صحيح.',
    loginError: 'فشل تسجيل الدخول. يرجى التحقق من رقم الهاتف والمحاولة مرة أخرى.',
    continue: 'متابعة',
    newParticipant: 'مشارك جديد',
    agree: 'أوافق على',
privacy: 'سياسة الخصوصية',
terms: 'شروط الاستخدام',
  },
  he: {
    subtitle: 'התחבר כדי לגלות את ההתאמות שלך',
    language: 'שפה',
    phone: 'מספר טלפון',
    phonePlaceholder: '',
    phoneError: 'נא להזין מספר טלפון תקין.',
    loginError: 'ההתחברות נכשלה. נא לבדוק את מספר הטלפון ולנסות שוב.',
    continue: 'המשך',
    newParticipant: 'משתתף חדש',
    agree: 'אני מאשר/ת את',
privacy: 'מדיניות הפרטיות',
terms: 'תנאי השימוש',
  },
}

const t = computed(() => TEXTS[lang.value] ?? TEXTS.en)
const isRtl = computed(() => lang.value === 'ar' || lang.value === 'he')

function normalizePhone(raw) {
  return String(raw || '').replace(/[^\d]/g, '').trim()
}

function isValidPhone(raw) {
  const normalized = normalizePhone(raw)
  return normalized.length >= 7
}

const isIdValid = computed(() => isValidPhone(phone.value))

function onPhoneInput() {
  phoneTouched.value = true
  errorMessage.value = ''
}

async function loginAndRoute(targetRoute) {
  phoneTouched.value = true
  errorMessage.value = ''

  if (!isIdValid.value) {
    errorMessage.value = t.value.phoneError
    return
  }
  if (!eventId.value) {
  errorMessage.value = 'Missing eventId in URL'
  return
}

  const enteredPhone = phone.value

  try {
    const url = buildApiUrl('/api/auth/phone-login')
    console.log('POST URL:', url)
    console.log('PHONE:', enteredPhone)

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
  phone: phone.value,
  eventId: eventId.value,
}),
    })

    const rawText = await res.text()
    console.log('STATUS:', res.status)
    console.log('RESPONSE TEXT:', rawText)

    let data = {}
    try {
      data = rawText ? JSON.parse(rawText) : {}
    } catch {
      data = {}
    }

    if (!res.ok) {
      throw new Error(data?.error || data?.message || `HTTP ${res.status}`)
    }

const pid = data?.participantId ? String(data.participantId).trim() : ''
    if (!pid) {
  throw new Error('Login failed: missing participantId')
}

    authStore.phone = phone.value
    authStore.isLoggedIn = true
    localStorage.setItem('harmony_pid', pid)
    localStorage.setItem('harmony_eventId', eventId.value)

    router.push(`/event/${eventId.value}/${targetRoute}/${pid}`)
  } catch (err) {
    console.error('LOGIN ERROR:', err)
    errorMessage.value = err.message || t.value.loginError
  }
}

async function continueLogin() {
  if (!acceptedPolicy.value) {
    errorMessage.value = "Please accept Terms & Privacy"
    return
  }

  await loginAndRoute('matches')
}
async function goToRegister() {
  router.push(`/event/${eventId.value}/profile/new`)
}
  const showPolicyModal = ref(false)
const modalType = ref('privacy')

function openPrivacy() {
  modalType.value = 'privacy'
  showPolicyModal.value = true
}

function openTerms() {
  modalType.value = 'terms'
  showPolicyModal.value = true
}

function closePolicyModal() {
  showPolicyModal.value = false
}

const modalTitle = computed(() => {
  return modalType.value === 'privacy' ? t.value.privacy : t.value.terms
})

const modalContent = computed(() => {
  return modalType.value === 'privacy' ? userPrivacyPolicy : userTermsOfUse
})


</script>

<style scoped>
.container { width: 100%; max-width: none; padding: 0; margin: 0; }

/* ===== PAGE BG (ירוק מחוזק כמו שביקשת) ===== */
.loginPage{
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 18px;
  font-family: Arial, sans-serif;
  color: var(--h-text);
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;

  background:
    radial-gradient(circle at 20% 20%, rgba(255,255,255,0.6), transparent 35%),
    radial-gradient(circle at 80% 80%, rgba(120,170,140,0.25), transparent 40%),
    linear-gradient(180deg, #f4faf7 0%, #e4f1ea 55%, #d3e6dc 100%);
}
/* ===== CARD (מסגרת ירוקה + glass ירקרק) ===== */
.loginCard{
  width: 100%;
  max-width: 560px;
  padding: 28px 24px 24px;
  border-radius: 28px;

  background: rgba(255,255,255,0.88);
  border: 1.5px solid rgba(47,107,79,0.22);

  box-shadow:
    0 18px 40px rgba(31,63,50,0.10),
    0 2px 10px rgba(31,63,50,0.05);

  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  display: flex;
  flex-direction: column;
  gap: 16px;

  overflow: visible;
}

/* ===== BRAND ===== */
.brand{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:14px;
  margin-top: 4px;
}

.brandLogo{
  height: 64px;
  width: 64px;
  object-fit: cover;
  border-radius: 50%;
}

.title{
  font-size: 52px;
  line-height: 1;
  font-weight: 900;
  color: #1f3f32;
  margin: 0;
  letter-spacing: -1px;
}

.subtitle {
  margin-top: 10px;
  font-size: 15.5px;
  color: #7a8f84;
  font-weight: 400;
  text-align: center;
  letter-spacing: 0.3px;
}

/* ===== FORM ===== */
.label{
  display: block;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #2f4f3e;
  line-height: 1.4;
}

.input{
  width: 100%;
  padding: 14px 44px 14px 16px;
  border-radius: 18px;
  height: 56px;
  box-sizing: border-box;

  border: 1.5px solid rgba(47,107,79,0.18);
  background: #ffffff;
  color: var(--h-text);

  font-size: 15px;
  box-shadow: 0 6px 16px rgba(31,63,50,0.05);
}

.input:focus{
  outline: none;
  border-color: #6e9d82;
  box-shadow:
    0 0 0 4px rgba(110,157,130,0.14),
    0 8px 20px rgba(31,63,50,0.08);
}

.field{
  width: 100%;
  position: relative;
}

.selectInput{
  padding-right: 44px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.arrow{
  pointer-events: none;
  position:absolute;
  right:16px;
  top:50%;
  transform: translateY(-50%);
  opacity: 0.6;
}

.ltrNum{ direction:ltr; unicode-bidi: plaintext; }

.errorText{
  margin: -6px 0 4px;
  font-size: 12.5px;
  color: rgba(170, 50, 50, 0.95);
  text-align: center;
}

/* ===== BUTTONS BAR ===== */
.btnBar {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 18px;
}

.btnBar .primaryBtn,
.btnBar .secondaryBtn {
  width: 100%;
  display: block;
  box-sizing: border-box;
  margin: 0;
}

.primaryBtn,
.secondaryBtn{
  width: 100%;
  min-height: 54px;
  border-radius: 18px;
  font-weight: 900;
  font-size: 16px;
  cursor: pointer;
  border: 2.5px solid #2f6b4f;
  color: #1f3f32;
  box-shadow: 0 14px 30px rgba(31,63,50,0.12);
  transition: transform 140ms ease, background 140ms ease, border-color 140ms ease;
}

.primaryBtn{
  background: linear-gradient(135deg, rgba(233,243,238,0.98), rgba(206,232,221,0.98));
}

.secondaryBtn{
  background: linear-gradient(135deg, rgba(233,243,238,0.98), rgba(206,232,221,0.98));
}

.primaryBtn,
.secondaryBtn{
  width: 100%;
  min-height: 56px;
  border-radius: 18px;
  font-weight: 800;
  font-size: 17px;
  cursor: pointer;
  transition: transform 140ms ease, background 140ms ease, border-color 140ms ease, box-shadow 140ms ease;
}

.primaryBtn{
  border: 0;
  background: linear-gradient(135deg, #5f8f73, #7cab8b);
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(79,125,99,0.22);
}

.primaryBtn:hover:not(:disabled){
  transform: translateY(-1px);
  box-shadow: 0 16px 28px rgba(79,125,99,0.28);
}

.primaryBtn:disabled{
  background: #dbe6df;
  color: #7d8f84;
  box-shadow: none;
  cursor: not-allowed;
}

.secondaryBtn{
  border: 1.5px solid rgba(47,107,79,0.30);
  background: rgba(255,255,255,0.72);
  color: #214234;
}

.secondaryBtn:hover{
  transform: translateY(-1px);
  background: rgba(239,247,242,0.95);
}
.checkboxWrapper {
  position: relative;
  width: 22px;
  height: 22px;
  display: inline-block;
  flex-shrink: 0;
  margin-top: 2px;
}

.customCheck {
  position: absolute;
  inset: 0;
  border-radius: 7px;
  border: 1.8px solid #5b8b70;
  background: #fff;
  transition: all 0.18s ease;
}
.checkboxWrapper input {
  opacity: 0;
  width: 0;
  height: 0;
}


/* כשהוא מסומן */
.checkboxWrapper input:checked + .customCheck {
  background: #2f6b4f;
  border-color: #2f6b4f;
}

/* וי בפנים */
.checkboxWrapper input:checked + .customCheck::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  color: white;
  font-size: 14px;
  font-weight: bold;
}

/* ===== MOBILE ===== */
@media (max-width: 768px){
  .container{
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }

  .loginPage{
    display: block;
    min-height: 100svh;
    padding: 0;
  }

  .loginCard{
    width: 100%;
    max-width: 100%;
    min-height: 100svh;
    border-radius: 0;
    padding: 24px 16px 32px;
    gap: 14px;
    box-shadow: none;
    border: none;
    background: rgba(255,255,255,0.92);
  }

  .brand{
    gap: 10px;
    margin-top: 4px;
  }

  .brandLogo{
    width: 44px;
    height: 44px;
  }

  .title{
    font-size: 34px;
  }

  .subtitle{
    font-size: 14px;
    margin-top: 4px;
  }

  .label{
    font-size: 14px;
    margin-bottom: 8px;
  }

  .input{
    height: 50px;
    padding: 12px 42px 12px 14px;
    font-size: 15px;
    border-radius: 14px;
  }

  .selectInput{
    padding-right: 42px;
  }

  .arrow{
    right: 14px;
  }

  .policyBox{
    margin-top: 0;
    padding: 4px 0 0;
  }

  .policyRow{
    gap: 10px;
    font-size: 12.5px;
    line-height: 1.5;
  }

  .btnBar{
    margin-top: 10px;
    gap: 10px;
  }

  .primaryBtn,
  .secondaryBtn{
    min-height: 50px;
    font-size: 15px;
    border-radius: 14px;
  }

  .modalOverlay{
    padding: 10px;
  }

  .modalCard{
    width: 100%;
    max-width: 100%;
    max-height: 90svh;
    border-radius: 18px;
  }

  .modalHeader{
    padding: 14px 16px;
  }

  .modalTitle{
    font-size: 20px;
  }

  .modalBody{
    padding: 16px;
  }

  .modalSection{
    padding: 14px;
    border-radius: 14px;
    margin-bottom: 16px;
  }

  .modalSection h3{
    font-size: 17px;
  }

  .modalSection p{
    font-size: 14px;
    line-height: 1.65;
  }
}
</style>
