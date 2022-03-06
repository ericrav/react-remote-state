export function entity(options = {}) {
    const entityFactory = (...params) => {
        const key = params.join('$');
        const entityById = (value) => ({ key, value, options });
        entityById.scope = entityFactory;
        entityById.params = params;
        entityById.options = options;
        return entityById;
    };
    return entityFactory;
}
