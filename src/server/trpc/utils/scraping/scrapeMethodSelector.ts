import { pricerunner } from './sites/pricerunner';

export const getProductInfo = async (url: string) => {
	const { hostname } = new URL(url);

	switch (hostname) {
		case 'www.pricerunner.com':
			return pricerunner(url);
		case 'www.pricerunner.dk':
			return pricerunner(url);
		default:
			return {
				title: '',
				price: 0,
				imageUrl: '',
			};
	}
};
