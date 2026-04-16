<template>
  <UserLayout>
    <div class="terms-page" :dir="isRtl ? 'rtl' : 'ltr'">
      <div class="terms-wrap">
        <section class="page-head">
          <div class="title-box modern-title-box">
            <h1 class="page-title modern-page-title">
              {{ t.pageTitle }}
            </h1>
            <p class="page-subtitle modern-page-subtitle">
              {{ t.pageSubtitle }}
            </p>
          </div>

          <div class="head-actions">
            <div class="language-box">
              <span class="language-icon" aria-hidden="true">🌐</span>
              <select class="language-select" v-model="lang">
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="he">עברית</option>
              </select>
            </div>
          </div>
        </section>

        <div class="terms-card">
          <div class="card-glow"></div>

          <div class="terms-hero">
            <div class="hero-badge">{{ t.badge }}</div>
            <h2 class="terms-main-title">{{ t.title }}</h2>
            <p class="terms-main-subtitle">{{ t.intro }}</p>
          </div>

          <div class="sections-grid">
            <article
              v-for="section in t.sections"
              :key="section.heading"
              class="section-card"
            >
              <h3>{{ section.heading }}</h3>
              <p>{{ section.text }}</p>
            </article>
          </div>
        </div>
      </div>
    </div>
  </UserLayout>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import UserLayout from '@/components/user/UserLayout.vue'

const LANG_KEY = 'harmony_lang'
const lang = ref(localStorage.getItem(LANG_KEY) || 'en')

watch(lang, (v) => {
  localStorage.setItem(LANG_KEY, v)
})

