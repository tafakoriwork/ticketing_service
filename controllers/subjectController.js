

const Subject = require('../models/Subject');
/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Subjects: 
 *       properties:
 *         title:
 *           type: string
 *       required:
 *         - title
 */
let controller = {

  /**
   * @swagger
   *
   * /subject/create:
   *   post:
   *     summary: register a new Subjects to the app
   *     operationId: register
   *     tags:
   *       - subjects
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Subjects'
   *     responses:
   *       '201':
   *         description: Created
   *       '400':
   *         description: Invalid request
   *       '409':
   *         description: Unique field already existing
   *
   */
  create: async (ctx) => {
    if (!ctx.request.body.title) {
      ctx.status = 400;
      return;
    }
    const duplicate = await Subject.findOne({
      title: ctx.request.body.title,
    }).exec();
    if (duplicate) {
      ctx.status = 409;
      return;
    }
    const subject = new Subject({
        title: ctx.request.body.title,
    });
    const ret = await subject.save();
    ctx.body = ret.toClient();
    ctx.status = 201;
  },


      /**
     * @swagger
     * 
     * /subject/list:
     *   get:
     *     summary: list all books
     *     operationId: listBooks
     *     tags: 
     *       - subjects
     *     responses:
     *       '200':
     *         description: success
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items: 
     *              
     */
      list: async (ctx) => {
        const subjects = await Subject.find({}).exec();
        for(let i = 0; i < subjects.length; i++) {
          subjects[i] = subjects[i].toClient();
      }
        ctx.body = subjects;
    },
};

module.exports = controller;
