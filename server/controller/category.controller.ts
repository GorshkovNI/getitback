import {NextFunction, Request, Response} from "express";
import {Equal, getRepository, IsNull, Not, Repository} from "typeorm";
import {Category} from "../entities/Category";
import {CustomField} from "../entities/CustomField";
import {as} from "pg-promise";
import {AppDataSource} from "../db/db";


export class CategoryController {

    static createCategory = async (req: Request, res: Response, next: NextFunction) => {

        try{
            const categoryName = req.body.name;
            console.log(categoryName)
            const categoryRepository = AppDataSource.getRepository(Category);

            // Проверяем, существует ли уже категория с таким именем
            const categoryExists = await categoryRepository.findOne({where:{name: categoryName}});

            if (categoryExists) {
                return res.status(400).json({message: "Category already exists!"});
            }

            // Если нет, создаем новую категорию
            const category = new Category();
            category.name = categoryName;

            await categoryRepository.save(category);

            return res.status(201).json({message: "Category created!", category});
        }catch (e) {
            console.log(e)
            next(e)
        }
    };

    static createSubcategory = async (req: Request, res: Response) => {
        const subcategoryName = req.body.name;
        const parentCategoryName = req.body.parent;
        const categoryRepository = AppDataSource.getRepository(Category);

        // Находим родительскую категорию
        const parentCategory = await categoryRepository.findOne({where:{name: parentCategoryName}});

        if (!parentCategory) {
            return res.status(400).json({message: "Parent category not found!"});
        }

        // Проверяем, существует ли уже подкатегория с таким именем
        const subcategoryExists = await categoryRepository.findOne({where:{name: subcategoryName}});

        if (subcategoryExists) {
            return res.status(400).json({message: "Subcategory already exists!"});
        }

        // Если нет, создаем новую подкатегорию
        const subcategory = new Category();
        subcategory.name = subcategoryName;
        subcategory.parent = parentCategory;

        await categoryRepository.save(subcategory);

        return res.status(201).json({message: "Subcategory created!", subcategory});
    };

    static createCustomField = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const {name, fieldType, categoryName, options} = req.body
            const customFieldRepository = AppDataSource.getRepository(CustomField)
            const categoryRepository = AppDataSource.getRepository(Category)

            const category = await categoryRepository.findOne({where: {name: categoryName}})

            if(!category){
                return res.status(400).send({ message: "Category not found" });
            }

            const newCustomCategory = customFieldRepository.create({
                name,
                fieldType,
                category,
                options
            })
            const results = await customFieldRepository.save(newCustomCategory)
            return res.send(results)

        } catch (e) {
            next(e)
        }
    }



    static getCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {

            async function buildCategoryTree(categories: Category[], categoryRepository: Repository<Category>) {
                return Promise.all(
                    categories.map(async (category) => {
                        const children = await categoryRepository.find({ where: { parent: Equal(category.id) } });

                        if (children.length > 0) {
                            return {
                                id: category.id,
                                name: category.name,
                                children: await buildCategoryTree(children, categoryRepository),
                            };
                        } else {
                            const subcategory = await categoryRepository.findOne({
                                where: { id: category.id },
                                relations: ['customFields']
                            });
                            return {
                                id: category.id,
                                name: category.name,
                                customFields: subcategory.customFields
                            };
                        }
                    })
                );
            }

            const categoryRepository = AppDataSource.getRepository(Category)

            const parentCategory = await categoryRepository
                .createQueryBuilder('category')
                .leftJoinAndSelect('category.parent', 'parent')
                .where('parent.id IS NULL')
                .getMany();

            const categoryTree = await buildCategoryTree(parentCategory, categoryRepository);
            console.log(categoryTree)
            return res.send(categoryTree)
        }catch (e){
            next(e)
        }
    }

    static getField = async (req: Request, res: Response, next: NextFunction) => {
        try{

            const {id} = req.body
            console.log(id)
            //const categoryRepository = getRepository(CustomField)

            // const parentCategory = await categoryRepository
            //     .createQueryBuilder('custom_field')
            //     .leftJoinAndSelect('category.parent', 'parent')
            //     .where(`parent.id = ${id}`)
            //     .getMany();

            //const parentCategory = await categoryRepository.find({ where: { category: id } });
            //console.log(parentCategory)

            const categoryRepository = AppDataSource.getRepository(Category);
            const category = await categoryRepository.findOne({
                where: { id: id },
                relations: ['customFields']
            });
            return res.send(category)
        }catch (e){
            next(e)
        }
    }

}
