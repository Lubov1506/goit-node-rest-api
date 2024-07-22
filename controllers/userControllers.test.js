import mongoose from "mongoose";
import startServer from "../app.js";
import request from "supertest";
import env from "../utils/env.js";
import bcrypt from "bcrypt";
import * as userServices from "../services/userServices.js";

const user = env("MONGODB_USER");
const password = env("MONGODB_PASSWORD");
const url = env("MONGODB_URL");
const name = env("MONGODB_NAME_TEST");
const DB_HOST = `mongodb+srv://${user}:${password}@${url}/${name}?retryWrites=true&w=majority&appName=Cluster0`;

describe("test /api/users/login route", () => {
  let server = null;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = startServer();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  test("test login with correct data", async () => {
    const loginData = {
      email: "user@example.com",
      password: "password123",
    };
    await userServices.register({
      email: loginData.email,
      password: await bcrypt.hash(loginData.password, 10),
    });

    const { body, statusCode } = await request(server)
      .post("/api/users/login")
      .send(loginData);

    expect(statusCode).toBe(200);
    expect(body.token).toBeTruthy();
    expect(body.user.email).toBe(loginData.email);
    expect(typeof body.user.email).toBe("string");
    expect(body.user.subscription).toBe("starter");
    expect(typeof body.user.subscription).toBe("string");
  });

  test("test login with incorrect email", async () => {
    const loginData = {
      email: "user@example.com",
      password: "password123",
    };

    const { body, statusCode } = await request(server)
      .post("/api/users/login")
      .send(loginData);

    expect(statusCode).toBe(401);
    expect(body.message).toBe("Email or password is wrong");
  });
  test("test login with incorrect password", async () => {
    const loginData = {
      email: "test@example.com",
      password: "pass123",
    };

    await userServices.register({
      email: loginData.email,
      password: await bcrypt.hash("password123", 10),
    });

    const { body, statusCode } = await request(server)
      .post("/api/users/login")
      .send(loginData);

    expect(statusCode).toBe(401);
    expect(body.message).toBe("Email or password is wrong");
  });
});
