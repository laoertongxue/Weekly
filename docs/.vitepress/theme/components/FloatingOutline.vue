<template>
  <Teleport to="body">
    <div v-if="headers.length > 0" class="floating-outline" :class="{ 'is-open': isOpen }">
        <button class="floating-outline__btn" @click="toggle" :title="isOpen ? '收起大纲' : '大纲'">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </button>

        <Transition name="outline-overlay">
          <div v-if="isOpen" class="floating-outline__overlay" @click="close">
            <Transition name="outline-panel">
              <div v-if="isOpen" class="floating-outline__panel" @click.stop>
                <div class="floating-outline__header">
                  <span>目录大纲</span>
                  <button class="floating-outline__close" @click="close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <nav class="floating-outline__nav">
                  <ul>
                    <li
                      v-for="header in headers"
                      :key="header.link"
                      :class="{ [`outline-item--${header.level}`]: true }"
                    >
                      <a
                        :href="header.link"
                        :class="{ active: activeAnchor === header.slug }"
                        @click="close"
                      >{{ header.title }}</a>
                      <ul v-if="header.children?.length">
                        <li
                          v-for="child in header.children"
                          :key="child.link"
                          :class="{ [`outline-item--${child.level}`]: true }"
                        >
                          <a
                            :href="child.link"
                            :class="{ active: activeAnchor === child.slug }"
                            @click="close"
                          >{{ child.title }}</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </Transition>
          </div>
        </Transition>
      </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useData, useRoute } from "vitepress";

const { page } = useData();
const route = useRoute();

const headers = computed(() => {
  const h = page.value?.headers || [];
  return h.filter((header: any) => header.level >= 2 && header.level <= 4);
});

const isOpen = ref(false);
const activeAnchor = ref("");

watch(
  () => route.path,
  () => {
    isOpen.value = false;
  }
);

let cleanup: (() => void) | null = null;

onMounted(() => {
  activeAnchor.value = window.location.hash.slice(1);

  const handleHashChange = () => {
    activeAnchor.value = window.location.hash.slice(1);
  };
  window.addEventListener("hashchange", handleHashChange);

  cleanup = () => {
    window.removeEventListener("hashchange", handleHashChange);
  };
});

onUnmounted(() => {
  if (cleanup) cleanup();
});

function toggle() {
  isOpen.value = !isOpen.value;
}

function close() {
  isOpen.value = false;
}
</script>

<style lang="scss" scoped>
.floating-outline {
  position: fixed;
  right: 16px;
  bottom: 40%;
  z-index: 30;
}

.floating-outline__btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(12px);

  &:hover {
    color: var(--vp-c-brand-1);
    border-color: var(--vp-c-brand-1);
    background: var(--vp-c-bg);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }
}

.floating-outline.is-open .floating-outline__btn {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.floating-outline__overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(0, 0, 0, 0.1);
}

.floating-outline__panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background: var(--vp-c-bg);
  border-left: 1px solid var(--vp-c-divider);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.06);
  overflow-y: auto;
  z-index: 41;
}

.floating-outline__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  border-bottom: 1px solid var(--vp-c-divider);
  position: sticky;
  top: 0;
  background: var(--vp-c-bg);
}

.floating-outline__close {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-1);
  }
}

.floating-outline__nav {
  padding: 12px 0;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    margin: 0;
  }

  a {
    display: block;
    padding: 4px 20px;
    font-size: 13px;
    line-height: 1.7;
    color: var(--vp-c-text-2);
    text-decoration: none;
    border-left: 2px solid transparent;
    transition: all 0.15s ease;
    word-break: break-all;

    &:hover {
      color: var(--vp-c-brand-1);
    }

    &.active {
      color: var(--vp-c-brand-1);
      border-left-color: var(--vp-c-brand-1);
      background: var(--vp-c-brand-soft);
    }
  }
}

.outline-item--3 a {
  padding-left: 36px;
  font-size: 13px;
}

.outline-item--4 a {
  padding-left: 52px;
  font-size: 12px;
}

.outline-overlay-enter-active,
.outline-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.outline-overlay-enter-from,
.outline-overlay-leave-to {
  opacity: 0;
}

.outline-panel-enter-active,
.outline-panel-leave-active {
  transition: transform 0.3s ease;
}

.outline-panel-enter-from,
.outline-panel-leave-to {
  transform: translateX(100%);
}
</style>
