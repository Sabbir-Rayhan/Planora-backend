import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DATABASE_URL: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVars = [
    "PORT",
    "DATABASE_URL",
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
    DATABASE_URL: process.env.DATABASE_URL || "",
  };
};

export const envVars = loadEnvVariables();
