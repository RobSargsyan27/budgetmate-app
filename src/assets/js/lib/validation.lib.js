class ValidationLib {
    /**
     * @returns {Object}
     * @description Get update user validation schema.
     */
    static getUpdateUserValidationSchema() {
        return Joi.object({
            firstname: Joi.string().min(2),
            lastname: Joi.string().min(2),
            country: Joi.string(),
            address: Joi.string().min(2),
            city: Joi.string(),
            postalCode: Joi.string(),
            avatarColor: Joi.string().regex(/^#?[0-9A-Fa-f]{6}$/)
        });
    }
}

module.exports = ValidationLib