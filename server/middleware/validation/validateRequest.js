const validateRequest = (schema) => async (req, res, next) => {
  try {
    const validated = await schema.parseAsync({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    req.validated = validated;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateRequest,
};
