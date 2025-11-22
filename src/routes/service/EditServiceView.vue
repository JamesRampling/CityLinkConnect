<script setup lang="ts">
import { Service } from '#shared/models';
import { ServiceContent, ServiceJs } from '#shared/xmlModels';
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import IconAdd from '@/components/icons/IconAdd.vue';
import IconBack from '@/components/icons/IconBack.vue';
import IconDelete from '@/components/icons/IconDelete.vue';
import IconRefresh from '@/components/icons/IconRefresh.vue';
import InputCheckbox from '@/components/InputCheckbox.vue';
import InputText from '@/components/InputText.vue';
import InputTextarea from '@/components/InputTextarea.vue';
import LoadedData from '@/components/LoadedData.vue';
import ValidationErrorList from '@/components/ValidationErrorList.vue';
import { useUser } from '@/user';
import { useSubmission } from '@/utils/validation';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import z from 'zod';

const props = defineProps<{ id: number }>();

const router = useRouter();

const { token } = useUser();

const EditServiceForm = ServiceJs.extend({ is_hidden: z.boolean() });

const fields = reactive<z.infer<typeof EditServiceForm>>({
  name: '',
  description: '',
  fees: [],
  is_hidden: false,
});
const {
  submit: submitStructural,
  fieldErrors,
  submissionError,
} = useSubmission(
  EditServiceForm,
  fields,
  ({ is_hidden, ...jsConfig }) => {
    const config = ServiceContent.encode(jsConfig);
    return api.services.update(props.id, { config, is_hidden }, token.value);
  },
  () => {
    router.back();
  },
);

const editingXml = ref(false);
const xmlFields = reactive({ config: '', is_hidden: false });
const {
  submit: submitXml,
  fieldErrors: xmlErrors,
  submissionError: xmlSubmissionError,
} = useSubmission(
  Service,
  xmlFields,
  (form) => api.services.update(props.id, form, token.value),
  () => {
    router.back();
  },
);

function toggleXmlEditing(state: boolean) {
  submissionError.value = undefined;
  xmlSubmissionError.value = undefined;
  editingXml.value = state;
}

function setFields(service: z.infer<typeof Service>) {
  try {
    fields.is_hidden = service.is_hidden;
    Object.assign(fields, ServiceContent.decode(service.config));
  } catch {}

  Object.assign(xmlFields, service);
}

async function submit() {
  if (editingXml.value) await submitXml();
  else await submitStructural();
}
</script>

<template>
  <div class="page-wrapper">
    <div class="button-row">
      <button class="back-button button-filled" @click="$router.back()">
        <IconBack />Back
      </button>

      <button
        v-if="!editingXml"
        class="button-outlined"
        @click="toggleXmlEditing(true)"
      >
        Edit as XML
      </button>
      <button v-else class="button-outlined" @click="toggleXmlEditing(false)">
        Edit as form
      </button>
    </div>

    <LoadedData
      :action="() => api.services.single(props.id, token)"
      @ok="setFields($event)"
    >
      <template #ok>
        <form class="form" @submit.prevent="submit()">
          <template v-if="!editingXml">
            <InputCheckbox
              v-model="fields.is_hidden"
              name="is_hidden"
              label="Hidden"
            />

            <InputText v-model="fields.name" name="title" label="Name" />
            <ValidationErrorList :errors="fieldErrors.name" />

            <InputTextarea
              v-model="fields.description"
              name="text"
              label="Content"
            />
            <ValidationErrorList :errors="fieldErrors.description" />

            <div v-if="fields.fees" class="fees">
              <div v-for="fee of fields.fees" :key="fee.title" class="fee">
                <div class="input-row">
                  <button
                    class="button-outlined"
                    @click="fields.fees.splice(fields.fees.indexOf(fee), 1)"
                  >
                    <IconDelete aria-label="Remove fee" />
                  </button>

                  <InputText v-model="fee.title" name="title" label="Title" />
                </div>

                <ul class="price-list">
                  <li
                    v-for="price of fee.prices"
                    :key="price.variant"
                    class="input-row"
                  >
                    <button
                      class="button-outlined"
                      @click="fee.prices.splice(fee.prices.indexOf(price), 1)"
                    >
                      <IconDelete aria-label="Remove variant" />
                    </button>
                    <InputText
                      v-model="price.variant"
                      name="variant"
                      label="Variant"
                    />
                    <InputText
                      v-model="price.price"
                      name="price"
                      label="Price"
                    />
                  </li>

                  <li>
                    <button
                      class="button-outlined"
                      @click="
                        fee.prices.splice(fee.prices.length, 0, {
                          variant: '',
                          price: '$0',
                        })
                      "
                    >
                      <IconAdd aria-hidden="true" />Add variant
                    </button>
                  </li>
                </ul>
              </div>
              <button
                class="button-outlined"
                @click="
                  fields.fees.splice(fields.fees.length, 0, {
                    title: '',
                    prices: [],
                  })
                "
              >
                <IconAdd aria-hidden="true" />Add fee
              </button>
              <ValidationErrorList :errors="fieldErrors.fees" />
            </div>
          </template>
          <template v-else>
            <InputCheckbox
              v-model="xmlFields.is_hidden"
              name="is_hidden"
              label="Hidden"
            />

            <InputTextarea
              v-model="xmlFields.config"
              name="text"
              label="Config"
            />
            <ValidationErrorList :errors="xmlErrors.config" />
          </template>

          <div class="button-row">
            <button type="submit" class="button-filled">Submit</button>
          </div>

          <ApiErrorMessage
            v-if="!editingXml && submissionError"
            class="small"
            :error="submissionError"
          />
          <ApiErrorMessage
            v-else-if="xmlSubmissionError"
            class="small"
            :error="xmlSubmissionError"
          />
        </form>
      </template>

      <template #error="{ error, retry }">
        <ApiErrorMessage :error>
          <button class="button-filled" @click="retry()">
            <IconRefresh />Retry
          </button>
        </ApiErrorMessage>
      </template>
    </LoadedData>
  </div>
</template>

<style scoped>
.back-button {
  width: fit-content;
}

time {
  color: var(--color-muted);
  font-weight: 700;
  font-size: 1.25rem;
}

.page-wrapper {
  gap: 1rem;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.price-list {
  list-style: none;
  padding-inline-start: 3rem;
}

.fees,
.fee,
.price-list {
  display: grid;
  gap: 2rem;
  place-items: start;
}

.fee,
.price-list {
  gap: 1rem;
}
</style>
