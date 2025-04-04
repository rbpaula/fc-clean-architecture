import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUseCase from "./find.product.usecase";

describe("Teste find product use case", () => {
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
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("Should find a product", async () =>{
        const productRepository = new ProductRepository();
        const usecase = new FindProductUseCase(productRepository);

        const product = ProductFactory.create("a", "Product 1", 100);
        await productRepository.create(product);

        const input = {
            id: product.id,
        };
        const result = await usecase.execute(input);

        const output = {
            id: product.id,
            name: product.name,
            price: product.price,
        };
        expect(result).toEqual(output);
    });
});