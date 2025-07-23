
import { generateModularTptpCommand } from "tonto-cli";
import * as vscode from "vscode";
import { CommandIds } from "./commandIds.js";

/*import * as fs from "fs/promises";
import * as path from "path";
const tptpContent = `% Include ontology modules for taxonomic and foundational axioms
include('./axioms/01_taxonomy_thing.p').
include('./axioms/02_taxonomy_abstract_individual.p').
include('./axioms/03_taxonomy_endurant.p').
include('./axioms/04_taxonomy_endurant_type_nature.p').
include('./axioms/05_taxonomy_endurant_types_properties.p').
include('./axioms/06_instantiation.p').
include('./axioms/07_specialization.p').
include('./axioms/08_rigidity_and_sortality.p').
include('./axioms/09_endurant_types_definitions.p').
include('./axioms/10_ultimate_sortals.p').
%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%
%%% Existência de mundos e entidades
%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%

% Existe pelo menos um mundo
fof(ax_exists_world, axiom,(
    ? [W]: world(W)
)).
% Existe pelo menos uma entidade
fof(ax_exists_entity, axiom,(
    ? [E]: entity(E)
)).
% Entidades são diferentes de mundos
fof(ax_entity_different_than_world, axiom, (
  ![X, W]: (( (X!=W) & exists(X, W) ) => (entity(X) & world(W)))
)).

% TODO:: Verificar se as entidades serão type_(E)
% Entidades serão tipos por enquanto
fof(ax_exists_entity, axiom,(
    ! [E]: (entity(E) => type_(E))
)).

%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%
%%% Existência de classes criadas
%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%

% Existem apenas as classes especificadas
fof(ax_existence_of_created_classes, axiom, (
  ![X, W]: (exists(X, W) =>
            (person(X) | child(X) | teenager(X) | adult(X) | universityStudent(X))
  )
  
)).

% Existe pelo menos um person(X)
fof(ax_exists_person, axiom,(
    ? [X, W]: (exists(X, W) & person(X))
)).

% Existe pelo menos um child(X)
fof(ax_exists_child, axiom,(
    ? [X, W]: (exists(X, W) & child(X))
)).

% Existe pelo menos um teenager(X)
fof(ax_exists_teenager, axiom,(
    ? [X, W]: (exists(X, W) & teenager(X))
)).

% Existe pelo menos um adult(X)
fof(ax_exists_adult, axiom,(
    ? [X, W]: (exists(X, W) & adult(X))
)).

% Existe pelo menos um universityStudent(X)
fof(ax_exists_universityStudent, axiom,(
    ? [X, W]: (exists(X, W) & universityStudent(X))
)).


%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%
%%% Inclusão das taxonomias
%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%

fof(ax_taxonomy_of_created_class_Person, axiom, (
  ![X]: (person(X)  => kind(X))
)).

fof(ax_taxonomy_of_created_class_Child, axiom, (
  ![X]: (child(X)  => phase(X))
)).

fof(ax_taxonomy_of_created_class_Teenager, axiom, (
  ![X]: (teenager(X)  => phase(X))
)).

fof(ax_taxonomy_of_created_class_Adult, axiom, (
  ![X]: (adult(X)  => phase(X))
)).

fof(ax_taxonomy_of_created_class_UniversityStudent, axiom, (
  ![X]: (universityStudent(X)  => role(X))
)).

%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%
%%% Especializacao
%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%
fof(ax_especialization_of_created_class_child, axiom, (
  ![X]: (child(X)  => person(X))
)).

fof(ax_especialization_of_created_class_teenager, axiom, (
  ![X]: (teenager(X)  => person(X))
)).

fof(ax_especialization_of_created_class_adult, axiom, (
  ![X]: (adult(X)  => person(X))
)).

fof(ax_especialization_of_created_class_universityStudent, axiom, (
  ![X]: (universityStudent(X)  => person(X))
)).

%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%
%%% Genset
%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%

% PhasesOfPerson é disjunto
fof(ax_generalization_set_disjoint_PhasesOfPerson, axiom, (
  ![X]: ~ (child(X) & teenager(X)) &
  ![X]: ~ (child(X) & adult(X)) &
  ![X]: ~ (teenager(X) & adult(X))
)).

% PhasesOfPerson é completo:
fof(ax_generalization_set_disjoint_PhasesOfPerson, axiom, (
  % TODO:: Para todo X, visto que é para phase?
  ![X]: (person(X) => (child(X) | teenager(X) | adult(X)))
)).

fof(ax_generalization_of_created_class_universityStudent, axiom, (
  % TODO:: Existe X, visto que é para role?
  ?[X]: (person(X) & universityStudent(X))
)).





%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%
%%% Conjectura
%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%
fof(conj_disjoint_child_adult_teenager, conjecture, (
  % TODO:: Nao posso afirmar isso, visto que a ontologia ve entidades "role" como diferentes de "phase"
  ![X]: ((universityStudent(X) => (child(X) | teenager(X) | adult(X))))
  %?[X]: (teenager(X) & (universityStudent(X)))
)).

% Todo universityStudent é uma pessoa
%fof(conj_example, conjecture, (
%  ![X]: ((universityStudent(X) => person(X)))
%)).

%fof(conj_disjoint_child_adult_teenager, conjecture, (
  % TODO:: Nao posso afirmar isso, visto que a ontologia ve entidades "role" como diferentes de "phase"
  % A pergunta certa seria se as instâncias disso podem compartilhar as classes.
  %![X]: ((universityStudent(X) => (child(X) | teenager(X) | adult(X))))
  %?[X]: (teenager(X) & (universityStudent(X)))
%)).
`;*/

