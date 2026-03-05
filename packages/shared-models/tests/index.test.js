const { OrderStatuses, ProductCategories } = require('../index');

describe('shared-models', () => {
    it('should export OrderStatuses', () => {
        expect(OrderStatuses).toBeDefined();
        expect(OrderStatuses.PENDING).toBe('PENDING');
    });

    it('should export ProductCategories', () => {
        expect(ProductCategories).toBeDefined();
        expect(ProductCategories.VIENNOISERIE).toBe('viennoiserie');
    });
});
