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
    targetDir: string;
    npmDevDir: string;
    dependencyArray: IJspmDependency[];
    constructor(optionsArg: ISmartJspmConstructorOptions);
    /**
     * installs jspm dependencies into a directory
     */
    installJspmTarget(targetDirArg?: string): q.Promise<void>;
    /**
     * creates bundle for production
     */
    createBundle(targetDirArg?: string, buildFile?: string): q.Promise<void>;
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
