
import chalk from "chalk";
import { glob } from "glob";
import { NodeFileSystem } from "langium/node";
import path from "path";
import { Model, builtInLibs } from "../../../language/index.js";
import { TontoServices, createTontoServices } from "../../../language/tonto-module.js";
import { extractAllAstNodes, extractAstNode } from "../../cli-util.js";
//import { generateJSONFileModular } from "../../generators/jsonModular.generator.js";
//import { generateJSONFile } from "../../jsonGenerator.js";
import { TontoManifest } from "../../model/grammar/TontoManifest.js";
import { readOrCreateDefaultTontoManifest } from "../../utils/readManifest.js";
//TODO::
import { generateTptpFileModular } from "../../generators/tptpModular.generator.js";
import { generateTptpFile } from "../../tptpGenerator.js";

export const generateTptpCommand = async (fileName: string, destination: string): Promise<string | undefined> => {
    const services = createTontoServices({ ...NodeFileSystem }).Tonto;
    const model = await extractAstNode<Model>(fileName, services);
    const generatedFilePath = generateTptpFile(model, fileName, destination);
    return generatedFilePath;
};

// TODO: Make this function generate file on folder
export async function generateModularTptpCommand(dir: string): Promise<string | undefined> {
    const services = createTontoServices({ ...NodeFileSystem }).Tonto;

    let manifest: TontoManifest;
    let folderAbsolutePath: string;
    // Find tonto.json file
    try {
        /**
         * Create Tonto Manifest file if it does not exist or read from an existing
         * one
         */
        manifest = readOrCreateDefaultTontoManifest(dir);

        console.log(chalk.bold("tonto_tptp.p file parsed successfully."));
        folderAbsolutePath = path.resolve(dir);
        const createdFile = await createModelTptp(dir, manifest, services, folderAbsolutePath);

        console.log(chalk.green("Tptp File generated successfully: "));
        return Promise.resolve(createdFile);
    } catch (error) {
        console.log(chalk.red(error));
        return Promise.reject();
    }
}
//TODO:: Consertar função
async function createModelTptp(
    dir: string,
    manifest: TontoManifest,
    services: TontoServices,
    folderAbsolutePath: string
): Promise<string | undefined> {
    const allFiles = await glob(dir + "/**/*.tonto");

    const models: Model[] = await extractAllAstNodes(allFiles, services, builtInLibs, false);

    generateTptpFileModular(models, manifest, folderAbsolutePath);

    return `${manifest.projectName}.p`;
}

