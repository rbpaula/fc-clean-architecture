import ProductFactory from "../../../domain/product/factory/product.factory";
import ListProductUseCase from "./list.product.usecase";

const productA = ProductFactory.create("a", "productA", 100);
const productB = ProductFactory.create("b", "productB", 200);

const MockProductRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([productA, productB])),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test for product list use case", () => {
    it("should return a list of products", async () => {
        const productRepository = MockProductRepository();
        const usecase = new ListProductUseCase(productRepository);
        const input = {};
    
        const result = await usecase.execute(input);
    
        expect(result.products.length).toBe(2);
        expect(result.products[0].id).toBe(productA.id);
        expect(result.products[0].name).toBe(productA.name);
        expect(result.products[0].price).toBe(productA.price);
        expect(result.products[1].id).toBe(productB.id);
        expect(result.products[1].name).toBe(productB.name);
        expect(result.products[1].price).toBe(productB.price);
    });
});