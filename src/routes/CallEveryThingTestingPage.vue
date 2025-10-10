<template>
  <div>
    <h1>Call Everything Testing Page</h1>

    <!-- Desktop announcement -->
    <AnnouncementArticle
      title="Exciting Update Released!"
      author="Jane Doe"
      date="September 25, 2025"
      summary="We are thrilled to announce a major update to CityLinkConnect. Enjoy new features and improvements!"
    />

    <!-- Mobile announcement -->
    <AnnouncementArticleMobile
      title="Mobile: Exciting Update Released!"
      author="John Smith"
      date="September 25, 2025"
      summary="Mobile users: here's a short summary of the update for smaller screens."
    />

    <!-- Accessibility popup (will be shown on mount for testing) -->
    <AccessibilityPopup ref="accessibilityRef" :target="getDocumentBody()" />

    <!-- Edit info component -->
    <EditInfo />
  </div>
</template>

<script setup lang="ts">
import AccessibilityPopup from '@/components/AccessibilityPopup.vue';
import AnnouncementArticle from '@/components/AnnouncementArticle.vue';
import AnnouncementArticleMobile from '@/components/AnnouncementArticleMobile.vue';
import EditInfo from '@/components/EditInfo.vue';
import { onMounted, ref } from 'vue';

const accessibilityRef = ref<{ show?: () => void } | null>(null);

function getDocumentBody(): HTMLElement | undefined {
  return typeof document !== 'undefined' ? document.body : undefined;
}

onMounted(() => {
  // call the exposed show() method on the AccessibilityPopup component for testing
  // AccessibilityPopup requires a `target` prop; pass a dummy element (document.body)
  // for testing because the prop is typed as HTMLElement.
  accessibilityRef.value?.show?.();
});
</script>
