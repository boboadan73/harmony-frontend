import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import MatchesView from '../views/MatchesView.vue'
import SavedView from '../views/SavedView.vue'
import MetView from '../views/MetView.vue'
import ProfileView from '../views/ProfileView.vue'
import UserPrivacyView from '../views/UserPrivacyView.vue'
import UserTermsView from '../views/UserTermsView.vue'

function getStoredPid() {
  if (typeof window === 'undefined') return ''

  const pid = String(localStorage.getItem('harmony_pid') || '').trim()

  const hasValidPid =
    pid !== '' &&
    pid !== 'null' &&
    pid !== 'undefined'

  return hasValidPid ? pid : ''
}

function getStoredEventId() {
  if (typeof window === 'undefined') return ''

  const eventId = String(localStorage.getItem('harmony_eventId') || '').trim()

  const hasValidEventId =
    eventId !== '' &&
    eventId !== 'null' &&
    eventId !== 'undefined'

  return hasValidEventId ? eventId : ''
}

const withPidOrLogin = (base) => {
  const pid = getStoredPid()
  const eventId = getStoredEventId()

  return pid && eventId ? `/event/${eventId}/${base}/${pid}` : '/event/default/login'
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/event/default/login' },

    { path: '/event/:eventId/login', component: LoginView },

    { path: '/matches', redirect: () => withPidOrLogin('matches') },
    { path: '/saved', redirect: () => withPidOrLogin('saved') },
    { path: '/met', redirect: () => withPidOrLogin('met') },
    { path: '/profile', redirect: () => withPidOrLogin('profile') },

    { path: '/event/:eventId/matches/:id', component: MatchesView },
    { path: '/event/:eventId/saved/:id', component: SavedView },
    { path: '/event/:eventId/met/:id', component: MetView },
    { path: '/event/:eventId/profile/:id', component: ProfileView },

    { path: '/event/:eventId/privacy', component: UserPrivacyView },
    { path: '/event/:eventId/terms', component: UserTermsView },
  ],
})

router.beforeEach((to, from, next) => {
  const pid = getStoredPid()

  const isLoginPage =
    to.path.startsWith('/event/') && to.path.endsWith('/login')

  const isNewParticipantPage =
    to.path.startsWith('/event/') && to.path.endsWith('/profile/new')

  if (!isLoginPage && !isNewParticipantPage && !pid) {
    const eventId = getStoredEventId() || 'default'
    return next(`/event/${eventId}/login`)
  }

  next()
})

export default router
