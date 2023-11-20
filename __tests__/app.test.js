const app = require("../app")
const request = require("supertest")
const db = require("../db/connection")
const { topicData, userData, articleData, commentData} = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed")


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