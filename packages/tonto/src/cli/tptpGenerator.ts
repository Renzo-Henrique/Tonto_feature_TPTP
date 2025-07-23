import { CompositeGeneratorNode } from "langium/generate";
import * as fs from "node:fs";
import * as path from "node:path";
import { MultilingualText, Project } from "ontouml-js";
import { Model } from "../language/index.js";
import { extractDestinationAndName } from "./cli-util.js";
import { contextModuleGenerator } from "./generators/contextModule.generator.js";

//TODO:: Verificar corretude do arquivo
export function generateTptpFile(model: Model, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);

    const ctx = <GeneratorTptpContext>{
        model,
        name: data.name,
        fileName: `${data.name}.p`,
        destination: data.destination,
        fileNode: new CompositeGeneratorNode(),
    };
    return generate(ctx);
}

export interface GeneratorTptpContext {
    model: Model
    name: string
    fileName: string
    destination: string
    fileNode: CompositeGeneratorNode
}

function generate(ctx: GeneratorTptpContext): string {
    // Every OntoUML element can be created from a constructor that can receive a partial object
    // as references for its creation
    const project = parseProjectTptp(ctx);

    const projectSerialization = JSON.stringify(project, null, 2);
    ctx.fileNode.append(projectSerialization);

    if (!fs.existsSync(ctx.destination)) {
        fs.mkdirSync(ctx.destination, { recursive: true });
    }
    const generatedFilePath = path.join(ctx.destination, ctx.fileName);
    // fs.writeFileSync(generatedFilePath, isGeneratorNode(ctx.fileNode));
    return generatedFilePath;
}

export function parseProjectTptp(ctx: GeneratorTptpContext): Project {
    const project = new Project({
        name: new MultilingualText(`${ctx.name}`),
    }); // creates an OntoUML projects
    const rootModel = project.createModel({
        name: new MultilingualText("root"),
    });

    const contextModule = ctx.model.module;

    const createdPackage = rootModel.createPackage(contextModule.name);
    // Generate a contextModule
    contextModuleGenerator(contextModule, createdPackage);
    return project;
}
