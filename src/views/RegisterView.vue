<template>
  <div class="matches-page" :dir="isRtl ? 'rtl' : 'ltr'">
    <main class="matches-wrap">
      <section class="page-head">
        <div class="title-box">
          <h1 class="page-title">{{ t.title }}</h1>
          <p class="page-subtitle">{{ t.subtitle }}</p>
        </div>
      </section>

      <section class="match-card form-card">
        <div class="form-grid">
          <div class="field">
            <label>{{ t.name }}</label>
            <input v-model="form.name" type="text" />
          </div>

          <div class="field">
            <label>{{ t.phone }}</label>
            <input v-model="form.phone" type="text" />
          </div>

          <div class="field">
            <label>{{ t.job }}</label>
            <input v-model="form.job" type="text" />
          </div>

          <div class="field">
            <label>{{ t.academic }}</label>
            <textarea v-model="form.academic"></textarea>
          </div>

          <div class="field">
            <label>{{ t.professional }}</label>
            <textarea v-model="form.professional"></textarea>
          </div>

          <div class="field">
            <label>{{ t.personal }}</label>
            <textarea v-model="form.personal"></textarea>
          </div>

          <div class="field">
            <label>{{ t.imageUrl }}</label>
            <input v-model="form.imageUrl" type="text" />
          </div>
        </div>

        <div v-if="errorMsg" class="state-box">
          <div>
            <div class="state-title">{{ t.error }}</div>
            <div class="state-sub">{{ errorMsg }}</div>
          </div>
        </div>

        <div class="actions-row single-action">
          <button class="action-btn save-btn" @click="submitForm" :disabled="saving">
            {{ saving ? t.saving : t.submit }}
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { buildSystemApiUrl } from '@/services/api'

const router = useRouter()

const lang = ref(localStorage.getItem('harmony_lang') || 'en')
const isRtl = computed(() => lang.value === 'ar' || lang.value === 'he')

const TEXTS = {
  en: {
    title: 'New Participant',
    subtitle: 'Create a new participant profile',
    name: 'Full name',
    phone: 'Phone number',
    job: 'Job title',
    academic: 'Academic background',
    professional: 'Professional background',
    personal: 'Personal interests',
    imageUrl: 'Image URL',
    submit: 'Create participant',
    saving: 'Saving...',
    error: 'Could not create participant',
  },
  ar: {
    title: 'مشارك جديد',
    subtitle: 'إنشاء ملف مشارك جديد',
    name: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    job: 'المسمى الوظيفي',
    academic: 'الخلفية الأكاديمية',
    professional: 'الخلفية المهنية',
    personal: 'الاهتمامات الشخصية',
    imageUrl: 'رابط الصورة',
    submit: 'إنشاء المشارك',
    saving: 'جارٍ الحفظ...',
    error: 'تعذر إنشاء المشارك',
  },
  he: {
    title: 'משתתף חדש',
    subtitle: 'יצירת פרופיל משתתף חדש',
    name: 'שם מלא',
    phone: 'מספר טלפון',
    job: 'תפקיד',
    academic: 'רקע אקדמי',
    professional: 'רקע מקצועי',
    personal: 'תחומי עניין אישיים',
    imageUrl: 'קישור לתמונה',
    submit: 'צור משתתף',
    saving: 'שומר...',
    error: 'לא הצלחנו ליצור משתתף',
  },
}

const t = computed(() => TEXTS[lang.value] || TEXTS.en)

const form = ref({
  name: '',
  phone: '',
  job: '',
  academic: '',
  professional: '',
  personal: '',
  imageUrl: '',
})

const saving = ref(false)
const errorMsg = ref('')

async function submitForm() {
  errorMsg.value = ''

  if (!form.value.name.trim() || !form.value.phone.trim()) {
    errorMsg.value = 'Name and phone are required'
    return
  }

  saving.value = true

  try {
    const res = await fetch(buildSystemApiUrl('/api/participants'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })

    if (!res.ok) throw new Error(`API error: ${res.status}`)

    const data = await res.json()

    const newId = data?.participant?.id || data?.id
    if (newId) {
      localStorage.setItem('harmony_pid', String(newId))
      router.push(`/matches/${newId}`)
    } else {
      router.push('/login')
    }
  } catch (e) {
    errorMsg.value = e?.message || 'Create failed'
  } finally {
    saving.value = false
  }
}
</script>