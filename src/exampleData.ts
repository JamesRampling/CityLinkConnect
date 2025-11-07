import { AnnouncementXML, ServiceXML } from '#shared/xmlModels';
import { ref } from 'vue';
import z from 'zod';

const exampleAnnouncements = ref<z.infer<typeof AnnouncementXML>[]>([
  {
    title: 'New Recycling Bins Rolled Out Citywide',
    date: '2025-09-25',
    content:
      'The council has introduced new colour-coded recycling bins across residential neighborhoods. Collection schedules remain unchanged.',
  },
  {
    title: 'Public Meeting on Park Redevelopment Plans',
    date: '2025-09-30',
    content: `Residents are invited to attend a public meeting on the 7th of October to discuss proposed redevelopment plans for Riverbend Park.
The meeting will be held at the Civic Centre Hall at 6 PM.`,
  },
  {
    title: 'Scheduled Road Maintenance in Westside District',
    date: '2025-10-01',
    content: `The council will begin scheduled road maintenance on Main Street and adjoining roads from the 10th of October to the 14th of October.
Residents are advised to plan alternative routes.`,
  },
]);

const exampleServices = ref<z.infer<typeof ServiceXML>[]>([
  {
    name: 'Building Permit Application',
    description:
      'Application and processing of permits for new building construction and renovations.',
    fees: {
      'Standard Permit': { Residential: '$150', Commerical: '$500' },
      'Expedited Permit': { Residential: '$300', Commercial: '$900' },
    },
  },
  {
    name: 'Community Event Booking',
    description:
      'Reservation service for community halls and outdoor event spaces.',
  },
  {
    name: 'Waste Collection',
    description: 'Weekly residential waste collection service.',
    fees: { 'Monthly Subscription': { Standard: '$25' } },
  },
]);

export function useExampleData() {
  return { announcements: exampleAnnouncements, services: exampleServices };
}
