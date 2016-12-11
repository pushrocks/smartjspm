/// <reference types="q" />
import * as q from 'q';
export declare type TModuleRegistry = 'npm';
export interface IJspmDependency {
    name: string;
    version: string;
    registry: TModuleRegistry;
}
export interface INpmextraSmartjspmData {
    npm?: any;
}
export interface ISmartJspmConstructorOptions {
    dependencyArray?: IJspmDependency[];
    targetDir: string;
    npmDevDir: string;
}
export declare class SmartJspm {
    /**
     * the target directory to install jspm modules to
     */
    targetDir: string;
    /**
     * the npm directory that the IDE looks for modules during development and transpiling
     */
    npmDevDir: string;
    /**
     * the needed dependencies specified in npmextra.json
     */
    dependencyArray: IJspmDependency[];
    /**
     * the path to jspm bin executable
     */
    jspmPath: string;
    /**
     * the constructor for the SmartJspm class
     */
    constructor(optionsArg: ISmartJspmConstructorOptions);
    /**
     * installs jspm dependencies into a directory
     */
    installJspmTarget(targetDirArg?: string): q.Promise<void>;
    /**
     * creates bundle for production
     * @param targetDirArg - defaults to targetDir
     * @param buildFile - the name of the file to bundle
     */
    createBundle(bundleTargetDirArg?: string, buildFile?: string): q.Promise<void>;
    /**
     * Installs all npm dependencies into the root of the development directory so IDE picks up TypeScript
     */
    installNpmDevDir(): void;
    /**
     * reads the dependencies from a source
     */
    readNpmextraJspmDependencies(npmExtraDirArg: any): void;
    /**
     * write jspmPackage.json
     */
    private writeJspmPackageJson();
}
