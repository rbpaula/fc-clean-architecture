import { Sequelize } from "sequelize-typescript";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import productRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";

const product = ProductFactory.create("a", "Product 1", 100);

const input = {
    id: product.id,
    name: "Product Updated",
    price: 100
};

describe("Unit Test update product use case", () => {

    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        await sequelize.addModels([ProductModel]);
        await sequelize.sync();

        input.name = "Product Updated";
        input.price = 300;
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should update a product", async () => {
        const repository = new productRepository();
        const usecase = new UpdateProductUseCase(repository);
        await repository.create(product);

        const output = await usecase.execute(input);

        expect(output).toEqual(input);
    });

    it("should throw an error when name is missing", async () => {
        const repository = new productRepository();
        const usecase = new UpdateProductUseCase(repository);
        await repository.create(product);
            
        input.name = "";

        await expect(() => {
            return usecase.execute(input);
        }).rejects.toThrow("Name is required");
    });

    it("should throw an error when price is less than zero", async () => {
        const repository = new productRepository();
        const usecase = new UpdateProductUseCase(repository);
        await repository.create(product);
            
        input.name = "Product Updated";
        input.price = -1;

        await expect(() => {
            return usecase.execute(input);
        }).rejects.toThrow("Price must be greater than zero");
    });
});