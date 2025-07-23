import { Class, Package } from "ontouml-js";
//TODO:: verificar se estah correto
import { DataType } from "../../language/index.js";

//TODO:: verificar corretude do arquivo
export function enumTptpGenerator(enumData: DataType, model: Package): Class {
    const createdEnum = model.createEnumeration(enumData.name);
    enumData.elements.forEach((element) => {
        createdEnum.createLiteral(element.name);
    });
    return createdEnum;
}
