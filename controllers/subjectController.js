

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
   *     parameters:
   *       - name: user_id
   *         in: header
   *         required: true
   *         description: the id of user
   *         schema:
   *           type: number
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Subjects'
   * 
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
    if (!ctx.request.body.title || !ctx.request.header.user_id) {
      ctx.status = 400;
      return;
    }
    const duplicate = await Subject.findOne({
      title: ctx.request.body.title,
      user: ctx.request.header.user_id
    }).exec();
    if (duplicate) {
      ctx.status = 409;
      return;
    }
    const subject = new Subject({
        title: ctx.request.body.title,
        user: ctx.request.header.user_id
    });
    const ret = await subject.save();
    ctx.body = ret.toClient();
    ctx.status = 201;
  },


  /**
     * @swagger
     * 
     * /subject/{user_id}:
     *   get:
     *     summary: get a subjects by user_id
     *     tags: 
     *       - subjects
     *     parameters:
     *       - name: user_id
     *         in: path
     *         required: true
     *         description: subjects to get by user id
     *         schema: 
     *           type: string

     *     responses:
     *       '200':
     *         description: success
     *       '400':
     *         description: Invalid request
     *       '401':
     *         description: Unauthorized
     *       '404':
     *         description: Book not found
     * 
     */
      list: async (ctx) => {
        const subjects = await Subject.find({user: ctx.params.user_id}).exec();
        for(let i = 0; i < subjects.length; i++) {
          subjects[i] = subjects[i].toClient();
      }
        ctx.body = subjects;
    },
};

module.exports = controller;
