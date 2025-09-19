<script setup lang="ts">
import * as article from '#shared/randomArticle';

defineProps<{ articleTitle: string; articleContent: string }>();
</script>

<template>
  <flex-col id="articleFlexCol">
    {{ article.article.title }}
    <flex-row id="articleFlexRow">{{ article.article.result }}</flex-row>
  </flex-col>
</template>
