import {
  XMLBuilder,
  XMLParser,
  XMLValidator,
  type X2jOptions,
} from 'fast-xml-parser';
import z from 'zod';

const xmlOptions = {
  ignoreAttributes: false,
  // Force fees and prices of service to be an array, helps with zod parsing.
  isArray: (_, jPath) =>
    ['service.fees.fee', 'service.fees.fee.price'].includes(jPath),
} satisfies X2jOptions;

const parser = new XMLParser(xmlOptions);
const builder = new XMLBuilder({ ...xmlOptions, format: true });

/**
 * Zod Codec that can parse objects from XML strings, and build XML strings from
 * objects.
 * @param schema The schema of the target object that the xml corresponds to.
 * @returns The XML parser Zod Codec, with the target {@link schema} included.
 */
const xml = <T extends z.ZodObject>(schema: T) =>
  z.codec(z.string(), schema, {
    decode: (value, ctx) => {
      try {
        const error = XMLValidator.validate(value);

        if (error !== true) {
          ctx.issues.push({
            code: 'invalid_format',
            format: 'xml',
            input: value,
            message: error.err.msg,
            path: [`Line ${error.err.line}`, `Column ${error.err.col}`],
          });
          return;
        }

        return parser.parse(value);
      } catch (e) {
        ctx.issues.push({
          code: 'invalid_format',
          format: 'xml',
          input: value,
          message: e instanceof Error ? e.message : undefined,
        });
        return z.NEVER;
      }
    },
    encode: (value) => builder.build(value),
  });

/**
 * The XML parser output schema for announcements, represents the raw XML file
 * contents.
 */
export const announcementXmlObject = z.object({
  announcement: z.object({
    title: z.string(),
    date: z.iso.date(),
    content: z.string(),
  }),
});

/**
 * The JavaScript object representation of announcements.
 */
export const AnnouncementJs = z.object({
  title: z.string(),
  date: z.iso.date(),
  content: z.string(),
});

/**
 * The XML parser output schema for services, represents the raw XML file
 * contents.
 */
export const serviceXmlObject = z.object({
  service: z.object({
    name: z.string(),
    description: z.string(),
    fees: z
      .union([
        z.object({
          fee: z
            .object({
              price: z
                .object({ '#text': z.string(), '@_variant': z.string() })
                .array()
                .optional(),

              '@_title': z.string(),
            })
            .array()
            .optional(),
        }),
        z.string(),
      ])
      .optional(),
  }),
});

/**
 * The JavaScript object representation of services.
 */
export const ServiceJs = z.object({
  name: z.string(),
  description: z.string(),
  fees: z
    .object({
      title: z.string().nonempty({ error: 'Fee title must not be empty.' }),
      prices: z
        .object({
          variant: z
            .string()
            .nonempty({ error: 'Fee variant name must not be empty.' }),
          price: z
            .string()
            .regex(/^\$\d+(\.\d{2})?$/, {
              error:
                'Invalid price: must be prefixed with $ and contain 0 or 2 decimal places.',
            }),
        })
        .array(),
    })
    .array(),
});

/**
 * Zod Codec that can convert to and from the XML object and JavaScript object
 * forms of announcements.
 */
const AnnouncementXmlToJs = z.codec(announcementXmlObject, AnnouncementJs, {
  decode: (value) => value.announcement,
  encode: (value) => ({ announcement: value }),
});

/**
 * Zod Codec that can convert to and from the XML object and JavaScript object
 * forms of services.
 */
const ServiceXmlToJs = z.codec(serviceXmlObject, ServiceJs, {
  decode: (value) => {
    const { name, description, fees: feesObj } = value.service;

    if (!feesObj) {
      return { name, description, fees: [] };
    }

    const fees =
      typeof feesObj === 'object' && feesObj.fee
        ? feesObj.fee.map((e) => ({
            title: e['@_title'],
            prices:
              e.price?.map((e) => ({
                price: e['#text'],
                variant: e['@_variant'],
              })) ?? [],
          }))
        : [];

    return { name, description, fees };
  },

  encode: (value) => {
    const { name, description, fees } = value;

    const fee = fees.map((e) => ({
      '@_title': e.title,
      price: e.prices.map((e) => ({
        '#text': e.price,
        '@_variant': e.variant,
      })),
    }));

    return { service: { name, description, fees: { fee } } };
  },
});

/**
 * The contents of services, use {@link ServiceContent.decode} to convert the
 * XML string to the JavaScript object with the type: {@link ServiceJs}, and use
 * {@link ServiceContent.encode} to convert the object to an XML string.
 */
export const ServiceContent = xml(serviceXmlObject).pipe(ServiceXmlToJs);

/**
 * The contents of services, use {@link AnnouncementContent.decode} to convert the XML
 * string to the JavaScript object with the type: {@link AnnouncementJs}, and
 * use {@link AnnouncementContent.encode} to convert the object to an XML string.
 */
export const AnnouncementContent = xml(announcementXmlObject).pipe(
  AnnouncementXmlToJs,
);
