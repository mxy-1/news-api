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
    test("201: POST accepts an array of topics with the properties slug and description, and responds with new topic object", () => {
        return request(app)
            .post("/api/topics")
            .send({
                "slug": "topic name here",
                "description": "description here"
            })
            .expect(201)
            .then(res => {
                const { topic } = res.body
                expect(topic).toMatchObject({
                    "slug": "topic name here",
                    "description": "description here"
                })
            })
    })
    test("400: POST responds with bad request when properties are missing", () => {
        return request(app)
            .post("/api/topics")
            .send({
                "asdsd": "topic name here",
                "description": "description here"
            })
            .expect(400)
            .then(res => {
                expect(res.body.msg).toBe("bad request")
            })
    })
    test("400: POST responds with bad request when properties are not valid", () => {
        return request(app)
            .post("/api/topics")
            .send({
                "slug": 1234,
                "description": "description here"
            })
            .expect(400)
            .then(res => {
                expect(res.body.msg).toBe("bad request")
            })
    })
    test("400: POST responds with bad request when there are extra fields", () => {
        return request(app)
            .post("/api/topics")
            .send({
                "slug": "123",
                "description": "description here",
                "extra": "property"
            })
            .expect(400)
            .then(res => {
                expect(res.body.msg).toBe("bad request")
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
    test("200: GET responds with an article object with a comment_count property", () => {
        return request(app)
            .get("/api/articles/2")
            .expect(200)
            .then(({ body }) => {
                const article = body.article
                expect(+article.comment_count).toBe(0)
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

    test("200: PATCH responds with updated article object, and increments votes", () => {
        return request(app)
            .patch("/api/articles/3")
            .send({ inc_votes: 10 })
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toMatchObject({
                    article_id: 3,
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: 10,
                    article_img_url: expect.any(String),
                })
            })
    })
    test("200: PATCH responds with updated article object and decrements votes", () => {
        return request(app)
            .patch("/api/articles/3")
            .send({ inc_votes: -10 })
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toMatchObject({
                    article_id: 3,
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: -10,
                    article_img_url: expect.any(String),
                })
            })
    })
    test("400: PATCH responds with bad request if article_id is invalid", () => {
        return request(app)
            .patch("/api/articles/baddd")
            .send({ inc_votes: 10 })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("404: PATCH responds with not found if article does not exist", () => {
        return request(app)
            .patch("/api/articles/99")
            .send({ inc_votes: 10 })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    })
    test("400: PATCH responds with bad request if invalid votes", () => {
        return request(app)
            .patch("/api/articles/2")
            .send({ inc_votes: "cat" })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
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

    test("200: GET accepts a topic query and responds with and array of filtered articles", () => {
        return request(app)
            .get("/api/articles/?topic=mitch")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles
                articles.forEach(article => {
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                    })
                    expect(typeof +article.comment_count).toBe("number")
                    expect(article.topic).toBe("mitch")
                })
            })
    })

    test("200: GET accepts a topic query and responds with an empty array when there no articles associated with topic", () => {
        return request(app)
            .get("/api/articles/?topic=paper")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles
                expect(articles).toEqual([])
            })
    })
    test("404: GET accepts a topic query and responds with not found when topic does not exist", () => {
        return request(app)
            .get("/api/articles/?topic=bread")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toEqual("not found")
            })
    })

    test("200: GET accepts a sort_by query and responds with array of articles sorted by query - article_id", () => {
        return request(app)
            .get("/api/articles/?sort_by=article_id")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles
                expect(articles).toBeSortedBy("article_id", { descending: true })
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
            })
    })
    test("200: GET accepts a sort_by query and responds with array of articles sorted by query - author", () => {
        return request(app)
            .get("/api/articles/?sort_by=author")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles
                expect(articles).toBeSortedBy("author", { descending: true })
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
            })
    })
    test("400: GET responds with bad request when sort by query does not exist", () => {
        return request(app)
            .get("/api/articles/?sort_by=pppp")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })

    test("200: GET accepts an order query which can be set to asc for ascending", () => {
        return request(app)
            .get("/api/articles/?order=asc")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles
                expect(articles).toBeSortedBy("created_at", { descending: false })
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
            })
    })
    test("200: GET accepts an order query which can be set to desc for descending", () => {
        return request(app)
            .get("/api/articles/?order=desc")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles
                expect(articles).toBeSortedBy("created_at", { descending: true })
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
            })
    })
    test("400: GET responds with bad request when order query is invalid", () => {
        return request(app)
            .get("/api/articles/?order=invalidquery")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })

    test("200: GET accepts multiples queries including sort by and order", () => {
        return request(app)
            .get("/api/articles/?order=asc&sort_by=author")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles
                expect(articles).toBeSortedBy("author", { descending: false })
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
            })
    })
    test("200: GET accepts all queries: topic, sort by and order", () => {
        return request(app)
            .get("/api/articles/?order=desc&sort_by=title&topic=mitch")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles
                expect(articles).toBeSortedBy("title", { descending: true })
                articles.forEach(article => {
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: "mitch",
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                    })
                    expect(typeof +article.comment_count).toBe("number")
                })
            })
    })

    test("201: POST accepts an object and responds with newly added article", () => {
        return request(app)
            .post("/api/articles")
            .send({
                author: "lurker",
                title: "water",
                body: "this is the body",
                topic: "mitch",
                article_img_url: "https://images.pexels.com/photos/bubuibu"
            })
            .expect(201)
            .then(({ body }) => {
                const { article } = body
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    body: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: 0
                })
            })
    })
    test("201: POST accepts an object and responds with newly added article and article_img_url defaults when not provided", () => {
        return request(app)
            .post("/api/articles")
            .send({
                author: "lurker",
                title: "water",
                body: "this is the body",
                topic: "mitch",
            })
            .expect(201)
            .then(({ body }) => {
                const { article } = body
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    body: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: 0
                })
            })
    })
    test("400: POST responds with bad request when missing properties", () => {
        return request(app)
            .post("/api/articles")
            .send({
                author: "lurker",
                title: "water",
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })

    })
    test("400: POST responds with bad request when properties are not valid", () => {
        return request(app)
            .post("/api/articles")
            .send({
                dasf: "lurker",
                saasd: "water",
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("400: POST responds with bad request when values are not valid", () => {
        return request(app)
            .post("/api/articles")
            .send({
                author: 213213,
                title: "water",
                body: "this is the body",
                topic: "mitch",
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })

    test("200: GET limits number of response to 10 by default", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles
                expect(articles.length).toBe(10)
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
            })
    })
    test("200: GET accepts limit query to limit number of responses", () => {
        return request(app)
            .get("/api/articles/?limit=5")
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
            })
    })
    test("200: GET accepts p query to specify the page to start", () => {
        return request(app)
            .get("/api/articles/?p=2")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles
                expect(articles.length).toBe(3)
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
            })
    })
    test("200: GET accepts multiple queries", () => {
        return request(app)
            .get("/api/articles/?limit=5&p=1&sort_by=article_id&order=asc")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles
                expect(articles.length).toBe(5)
                expect(articles[0].article_id).toBe(1)
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
                    expect(articles).toBeSortedBy("article_id", { descending: false })
                })
            })
    })
    test("200: GET responds with total count property displaying total number of articles", () => {
        return request(app)
            .get("/api/articles/?p=2")
            .expect(200)
            .then(({ body }) => {
                const { total_count } = body
                expect(total_count).toBe(13)
            })
    })
    test("200: GET responds with total count property displaying total number of articles, discounting the limit, when filters are applied", () => {
        return request(app)
            .get("/api/articles/?p=2&limit=5&sort_by=article_id")
            .expect(200)
            .then(({ body }) => {
                const { total_count } = body
                expect(total_count).toBe(13)
            })
    })
    test("400: GET responds with bad request when given query does not exist", () => {
        return request(app)
            .get("/api/articles/?dsds=3")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("404: GET responds with not found when the page does not exist", () => {
        return request(app)
            .get("/api/articles/?p=3")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    })

})

