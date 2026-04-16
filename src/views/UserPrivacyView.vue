<template>
  <UserLayout>
    <div class="privacy-page" :dir="isRtl ? 'rtl' : 'ltr'">
      <div class="privacy-wrap">
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

        <div class="privacy-card">
          <div class="card-glow"></div>

          <div class="privacy-hero">
            <div class="hero-badge">{{ t.badge }}</div>
            <h2 class="privacy-main-title">{{ t.title }}</h2>
            <p class="privacy-main-subtitle">{{ t.intro }}</p>
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
    pageTitle: 'Privacy Policy',
    pageSubtitle: 'Read how participant data is handled',
    badge: 'Harmony User',
    title: 'User Privacy Policy',
    intro:
      'Please read these terms carefully before using the Harmony Intelligent Networking System.',
    sections: [
      {
        heading: 'Purpose',
        text:
          'This Privacy Policy explains how the Harmony Intelligent Networking System collects, uses, and protects participant information during the event experience.',
      },
      {
        heading: 'Information We Collect',
        text:
          'When participants use the system, we may collect profile information such as name, phone number, professional details, academic background, personal interests, profile image, and event-related information.',
      },
      {
        heading: 'How We Use Information',
        text:
          'We use participant information to identify the participant within the event, generate networking recommendations, display relevant matches, and improve the event networking experience.',
      },
      {
        heading: 'Authentication',
        text:
          'Participant access is provided through the event login flow using the information submitted for the event. We do not use OTP authentication for participants in this flow.',
      },
      {
        heading: 'Data Storage',
        text:
          'Participant-related data may be stored securely in protected cloud systems, including Microsoft Azure services such as Azure Cosmos DB, for the operation of the project.',
      },
      {
        heading: 'Data Sharing',
        text:
          'We do not sell participant information. Data is used only for the operation of the Harmony system and may be processed through secure infrastructure required for the project.',
      },
      {
        heading: 'Data Retention',
        text:
          'Participant data is retained only for the period necessary for the event, project operation, and academic testing, and may later be deleted according to project needs.',
      },
      {
        heading: 'Security',
        text:
          'We apply reasonable security measures such as HTTPS communication, controlled backend access, and restricted database access to protect participant information.',
      },
      {
        heading: 'Academic Project Notice',
        text:
          'This system is developed as part of an academic project and may change before any future production release.',
      },
      {
        heading: 'Contact',
        text:
          '[Project team email]',
      },
    ],
  },

  ar: {
    pageTitle: 'سياسة الخصوصية',
    pageSubtitle: 'اقرأ كيف يتم التعامل مع بيانات المشاركين',
    badge: 'Harmony User',
    title: 'سياسة خصوصية المستخدم',
    intro:
      'توضح سياسة الخصوصية هذه كيف يقوم نظام Harmony الذكي للتواصل بجمع معلومات المشاركين واستخدامها وحمايتها خلال تجربة الفعالية.',
    sections: [
      {
        heading: 'الغرض',
        text:
          'توضح سياسة الخصوصية هذه كيف يقوم نظام Harmony الذكي للتواصل بجمع معلومات المشاركين واستخدامها وحمايتها خلال تجربة الفعالية.',
      },
      {
        heading: 'المعلومات التي نجمعها',
        text:
          'عند استخدام المشاركين للنظام، قد نقوم بجمع معلومات الملف الشخصي مثل الاسم، رقم الهاتف، التفاصيل المهنية، الخلفية الأكاديمية، الاهتمامات الشخصية، صورة الملف الشخصي، ومعلومات متعلقة بالفعالية.',
      },
      {
        heading: 'كيف نستخدم المعلومات',
        text:
          'نستخدم معلومات المشاركين للتعرف على المشارك داخل الفعالية، وإنشاء توصيات للتواصل، وعرض المطابقات المناسبة، وتحسين تجربة التواصل داخل الفعالية.',
      },
      {
        heading: 'المصادقة',
        text:
          'يتم توفير وصول المشاركين من خلال مسار تسجيل الدخول الخاص بالفعالية باستخدام المعلومات المقدمة عند التسجيل. نحن لا نستخدم مصادقة OTP للمشاركين في هذا المسار.',
      },
      {
        heading: 'تخزين البيانات',
        text:
          'قد يتم تخزين البيانات المتعلقة بالمشاركين بشكل آمن في أنظمة سحابية محمية، بما في ذلك خدمات Microsoft Azure مثل Azure Cosmos DB، لتشغيل المشروع.',
      },
      {
        heading: 'مشاركة البيانات',
        text:
          'نحن لا نبيع معلومات المشاركين. تُستخدم البيانات فقط لتشغيل نظام Harmony، وقد تتم معالجتها من خلال بنية تحتية آمنة مطلوبة للمشروع.',
      },
      {
        heading: 'الاحتفاظ بالبيانات',
        text:
          'يتم الاحتفاظ ببيانات المشاركين فقط للفترة اللازمة للفعالية وتشغيل المشروع والاختبارات الأكاديمية، وقد يتم حذفها لاحقًا وفقًا لاحتياجات المشروع.',
      },
      {
        heading: 'الأمان',
        text:
          'نطبق إجراءات أمان معقولة مثل الاتصال عبر HTTPS، والوصول المتحكم به إلى الخادم، وتقييد الوصول إلى قاعدة البيانات لحماية معلومات المشاركين.',
      },
      {
        heading: 'إشعار المشروع الأكاديمي',
        text:
          'تم تطوير هذا النظام كجزء من مشروع أكاديمي، وقد يتغير قبل أي إصدار إنتاجي مستقبلي.',
      },
      {
        heading: 'التواصل',
        text:
          '[بريد فريق المشروع]',
      },
    ],
  },

  he: {
    pageTitle: 'מדיניות פרטיות',
    pageSubtitle: 'קראי/קרא כיצד מידע המשתתפים מנוהל',
    badge: 'Harmony User',
    title: 'מדיניות פרטיות למשתמש',
    intro:
      'מדיניות פרטיות זו מסבירה כיצד מערכת Harmony Intelligent Networking System אוספת, משתמשת ושומרת על מידע של משתתפים במהלך חוויית האירוע.',
    sections: [
      {
        heading: 'מטרה',
        text:
          'מדיניות פרטיות זו מסבירה כיצד מערכת Harmony Intelligent Networking System אוספת, משתמשת ושומרת על מידע של משתתפים במהלך חוויית האירוע.',
      },
      {
        heading: 'המידע שאנו אוספים',
        text:
          'כאשר משתתפים משתמשים במערכת, אנו עשויים לאסוף מידע פרופיל כגון שם, מספר טלפון, פרטים מקצועיים, רקע אקדמי, תחומי עניין אישיים, תמונת פרופיל ומידע הקשור לאירוע.',
      },
      {
        heading: 'כיצד אנו משתמשים במידע',
        text:
          'אנו משתמשים במידע של משתתפים כדי לזהות את המשתתף בתוך האירוע, לייצר המלצות לנטוורקינג, להציג התאמות רלוונטיות ולשפר את חוויית הנטוורקינג באירוע.',
      },
      {
        heading: 'אימות',
        text:
          'הגישה של המשתתפים ניתנת דרך תהליך ההתחברות של האירוע באמצעות המידע שנמסר עבור האירוע. אין שימוש באימות OTP עבור משתתפים בתהליך זה.',
      },
      {
        heading: 'אחסון נתונים',
        text:
          'נתונים הקשורים למשתתפים עשויים להישמר באופן מאובטח במערכות ענן מוגנות, כולל שירותי Microsoft Azure כגון Azure Cosmos DB, לצורך תפעול הפרויקט.',
      },
      {
        heading: 'שיתוף נתונים',
        text:
          'איננו מוכרים מידע של משתתפים. הנתונים משמשים רק להפעלת מערכת Harmony, ועשויים להיות מעובדים באמצעות תשתית מאובטחת הנדרשת לפרויקט.',
      },
      {
        heading: 'שמירת נתונים',
        text:
          'נתוני משתתפים נשמרים רק למשך התקופה הנדרשת עבור האירוע, תפעול הפרויקט והבדיקות האקדמיות, ולאחר מכן עשויים להימחק בהתאם לצורכי הפרויקט.',
      },
      {
        heading: 'אבטחה',
        text:
          'אנו מיישמים אמצעי אבטחה סבירים כגון תקשורת HTTPS, גישת backend מבוקרת וגישה מוגבלת למסד הנתונים כדי להגן על מידע המשתתפים.',
      },
      {
        heading: 'הודעה על פרויקט אקדמי',
        text:
          'מערכת זו מפותחת כחלק מפרויקט אקדמי, וייתכנו בה שינויים לפני כל גרסת ייצור עתידית.',
      },
      {
        heading: 'יצירת קשר',
        text:
          '[אימייל צוות הפרויקט]',
      },
    ],
  },
}

const t = computed(() => TEXTS[lang.value] ?? TEXTS.en)
const isRtl = computed(() => lang.value === 'ar' || lang.value === 'he')
</script>

<style scoped>
.privacy-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(143, 184, 156, 0.14), transparent 26%),
    radial-gradient(circle at top right, rgba(111, 153, 121, 0.12), transparent 24%),
    linear-gradient(180deg, #f6f8f6 0%, #eef3ef 100%);
  color: #45545a;
  font-family: Arial, sans-serif;
}

.privacy-wrap {
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

.privacy-card {
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

.privacy-hero {
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

.privacy-main-title {
  margin: 0;
  font-size: 42px;
  line-height: 1.1;
  font-weight: 800;
  color: #233b2f;
}

.privacy-main-subtitle {
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

  .privacy-main-title {
    font-size: 34px;
  }
}

@media (max-width: 700px) {
  .privacy-wrap {
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

  .privacy-card {
    padding: 20px 16px;
    border-radius: 22px;
  }

  .privacy-main-title {
    font-size: 28px;
  }

  .privacy-main-subtitle {
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
