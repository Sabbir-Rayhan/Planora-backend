import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVars = [
    "PORT",
  ];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      console.warn(
        `Warning: Environment variable ${varName} is not set in .env file.`,
      );
    }
  });

  return {
    PORT: process.env.PORT || "5000",
  };
};

export const envVars = loadEnvVariables();
