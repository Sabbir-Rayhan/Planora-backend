import { Server } from 'node:http';
import app from './app';
import { envVars } from './config/env';

const port = 5000; // The port your express server will be running on.


let server : Server;

// Start the server
const bootstrap = async() => {
    try {
        server = app.listen(envVars.PORT, () => {
            console.log(`Server is running on http://localhost:${envVars.PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }   
}

bootstrap();