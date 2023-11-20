const app = require("../app")
const request = require("supertest")
const db = require("../db/connection")
const { topicData, userData, articleData, commentData} = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed")
const fs = require("fs/promises")
const endpointsData = require("../endpoints.json")


afterAll(() => db.end())
beforeEach(() => {
    return seed({topicData, userData, articleData, commentData })
})

describe("/api/topics", () => {
    test("200: GET respond an array of topics with the properties slug and description", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(res => {
            const {topics} = res.body
            expect(topics.length).toBe(3)
            topics.forEach(topic => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    })
})

describe("ANY /invalidpath", () => {
    test("404: respond with error if path invalid", () => {
        return request(app)
        .get("/invalidpath")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("invalid path")
        })
    })
})

describe("/api", () => {
    test("200: GET respond with an object describing all available end points", () => {
       return request(app)
       .get("/api")
       .expect(200)
       .then(({body}) => {
        const endpoints = body.endpoints
        expect(endpoints).toEqual(endpointsData)
       })
    })
})

describe("/api/articles/:article_id", () => {
    test("200: GET responds with an article object", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({body}) => {
            const article = body.article
            expect(article).toMatchObject({
                article_id: 1,
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
              })
        })
    })
    test("404: GET responds with error message when given an id that does not exist", () => {
        return request(app)
        .get("/api/articles/99")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("article does not exist")
        })
    })
})