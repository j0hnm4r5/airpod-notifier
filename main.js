// Require the framework and instantiate it
const fastify = require(`fastify`)({ logger: true });
const getStatus = require(`./getStatus`);

// Declare a route
fastify.get(`/`, async (request, reply) => {
	const status = await getStatus();
	return status;
});

// Run the server!
const start = async () => {
	try {
		await fastify.listen(5000);
		fastify.log.info(
			`server listening on ${fastify.server.address().port}`
		);
	} catch (error) {
		fastify.log.error(error);
		process.exit(1);
	}
};
start();
