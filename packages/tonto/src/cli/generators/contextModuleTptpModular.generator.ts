import { Class, Package, Relation } from "ontouml-js";
import {
    ClassDeclaration,
    ContextModule,
    //DataType,
    ElementRelation,
    GeneralizationSet,
} from "../../language/generated/ast.js";
import { attributeTptpGenerator } from "./attribute.tptp.generator.js";
import { classElementTptpGenerator } from "./class.tptp.generator.js";
//import { customDataTypeAttributesGenerator, customDataTypeGenerator} from "./datatype.generator.js";
//import { enumGenerator } from "./enum.generator.js";
import { generalizationSetTptpGenerator } from "./genset.tptp.generator.js";
import { generateTptpInstantiations } from "./instantiation.tptp.generator.js";
import { relationTptpGenerator } from "./relation.tptp.generator.js";
import { //generateDataTypeSpecializations, 
        generateTptpSpecializations } from "./specialization.tptp.generator.js";

//TODO:: Verificar quais imports devem ser modificados
//TODO:: Verificar corretude do arquivo
export interface GeneratedContextModuleTptpData {
    classes: Class[];
    dataTypes: Class[];
    enums: Class[];
    relations: Relation[];
}

export function contextModuleTptpGenerateClasses(
    contextModule: ContextModule,
    packageItem: Package
): GeneratedContextModuleTptpData {
    const returnData: GeneratedContextModuleTptpData = {
        classes: [],
        dataTypes: [],
        enums: [],
        relations: [],
    };

    contextModule.declarations.forEach((declaration) => {
        switch (declaration.$type) {
            case "ClassDeclaration": {
                const classElement = declaration as ClassDeclaration;
                const newClass = classElementTptpGenerator(classElement, packageItem);
                returnData.classes.push(newClass);
                break;
            }
            
            //TODO:: Corrigir depois
            /*case "DataType": {
                const dataType = declaration as DataType;
                if (dataType.isEnum) {
                    const newEnum = enumGenerator(dataType, packageItem);
                    returnData.dataTypes.push(newEnum);
                } else {
                    const newDataType = customDataTypeGenerator(dataType, packageItem);
                    returnData.dataTypes.push(newDataType);
                }
                break;
            }*/
        }
    });

    return returnData;
}

export function contextModuleTptpGenerateRelations(
    contextModule: ContextModule,
    packageItem: Package,
    modelData: GeneratedContextModuleTptpData,
    importedData: GeneratedContextModuleTptpData[]
): void {
    const classes: Class[] = [...modelData.classes];
    classes.push(...importedData.flatMap((data) => data.classes));

    //TODO:: Consertar em versões futuras
    const internalRelations = generateInternalRelations(contextModule, classes, packageItem);
    const externalRelations = generateExternalRelations(contextModule, classes, packageItem);
    modelData.relations.push(...internalRelations, ...externalRelations);
}

export function contextModuleTptpModularGenerator(
    contextModule: ContextModule,
    modelData: GeneratedContextModuleTptpData,
    packageItem: Package,
    importedData: GeneratedContextModuleTptpData[]
): void {
    const classes: Class[] = [...modelData.classes];
    const dataTypes: Class[] = [...modelData.dataTypes];
    const relations: Relation[] = [...modelData.relations];

    // Adding Elements from imports
    classes.push(...importedData.flatMap((data) => data.classes));
    dataTypes.push(...importedData.flatMap((data) => data.dataTypes));
    relations.push(...importedData.flatMap((data) => data.relations));

    //TODO:: Verificar quais serão mantidos
    generateGenSets(contextModule, classes, packageItem);
    //generateComplexDataTypesAttributes(contextModule, dataTypes);
    generateTptpSpecializations(contextModule, classes, relations, packageItem);
    generateClassDeclarationAttributes(contextModule, classes, dataTypes);
    //generateDataTypeSpecializations(contextModule, classes, dataTypes, packageItem);
    generateTptpInstantiations(contextModule, classes, relations, packageItem);
}

function generateGenSets(contextModule: ContextModule, classes: Class[], packageItem: Package) {
    contextModule.declarations.forEach((declaration) => {
        if (declaration.$type === "GeneralizationSet") {
            const gensetData = declaration as GeneralizationSet;
            generalizationSetTptpGenerator(gensetData, classes, packageItem);
        }
    });
}

function generateClassDeclarationAttributes(contextModule: ContextModule, classes: Class[], dataTypes: Class[]): void {
    contextModule.declarations.forEach((declaration) => {
        switch (declaration.$type) {
            case "ClassDeclaration": {
                const classDeclaration = declaration as ClassDeclaration;
                const createdClass = classes.find((item) => item.getName() === classDeclaration.name);
                if (createdClass) {
                    attributeTptpGenerator(classDeclaration, createdClass, dataTypes);
                }
            }
        }
    });
}

function generateExternalRelations(contextModule: ContextModule, classes: Class[], packageItem: Package): Relation[] {
    const relations: Relation[] = [];
    contextModule.declarations.forEach((declaration) => {
        switch (declaration.$type) {
            case "ElementRelation": {
                const elementRelation = declaration as ElementRelation;
                const createdRelation = relationTptpGenerator(elementRelation, packageItem, classes);
                if (createdRelation) {
                    relations.push(createdRelation);
                }
            }
        }
    });
    return relations;
}

function generateInternalRelations(contextModule: ContextModule, classes: Class[], packageItem: Package): Relation[] {
    const relations: Relation[] = [];
    contextModule.declarations.forEach((declaration) => {
        if (declaration.$type === "ClassDeclaration") {
            const classDeclaration = declaration as ClassDeclaration;

            classDeclaration.references.forEach((reference) => {
                const createdRelation = relationTptpGenerator(reference, packageItem, classes, classDeclaration);
                if (createdRelation) {
                    relations.push(createdRelation);
                }
            });
        }
    });
    return relations;
}

/*function generateComplexDataTypesAttributes(contextModule: ContextModule, dataTypes: Class[]): void {
    contextModule.declarations.forEach((declaration) => {
        if (declaration.$type === "DataType") {
            const dataType = declaration as DataType;
            customDataTypeAttributesGenerator(dataType, dataTypes);
        }
    });
}*/
