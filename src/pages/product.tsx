import { type NextPage } from 'next';
import Hero from '../components/hero-section';
import Testimonials from '../components/testimonials';

import Content from '../components/layouts/content';

const Product: NextPage = () => {
	return (
		<>
			<Content>
				<Hero></Hero>
				<Testimonials></Testimonials>
			</Content>
		</>
	);
};

export default Product;
