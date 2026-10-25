export type Ratio = '3:2' | '3:4' | '1:1' | '4:5';

/** One numbered window (Fenster). Media paths are root-relative; components add the deploy base. */
export interface Window {
  num: string;
  caption: string;
  ratio: Ratio;
  alt: string;
  poster: string;
  video?: { d720: string; d480: string };
}

export interface Dish {
  name: string;
  price: string;
  note: string;
}

export interface LegalBlock {
  title: string;
  sections: { heading: string; body: string }[];
}

export const site = {
  lang: 'de-AT',
  name: 'SEEBLICK & GLUT',
  tagline: 'Feuer. See. Sonst nichts.',

  meta: {
    title: 'SEEBLICK & GLUT — Wood-fire am Wörthersee',
    description:
      'Wood-fire restaurant on the Wörthersee shore, Klagenfurt. Carinthian dry-aged beef, lake char, reinterpreted Kasnudeln. Feuer. See. Sonst nichts.',
    ogImage: '/media/og.jpg',
    url: 'https://seeblick-glut.at',
  },

  schema: {
    '@type': 'Restaurant' as const,
    servesCuisine: 'Alpine-Adriatic',
    priceRange: '€€€',
    telephone: '+43-463-555-012',
    address: {
      street: 'Lendkanal 12',
      locality: 'Klagenfurt am Wörthersee',
      postalCode: '9020',
      country: 'AT',
    },
    openingHours: ['Tu-Su 12:00-14:30', 'Tu-Su 18:00-22:30'],
    geo: {
      latitude: 46.6247,
      longitude: 14.3053,
    },
  },

  // The nine windows, 00–08, plates in a book (.olympus/06-build-plan.md, media map).
  windows: {
    glut: {
      num: '00', caption: 'Die Glut, 19:40', ratio: '3:2',
      alt: 'Dry-aged Rind über der Glut, dahinter der Wörthersee im Fensterglas',
      poster: '/media/f00-glut.webp',
      video: { d720: '/media/f00-glut.720.mp4', d480: '/media/f00-glut.480.mp4' },
    },
    feuer: {
      num: '01', caption: 'Das Feuer', ratio: '3:4',
      alt: 'Rindersteak auf dem Rost, Funken steigen auf',
      poster: '/media/f01-feuer.webp',
    },
    saal: {
      num: '02', caption: 'Der Saal, 20:30', ratio: '3:2',
      alt: 'Der Saal bei Dämmerung — Holz, Kerzen, See im Fenster',
      poster: '/media/f02-saal.webp',
      video: { d720: '/media/f02-saal.720.mp4', d480: '/media/f02-saal.480.mp4' },
    },
    seelicht: {
      num: '03', caption: 'Seelicht', ratio: '3:4',
      alt: 'Abendlicht vom Wörthersee fällt durch die Fenster auf gedeckte Tische',
      poster: '/media/f03-seelicht.webp',
      video: { d720: '/media/f03-seelicht.720.mp4', d480: '/media/f03-seelicht.480.mp4' },
    },
    herd: {
      num: '04', caption: 'Die Glut, geschürt', ratio: '4:5',
      alt: 'Glut im Herd, Nahaufnahme',
      poster: '/media/f04-glut-poster.webp',
    },
    haende: {
      num: '05', caption: 'Die Hände', ratio: '1:1',
      alt: 'Hände richten Reinanke auf Schiefer an',
      poster: '/media/f05-haende.webp',
      video: { d720: '/media/f05-haende.720.mp4', d480: '/media/f05-haende.480.mp4' },
    },
    haus: {
      num: '06', caption: 'Das Haus', ratio: '3:2',
      alt: 'Das Team von SEEBLICK & GLUT vor dem Kamin',
      poster: '/media/f06-haus.webp',
      video: { d720: '/media/f06-haus.720.mp4', d480: '/media/f06-haus.480.mp4' },
    },
    terrasse: {
      num: '07', caption: 'Die Terrasse', ratio: '3:4',
      alt: 'Musik auf der Seeterrasse',
      poster: '/media/f07-terrasse.webp',
      video: { d720: '/media/f07-terrasse.720.mp4', d480: '/media/f07-terrasse.480.mp4' },
    },
    ankunft: {
      num: '08', caption: 'Die Ankunft', ratio: '3:2',
      alt: 'Der Eingang am Abend, Fackeln, die Tür steht offen',
      poster: '/media/f08-ankunft.webp',
      video: { d720: '/media/f08-ankunft.720.mp4', d480: '/media/f08-ankunft.480.mp4' },
    },
  } satisfies Record<string, Window>,

  // Dish stills for the hover / inline previews, in the order of craft.dishes.
  dishStills: [
    { src: '/media/d1-rind.webp', alt: 'Dry-aged Rinderfilet über Holzfeuer' },
    { src: '/media/d2-reinanke.webp', alt: 'Reinanke vom Grill mit Zitrone und Dill' },
    { src: '/media/d3-kasnudeln.webp', alt: 'Kasnudeln in brauner Butter mit Salbei' },
  ],

  assets: {
    intro: '/media/wordmark-intro.mp4',
    // Pen engravings for the menu card (Artlist, Nano Banana 2; cut by scripts/engravings.mjs).
    // Dishes follow the order of craft.dishes.
    engravings: {
      dishes: ['/media/e-rind.webp', '/media/e-reinanke.webp', '/media/e-kasnudeln.webp'],
      telefon: '/media/e-telefon.webp',
      holz: '/media/e-holz.webp',
      see: '/media/e-see.webp',
      feste: '/media/e-feste.webp',
      kerze: '/media/e-kerze.webp',
    },
    seeblick: { wide: '/media/seeblick-1600.webp', tall: '/media/seeblick-900.webp' },
  },

  hero: {
    lines: ['SEEBLICK', '&', 'GLUT'],
    cta: {
      label: 'Tisch reservieren',
      href: '#practical',
    },
  },

  philosophy: {
    kicker: 'Philosophie',
    headline: 'Zwölf Gänge. Ein Feuer. Der See durch das Glas.',
    body: 'Kärntner dry-aged beef über offener Glut. Reinanke aus dem Wörthersee. Kasnudeln, wie Ihre Großmutter sie meinte — eine Neuinterpretation, kein Thema. Kein Hotelrestaurant. Keine Stadt-Gastro. Nur der Herd und der See.',
    imageAlt:
      'Dry-aged ribeye over embers with twilight Wörthersee light through floor-to-ceiling glass',
  },

  tour: {
    kicker: 'Der Raum',
    ariaLabel: 'Der Raum — eine Tour durch das Haus',
    preBeat: {
      a: 'Ein Haus.',
      b: 'Jede Geschichte.',
    },
    legMeta: {
      leg1: { sub: 'Fackelweg, offene Tür — der erste Blick in den Saal.' },
      leg2: { sub: 'Vom Saal auf die Seeterrasse — Musik am Wasser.' },
      leg3: { sub: 'Die Bar — und zuletzt die Stille vor dem Service.' },
    } as Record<string, { sub: string }>,
    events: {
      kicker: 'Feste & Events',
      headline: 'Das Haus für Ihren Abend.',
      body: 'Vom Aperitif an der Bar bis zum letzten Toast auf der Seeterrasse — das ganze Haus, ein Abend, Ihre Geschichte. Wir planen mit Ihnen Menü, Ablauf und Raum.',
      marquee: ['Hochzeiten', 'Galas', 'Geburtstage', 'Firmenfeiern'],
      cta: {
        label: 'Anfragen',
        href: 'mailto:reservierung@seeblick-glut.at',
      },
    },
  },

  craft: {
    kicker: 'Die Glut',
    headline: 'Hände. Feuer.<br>Nichts dazwischen.',
    body: 'Das Feuer bestimmt die Karte. Was der See diese Woche hergibt. Was der Metzger lang genug gereift hat. Zwölf Gänge — nicht mehr, nicht weniger.',
    dishes: [
      {
        name: 'Dry-aged Rinderfilet 250g',
        price: '€48',
        note: 'Kärntner Rind, Holzfeuer',
      },
      {
        name: 'Reinanke vom Grill, Zitrone-Dill',
        price: '€32',
        note: 'Saibling vom Wörthersee',
      },
      {
        name: 'Kasnudeln, braune Butter, Salbei',
        price: '€18',
        note: 'Eine Neuinterpretation',
      },
    ] satisfies Dish[],
  },

  practical: {
    kicker: 'Besuch',
    title: 'Praktisches',
    hours: {
      label: 'Öffnungszeiten',
      lines: ['Dienstag – Sonntag', '12:00 – 14:30 · 18:00 – 22:30'],
      note: 'Montag Ruhetag',
    },
    address: {
      label: 'Adresse',
      lines: ['Lendkanal 12', '9020 Klagenfurt am Wörthersee'],
      mapLabel: 'Auf Karte anzeigen',
      mapUrl: 'https://maps.google.com/?q=Lendkanal+12,+9020+Klagenfurt',
    },
    parking: {
      label: 'Parken & Terrasse',
      lines: ['40 Plätze am Lendkanal — kostenlos ab 18:00'],
      note: 'Seeterrasse Mai – September, wetterabhängig',
    },
    contact: {
      label: 'Kontakt',
      phone: '+43 463 555 012',
      phoneHref: 'tel:+43463555012',
      note: 'Glutenfrei markiert — bitte bei Reservierung angeben',
    },
    tastingMenu: 'Tagesmenü 5 Gänge — €78',
    cta: {
      label: 'Tisch reservieren',
      href: 'tel:+43463555012',
      sub: 'Freitag und Samstag früh buchen — wir antworten innerhalb von 24 Stunden.',
    },
  },

  footer: {
    copyright: '© 2026 SEEBLICK & GLUT',
    line: 'Lendkanal 12 · Klagenfurt',
    impressumLabel: 'Impressum',
    datenschutzLabel: 'Datenschutz',
  },

  legal: {
    impressum: {
      title: 'Impressum',
      sections: [
        {
          heading: 'Angaben gemäß § 5 ECG',
          body: 'SEEBLICK & GLUT GmbH\nLendkanal 12\n9020 Klagenfurt am Wörthersee\nÖsterreich',
        },
        {
          heading: 'Kontakt',
          body: 'Telefon: +43 463 555 012\nE-Mail: reservierung@seeblick-glut.at',
        },
        {
          heading: 'Unternehmensgegenstand',
          body: 'Gastronomie — Restaurant mit Holzfeuer-Küche',
        },
        {
          heading: 'UID-Nummer',
          body: 'ATU00000000',
        },
        {
          heading: 'Mitglied bei',
          body: 'Wirtschaftskammer Kärnten',
        },
        {
          heading: 'Aufsichtsbehörde',
          body: 'Magistrat Klagenfurt am Wörthersee',
        },
      ],
    } satisfies LegalBlock,
    datenschutz: {
      title: 'Datenschutzerklärung',
      sections: [
        {
          heading: 'Verantwortlicher',
          body: 'SEEBLICK & GLUT GmbH, Lendkanal 12, 9020 Klagenfurt am Wörthersee. Kontakt: reservierung@seeblick-glut.at',
        },
        {
          heading: 'Erhebung und Speicherung personenbezogener Daten',
          body: 'Beim Besuch dieser Website werden durch den Hosting-Anbieter automatisch Server-Logfiles erhoben (IP-Adresse, Datum/Uhrzeit, angeforderte Seite, Browsertyp). Diese Daten dienen der technischen Bereitstellung und werden nach kurzer Zeit gelöscht.',
        },
        {
          heading: 'Kontaktaufnahme',
          body: 'Wenn Sie uns telefonisch oder per E-Mail kontaktieren, verarbeiten wir Ihre Angaben zur Bearbeitung der Anfrage auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.',
        },
        {
          heading: 'Cookies',
          body: 'Diese Website setzt keine Tracking-Cookies ein. Technisch notwendige Cookies können vom Hosting-Anbieter verwendet werden.',
        },
        {
          heading: 'Ihre Rechte',
          body: 'Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Beschwerden können Sie bei der Österreichischen Datenschutzbehörde einbringen.',
        },
        {
          heading: 'Hosting',
          body: 'Diese Website wird bei einem europäischen Hosting-Anbieter betrieben. Mit dem Anbieter besteht ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO.',
        },
      ],
    } satisfies LegalBlock,
  },
} as const;

export type Site = typeof site;

export function buildJsonLd() {
  const { schema, meta, name } = site;
  return {
    '@context': 'https://schema.org',
    '@type': schema['@type'],
    name,
    description: meta.description,
    url: meta.url,
    image: new URL(meta.ogImage, meta.url).href,
    telephone: schema.telephone,
    priceRange: schema.priceRange,
    servesCuisine: schema.servesCuisine,
    address: {
      '@type': 'PostalAddress',
      streetAddress: schema.address.street,
      addressLocality: schema.address.locality,
      postalCode: schema.address.postalCode,
      addressCountry: schema.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: schema.geo.latitude,
      longitude: schema.geo.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '12:00',
        closes: '14:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '18:00',
        closes: '22:30',
      },
    ],
  };
}
