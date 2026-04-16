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
    pageSubtitle: 'Read how administrator data is handled',
    badge: 'Harmony Admin',
    title: 'Admin Privacy Policy',
    intro:
      'This Privacy Policy describes how the Harmony Intelligent Networking System Admin Panel collects, uses, and protects administrator information.',
    sections: [
      {
        heading: 'Purpose',
        text:
          'This Privacy Policy describes how the Harmony Intelligent Networking System Admin Panel collects, uses, and protects administrator information.',
      },
      {
        heading: 'Information We Collect',
        text:
          'When administrators access the system, we may collect name, email address, authentication identifier from Microsoft Azure Entra ID, admin activity logs, and technical data.',
      },
      {
        heading: 'Authentication',
        text:
          'Administrator access is provided using Microsoft Azure Entra ID. Authentication is handled by Microsoft, and we only receive basic profile information required for authorization.',
      },
      {
        heading: 'How We Use Information',
        text:
          'We use administrator information to authenticate authorized administrators, manage events and participant data, provide analytics dashboards, monitor system usage, and maintain system security.',
      },
      {
        heading: 'Data Storage',
        text:
          'Administrator-related data may be stored securely using Microsoft Azure services, including Azure Cosmos DB and secure cloud infrastructure with restricted access.',
      },
      {
        heading: 'Data Sharing',
        text:
          'We do not sell or share administrator information. Data may be shared only with Microsoft Azure services required for system operation, if required by law, or to protect system security.',
      },
      {
        heading: 'Data Retention',
        text:
          'Administrator data is retained only for the duration of the project deployment and testing period.',
      },
      {
        heading: 'Security',
        text:
          'We implement Azure Entra ID authentication, role-based access control, HTTPS encryption, and restricted database access.',
      },
      {
        heading: 'Academic Project Notice',
        text:
          'This system is developed as part of an academic project and may change before production release.',
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
    pageSubtitle: 'اقرأ كيف يتم التعامل مع بيانات المديرين',
    badge: 'Harmony Admin',
    title: 'سياسة خصوصية المشرف',
    intro:
      'توضح سياسة الخصوصية هذه كيف تقوم لوحة إدارة نظام Harmony الذكي للتواصل بجمع معلومات المشرفين واستخدامها وحمايتها.',
    sections: [
      {
        heading: 'الغرض',
        text:
          'توضح سياسة الخصوصية هذه كيف تقوم لوحة إدارة نظام Harmony الذكي للتواصل بجمع معلومات المشرفين واستخدامها وحمايتها.',
      },
      {
        heading: 'المعلومات التي نجمعها',
        text:
          'عند دخول المشرفين إلى النظام، قد نقوم بجمع الاسم، عنوان البريد الإلكتروني، معرّف المصادقة من Microsoft Azure Entra ID، سجلات نشاط المشرف، والبيانات التقنية.',
      },
      {
        heading: 'المصادقة',
        text:
          'يتم توفير وصول المشرفين باستخدام Microsoft Azure Entra ID. تتم المصادقة من خلال Microsoft، ونحن نتلقى فقط معلومات الملف الشخصي الأساسية المطلوبة للتفويض.',
      },
      {
        heading: 'كيف نستخدم المعلومات',
        text:
          'نستخدم معلومات المشرفين لمصادقة المشرفين المصرح لهم، وإدارة الفعاليات وبيانات المشاركين، وتوفير لوحات التحليلات، ومراقبة استخدام النظام، والحفاظ على أمان النظام.',
      },
      {
        heading: 'تخزين البيانات',
        text:
          'قد يتم تخزين البيانات المتعلقة بالمشرفين بشكل آمن باستخدام خدمات Microsoft Azure، بما في ذلك Azure Cosmos DB وبنية سحابية آمنة ذات وصول مقيّد.',
      },
      {
        heading: 'مشاركة البيانات',
        text:
          'نحن لا نبيع أو نشارك معلومات المشرفين. قد تتم مشاركة البيانات فقط مع خدمات Microsoft Azure اللازمة لتشغيل النظام، أو إذا كان ذلك مطلوبًا بموجب القانون، أو لحماية أمن النظام.',
      },
      {
        heading: 'الاحتفاظ بالبيانات',
        text:
          'يتم الاحتفاظ ببيانات المشرفين فقط طوال مدة نشر المشروع وفترة الاختبار.',
      },
      {
        heading: 'الأمان',
        text:
          'نقوم بتطبيق مصادقة Azure Entra ID، والتحكم في الوصول حسب الأدوار، وتشفير HTTPS، وتقييد الوصول إلى قاعدة البيانات.',
      },
      {
        heading: 'إشعار المشروع الأكاديمي',
        text:
          'تم تطوير هذا النظام كجزء من مشروع أكاديمي، وقد يتغير قبل الإطلاق الإنتاجي.',
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
    pageSubtitle: 'קראי/קרא כיצד מנוהל מידע של מנהלים',
    badge: 'Harmony Admin',
    title: 'מדיניות פרטיות לאדמין',
    intro:
      'מדיניות פרטיות זו מתארת כיצד פאנל הניהול של Harmony Intelligent Networking System אוסף, משתמש ושומר על מידע של מנהלים.',
    sections: [
      {
        heading: 'מטרה',
        text:
          'מדיניות פרטיות זו מתארת כיצד פאנל הניהול של Harmony Intelligent Networking System אוסף, משתמש ושומר על מידע של מנהלים.',
      },
      {
        heading: 'המידע שאנו אוספים',
        text:
          'כאשר מנהלים ניגשים למערכת, אנו עשויים לאסוף שם, כתובת דוא"ל, מזהה אימות מ־Microsoft Azure Entra ID, יומני פעילות של אדמינים ונתונים טכניים.',
      },
      {
        heading: 'אימות',
        text:
          'הגישה למנהלים ניתנת באמצעות Microsoft Azure Entra ID. האימות מתבצע על ידי Microsoft, ואנו מקבלים רק מידע בסיסי מהפרופיל שנדרש לצורך הרשאה.',
      },
      {
        heading: 'כיצד אנו משתמשים במידע',
        text:
          'אנו משתמשים במידע של מנהלים כדי לאמת מנהלים מורשים, לנהל אירועים ונתוני משתתפים, לספק לוחות אנליטיקה, לנטר שימוש במערכת ולשמור על אבטחת המערכת.',
      },
      {
        heading: 'אחסון נתונים',
        text:
          'נתונים הקשורים למנהלים עשויים להישמר באופן מאובטח באמצעות שירותי Microsoft Azure, כולל Azure Cosmos DB ותשתית ענן מאובטחת עם גישה מוגבלת.',
      },
      {
        heading: 'שיתוף נתונים',
        text:
          'איננו מוכרים או משתפים מידע של מנהלים. נתונים עשויים להיות משותפים רק עם שירותי Microsoft Azure הנדרשים להפעלת המערכת, אם נדרש על פי חוק, או כדי להגן על אבטחת המערכת.',
      },
      {
        heading: 'שמירת נתונים',
        text:
          'נתוני מנהלים נשמרים רק למשך תקופת הפריסה והבדיקות של הפרויקט.',
      },
      {
        heading: 'אבטחה',
        text:
          'אנו מיישמים Azure Entra ID authentication, בקרת גישה מבוססת תפקידים, הצפנת HTTPS וגישה מוגבלת למסד הנתונים.',
      },
      {
        heading: 'הודעה על פרויקט אקדמי',
        text:
          'מערכת זו מפותחת כחלק מפרויקט אקדמי, וייתכנו בה שינויים לפני גרסת הייצור.',
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
