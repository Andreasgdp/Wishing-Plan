import { Content } from '@components/layouts/Content';
import { HeroSection } from './HeroSection';
import { TestemonialSection } from './Testimonials';

export const HomeScreen = () => {
	return (
		<Content>
			<HeroSection></HeroSection>
			<TestemonialSection></TestemonialSection>
		</Content>
	);
};