const TEXTS = {
  en: {
    pageTitle: 'Terms of Use',
    pageSubtitle: 'Read the usage terms for Harmony',
    badge: 'Harmony',
    title: 'User Terms of Use',
    intro:
      'Please read these terms carefully before using the Harmony Intelligent Networking System.',
    sections: [
      {
        heading: 'Acceptance of Terms',
        text:
          'By accessing or using the Harmony Intelligent Networking System, you agree to these terms.',
      },
      {
        heading: 'Academic Project Status',
        text:
          'This system is part of a student academic project and may change before public release.',
      },
      {
        heading: 'Participant Use',
        text:
          'Participants agree to use the system only for event networking purposes and to provide accurate information when requested.',
      },
      {
        heading: 'Profile Responsibility',
        text:
          'You are responsible for the accuracy of the information you provide, including professional, academic, and personal profile details.',
      },
      {
        heading: 'Appropriate Conduct',
        text:
          'Users must interact respectfully with other participants and must not misuse the platform or its recommendations.',
      },
      {
        heading: 'System Availability',
        text:
          'We do not guarantee uninterrupted availability and may update, suspend, or modify parts of the system when needed.',
      },
      {
        heading: 'Privacy and Data Use',
        text:
          'Your information is used to support networking recommendations during the event and is handled according to the project privacy policy.',
      },
      {
        heading: 'Contact',
        text:
          'If you have questions about these terms, please contact the event organizers or the project team.',
      },
    ],
  },

  ar: {
    pageTitle: 'شروط الاستخدام',
    pageSubtitle: 'اقرأ شروط استخدام Harmony',
    badge: 'Harmony',
    title: 'شروط استخدام المستخدم',
    intro:
      'يرجى قراءة هذه الشروط بعناية قبل استخدام نظام Harmony الذكي للتواصل.',
    sections: [
      {
        heading: 'قبول الشروط',
        text:
          'عند الدخول إلى نظام Harmony الذكي للتواصل أو استخدامه، فإنك توافق على هذه الشروط.',
      },
      {
        heading: 'حالة المشروع الأكاديمية',
        text:
          'هذا النظام جزء من مشروع أكاديمي طلابي، وقد تطرأ عليه تغييرات قبل الإطلاق العام.',
      },
      {
        heading: 'استخدام المشاركين',
        text:
          'يوافق المشاركون على استخدام النظام فقط لأغراض التواصل في الفعالية، وتقديم معلومات دقيقة عند الطلب.',
      },
      {
        heading: 'المسؤولية عن الملف الشخصي',
        text:
          'أنت مسؤول عن دقة المعلومات التي تقدمها، بما في ذلك التفاصيل المهنية والأكاديمية والشخصية في ملفك الشخصي.',
      },
      {
        heading: 'السلوك المناسب',
        text:
          'يجب على المستخدمين التعامل باحترام مع المشاركين الآخرين، وعدم إساءة استخدام المنصة أو التوصيات التي تقدمها.',
      },
      {
        heading: 'توفر النظام',
        text:
          'لا نضمن توفر النظام بشكل متواصل، وقد نقوم بتحديثه أو إيقافه أو تعديل بعض أجزائه عند الحاجة.',
      },
      {
        heading: 'الخصوصية واستخدام البيانات',
        text:
          'تُستخدم معلوماتك لدعم توصيات التواصل خلال الفعالية، ويتم التعامل معها وفقًا لسياسة الخصوصية الخاصة بالمشروع.',
      },
      {
        heading: 'التواصل',
        text:
          'إذا كانت لديك أسئلة حول هذه الشروط، يرجى التواصل مع منظمي الفعالية أو فريق المشروع.',
      },
    ],
  },

  he: {
    pageTitle: 'תנאי שימוש',
    pageSubtitle: 'קריאת תנאי השימוש של Harmony',
    badge: 'Harmony',
    title: 'תנאי השימוש למשתמש',
    intro:
      'נא לקרוא את התנאים הבאים בעיון לפני השימוש במערכת Harmony לחיבורים חכמים.',
    sections: [
      {
        heading: 'קבלת התנאים',
        text:
          'באמצעות גישה או שימוש במערכת Harmony לחיבורים חכמים, את/ה מסכים/ה לתנאים אלו.',
      },
      {
        heading: 'סטטוס אקדמי של הפרויקט',
        text:
          'מערכת זו היא חלק מפרויקט אקדמי של סטודנטים, וייתכנו בה שינויים לפני השקה ציבורית.',
      },
      {
        heading: 'שימוש המשתתפים',
        text:
          'המשתתפים מתחייבים להשתמש במערכת למטרות נטוורקינג באירוע בלבד, ולספק מידע מדויק כאשר יתבקשו לכך.',
      },
      {
        heading: 'אחריות על הפרופיל',
        text:
          'האחריות על נכונות המידע שאת/ה מספק/ת חלה עלייך, כולל פרטים מקצועיים, אקדמיים ואישיים בפרופיל.',
      },
      {
        heading: 'התנהגות הולמת',
        text:
          'על המשתמשים לנהוג בכבוד כלפי משתתפים אחרים, ולא לעשות שימוש לרעה בפלטפורמה או בהמלצות שלה.',
      },
      {
        heading: 'זמינות המערכת',
        text:
          'איננו מתחייבים לזמינות רציפה של המערכת, וייתכן שנעדכן, נשעה או נשנה חלקים ממנה לפי הצורך.',
      },
      {
        heading: 'פרטיות ושימוש במידע',
        text:
          'המידע שלך משמש לצורך יצירת המלצות לנטוורקינג במהלך האירוע, ומטופל בהתאם למדיניות הפרטיות של הפרויקט.',
      },
      {
        heading: 'יצירת קשר',
        text:
          'לשאלות בנוגע לתנאים אלו, ניתן לפנות למארגני האירוע או לצוות הפרויקט.',
      },
    ],
  },
}

const t = computed(() => TEXTS[lang.value] ?? TEXTS.en)
const isRtl = computed(() => lang.value === 'ar' || lang.value === 'he')
</script>

<style scoped>
.terms-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(143, 184, 156, 0.14), transparent 26%),
    radial-gradient(circle at top right, rgba(111, 153, 121, 0.12), transparent 24%),
    linear-gradient(180deg, #f6f8f6 0%, #eef3ef 100%);
  color: #45545a;
  font-family: Arial, sans-serif;
}

