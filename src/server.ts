import { Server } from 'node:http';
import app from './app.js';
import { envVars } from './app/config/env.js';

let server: Server;

const bootstrap = async () => {
  try {
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

bootstrap();