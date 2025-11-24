<script setup lang="ts">
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import IconAdd from '@/components/icons/IconAdd.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import LoadedData from '@/components/LoadedData.vue';
import ZodErrorMessage from '@/components/ZodErrorMessage.vue';
import { useUser } from '@/user';
import { isZodError } from '@/utils';

const { token } = useUser();
</script>

<template>
  <div class="item-list">
    <LoadedData :action="() => api.services.allAdmin(token)">
      <template #ok="{ data: services }">
        <div class="list-actions button-row">
          <router-link to="/services/create" class="button-filled"
            ><IconAdd aria-hidden="true" />Add Service</router-link
          >
        </div>

        <router-link
          v-for="service in services"
          :key="service.service_id"
          :to="`/services/book/${service.service_id}`"
          :class="{
            clickable: true,
            card: true,
            'service-card': true,
            hidden: service.is_hidden,
          }"
        >
          <div class="card-actions button-row">
            <router-link
              class="button-outlined"
              :to="`/services/edit/${service.service_id}`"
              ><IconEdit aria-hidden="true" />Edit</router-link
            >
          </div>
          <ZodErrorMessage
            v-if="isZodError(service.config)"
            :error="service.config"
          >
            <template #title>Malformed XML data</template>
          </ZodErrorMessage>
          <template v-else>
            <h2 class="title">
              <span class="title-text">{{ service.config.name }}</span>
              <span class="tag hidden-tag" aria-label=" (hidden)">hidden</span>
            </h2>
            <p>{{ service.config.description }}</p>
            <div v-if="service?.config.fees" class="fees">
              <div
                v-for="{ title, prices } of service.config.fees"
                :key="title"
                class="fee"
              >
                <h3>{{ title }}</h3>
                <ul>
                  <li v-for="{ variant, price } of prices" :key="variant">
                    <strong class="fee-name">{{ variant }}</strong> &ndash;
                    {{ price }}
                  </li>
                </ul>
              </div>
            </div>
          </template>
        </router-link>
      </template>

      <template #error="{ error }">
        <ApiErrorMessage :error />
      </template>
    </LoadedData>
  </div>
</template>

<style scoped>
.item-list {
  display: grid;
  gap: 1rem;
}

.list-actions {
  margin-inline: 1.5rem;
}

.card {
  .title {
    font-size: 1.5rem;
  }
}

.service-card {
  &:not(.hidden) .hidden-tag {
    display: none;
  }

  &.hidden {
    opacity: 0.6;
  }

  p,
  .fee,
  .fee h3 {
    margin-block-end: 0.5rem;
  }
}
</style>
