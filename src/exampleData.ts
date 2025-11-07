import {
  AnnouncementContent,
  AnnouncementJs,
  ServiceContent,
  ServiceJs,
} from '#shared/xmlModels';
import { ref } from 'vue';
import z from 'zod';

const exampleAnnouncementXmlStrings = [
  `<?xml version="1.0" encoding="UTF-8"?>
<announcement>
    <title>New Recycling Bins Rolled Out Citywide</title>
    <date>2025-09-25</date>
    <content>The council has introduced new colour-coded recycling bins across residential neighborhoods. Collection schedules remain unchanged.</content>
</announcement>`,
  `<?xml version="1.0" encoding="UTF-8"?>
<announcement>
    <title>Public Meeting on Park Redevelopment Plans</title>
    <date>2025-09-30</date>
    <content>Residents are invited to attend a public meeting on the 7th of October to discuss proposed redevelopment plans for Riverbend Park.
    The meeting will be held at the Civic Centre Hall at 6 PM.</content>
</announcement>`,
  `<?xml version="1.0" encoding="UTF-8"?>
<announcement>
    <title>Scheduled Road Maintenance in Westside District</title>
    <date>2025-10-01</date>
    <content>The council will begin scheduled road maintenance on Main Street and adjoining roads from the 10th of October to the 14th of October.
    Residents are advised to plan alternative routes.</content>
</announcement>`,
];

const exampleServiceXmlStrings = [
  `<?xml version="1.0" encoding="UTF-8"?>
<service>
  <name>Building Permit Application</name>
  <description>Application and processing of permits for new building construction and renovations.</description>
  <fees>
    <fee title="Standard Permit">
      <price variant="residential">$150</price>
      <price variant="commercial">$500</price>
    </fee>
    <fee title="Expedited Permit">
      <price variant="residential">$300</price>
      <price variant="commercial">$900</price>
    </fee>
  </fees>
</service>`,
  `<?xml version="1.0" encoding="UTF-8"?>
<service>
  <name>Community Event Booking</name>
  <description>Reservation service for community halls and outdoor event spaces.</description>
</service>`,
  `<?xml version="1.0" encoding="UTF-8"?>
<service>
  <name>Waste Collection</name>
  <description>Weekly residential waste collection service.</description>
  <fees>
    <fee title="Monthly Subscription">
      <price variant="standard">$25</price>
    </fee>
  </fees>
</service>`,
];

const exampleAnnouncements = ref<z.infer<typeof AnnouncementJs>[]>(
  exampleAnnouncementXmlStrings.map((e) => AnnouncementContent.decode(e)),
);

const exampleServices = ref<z.infer<typeof ServiceJs>[]>(
  exampleServiceXmlStrings.map((e) => ServiceContent.decode(e)),
);

export function useExampleData() {
  return { announcements: exampleAnnouncements, services: exampleServices };
}
