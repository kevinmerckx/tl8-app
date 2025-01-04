import { getTranslationsAtPath } from './get-translations-at-path';

describe('getTranslationsAtPath', () => {
  it('returns all keys, even the empty ones', () => {
    const translations = [
      {
        lang: 'en',
        translations: {
          menu: {
            orders: '',
            products: 'Produüûcts',
            customers: 'Customeeeeers',
            reports: 'Reports',
            integrations: 'Integrations',
            currentMonth:
              'Current Monthpsdoiflkdjsflkjsd fsdfsdfsdfsdfsdfsdfdsfsdfsdfsdf',
            lastQuarter: 'Last Quarter',
            socialEngagement: 'Social Engagement',
            yearEndSale: 'Year-end Sale',
          },
          dashboard: {
            title: 'Dashboord (fix me!)',
          },
        },
      },
      {
        lang: 'fr',
        translations: {
          menu: {
            orders: '',
            products: 'Produits',
            customers: 'Clients',
            reports: 'Rapports',
            integrations: 'Intégrations',
            currentMonth: 'Ce mois-ci',
            lastQuarter: 'Le dernier trimestre',
            socialEngagement: 'Quelque chose',
            yearEndSale: "Ventes de fin d'année",
          },
          dashboard: {
            title: 'Tableau de bord',
          },
        },
      },
    ];
    expect(getTranslationsAtPath(translations, 'menu.products')).toEqual([
      'menu.products',
    ]);
    expect(getTranslationsAtPath(translations, 'menu.orders')).toEqual([
      'menu.orders',
    ]);
    expect(getTranslationsAtPath(translations, 'menu')).toEqual([
      'menu.orders',
      'menu.products',
      'menu.customers',
      'menu.reports',
      'menu.integrations',
      'menu.currentMonth',
      'menu.lastQuarter',
      'menu.socialEngagement',
      'menu.yearEndSale',
    ]);
    expect(getTranslationsAtPath(translations)).toEqual([
      'menu.orders',
      'menu.products',
      'menu.customers',
      'menu.reports',
      'menu.integrations',
      'menu.currentMonth',
      'menu.lastQuarter',
      'menu.socialEngagement',
      'menu.yearEndSale',
      'dashboard.title',
    ]);
  });
});
