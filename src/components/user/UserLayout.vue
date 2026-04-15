<template>
  <div>
    <TopNav />
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
import TopNav from "@/components/TopNav.vue"
</script>

<style scoped>
main {
  padding: 20px;
}
</style>
