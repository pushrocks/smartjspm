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
     * @param bundleBaseDir - the base directory to bundle files from
     * @param buildFile - the relative path of the
     * @param bundletargetDirArg - defaults to targetDir
     */
    createBundle(bundleBaseDirArg = this.targetDir, buildFileArg = 'main.js', bundleTargetDirArg = this.targetDir) {
        let done = q.defer();
        plugins.smartfile.fs.ensureDirSync(bundleTargetDirArg);
        this.writeJspmPackageJson();
        plugins.shelljs.exec(`cd ${bundleBaseDirArg} && ` +
            `node ${this.jspmPath} build ${plugins.path.join(bundleBaseDirArg, buildFileArg)} ` +
            `${plugins.path.join(bundleTargetDirArg, 'build.js')} -y`);
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