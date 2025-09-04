const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;
const DUPLICATE = 409;
const FORBIDDEN = 403;
const errorCodes = {
  CastError: BAD_REQUEST,
  ValidationError: BAD_REQUEST,
  DocumentNotFoundError: NOT_FOUND,
  DefaultError: SERVER_ERROR,
  DuplicateError: DUPLICATE,
  ForbiddenError: FORBIDDEN,
};

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  errorCodes,
  DUPLICATE,
  FORBIDDEN,
};
