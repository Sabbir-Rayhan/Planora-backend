import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DATABASE_URL: string;
  JWT_ACCESS_SECRET : string
  JWT_REFRESH_SECRET : string
  JWT_ACCESS_EXPIRES_IN : string
  JWT_REFRESH_EXPIRES_IN : string
  BCRYPT_SALT_ROUNDS : number
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVars = [
    "PORT",
    "DATABASE_URL",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "JWT_ACCESS_EXPIRES_IN",
    "JWT_REFRESH_EXPIRES_IN",
    "BCRYPT_SALT_ROUNDS",
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
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "",
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "",
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "",
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || "10"),
  };
};

export const envVars = loadEnvVariables();
