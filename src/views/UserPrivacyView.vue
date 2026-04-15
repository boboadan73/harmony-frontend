<template>
  <UserLayout>
    <div class="privacy-page">
      <div class="privacy-card">
        <h1>{{ policy.title }}</h1>

        <div
          v-for="section in policy.sections"
          :key="section.heading"
          class="section"
        >
          <h2>{{ section.heading }}</h2>
          <p>{{ section.text }}</p>
        </div>
      </div>
    </div>
  </UserLayout>
</template>

<script setup>

import UserLayout from "@/components/user/UserLayout.vue"
import { userPrivacyPolicy as policy } from "@/content/userPrivacyPolicy"
</script>

<style scoped>
.privacy-page {
  padding: 40px;
}

.privacy-card {
  width: 100%;
  max-width: 1000px;
  background: #fff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.privacy-card h1 {
  margin-bottom: 28px;
  font-size: 42px;
  font-weight: 700;
}

.section {
  margin-bottom: 28px;
}

.section h2 {
  margin-bottom: 10px;
  font-size: 24px;
  font-weight: 700;
}

.section p {
  line-height: 1.7;
  color: #333;
}
</style>
