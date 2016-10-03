import * as plugins from './smartjspm.plugins'

import * as q from 'q'

export type TModuleRegistry = 'npm'

export interface IJspmDependency {
    name: string,
    version: string
    registry: TModuleRegistry
}

export interface INpmextraSmartjspmData {
    npm?: any
}

export interface ISmartJspmConstructorOptions {
    dependencyArray?: IJspmDependency[]
    targetDir: string
    npmDevDir: string
}

export class SmartJspm {
    targetDir: string
    npmDevDir: string
    dependencyArray: IJspmDependency[] = []
    constructor(optionsArg: ISmartJspmConstructorOptions) {
        this.targetDir = optionsArg.targetDir
        this.npmDevDir = optionsArg.npmDevDir
    }

    /**
     * installs jspm dependencies into a directory
     */
    installJspmTarget(targetDirArg = this.targetDir): q.Promise<void> {
        let done = q.defer<void>()
        plugins.smartfile.fs.ensureDirSync(targetDirArg)
        this.writeJspmPackageJson()
        plugins.jspm.setPackagePath(targetDirArg)
        plugins.jspm.install(true, { lock: false }).then(() => { done.resolve() })
        return done.promise
    }

    /**
     * creates bundle for production
     */
    createBundle(targetDirArg = this.targetDir, buildFile: string = 'main'): q.Promise<void> {
        let done = q.defer<void>()
        plugins.smartfile.fs.ensureDirSync(targetDirArg)
        this.writeJspmPackageJson()
        plugins.jspm.setPackagePath(targetDirArg)
        plugins.jspm.bundle(buildFile, 'build.js', { mangle: false }).then(function() {
            done.resolve()
        })
        return done.promise
    }

    /**
     * Installs all npm dependencies into the root of the development directory so IDE picks up TypeScript
     */
    installNpmDevDir(): void {
        let installString = 'npm install'
        for (let dependency of this.dependencyArray) {
            installString = installString + ` ${dependency.name}@${dependency.version}`
        }
        plugins.shelljs.exec(`cd ${this.npmDevDir} && ${installString}`)
    }

    /**
     * reads the dependencies from a source
     */
    readNpmextraJspmDependencies(npmExtraDirArg): void {
        let localNpmextra = new plugins.npmextra.Npmextra(npmExtraDirArg)
        let dependencyData: INpmextraSmartjspmData = localNpmextra.dataFor('smartjspm', {})
        if (dependencyData.npm) {
            for (let dependency in dependencyData.npm) {
                let dependencyObject: IJspmDependency = {
                    name: dependency,
                    version: dependencyData.npm[dependency],
                    registry: 'npm'
                }
                this.dependencyArray.push(dependencyObject)
            }
        }
    }

    /**
     * write jspmPackage.json
     */
    private writeJspmPackageJson(): void {
        let jspmDependencyObject: any = {}
        for (let dependency of this.dependencyArray) {
            if (dependency.registry === 'npm') {
                jspmDependencyObject[dependency.name] = `npm:${dependency.name}@${dependency.version}`
            } else {
                plugins.beautylog.error(`unsupported registry ${dependency.registry}`)
            }
        }
        let packageJsonObject = {
            jspm: {
                dependencies: jspmDependencyObject
            }
        }
        plugins.smartfile.memory.toFsSync(
            JSON.stringify(packageJsonObject),
            plugins.path.join(this.targetDir, 'package.json')
        )
    }
}
