import createApp from './app';

const app = createApp();

const start = async () => {
    try {
        await app.listen({ port: 3000 });
        app.log.info('Server started successfully');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
