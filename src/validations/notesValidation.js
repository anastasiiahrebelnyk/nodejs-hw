import { Segments, Joi } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const objectIdValidator = (value, helpers) => {
  return isValidObjectId(value) ? value : helpers.message('invalid id format');
};

export const idSchema = Joi.string().custom(objectIdValidator);

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    sortBy: Joi.string()
      .valid(...TAGS)
      .default('_id'),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
    tag: Joi.string().valid(...TAGS),
    search: Joi.string(),
  }),
};

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().required().min(1).messages({
      'any.required': 'title must be exist',
      'base.string': 'title must be string',
    }),
    content: Joi.string(),
    tag: Joi.string()
      .valid(...TAGS)
      .default(TAGS[0]),
  }),
};

export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    id: idSchema.required(),
  }),
};

export const updateNoteSchema = {
  [Segments.PARAMS]: noteIdSchema,
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).messages({
      'any.required': 'title must be exist',
    }),
    content: Joi.string(),
    tag: Joi.string().valid(...TAGS),
  }).min(1),
};
