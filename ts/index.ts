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
    /**
     * the target directory to install jspm modules to
     */
    targetDir: string

    /**
     * the npm directory that the IDE looks for modules during development and transpiling
     */
    npmDevDir: string

    /**
     * the needed dependencies specified in npmextra.json
     */
    dependencyArray: IJspmDependency[] = []

    /**
     * the path to jspm bin executable
     */
    jspmPath = plugins.path.join(
        plugins.path.parse(require.resolve('jspm')).dir,
        'jspm.js'
    )

    /**
     * the constructor for the SmartJspm class
     */
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
        plugins.shelljs.exec(`cd ${this.targetDir} && node ${this.jspmPath} install -y`)
        let jspmConfigJs = plugins.smartfile.fs.toStringSync(plugins.path.join(this.targetDir, 'jspm.config.js'))
        let jspmConfigPrefix = plugins.smartstring.indent.normalize(`
            SystemJS.config({
                packages: {
                    app: {
                        main: './main.js',
                        defaultExtension: 'js'
                    }
                }
            });
        `)
        let appJSConfigRegex = /app:.*{\n\s*main:/
        if (!appJSConfigRegex.test(jspmConfigJs)) {
            jspmConfigJs = jspmConfigPrefix + jspmConfigJs
            plugins.smartfile.memory.toFsSync(jspmConfigJs, plugins.path.join(this.targetDir, 'jspm.config.js'))
        }
        done.resolve()
        return done.promise
    }

    /**
     * creates bundle for production
     * @param targetDirArg - defaults to targetDir
     * @param buildFile - the name of the file to bundle
     */
    createBundle(bundleTargetDirArg = this.targetDir, buildFile: string = 'main.js'): q.Promise<void> {
        let done = q.defer<void>()
        plugins.smartfile.fs.ensureDirSync(bundleTargetDirArg)
        this.writeJspmPackageJson()
        plugins.shelljs.exec(
            `cd ${bundleTargetDirArg} && node ${this.jspmPath} build ${plugins.path.join(this.targetDir,buildFile)} -y`
        )
        done.resolve()
        return done.promise
    }

    /**
     * Installs all npm dependencies into the root of the development directory so IDE picks up TypeScript
     */
    installNpmDevDir(): void {
        let installString = 'npm install'
        let installDir: string
        if (this.npmDevDir) {
            installDir = this.npmDevDir
        } else {
            installDir = this.targetDir
        }
        for (let dependency of this.dependencyArray) {
            installString = installString + ` ${dependency.name}@${dependency.version}`
        }
        plugins.shelljs.exec(`cd ${installDir} && ${installString}`)
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
