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
    subtitle: 'Sign in to view your matches',
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
    subtitle: 'سجّل/ي الدخول لعرض المطابقات',
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
    subtitle: 'התחבר/י כדי לראות את ההתאמות שלך',
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
  display: grid;
  place-items: center;
  width: 100%;
  padding: 18px;
  font-family: Arial, sans-serif;
  color: var(--h-text);

  background: linear-gradient(
    180deg,
    #e6f2ec 0%,
    #d6e8df 55%,
    #c8ded3 100%
  );
}

/* ===== CARD (מסגרת ירוקה + glass ירקרק) ===== */
.loginCard{
  width: min(560px, 92vw);
  padding: 34px 32px 28px;
  border-radius: 30px;

  background: rgba(255,255,255,0.88);
  border: 1.5px solid rgba(47,107,79,0.22);

  box-shadow:
    0 18px 40px rgba(31,63,50,0.10),
    0 2px 10px rgba(31,63,50,0.05);

  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  display: flex;
  flex-direction: column;
  gap: 18px;

  max-height: calc(100svh - 36px);
  overflow: auto;
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

.subtitle{
  text-align:center;
  font-size:15px;
  color: #5f766a;
  margin-top: -2px;
  margin-bottom: 8px;
}

/* ===== FORM ===== */
.label{ font-size: 13px; font-weight: 900; color: var(--h-text); }

.input{
  width: 100%;
  padding: 14px 44px 14px 14px;
  border-radius: 16px;
  height: 52px;
  box-sizing: border-box;

  border: 2px solid rgba(47,107,79,0.25);
  background: rgba(255,255,255,0.94);
  color: var(--h-text);

  font-size: 14px;
  box-shadow: 0 10px 22px rgba(31,63,50,0.08);
}

.input:focus{
  outline: none;
  border-color: #2f6b4f;
  box-shadow: 0 0 0 4px rgba(47,107,79,0.18), 0 12px 26px rgba(31,63,50,0.10);
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

.primaryBtn:hover,
.secondaryBtn:hover{
  transform: translateY(-1px);
  border-color: #24513f;
  background: rgba(233,243,238,1);
}

.primaryBtn:disabled{
  background: rgba(233,243,238,0.55);
  border-color: rgba(47,107,79,0.28);
  color: rgba(31,63,50,0.55);
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
}
  .checkboxWrapper {
  position: relative;
  width: 22px;
  height: 22px;
  display: inline-block;
}

.checkboxWrapper input {
  opacity: 0;
  width: 0;
  height: 0;
}

.customCheck {
  position: absolute;
  top: 0;
  left: 0;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid #2f6b4f;
  background: white;
  transition: all 0.2s ease;
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
@media (max-width: 420px){
  .loginPage{ padding: 12px; }
  .loginCard{
    width: 94vw;
    padding: 16px 14px;
    border-radius: 18px;
    gap: 10px;
  }
  .title{ font-size: 34px; }
  .brandLogo{ height: 44px; width:44px; }

  .primaryBtn, .secondaryBtn{ min-height: 50px; font-size: 15px; }

  .btnBar{
    margin-left: -14px;
    margin-right: -14px;
    padding-left: 14px;
    padding-right: 14px;
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
  }
}

.policyBox {
  margin-top: 10px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(255,255,255,0.7);
  border: 1.5px solid rgba(47,107,79,0.2);
}

.policyRow {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  line-height: 1.5;
  color: #2c4a3b;
}

.policyRow input {
  width: 18px;
  height: 18px;
  accent-color: #2f6b4f;
  cursor: pointer;
}

.link {
  color: #2f6b4f;
  font-weight: 700;
  text-decoration: underline;
  margin: 0 4px;
}
  .linkBtn {
  background: none;
  border: none;
  padding: 0;
  margin: 0 4px;
  color: #2f6b4f;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
  font: inherit;
}

.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 35, 28, 0.45);
  display: grid;
  place-items: center;
  z-index: 9999;
  padding: 18px;
}

.modalCard {
  width: min(760px, 96vw);
  max-height: 85vh;
  overflow: hidden;
  border-radius: 22px;
  background: linear-gradient(
    180deg,
    rgba(233,243,238,0.98),
    rgba(255,255,255,0.96)
  );
  border: 2px solid #2f6b4f;
  box-shadow: 0 20px 45px rgba(31,63,50,0.18);
  display: flex;
  flex-direction: column;
}

.modalHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid rgba(47,107,79,0.18);
}

.modalTitle {
  margin: 0;
  font-size: 24px;
  font-weight: 900;
  color: #1f3f32;
}

.modalClose {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 2px solid #2f6b4f;
  background: #f4faf6;
  color: #1f3f32;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
}

.modalBody {
  padding: 20px;
  overflow-y: auto;
}

.modalSection {
  margin-bottom: 22px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(255,255,255,0.78);
  border: 1px solid rgba(47,107,79,0.12);
}

.modalSection h3 {
  margin: 0 0 10px;
  font-size: 20px;
  color: #204634;
}

.modalSection p {
  margin: 0;
  line-height: 1.75;
  color: #304c3d;
  font-size: 15px;
}
.policyText {
  display: inline;
}

.linkBtn {
  background: none;
  border: none;
  padding: 0;
  margin: 0 4px;
  color: #2f6b4f;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
  font: inherit;
}

.linkBtn:hover {
  color: #24513f;
}
</style>
