import { CompositeGeneratorNode } from "langium/generate";
import * as fs from "node:fs";
import * as path from "node:path";
import { MultilingualText, Package, Project } from "ontouml-js";
import { Model } from "../../language/index.js";
import { TontoManifest } from "../model/grammar/TontoManifest.js";
//import { GeneratedContextModuleData, contextModuleGenerateClasses, contextModuleGenerateRelations, contextModuleModularGenerator } from "./contextModuleModular.generator.js";

import { GeneratedContextModuleTptpData, contextModuleTptpGenerateClasses
        , contextModuleTptpGenerateRelations, contextModuleTptpModularGenerator 
      } from "./contextModuleTptpModular.generator.js";

//TODO:: verificar corretude do arquivo

export function generateTptpFileModular(
    models: Model[],
    tontoManifest: TontoManifest,
    folderAbsolutePath: string
): string {
    const ctx = <GeneratorTptpContext>{
        models,
        manifest: tontoManifest,
        fileNode: new CompositeGeneratorNode(),
        folderAbsolutePath,
    };
    return generate(ctx);
}

export interface GeneratorTptpContext {
    models: Model[]
    manifest: TontoManifest
    fileNode: CompositeGeneratorNode
    folderAbsolutePath: string
}

interface GeneratedTptpModelData {
    package: Package
    model: Model
    generatedData: GeneratedContextModuleTptpData
}

//TODO:: corretude da função
function generate(ctx: GeneratorTptpContext): string {
    /**
   * First we need to parse the project and create all elements
   */
    //const project = parseProjectTptp(ctx);

    /**
   * Now, we convert the project to JSON and save it to a file
   */
    const destinationFolder = path.join(ctx.folderAbsolutePath, ctx.manifest.outFolder);
    //const destinationFile = path.join(destinationFolder, project.name.getText() + ".p");

    //TODO:: Mudar a forma em que o projeto se torna string
    //const projectSerialization = JSON.stringify(project, null, 2);
    //ctx.fileNode.append(projectSerialization);
    
    // TODO:: Futura forma de fazer o projeto
    const tptpFormulas: string[] = parseProjectTptp(ctx);
    const tptpContent = tptpFormulas.join('\n\n'); // separa fórmulas com linha em branco
    ctx.fileNode.append(tptpContent);
    const destinationFile = path.join(destinationFolder, ctx.manifest.projectName + ".p");
    

    if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder);
    }

    fs.writeFileSync(destinationFile, projectSerialization);
    return destinationFile;
}

/*export function parseProjectTptp(ctx: GeneratorTptpContext): Project {
    const project = new Project({
        name: new MultilingualText(ctx.manifest.projectName),
    });

    const rootPackage = project.createModel({
        name: new MultilingualText(ctx.manifest.projectName),
    });

    const generatedTptpModelDatas: Map<string, GeneratedTptpModelData> = new Map();

    /**
   * First we generate all the classes for each context module
   */
    /*for (const model of ctx.models) {
        const contextModule = model.module;

        const createdPackage = rootPackage.createPackage(contextModule.name);

        const GeneratedContextTptpModuleData = contextModuleTptpGenerateClasses(contextModule, createdPackage);

        const generatedTptpModelData: GeneratedTptpModelData = {
            package: createdPackage,
            model: model,
            generatedData: GeneratedContextTptpModuleData,
        };
        generatedTptpModelDatas.set(model.module.name, generatedTptpModelData);
    }

    /**
   * Secondly, we generate all the relations for each context module
   */
    //TODO:: Será implementado em versões futuras
    /*ctx.models.forEach((model) => {
        const importedNames = model.imports.flatMap((e) => e.referencedModel.ref?.name).filter((e) => e !== undefined);
        const arrayOfGeneratedTptpModelDatas = Array.from(generatedTptpModelDatas.values());

        const globalDataTypes = arrayOfGeneratedTptpModelDatas
            .filter((data) => data.model.module.isGlobal)
            .map((data) => data.generatedData);
        const importedDataTypes = arrayOfGeneratedTptpModelDatas
            .filter((data) => importedNames.includes(data.model.module.name))
            .map((data) => data.generatedData);

        const createdPackage = generatedTptpModelDatas.get(model.module.name)?.package;
        const generatedContextModelData = generatedTptpModelDatas.get(model.module.name)?.generatedData;
        if (createdPackage && generatedContextModelData) {
            contextModuleTptpGenerateRelations(model.module, createdPackage, generatedContextModelData, [
                ...importedDataTypes,
                ...globalDataTypes,
            ]);
        }
    });

    /**
   * Then, we navigate again through the models and generate the missing elements
   * that needed the references of the classes and relations generated in the previous step
   */
    //TODO:: Será implementado em versões futuras
    /*ctx.models.forEach((model) => {
        const importedNames = model.imports.flatMap((e) => e.referencedModel.ref?.name).filter((e) => e !== undefined);
        const arrayOfGeneratedModelDatas = Array.from(generatedTptpModelDatas.values());

        const globalDataTypes = arrayOfGeneratedModelDatas
            .filter((data) => data.model.module.isGlobal)
            .map((data) => data.generatedData);
        const importedDataTypes = arrayOfGeneratedModelDatas
            .filter((data) => importedNames.includes(data.model.module.name))
            .map((data) => data.generatedData);

        const createdPackage = generatedTptpModelDatas.get(model.module.name)?.package;
        const generatedContextTptpModelData = generatedTptpModelDatas.get(model.module.name)?.generatedData;

        if (createdPackage && generatedContextTptpModelData) {
            contextModuleTptpModularGenerator(model.module, generatedContextTptpModelData, createdPackage, [
                ...importedDataTypes,
                ...globalDataTypes,
            ]);
        }
    });
    return project;
}*/

