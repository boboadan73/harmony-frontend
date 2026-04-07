<template>
  <div class="container">
    <div class="shell" :dir="isRtl ? 'rtl' : 'ltr'">
      <div class="page">

        <TopNav :lang="lang" :pid="pid || 'new'" />

        <h1>{{ t.title }}</h1>

        <div v-if="loading">{{ t.loading }}</div>
        <div v-if="errorMsg">{{ errorMsg }}</div>

        <div v-if="!loading">

          <img :src="profileAvatar" width="120" />

          <button v-if="!isEditing" @click="startEdit">{{ t.edit }}</button>

          <div v-if="isEditing">
            <button @click="saveProfile">{{ saving ? t.saving : t.save }}</button>
            <button @click="cancelEdit">{{ t.cancel }}</button>
          </div>

          <!-- NAME -->
          <div>
            <label>{{ t.name }}</label>
            <input v-if="isEditing" v-model="form.name" />
            <div v-else>{{ profile.name }}</div>
          </div>

          <!-- PHONE -->
          <div>
            <label>{{ t.phone }}</label>
            <input v-if="isEditing" v-model="form.phoneNumber" />
            <div v-else>{{ profile.phoneNumber }}</div>
          </div>

          <!-- JOB -->
          <div>
            <label>{{ t.job }}</label>
            <input v-if="isEditing" v-model="form.jobTitle" />
            <div v-else>{{ profile.jobTitle }}</div>
          </div>

          <!-- IMAGE -->
          <div>
            <label>{{ t.image }}</label>
            <input v-if="isEditing" v-model="form.photoUrl" />
            <div v-else>{{ profile.photoUrl }}</div>
          </div>

          <!-- ACADEMIC -->
          <div>
            <label>{{ t.academic }}</label>
            <textarea v-if="isEditing" v-model="form.academicResume" />
            <div v-else>{{ profile.academicResume }}</div>
          </div>

          <!-- PROFESSIONAL -->
          <div>
            <label>{{ t.professional }}</label>
            <textarea v-if="isEditing" v-model="form.professionalResume" />
            <div v-else>{{ profile.professionalResume }}</div>
          </div>

          <!-- PERSONAL -->
          <div>
            <label>{{ t.personal }}</label>
            <textarea v-if="isEditing" v-model="form.personalResume" />
            <div v-else>{{ profile.personalResume }}</div>
          </div>

          <!-- I WANT TO MEET -->
          <div>
            <label>I Want To Meet</label>
            <textarea v-if="isEditing" v-model="form.iWantToMeet" />
            <div v-else>{{ profile.iWantToMeet }}</div>
          </div>

          <div v-if="successMsg">{{ successMsg }}</div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { buildSystemApiUrl } from '@/services/api'
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import TopNav from '@/components/TopNav.vue'

const route = useRoute()

const isNewParticipant = computed(() => route.params.id === 'new')

const pid = computed(() => {
  if (route.params.id === 'new') return ''
  return route.params.id || localStorage.getItem('harmony_pid')
})

watch(pid, v => {
  if (v) localStorage.setItem('harmony_pid', v)
}, { immediate: true })

const lang = ref('en')

const TEXTS = {
  en: {
    title: 'Profile',
    loading: 'Loading...',
    edit: 'Edit',
    save: 'Save',
    saving: 'Saving...',
    cancel: 'Cancel',
    name: 'Name',
    phone: 'Phone',
    job: 'Job',
    image: 'Photo',
    academic: 'Academic',
    professional: 'Professional',
    personal: 'Personal',
    saveSuccess: 'Saved successfully',
  }
}

const t = computed(() => TEXTS.en)

const loading = ref(false)
const saving = ref(false)
const isEditing = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const profile = ref({})
const form = ref({})

const profileAvatar = computed(() => {
  return profile.value.photoUrl || profile.value.thumbnail_url || ''
})

function fillForm(p) {
  form.value = {
    name: p.name || '',
    phoneNumber: p.phoneNumber || '',
    jobTitle: p.jobTitle || '',
    academicResume: p.academicResume || '',
    professionalResume: p.professionalResume || '',
    personalResume: p.personalResume || '',
    iWantToMeet: p.iWantToMeet || '',
    photoUrl: p.photoUrl || '',
  }
}

async function loadProfile() {
  if (isNewParticipant.value) {
    isEditing.value = true
    fillForm({})
    return
  }

  loading.value = true

  try {
    const res = await fetch(buildSystemApiUrl(`/api/participants/${pid.value}`))
    const data = await res.json()

    profile.value = data.participant || data
    fillForm(profile.value)

  } catch {
    errorMsg.value = 'Load failed'
  }

  loading.value = false
}

function startEdit() {
  fillForm(profile.value)
  isEditing.value = true
}

function cancelEdit() {
  fillForm(profile.value)
  isEditing.value = false
}

async function saveProfile() {
  saving.value = true

  try {
    const isNew = isNewParticipant.value

    const url = isNew
      ? buildSystemApiUrl('/api/participants')
      : buildSystemApiUrl(`/api/participants/${pid.value}`)

    const method = isNew ? 'POST' : 'PUT'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })

    const data = await res.json()

    profile.value = data.participant || data
    fillForm(profile.value)

    successMsg.value = t.value.saveSuccess
    isEditing.value = false

    if (isNew && profile.value.id) {
      localStorage.setItem('harmony_pid', profile.value.id)
      window.location.href = `/matches/${profile.value.id}`
    }

  } catch (err) {
    errorMsg.value = err.message
  }

  saving.value = false
}

onMounted(loadProfile)
watch(pid, loadProfile)
</script>
