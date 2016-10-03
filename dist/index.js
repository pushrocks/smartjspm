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
        plugins.jspm.install(true, { lock: false }).then(() => {
            let configFile = plugins.smartfile.fs.toStringSync(plugins.path.join(targetDirArg, 'config.js'));
            configFile = configFile.replace('  transpiler: "babel",', '');
            plugins.smartfile.memory.toFsSync(configFile, plugins.path.join(targetDirArg, 'config.js'));
            done.resolve();
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0NBQThDO0FBRTlDLHVCQUFzQjtBQW9CdEI7SUFJSSxZQUFZLFVBQXdDO1FBRHBELG9CQUFlLEdBQXNCLEVBQUUsQ0FBQTtRQUVuQyxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUE7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFBO0lBQ3pDLENBQUM7SUFFRDs7T0FFRztJQUNILGlCQUFpQixDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUztRQUMzQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFRLENBQUE7UUFDMUIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQ2hELElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFBO1FBQzNCLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQ3pDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUM3QyxJQUFJLFVBQVUsR0FBVyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUE7WUFDeEcsVUFBVSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLEVBQUMsRUFBRSxDQUFDLENBQUE7WUFDNUQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsV0FBVyxD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