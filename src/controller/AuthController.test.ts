import "reflect-metadata"
import request from "supertest";
import { startServerTest } from "../server_test";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";




describe("AuthController full test suite", () => {

    let app;


    beforeAll(async () => {
        app = await startServerTest();
        jest.useFakeTimers();
    })

    afterAll(async () => {
        await AppDataSource.dropDatabase();
    })


    describe("Register behavior", () => {
        it('SUCCESS create user', async () => {
            const payload = {
                nickname: 'flo',
                email: "florian@alt.bzh",
                password: "Lksdf4545sdf32ds:!;"
            };
            const response = await request(app).post('/auth/register').send(payload)
            expect(response.body.status).toBe(201);
            
            expect(response.body.data.user.nickname).toStrictEqual(payload.nickname)
            expect(response.body.data.user.email).toStrictEqual(payload.email)
        })

        it('ERROR create user', async () => {
            const payload = {
                nickname: 'flo',
                email: "florian@alt.bzh",
                password: "Lksdf4545sdf32ds:!;"
            };
            const response = await request(app).post('/auth/register').send(payload)
            expect(response.status).toBe(500);
            expect(response.body.error).toStrictEqual('Email already used')
        })
    })


    describe("login behavior", () => {
        it('SUCCESS login user', async () => {
            const payload = {
                email: "florian@alt.bzh",
                password: "Lksdf4545sdf32ds:!;"
            };
            const response = await request(app).post('/auth/login').send(payload)
            expect(response.status).toBe(200);
            expect(response.body.user.email).toStrictEqual(payload.email)
            expect(typeof response.body.user.id).toBe('number')
            expect(typeof response.body.token).toBe('string')
            expect(typeof response.body.refreshToken).toBe('string')

        })

        it('ERROR login user bad password', async () => {
            const payload = {
                email: "florian@alt.bzh",
                password: "Lksddf32ds:!;"
            };
            const response = await request(app).post('/auth/login').send(payload)
            expect(response.status).toBe(500);
            expect(response.body.error).toStrictEqual("Unauthotized (password not matched)")
        })

        it('ERROR login user bad email', async () => {
            const payload = {
                email: "bad_email@alt.bzh",
                password: "Lksdf4545sdf32ds:!;"
            };
            const response = await request(app).post('/auth/login').send(payload)
            expect(response.status).toBe(500);
            expect(response.body.error).toStrictEqual("User not found")
        })
    })

    describe("refresh Token behavior", () => {
        it('SUCCESS refreshToken', async () => {
            const payload = {
                email: "florian@alt.bzh",
                password: "Lksdf4545sdf32ds:!;"
            };
            const login = await request(app).post('/auth/login').send(payload)

            const response = await request(app)
                .get('/api/auth/refreshToken')
                .auth(login.body.refreshToken, { type: 'bearer' }).send();

            expect(response.status).toBe(200);
            expect(response.body.user.email).toStrictEqual(payload.email)
            expect(typeof response.body.user.id).toBe('number')
            expect(typeof response.body.token).toBe('string')
            expect(typeof response.body.refreshToken).toBe('string')

        })

        it('ERROR refreshToken', async () => {
            const response = await request(app)
                .get('/api/auth/refreshToken')
                .auth("klsjdljkjsdf.sdfjklsdfk.Sdfsdf", { type: 'bearer' }).send();

            expect(response.status).toBe(500);
            expect(response.body.error).toStrictEqual("invalid token")
        })
    })

})