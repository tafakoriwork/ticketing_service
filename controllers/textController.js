const Sabject = require("../models/Subject");
const Text = require("../models/Text");
/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Texts:
 *       properties:
 *         text:
 *           type: string
 *         subject_id:
 *           type: number
 *       required:
 *         - text
 *         - subject_id
 *     PartialTexts:
 *       properties:
 *         text:
 *           type: string
 *       required:
 *         - text
 */
let controller = {
  /**
   * @swagger
   *
   * /text:
   *   post:
   *     summary: register a new Texts to the app
   *     tags:
   *       - texts
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Texts'
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
    if (!ctx.request.body.text) {
      ctx.status = 400;
      return;
    }
    const duplicate = await Text.findOne({
      text: ctx.request.body.text,
    }).exec();
    const _subject = await Sabject.findOne({
      _id: ctx.request.body.subject_id,
    }).exec();
    if (duplicate) {
      ctx.body = {
        RetVal: false,
        result: "title is duplicate"
      };
      return;
    }
    if (!_subject) {
      ctx.body = {
        RetVal: false,
        result: "please enter valid {subject_id}"
      };
      return;
    }
    const text = new Text({
      text: ctx.request.body.text,
      subject: _subject._id,
    });
    const ret = await text.save();
    await Text.populate(text, { path: "subject" });
    ctx.body = {
      RetVal: true, 
      result: ret.toClient()
    }
    ctx.status = 201;
  },

  /**
   * @swagger
   *
   * /text:
   *   get:
   *     summary: list all texts
   *     tags:
   *       - texts
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
    const texts = await Text.find({}).populate("subject").exec();
    for (let i = 0; i < texts.length; i++) {
      texts[i] = texts[i].toClient();
    }
    ctx.body = {
      RetVal: true,
      result: texts
    }
  },

  /**
     * @swagger
     * 
     * /text/{text_id}:
     *   get:
     *     summary: get a text by id
     *     tags: 
     *       - texts
     *     parameters:
     *       - name: text_id
     *         in: path
     *         required: true
     *         description: the id of the text to update
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
  get: async (ctx) => {
    const text = await Text.findById(ctx.params.text_id).populate("subject").exec();

    if (!text) {
      ctx.body = { RetVal: false, result: "text not found" };
    } else {
      ctx.status = 200;
      ctx.body = {
        RetVal: true,
        result: text.toClient()
      }
    }
  },

  /**
   * @swagger
   *
   * /text/{text_id}:
   *   put:
   *     summary: update a text by id
   *     tags:
   *       - texts
   *     parameters:
   *       - name: text_id
   *         in: path
   *         required: true
   *         description: the id of the text to update
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/PartialTexts'
   *     responses:
   *       '200':
   *         description: success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Texts'
   *       '400':
   *         description: Invalid request
   *       '401':
   *         description: Unauthorized
   *       '404':
   *         description: text not found
   *
   */
  update: async (ctx) => {
    try {
      const _TEXT = await Text.findById(ctx.params.text_id);
      if (!_TEXT)
        return (ctx.body = { RetVal: false, result: "text not found" });
      _TEXT.text = ctx.request.body.text;
      await _TEXT.save();
      await _TEXT.populate("subject").execPopulate();
      ctx.body = _TEXT.toClient();
    } catch (err) {
      ctx.status = 400;
    }
  },

  /**
   * @swagger
   *
   * /text/{text_id}:
   *   delete:
   *     summary: delete a text by id
   *     tags:
   *       - texts
   *     parameters:
   *       - name: text_id
   *         in: path
   *         required: true
   *         description: the id of the text to delete
   *         schema:
   *           type: string
   *     responses:
   *       '204':
   *         description: no content
   *       '404':
   *         description: text not found
   *       '401':
   *         description: Unauthorized
   *
   */
  remove: async (ctx) => {
    const res = await Text.findByIdAndDelete(ctx.params.text_id).exec();
    if (res) {
      res["RetVal"] = true;
      ctx.body = {
        RetVal: true,
        result: "text successfully deleted",
      };
    } else {
      ctx.body = { RetVal: false, result: "text not found" };
      ctx.status = 404;
    }
  },
};

module.exports = controller;
