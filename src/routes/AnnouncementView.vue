<script setup lang="ts">
defineProps<{ id: number }>();

import AnnouncementArticle from '@/components/AnnouncementArticle.vue';
import EditInfo from '@/components/EditInfo.vue';
</script>

<template>
  <div>
    <AnnouncementArticle
      title="CityLinkConnect Launches New Initiative to Boost Local Businesses"
      date="10/10/2025"
      author="CityLinkConnect Staff"
      summary="CityLinkConnect, the growing hub for local events, business news, and community updates, has announced a new initiative aimed at helping small businesses strengthen their online presence and connect with nearby customers."
    />
    <AnnouncementArticle
      title="Exciting Update Released!"
      author="Jane Doe"
      date="September 25, 2025"
      summary="We are thrilled to announce a major update to CityLinkConnect. Enjoy new features and improvements!"
    />
    <AnnouncementArticle
      title="Community Event: CityLinkConnect Annual Meetup"
      author="John Smith"
      date="August 15, 2025"
      summary="Join us for the CityLinkConnect Annual Meetup! Network with fellow community members, share ideas, and celebrate our achievements over the past year."
    />
  </div>
  <EditInfo />
</template>

<style lang="css" scoped>
div {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
