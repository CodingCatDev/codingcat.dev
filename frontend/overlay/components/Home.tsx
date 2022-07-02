import {
	ApolloClient,
	ApolloProvider,
	gql,
	HttpLink,
	InMemoryCache,
	split,
	useSubscription
} from '@apollo/client';
import AJPrimary from '../components/AJPrimary';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({
	uri: 'https://codingcat-twitch.onrender.com/graphql'
});

const wsLink = new WebSocketLink(
	new SubscriptionClient('wss:codingcat-twitch.onrender.com/graphql')
);

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
	},
	wsLink,
	httpLink
);

const client = new ApolloClient({
	link: splitLink,
	cache: new InMemoryCache()
});

const MESSAGES_SUBSCRIPTION = gql`
	subscription getMessages($username: String!) {
		message(channel: $username) {
			id
			message
			author {
				username
				roles
			}
			emotes {
				id
				name
				locations
				images {
					small
					medium
					large
				}
			}
			time
		}
	}
`;

function LatestMessage(client: any) {
	const { data, loading } = useSubscription(MESSAGES_SUBSCRIPTION, {
		client,
		variables: { username: 'codingcatdev' }
	});
	console.log(loading);
	console.log(data);
	return (
		<>
			{loading && data?.message?.message ? (
				<>Loading...</>
			) : (
				<>
					<div className="flex">
						<div>{data?.message?.message}</div>
					</div>
				</>
			)}
		</>
	);
}

export default function Home() {
	return (
		<ApolloProvider client={client}>
			<main className="grid grid-rows-[1fr_8px_144px] h-screen overflow-hidden">
				<div className="overlay-top h-full w-full" />
				<div className="w-full bg-purple-900 h-2" />
				<div className="w-full bg-gradient-to-r to-purple-700 via-purple-500 from-pink-500 flex justify-end">
					<div className="flex flex-grow">{LatestMessage(client)}</div>
					<div className="w-36 h-36 p-2">
						<AJPrimary className="block w-32 h-32" />
					</div>
				</div>
			</main>
		</ApolloProvider>
	);
}