export function parseProjectTptp(ctx: GeneratorTptpContext): string[] {
    const project = new Project({
        name: new MultilingualText(ctx.manifest.projectName),
    });

    const rootPackage = project.createModel({
        name: new MultilingualText(ctx.manifest.projectName),
    });

    const generatedTptpModelDatas: Map<string, GeneratedTptpModelData> = new Map();

    /**
   * First we generate all the classes for each context module
   */
    for (const model of ctx.models) {
        const contextModule = model.module;

        const createdPackage = rootPackage.createPackage(contextModule.name);

        const GeneratedContextTptpModuleData = contextModuleTptpGenerateClasses(contextModule, createdPackage);

        const generatedTptpModelData: GeneratedTptpModelData = {
            package: createdPackage,
            model: model,
            generatedData: GeneratedContextTptpModuleData,
        };
        generatedTptpModelDatas.set(model.module.name, generatedTptpModelData);
    }

    /**
   * Secondly, we generate all the relations for each context module
   */
    //TODO:: Será implementado em versões futuras
    ctx.models.forEach((model) => {
        const importedNames = model.imports.flatMap((e) => e.referencedModel.ref?.name).filter((e) => e !== undefined);
        const arrayOfGeneratedTptpModelDatas = Array.from(generatedTptpModelDatas.values());

        const globalDataTypes = arrayOfGeneratedTptpModelDatas
            .filter((data) => data.model.module.isGlobal)
            .map((data) => data.generatedData);
        const importedDataTypes = arrayOfGeneratedTptpModelDatas
            .filter((data) => importedNames.includes(data.model.module.name))
            .map((data) => data.generatedData);

        const createdPackage = generatedTptpModelDatas.get(model.module.name)?.package;
        const generatedContextModelData = generatedTptpModelDatas.get(model.module.name)?.generatedData;
        if (createdPackage && generatedContextModelData) {
            contextModuleTptpGenerateRelations(model.module, createdPackage, generatedContextModelData, [
                ...importedDataTypes,
                ...globalDataTypes,
            ]);
        }
    });

    /**
   * Then, we navigate again through the models and generate the missing elements
   * that needed the references of the classes and relations generated in the previous step
   */
    //TODO:: Será implementado em versões futuras
    ctx.models.forEach((model) => {
        const importedNames = model.imports.flatMap((e) => e.referencedModel.ref?.name).filter((e) => e !== undefined);
        const arrayOfGeneratedModelDatas = Array.from(generatedTptpModelDatas.values());

        const globalDataTypes = arrayOfGeneratedModelDatas
            .filter((data) => data.model.module.isGlobal)
            .map((data) => data.generatedData);
        const importedDataTypes = arrayOfGeneratedModelDatas
            .filter((data) => importedNames.includes(data.model.module.name))
            .map((data) => data.generatedData);

        const createdPackage = generatedTptpModelDatas.get(model.module.name)?.package;
        const generatedContextTptpModelData = generatedTptpModelDatas.get(model.module.name)?.generatedData;

        if (createdPackage && generatedContextTptpModelData) {
            contextModuleTptpModularGenerator(model.module, generatedContextTptpModelData, createdPackage, [
                ...importedDataTypes,
                ...globalDataTypes,
            ]);
        }
    });
    return project;
}
