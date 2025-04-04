import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ListProductUseCase from "./list.product.usecase";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductFactory from "../../../domain/product/factory/product.factory";

describe("Integration test for product list use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
        });
        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should return a list of products", async () => {
       const repository = new ProductRepository();
       const listProductUseCase = new ListProductUseCase(repository);

       const productA = ProductFactory.create("a", "Product A", 100);
       const productB = ProductFactory.create("b", "Product B", 200);

        await repository.create(productA);
        await repository.create(productB);

        const result = await listProductUseCase.execute({});

        expect(result.products.length).toBe(2);
        expect(result.products[0].id).toBe(productA.id);
        expect(result.products[0].name).toBe(productA.name);
        expect(result.products[0].price).toBe(productA.price);
        expect(result.products[1].id).toBe(productB.id);
        expect(result.products[1].name).toBe(productB.name);
        expect(result.products[1].price).toBe(productB.price);
    });

    it("should return an empty list of products", async () => {
       const repository = new ProductRepository();
       const listProductUseCase = new ListProductUseCase(repository);

       const result = await listProductUseCase.execute({});

       expect(result.products.length).toBe(0);
    }
    );
});