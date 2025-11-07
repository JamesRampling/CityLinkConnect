import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import z from 'zod';

const parser = new XMLParser({ ignoreAttributes: false });
const builder = new XMLBuilder({ ignoreAttributes: false });

export const AnnouncementXML = z.object({
  announcement: z.object({
    title: z.string(),
    date: z.iso.date(),
    content: z.string(),
  }),
});

export const AnnouncementJS = z.object({
  title: z.string(),
  date: z.iso.date(),
  content: z.string(),
});

export const ServiceXML = z.object({
  service: z.object({
    name: z.string(),
    description: z.string(),
    fees: z
      .object({
        fee: z
          .object({
            price: z
              .object({ '#text': z.string(), '@_variant': z.string() })
              .array(),
            '@_title': z.string(),
          })
          .array(),
      })
      .optional(),
  }),
});

export const ServiceJS = z.object({
  name: z.string(),
  description: z.string(),
  fees: z.record(z.string(), z.record(z.string(), z.string())).optional(),
});

const announcementXMLtoJS = z.codec(AnnouncementXML, AnnouncementJS, {
  decode: (value) => value.announcement,
  encode: (value) => ({ announcement: value }),
});

const serviceXMLtoJS = z.codec(ServiceXML, ServiceJS, {
  decode: (value) => {
    const { name, description, fees: feesObj } = value.service;

    if (!feesObj) {
      return { name, description };
    }

    const fees = Object.fromEntries(
      feesObj.fee.map(({ '@_title': title, price: prices }) => [
        title,
        prices.reduce<Record<string, string>>(
          (obj, { '@_variant': variant, '#text': text }) => (
            (obj[variant] = text),
            obj
          ),
          {},
        ),
      ]),
    );

    return { name, description, fees };
  },

  encode: (value) => {
    const { name, description, fees: feesRecord } = value;

    if (!feesRecord) {
      return { service: { name, description } };
    }

    const fee = Object.entries(feesRecord).map(([title, prices]) => ({
      price: Object.entries(prices).map(([variant, price]) => ({
        '@_variant': variant,
        '#text': price,
      })),
      '@_title': title,
    }));

    return { service: { name, description, fees: { fee } } };
  },
});
