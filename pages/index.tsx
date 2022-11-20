import Hero from '../components/hero-section';
import Content from '../components/layouts/content';
import Testimonials from '../components/testimonials';

export default function Home() {
	return (
		<Content>
			<Hero></Hero>
			<Testimonials></Testimonials>
		</Content>
	);
}
