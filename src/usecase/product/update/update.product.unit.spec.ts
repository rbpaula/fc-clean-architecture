import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";

const product = ProductFactory.create("a", "Product 1", 100);

const input = {
    id: product.id,   
    name: "Product Updated",
    price: 100
};

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit Test update product use case", () => {
  it("should update a product", async () => {
    const productRepository = MockRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const output = await usecase.execute(input);

    expect(output).toEqual(input);
  });

  it("should not find a product", async () => {
    const productRepository = MockRepository();
    productRepository.find.mockImplementation(() => {
      throw new Error("Product not found");
    });
    const usecase = new UpdateProductUseCase(productRepository);

    const input = {
        id: "1",
        name: "Product Updated",    
        price: 100
    };

    expect(() => {
      return usecase.execute(input);
    }).rejects.toThrow("Product not found");
  });
});