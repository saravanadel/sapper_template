import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

//graphql
const { gql, ApolloServer } = require('apollo-server-express');

const tasks = [
	{ id: 1, name: 'Go to Market', complete: false },
	{ id: 2, name: 'Walk the dog', complete: true },
	{ id: 3, name: 'Take a nap', complete: false }
];

const typeDefs = gql`
	type Task {
		id: Int!
		name: String!
		complete: Boolean!
	}
	type Query {
		tasks: [Task]
		task(id: Int!): Task
	}
	type Mutation {
		createTask (
		  postName: String!
		): Task
	}
`;

//https://www.apollographql.com/docs/graphql-tools/generate-schema/

const resolvers = {
	Query: {
		tasks: () => tasks,
		task: (_, args) => tasks.find(o => o.id === args.id)
	},
	Mutation: {
		createTask: (_, { postName }) => {
			const task = tasks.find(o => o.name === postName);
			if (!task) {
				throw new Error(`Couldn't find post with id ${postName}`);
			}
			task.name = postName
			return task;
		},
	},
};

const schema = module.exports = new ApolloServer({
	typeDefs,
	resolvers,
	playground: {
		endpoint: 'graphql'
	}
})

//end 
const app = polka(); // You can also use Express

//graph
schema.applyMiddleware({
	app: app
});
//

app.use(
	compression({ threshold: 0 }),
	sirv('static', { dev }),
	sapper.middleware({ ignore: '/graphql' })
)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
