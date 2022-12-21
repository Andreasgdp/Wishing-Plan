import axios from 'axios';
import * as cheerio from 'cheerio';

export const pricerunner = async (url: string) => {
	try {
		const { data } = await axios.get(url);
		const $ = cheerio.load(data);

		const title = $('h1').first().text();

		const price = $('span[data-testid="priceComponent"]').first().text();
		const numerPrice = Number(price.replace(/\D+/g, ''));

		const imageUrl = $('div > div > img').first().attr('src');

		return {
			title: title,
			price: numerPrice,
			imageUrl: imageUrl ?? '',
		};
	} catch (e) {
		// 5
		return {
			title: '',
			price: 0,
			imageUrl: '',
		};
	}
};
