<template>
  <UserLayout>
    <div class="terms-page">
      <div class="terms-card">
        <h1>{{ terms.title }}</h1>

        <div
          v-for="section in terms.sections"
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
import UserLayout from "@/user/UserLayout.vue";
import { userTermsOfUse as terms } from "../content/userTermsOfUse"
</script>

<style scoped>
.terms-page {
  padding: 40px;
}

.terms-card {
  width: 100%;
  max-width: 1000px;
  background: #fff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.terms-card h1 {
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
