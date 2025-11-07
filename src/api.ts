import { Service } from '#shared/models';
import { makeRequest } from '@/utils/makeRequest';
import type z from 'zod';

const origin = '/api';

export const Api = {
  Services: {
    endpoint: `${origin}/services`,
    withoutId: Service.omit({ service_id: true }),
    withId: Service.required({ service_id: true }),

    async all() {
      return await makeRequest({
        route: this.endpoint,
        method: 'GET',
        outputSchema: Service.array(),
      });
    },

    async single(id: number) {
      return await makeRequest({
        route: `${this.endpoint}/${id}`,
        method: 'GET',
        outputSchema: Service,
      });
    },

    async create(service: z.input<typeof this.withoutId>) {
      return await makeRequest({
        route: this.endpoint,
        method: 'POST',
        outputSchema: Service,
        inputSchema: this.withoutId,
        data: service,
      });
    },

    async update(service: z.input<typeof this.withId>) {
      return await makeRequest({
        route: `${this.endpoint}/${service.service_id}`,
        method: 'PUT',
        outputSchema: Service,
        inputSchema: this.withId,
        data: service,
      });
    },

    async delete(id: number) {
      return await makeRequest({
        route: `${this.endpoint}/${id}`,
        method: 'DELETE',
      });
    },
  },
};
