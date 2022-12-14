import { Button } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

const errors = {
	accessdenied: {
		message: 'You do not have permission to sign in.',
		reason: 'You may not have permission to access this site.',
	},
	configuration: {
		message: 'There is a problem with the server configuration.',
		reason: 'Please contact the site administrator.',
	},
	verification: {
		message: 'The sign in link is no longer valid.',
		reason: 'It may have been used already or it may have expired.',
	},
	default: {
		message: 'Something went wrong!',
		reason: 'Please try again later.',
	},
};

const ErrorPage = () => {
	const router = useRouter();
	const { error = 'default' } = router.query;

	const newError = error.toString() as keyof typeof errors;

	const { message, reason } = errors[newError];

	return (
		<section className="h-screen w-screen bg-zinc-800 p-4 text-white">
			<div className="flex h-full items-center justify-center">
				<div className="text-start min-w-[40%] rounded-xl border border-blue-500 px-8 py-6 pb-7 2xl:min-w-[25%]">
					<h1 className="mb-4 text-3xl font-bold">
						Unable to sign in
					</h1>
					<div className="mb-6 text-lg text-zinc-500">
						<p>{message}</p>
						<p>{reason}</p>
					</div>
					<Button
						onClick={() => signIn(undefined, { callbackUrl: '/' })}
					>
						Sign In
					</Button>
				</div>
			</div>
		</section>
	);
};

ErrorPage.authpage = true;

export default ErrorPage;