.terms-wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 22px 18px 46px;
}

.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 18px 0 22px;
  padding-bottom: 14px;
  border-bottom: 1px solid #d9ddd9;
}

:dir(rtl) .page-head {
  text-align: right;
}

.title-box {
  min-width: 0;
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
  font-size: 30px;
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
  width: 72%;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, #8fb89c, #5f8d70);
  opacity: 0.95;
}

:dir(rtl) .modern-page-title::after {
  left: auto;
  right: 0;
}

.modern-page-subtitle {
  margin: 10px 0 0;
  font-size: 15px;
  color: #7c8b84;
  font-weight: 600;
}

.head-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-inline-start: auto;
}

:dir(rtl) .head-actions {
  flex-direction: row-reverse;
}

.language-box {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f8f8f6;
  border: 1px solid #d7dbd6;
  border-radius: 999px;
  padding: 8px 14px;
  flex-shrink: 0;
  box-shadow: 0 6px 16px rgba(80, 120, 96, 0.08);
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
  font-weight: 700;
}

.terms-card {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid rgba(216, 221, 216, 0.95);
  border-radius: 28px;
  padding: 30px;
  box-shadow:
    0 18px 44px rgba(84, 108, 93, 0.10),
    0 3px 10px rgba(84, 108, 93, 0.05);
  backdrop-filter: blur(8px);
}

.card-glow {
  position: absolute;
  top: -80px;
  inset-inline-end: -80px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(143, 184, 156, 0.24) 0%, rgba(143, 184, 156, 0) 72%);
  pointer-events: none;
}

.terms-hero {
  position: relative;
  z-index: 1;
  margin-bottom: 28px;
  padding: 4px 2px 8px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background: linear-gradient(135deg, #edf6ef, #dceadf);
  border: 1px solid #d5e1d8;
  color: #52715e;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.4px;
  margin-bottom: 14px;
}

.terms-main-title {
  margin: 0;
  font-size: 42px;
  line-height: 1.1;
  font-weight: 800;
  color: #233b2f;
}

.terms-main-subtitle {
  margin: 14px 0 0;
  max-width: 760px;
  font-size: 16px;
  line-height: 1.8;
  color: #6f7d75;
  font-weight: 600;
}

.sections-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.section-card {
  background: linear-gradient(180deg, #ffffff 0%, #fbfcfb 100%);
  border: 1px solid #e0e6e1;
  border-radius: 20px;
  padding: 22px 20px;
  box-shadow: 0 4px 14px rgba(66, 92, 78, 0.05);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.section-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 22px rgba(66, 92, 78, 0.10);
  border-color: #cfdacf;
}

.section-card h3 {
  margin: 0 0 12px;
  font-size: 22px;
  line-height: 1.3;
  font-weight: 800;
  color: #294535;
}

.section-card p {
  margin: 0;
  font-size: 15px;
  line-height: 1.85;
  color: #55656b;
}

@media (max-width: 900px) {
  .sections-grid {
    grid-template-columns: 1fr;
  }

  .terms-main-title {
    font-size: 34px;
  }
}

@media (max-width: 700px) {
  .terms-wrap {
    padding: 14px 12px 30px;
  }

  .page-head {
    align-items: flex-start;
    flex-direction: column;
  }

  .head-actions {
    width: 100%;
    justify-content: space-between;
    margin-inline-start: 0;
  }

  .language-box {
    align-self: flex-start;
  }

  :dir(rtl) .language-box {
    align-self: flex-end;
  }

  .terms-card {
    padding: 20px 16px;
    border-radius: 22px;
  }

  .terms-main-title {
    font-size: 28px;
  }

  .terms-main-subtitle {
    font-size: 15px;
    line-height: 1.75;
  }

  .section-card {
    padding: 18px 16px;
    border-radius: 16px;
  }

  .section-card h3 {
    font-size: 19px;
  }

  .section-card p {
    font-size: 14px;
    line-height: 1.75;
  }
}
</style>