// Função principal para criar o status bar item
function createGenerateTptpStatusBarItem(context: vscode.ExtensionContext, statusBarItem: vscode.StatusBarItem) {
    context.subscriptions.push(
        vscode.commands.registerCommand(CommandIds.generateTptpFromButton, createStatusBarItemGenerateTptpCommand)
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(CommandIds.generateTptp, createCommandPaletteGenerateTptpCommand)
    );

    return createStatusBarItem(context, statusBarItem);
}

function createStatusBarItem(context: vscode.ExtensionContext, statusBarItem: vscode.StatusBarItem) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = CommandIds.generateTptpFromButton;
    context.subscriptions.push(statusBarItem);

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(() => {
            updateTptpStatusBarItem(statusBarItem);
        })
    );

    context.subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection(() => {
            updateTptpStatusBarItem(statusBarItem);
        })
    );

    updateTptpStatusBarItem(statusBarItem);
    return statusBarItem;
}

function updateTptpStatusBarItem(statusBarItem: vscode.StatusBarItem): void {
    statusBarItem.text = "$(book) Tonto -> TPTP";
    statusBarItem.show();
}

async function generateTptp(workspaceFolder: vscode.WorkspaceFolder) {
    // Aqui você colocaria sua função real de geração de TPTP. Por enquanto é só exemplo.
    //vscode.window.showInformationMessage(`TPTP file generated for workspace: "${workspaceFolder.uri.fsPath}"`);
    /*try {
        // Caminho do arquivo .p no workspace
        const filePath = path.join(workspaceFolder.uri.fsPath, "tptp.p");

        // Se quiser usar generateModularCommand, chame aqui; caso contrário, escreva o arquivo direto:
        // const generatedFileName = await generateModularCommand(workspaceFolder.uri.fsPath);
        // if (generatedFileName) { ... }

        // Escreve o conteúdo estático no arquivo
        await fs.writeFile(filePath, tptpContent, { encoding: "utf8" });

        vscode.window.showInformationMessage(`TPTP file generated successfully at "${filePath}"`);
    } catch (err) {
        vscode.window.showErrorMessage(`Error generating TPTP file: ${err}`);
    }*/
   const filePattern = workspaceFolder.uri.path + "tonto_tptp.p";
    vscode.workspace.findFiles(filePattern).then(async (_) => {
        const generatedFileName = await generateModularTptpCommand(workspaceFolder.uri.path);
        if (generatedFileName) {
            vscode.window.showInformationMessage(`TPTP File generated successfully with name "${generatedFileName}"`);
        }
    });
}

async function createCommandPaletteGenerateTptpCommand() {
    const directoryUri = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: "Select Tonto Project directory",
    });

    if (directoryUri && directoryUri[0]) {
        const selectedFolder = directoryUri[0];
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(selectedFolder);
        if (workspaceFolder) {
            await generateTptp(workspaceFolder);
        } else {
            vscode.window.showErrorMessage("Failed! Project needs to be in a workspace");
        }
    } else {
        vscode.window.showErrorMessage("Failed! Not a valid directory selected");
    }
}

async function createStatusBarItemGenerateTptpCommand(uri: vscode.Uri) {
    const editor = vscode.window.activeTextEditor;
    if (!uri) {
        const documentUri = editor?.document.uri;
        if (documentUri) {
            uri = documentUri;
        } else {
            const currentRoot = vscode.workspace.workspaceFolders?.[0]?.uri;
            if (currentRoot) {
                uri = currentRoot;
            }
        }
    }

    if (uri) {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (workspaceFolder) {
            await generateTptp(workspaceFolder);
        } else {
            vscode.window.showErrorMessage("Failed! File needs to be in a workspace");
        }
    }
}

export { createGenerateTptpStatusBarItem };