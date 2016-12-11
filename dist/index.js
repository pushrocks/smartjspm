"use strict";
const plugins = require("./smartjspm.plugins");
const q = require("q");
class SmartJspm {
    /**
     * the constructor for the SmartJspm class
     */
    constructor(optionsArg) {
        /**
         * the needed dependencies specified in npmextra.json
         */
        this.dependencyArray = [];
        /**
         * the path to jspm bin executable
         */
        this.jspmPath = plugins.path.join(plugins.path.parse(require.resolve('jspm')).dir, 'jspm.js');
        this.targetDir = optionsArg.targetDir;
        this.npmDevDir = optionsArg.npmDevDir;
    }
    /**
     * installs jspm dependencies into a directory
     */
    installJspmTarget(targetDirArg = this.targetDir) {
        let done = q.defer();
        plugins.smartfile.fs.ensureDirSync(targetDirArg);
        this.writeJspmPackageJson();
        plugins.jspm.setPackagePath(targetDirArg);
        plugins.shelljs.exec(`cd ${this.targetDir} && node ${this.jspmPath} install -y`);
        let jspmConfigJs = plugins.smartfile.fs.toStringSync(plugins.path.join(this.targetDir, 'jspm.config.js'));
        let jspmConfigPrefix = plugins.smartstring.indent.normalize(`
            SystemJS.config({
                packages: {
                    app: {
                        main: './main.js',
                        defaultExtension: 'js'
                    }
                }
            });
        `);
        let appJSConfigRegex = /app:.*{\n\s*main:/;
        if (!appJSConfigRegex.test(jspmConfigJs)) {
            jspmConfigJs = jspmConfigPrefix + jspmConfigJs;
            plugins.smartfile.memory.toFsSync(jspmConfigJs, plugins.path.join(this.targetDir, 'jspm.config.js'));
        }
        done.resolve();
        return done.promise;
    }
    /**
     * creates bundle for production
     * @param targetDirArg - defaults to targetDir
     * @param buildFile - the name of the file to bundle
     */
    createBundle(bundleTargetDirArg = this.targetDir, buildFile = 'main.js') {
        let done = q.defer();
        plugins.smartfile.fs.ensureDirSync(bundleTargetDirArg);
        this.writeJspmPackageJson();
        plugins.shelljs.exec(`cd ${bundleTargetDirArg} && node ${this.jspmPath} build ${plugins.path.join(this.targetDir, buildFile)} -y`);
        done.resolve();
        return done.promise;
    }
    /**
     * Installs all npm dependencies into the root of the development directory so IDE picks up TypeScript
     */
    installNpmDevDir() {
        let installString = 'npm install';
        let installDir;
        if (this.npmDevDir) {
            installDir = this.npmDevDir;
        }
        else {
            installDir = this.targetDir;
        }
        for (let dependency of this.dependencyArray) {
            installString = installString + ` ${dependency.name}@${dependency.version}`;
        }
        plugins.shelljs.exec(`cd ${installDir} && ${installString}`);
    }
    /**
     * reads the dependencies from a source
     */
    readNpmextraJspmDependencies(npmExtraDirArg) {
        let localNpmextra = new plugins.npmextra.Npmextra(npmExtraDirArg);
        let dependencyData = localNpmextra.dataFor('smartjspm', {});
        if (dependencyData.npm) {
            for (let dependency in dependencyData.npm) {
                let dependencyObject = {
                    name: dependency,
                    version: dependencyData.npm[dependency],
                    registry: 'npm'
                };
                this.dependencyArray.push(dependencyObject);
            }
        }
    }
    /**
     * write jspmPackage.json
     */
    writeJspmPackageJson() {
        let jspmDependencyObject = {};
        for (let dependency of this.dependencyArray) {
            if (dependency.registry === 'npm') {
                jspmDependencyObject[dependency.name] = `npm:${dependency.name}@${dependency.version}`;
            }
            else {
                plugins.beautylog.error(`unsupported registry ${dependency.registry}`);
            }
        }
        let packageJsonObject = {
            jspm: {
                dependencies: jspmDependencyObject
            }
        };
        plugins.smartfile.memory.toFsSync(JSON.stringify(packageJsonObject), plugins.path.join(this.targetDir, 'package.json'));
    }
}
exports.SmartJspm = SmartJspm;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0NBQThDO0FBRTlDLHVCQUFzQjtBQW9CdEI7SUF3Qkk7O09BRUc7SUFDSCxZQUFZLFVBQXdDO1FBaEJwRDs7V0FFRztRQUNILG9CQUFlLEdBQXNCLEVBQUUsQ0FBQTtRQUV2Qzs7V0FFRztRQUNILGFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FDeEIsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFDL0MsU0FBUyxDQUNaLENBQUE7UUFNRyxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUE7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFBO0lBQ3pDLENBQUM7SUFFRDs7T0FFRztJQUNILGlCQUFpQixDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUztRQUMzQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFRLENBQUE7UUFDMUIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQ2hELElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFBO1FBQzNCLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQ3pDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLFNBQVMsWUFBWSxJQUFJLENBQUMsUUFBUSxhQUFhLENBQUMsQ0FBQTtRQUNoRixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFB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