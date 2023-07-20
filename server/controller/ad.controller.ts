import {NextFunction, Request, Response} from "express";
import {DataSource, getRepository} from "typeorm";
import {AdCustomField} from "../entities/AdCustomField";
import {CustomField} from "../entities/CustomField";
import {AppDataSource} from "../db/db";
import {Ad} from "../entities/Ad/Ads";
import {Category} from "../entities/Category";

export class AdController {
    static addItem = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const receivedData = req.body
            const customFieldRepo = AppDataSource.getRepository(CustomField)
            const categoryRepo = AppDataSource.getRepository(Category)
            const adRepo = AppDataSource.getRepository(Ad);

            const ad = new Ad()

            ad.title = receivedData.title;
            ad.price = receivedData.price;
            ad.city = receivedData.city;

            //ad.location = receivedData.location;

            ad.customFields = [];

            for(const key of Object.keys(receivedData)){
                if (key === 'id' || key === 'title' || key === 'price' || key === 'location' || key === 'city') {
                    continue;
                }

                const category = await categoryRepo.findOne({where: {id: receivedData.id}});
                const customField = await customFieldRepo.findOne({
                    where: {name: key, category: {id: receivedData.id}}
                });

                if(!customField){
                    continue
                }

                let fieldValue = ad.customFields.find(fv => fv.customField.id === customField.id )

                if(!fieldValue){
                    fieldValue = new AdCustomField()
                    fieldValue.ad = ad
                    fieldValue.customField = customField
                    fieldValue.value = receivedData[key]
                    ad.customFields.push(fieldValue);
                }
            }

            await adRepo.save(ad);

        }catch (e){
            console.log(e)
            next(e)
        }
    }
}