describe("/api/articles/:article_id/comments", () => {
    test("201: POST responds with posted comment object", () => {
        return request(app)
            .post("/api/articles/2/comments")
            .send({
                username: "lurker",
                body: "awful",
            })
            .expect(201)
            .then(({ body }) => {
                const comment = body.comment
                expect(typeof comment.comment_id).toBe("number")
                expect(typeof comment.body).toBe("string")
                expect(comment.article_id).toBe(2)
                expect(comment.author).toBe("lurker")
                expect(comment.votes).toBe(0)
                expect(typeof comment.created_at).toBe("string")
            })
    })
    test("400: POST responds with bad request when body not provided or is empty", () => {
        return request(app)
            .post("/api/articles/2/comments")
            .send({
                username: "lurker"
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("400: POST responds with bad request when username not provided or is empty", () => {
        return request(app)
            .post("/api/articles/2/comments")
            .send({
                body: "awful"
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("400: POST responds with bad request when username does not exist", () => {
        return request(app)
            .post("/api/articles/2/comments")
            .send({
                username: "nolurk",
                body: "awful",
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("200: GET responds with an array of comments for a given article id, with most recent comment first", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
                const commentsArray = body.comments
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

    test("200: GET limits responses by a default of 10", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
                const commentsArray = body.comments
                expect(commentsArray.length).toBe(10)
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
    test("200: GET limits responses by a given number", () => {
        return request(app)
            .get("/api/articles/1/comments/?limit=3")
            .expect(200)
            .then(({ body }) => {
                const commentsArray = body.comments
                expect(commentsArray.length).toBe(3)
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
    test("400: GET limits responds with bad request when limit value is not valid", () => {
        return request(app)
            .get("/api/articles/1/comments/?limit=ubi")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("200: GET accepts page query and paginates respond", () => {
        return request(app)
            .get("/api/articles/1/comments/?p=2")
            .expect(200)
            .then(({ body }) => {
                const commentsArray = body.comments
                expect(commentsArray.length).toBe(1)
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
    test("400: GET limits responds with bad request when page value is not valid", () => {
        return request(app)
            .get("/api/articles/1/comments/?p=ubi")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("400: GET responds with bad request when query does not exist", () => {
        return request(app)
            .get("/api/articles/1/comments/?asdsd=2")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("404: GET responds with not found when page does not exist", () => {
        return request(app)
            .get("/api/articles/1/comments/?p=99")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    })
    test("200: GET accepts limit and page query", () => {
        return request(app)
            .get("/api/articles/1/comments/?p=2&limit=2")
            .expect(200)
            .then(({ body }) => {
                const commentsArray = body.comments
                expect(commentsArray.length).toBe(2)
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
})

describe("/api/users", () => {
    test("200: GET responds with an array of user objects", () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then(response => {
                const usersArray = response.body.users
                expect(usersArray.length).toBe(4)
                usersArray.forEach(user => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                })
            })
    })
    test("200: GET responds with a user by username on /api/users/:username", () => {
        return request(app)
            .get("/api/users/lurker")
            .expect(200)
            .then(({ body }) => {
                const user = body.user
                expect(user.username).toBe("lurker")
                expect(user).toMatchObject({
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
    })
    test("400: GET responds with a not found on /api/users/:username when username does not exist", () => {
        return request(app)
            .get("/api/users/me")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    })
})

describe("/api/comments/:comment_id", () => {
    test("204: DELETE responds with no content and delete comment by comment id", () => {
        return request(app)
            .delete("/api/comments/1")
            .expect(204)
    })
    test("404: DELETE responds with not found when given a valid exist that does not exist", () => {
        return request(app)
            .delete("/api/comments/111")
            .expect(404)
            .then(response => {
                expect(response.body.msg).toBe("not found")
            })
    })
    test("400: DELETE responds with bad request when given an invalid id", () => {
        return request(app)
            .delete("/api/comments/badd")
            .expect(400)
            .then(response => {
                expect(response.body.msg).toBe("bad request")
            })
    })

    test("200: PATCH increments votes on a comment by comment_id", () => {
        return request(app)
            .patch("/api/comments/5")
            .send({ inc_votes: 10 })
            .expect(200)
            .then(({ body }) => {
                const { comment } = body
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    article_id: expect.any(Number),
                    author: expect.any(String),
                    votes: 10,
                    created_at: expect.any(String)
                })
            })
    })
    test("200: PATCH decrements votes on a comment by comment_id", () => {
        return request(app)
            .patch("/api/comments/5")
            .send({ inc_votes: -10 })
            .expect(200)
            .then(({ body }) => {
                const { comment } = body
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    article_id: expect.any(Number),
                    author: expect.any(String),
                    votes: -10,
                    created_at: expect.any(String)
                })
            })
    })
    test("404: PATCH responds with not found when given a comment_id that does not exist", () => {
        return request(app)
            .patch("/api/comments/999")
            .send({ inc_votes: 10 })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    })
    test("400: PATCH responds with bad request when given a comment_id that is invalid", () => {
        return request(app)
            .patch("/api/comments/asd")
            .send({ inc_votes: 10 })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("400: PATCH responds with bad request when missing inc_votes", () => {
        return request(app)
            .patch("/api/comments/2")
            .send({ dfa: 22 })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("400: PATCH responds with bad request when invalid inc_votes value", () => {
        return request(app)
            .patch("/api/comments/2")
            .send({ inc_votes: "asd" })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
})