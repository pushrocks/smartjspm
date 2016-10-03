"use strict";
const plugins = require("./smartjspm.plugins");
const q = require("q");
class SmartJspm {
    constructor(optionsArg) {
        this.dependencyArray = [];
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
        plugins.jspm.install(true, { lock: false }).then(() => { done.resolve(); });
        return done.promise;
    }
    /**
     * creates bundle for production
     */
    createBundle(targetDirArg = this.targetDir, buildFile = 'main') {
        let done = q.defer();
        plugins.smartfile.fs.ensureDirSync(targetDirArg);
        this.writeJspmPackageJson();
        plugins.jspm.setPackagePath(targetDirArg);
        plugins.jspm.bundle(buildFile, 'build.js', { mangle: false }).then(function () {
            done.resolve();
        });
        return done.promise;
    }
    /**
     * Installs all npm dependencies into the root of the development directory so IDE picks up TypeScript
     */
    installNpmDevDir() {
        let installString = 'npm install';
        for (let dependency of this.dependencyArray) {
            installString = installString + ` ${dependency.name}@${dependency.version}`;
        }
        plugins.shelljs.exec(`cd ${this.npmDevDir} && ${installString}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0NBQThDO0FBRTlDLHVCQUFzQjtBQW9CdEI7SUFJSSxZQUFZLFVBQXdDO1FBRHBELG9CQUFlLEdBQXNCLEVBQUUsQ0FBQTtRQUVuQyxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUE7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFBO0lBQ3pDLENBQUM7SUFFRDs7T0FFRztJQUNILGlCQUFpQixDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUztRQUMzQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFRLENBQUE7UUFDMUIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQ2hELElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFBO1FBQzNCLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQ3pDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFBO0lBQ3ZCLENBQUM7SUFFRDs7T0FFRztJQUNILFlBQVksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxTQUFTLEdBQVcsTUFBTTtRQUNsRSxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFRLENBQUE7UUFDMUIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQ2hELElBQUks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