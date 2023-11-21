const app = require("../app")
const request = require("supertest")
const db = require("../db/connection")
const { topicData, userData, articleData, commentData } = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed")
const endpointsData = require("../endpoints.json")
require('jest-sorted')

afterAll(() => db.end())
beforeEach(() => {
    return seed({ topicData, userData, articleData, commentData })
})

describe("/api/topics", () => {
    test("200: GET respond an array of topics with the properties slug and description", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(res => {
                const { topics } = res.body
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
            .then(({ body }) => {
                expect(body.msg).toBe("invalid path")
            })
    })
})

describe("/api", () => {
    test("200: GET respond with an object describing all available end points", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
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
            .then(({ body }) => {
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
            .then(({ body }) => {
                expect(body.msg).toBe("article does not exist")
            })
    })
})

describe("/api/articles", () => {
    test("200: GET responds with articles array of article objects", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles
                expect(articles.length).toBe(5)
                articles.forEach(article => {
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                    })
                    expect(typeof +article.comment_count).toBe("number")
                })
                expect(articles).toBeSortedBy("created_at", { descending: true })
            })
    })
})

describe("/api/articles/:article_id/comments", () => {
    test("POST: 201 responds with posted comment object", () => {
        return request(app)
        .post("/api/articles/2/comments")
        .send({
            username: "lurker",
            body: "awful",
        })
        .expect(201)
        .then(({body}) => {
            const comment = body.comment
            expect(typeof comment.comment_id).toBe("number")
            expect(typeof comment.body).toBe("string")
            expect(comment.article_id).toBe(2)
            expect(comment.author).toBe("lurker")
            expect(comment.votes).toBe(0)
            expect(typeof comment.created_at).toBe("string")
        })
    })
    test("POST: 400 responds with bad request when body not provided or is empty", () => {
        return request(app)
        .post("/api/articles/2/comments")
        .send({
            username:"lurker"
        })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("bad request")
        })
    })
    test("POST: 400 responds with bad request when username not provided or is empty", () => {
        return request(app)
        .post("/api/articles/2/comments")
        .send({
            body:"awful"
        })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("bad request")
        })
    })
    test("POST: 400 responds with bad request when username does not exist", () => {
        return request(app)
        .post("/api/articles/2/comments")
        .send({
            username: "nolurk",
            body: "awful",
        })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("bad request")
        })
    })
})