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

    // test("200: PATCH responds with updated article object", () => {
    //     return request(app)
    //         .patch("/api/articles/2")
    //         .send({ inc_votes: 10 })
    //         .expect(200)
    //         .then(({ body }) => {
    //             expect(body.article).toMatchObject({
    //                 article_id: 2,
    //                 title: expect.any(String),
    //                 topic: expect.any(String),
    //                 author: expect.any(String),
    //                 body: expect.any(String),
    //                 created_at: expect.any(String),
    //                 votes: 10,
    //                 article_img_url: expect.any(String),
    //             })
    //         })
    // })
    // test("400: PATCH responds with bad request if article_id is invalid", () => {
    //     return request(app)
    //         .patch("/api/articles/baddd")
    //         .send({ inc_votes: 10 })
    //         .expect(400)
    //         .then(({ body }) => {
    //             expect(body.msg).toBe("bad request")
    //         })
    // })
    // test("400: PATCH responds with bad request if article does not exist", () => {
    //     return request(app)
    //         .patch("/api/articles/99")
    //         .send({ inc_votes: 10 })
    //         .expect(400)
    //         .then(({ body }) => {
    //             expect(body.msg).toBe("bad request")
    //         })
    // })
    // test("400: PATCH responds with bad request if invalid votes", () => {
    //     return request(app)
    //         .patch("/api/articles/2")
    //         .send({ inc_votes: "cat" })
    //         .expect(400)
    //         .then(({ body }) => {
    //             expect(body.msg).toBe("bad request")
    //         })
    // })
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
    test("200: GET responds with an array of comments for a given article id, with most recent comment first", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
                const commentsArray = body.comments
                expect(commentsArray.length).toBe(11)
                expect(commentsArray).toBeSortedBy("created_at", { descending: true })
                commentsArray.forEach(comment => {
                    expect(typeof comment.comment_id).toBe("number")
                    expect(typeof comment.votes).toBe("number")
                    expect(typeof comment.created_at).toBe("string")
                    expect(typeof comment.author).toBe("string")
                    expect(typeof comment.body).toBe("string")
                    expect(typeof comment.article_id).toBe("number")
                })
            })
    })
    test("200: GET responds with an empty when given an article id thats exists but has no comments", () => {
        return request(app)
            .get("/api/articles/11/comments")
            .expect(200)
            .then(response => {
                expect(response.body.comments).toEqual([])
            })
    })
    test("404: GET responds with error message when given an article id that does not exist", () => {
        return request(app)
            .get("/api/articles/99/comments")
            .expect(404)
            .then(response => {
                expect(response.body.msg).toBe("not found")
            })
    })
    test("400: GET responds with error message when given an invalid article_id", () => {
        return request(app)
            .get("/api/articles/baddd/comments")
            .expect(400)
            .then(response => {
                expect(response.body.msg).toBe("bad request")
            })
    })
})